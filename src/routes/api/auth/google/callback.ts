import { createFileRoute } from "@tanstack/react-router";
import { deleteCookie, getCookie } from "@tanstack/react-start/server";

import {
	claimOrphanedAccounts,
	exchangeCodeForTokens,
	fetchGoogleUser,
	resolveRedirectUri,
	upsertGoogleUser,
} from "../../../../lib/auth/google";
import {
	createSession,
	OAUTH_COOKIE,
	OAUTH_COOKIE_OPTIONS,
	verifyOAuthState,
} from "../../../../lib/auth/session";
import { prisma } from "../../../../lib/prisma";

const redir = (target: string) =>
	new Response(null, {
		status: 302,
		headers: { location: target },
	});

export const Route = createFileRoute("/api/auth/google/callback")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);
				const code = url.searchParams.get("code");
				const returnedState = url.searchParams.get("state");
				const error = url.searchParams.get("error");
				const oauthCookie = getCookie(OAUTH_COOKIE);

				const fail = (reason: string) =>
					redir(`/login?error=${encodeURIComponent(reason)}`);

				if (error) return fail("Google sign-in was cancelled.");

				const payload = verifyOAuthState(oauthCookie);
				if (!payload || !code || !returnedState) {
					return fail("Invalid or expired sign-in request. Please try again.");
				}

				let oauth: { state: string; verifier: string; redirect: string };
				try {
					oauth = JSON.parse(
						Buffer.from(payload, "base64url").toString("utf8"),
					);
				} catch {
					return fail("Invalid sign-in request. Please try again.");
				}

				deleteCookie(OAUTH_COOKIE, OAUTH_COOKIE_OPTIONS);

				if (oauth.state !== returnedState) {
					return fail("Security check failed. Please try again.");
				}

				try {
					const tokens = await exchangeCodeForTokens(
						code,
						oauth.verifier,
						resolveRedirectUri(request),
					);
					const info = await fetchGoogleUser(tokens.access_token);
					const user = await upsertGoogleUser(info);
					await claimOrphanedAccounts(user.id, user.role === "ADMIN");
					// Rotate: revoke any existing sessions for this user, then issue fresh.
					await prisma.session.deleteMany({ where: { userId: user.id } });
					await createSession(user.id);
				} catch (err) {
					const message =
						err instanceof Error ? err.message : "Something went wrong.";
					return fail(message);
				}

				const target =
					typeof oauth.redirect === "string" &&
					oauth.redirect.startsWith("/") &&
					!oauth.redirect.startsWith("//")
						? oauth.redirect
						: "/dashboard";

				return redir(target);
			},
		},
	},
});
