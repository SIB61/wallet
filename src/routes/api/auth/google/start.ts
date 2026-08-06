import { createFileRoute } from "@tanstack/react-router";
import { setCookie } from "@tanstack/react-start/server";

import {
	buildAuthorizeUrl,
	createOAuthParams,
	resolveRedirectUri,
} from "../../../../lib/auth/google";
import {
	OAUTH_COOKIE,
	OAUTH_COOKIE_OPTIONS,
	signOAuthState,
} from "../../../../lib/auth/session";

function sanitizeRedirect(value: string | null): string {
	if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
	return value;
}

function redir(target: string): Response {
	return new Response(null, {
		status: 302,
		headers: { location: target },
	});
}

export const Route = createFileRoute("/api/auth/google/start")({
	server: {
		handlers: {
			GET: async ({ request }) => {
				const url = new URL(request.url);
				const redirect = sanitizeRedirect(url.searchParams.get("redirect"));
				const oauth = createOAuthParams();

				const payload = Buffer.from(
					JSON.stringify({
						state: oauth.state,
						verifier: oauth.verifier,
						redirect,
					}),
				).toString("base64url");

				setCookie(OAUTH_COOKIE, signOAuthState(payload), OAUTH_COOKIE_OPTIONS);

				return redir(buildAuthorizeUrl(oauth, resolveRedirectUri(request)));
			},
		},
	},
});
