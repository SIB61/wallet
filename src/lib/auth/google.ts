import { createHash, randomBytes } from "node:crypto";
import type { User } from "@/generated/prisma/client";
import { Role } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import type { SessionUser } from "./session";

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

const SCOPES = ["openid", "profile", "email"];

function base64url(buf: Buffer): string {
	return buf
		.toString("base64")
		.replace(/=/g, "")
		.replace(/\+/g, "-")
		.replace(/\//g, "_");
}

export function getGoogleClientId(): string {
	return process.env.GOOGLE_CLIENT_ID ?? "";
}

export function getGoogleClientSecret(): string {
	return process.env.GOOGLE_CLIENT_SECRET ?? "";
}

/**
 * Resolve the OAuth redirect URI for the current request.
 *
 * Google only accepts an exact string match against the "Authorized redirect
 * URIs" registered in the Cloud Console. The safe default is to derive it from
 * the request's own origin, so it always matches whatever URL the browser is
 * actually on (e.g. any localhost port during development). Set
 * `GOOGLE_REDIRECT_URI` only when the derived origin is not the public URL
 * users should be redirected to.
 */
export function resolveRedirectUri(request: Request): string {
	const configured = process.env.GOOGLE_REDIRECT_URI;
	if (configured) return configured;
	return new URL(request.url).origin + "/api/auth/google/callback";
}

export type OAuthParams = {
	state: string;
	verifier: string;
	challenge: string;
};

export function createOAuthParams(): OAuthParams {
	const state = base64url(randomBytes(32));
	const verifier = base64url(randomBytes(32));
	const challenge = base64url(createHash("sha256").update(verifier).digest());
	return { state, verifier, challenge };
}

export function buildAuthorizeUrl(
	params: OAuthParams,
	redirectUri: string,
): string {
	const url = new URL(GOOGLE_AUTH_URL);
	url.searchParams.set("response_type", "code");
	url.searchParams.set("client_id", getGoogleClientId());
	url.searchParams.set("redirect_uri", redirectUri);
	url.searchParams.set("scope", SCOPES.join(" "));
	url.searchParams.set("state", params.state);
	url.searchParams.set("code_challenge", params.challenge);
	url.searchParams.set("code_challenge_method", "S256");
	url.searchParams.set("access_type", "online");
	url.searchParams.set("prompt", "select_account");
	return url.toString();
}

type TokenResponse = {
	access_token: string;
	token_type: string;
	expires_in: number;
	id_token?: string;
};

export async function exchangeCodeForTokens(
	code: string,
	verifier: string,
	redirectUri: string,
): Promise<TokenResponse> {
	const res = await fetch(GOOGLE_TOKEN_URL, {
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		body: new URLSearchParams({
			code,
			client_id: getGoogleClientId(),
			client_secret: getGoogleClientSecret(),
			redirect_uri: redirectUri,
			grant_type: "authorization_code",
			code_verifier: verifier,
		}),
	});

	if (!res.ok) {
		const body = await res.text();
		throw new Error(`Google token exchange failed (${res.status}): ${body}`);
	}

	return (await res.json()) as TokenResponse;
}

export type GoogleUserInfo = {
	sub: string;
	email?: string;
	name?: string;
	picture?: string;
	email_verified?: boolean;
};

export async function fetchGoogleUser(
	accessToken: string,
): Promise<GoogleUserInfo> {
	const res = await fetch(GOOGLE_USERINFO_URL, {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
	if (!res.ok) {
		throw new Error(`Failed to fetch Google user (${res.status})`);
	}
	return (await res.json()) as GoogleUserInfo;
}

export function isAdminEmail(email: string): boolean {
	const configured = process.env.ADMIN_EMAILS ?? "";
	return configured
		.split(",")
		.map((e) => e.trim().toLowerCase())
		.filter(Boolean)
		.includes(email.toLowerCase());
}

export async function upsertGoogleUser(
	info: GoogleUserInfo,
): Promise<SessionUser> {
	if (!info.email || !info.sub) {
		throw new Error("Google account is missing an email address.");
	}

	const existing = await prisma.user.findFirst({
		where: { OR: [{ googleId: info.sub }, { email: info.email }] },
	});

	let user: User;
	if (existing) {
		user = await prisma.user.update({
			where: { id: existing.id },
			data: {
				name: info.name ?? existing.name ?? null,
				avatarUrl: info.picture ?? existing.avatarUrl ?? null,
				googleId: info.sub,
				role: isAdminEmail(info.email) ? Role.ADMIN : existing.role,
			},
		});
	} else {
		try {
			user = await prisma.user.create({
				data: {
					email: info.email,
					name: info.name ?? null,
					googleId: info.sub,
					avatarUrl: info.picture ?? null,
					role: isAdminEmail(info.email) ? Role.ADMIN : Role.USER,
				},
			});
		} catch (err) {
			// A concurrent sign-in may have created the user already.
			const raced = await prisma.user.findUnique({
				where: { googleId: info.sub },
			});
			if (!raced) {
				throw err;
			}
			user = raced;
		}
	}

	return {
		id: user.id,
		email: user.email,
		name: user.name,
		avatarUrl: user.avatarUrl,
		role: user.role,
	};
}

/** Claim any wallet accounts not yet assigned to a user (legacy data) for an admin on first sign-in. */
export async function claimOrphanedAccounts(
	userId: string,
	isAdmin: boolean,
): Promise<void> {
	if (!isAdmin) return;
	const accountCount = await prisma.account.count({ where: { userId } });
	if (accountCount > 0) return;
	await prisma.account.updateMany({
		where: { userId: null },
		data: { userId },
	});
}
