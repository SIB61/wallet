import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import {
	deleteCookie,
	getCookie,
	setCookie,
} from "@tanstack/react-start/server";
import type { Role } from "@/generated/prisma/enums";
import type { UserModel } from "@/generated/prisma/models";
import { prisma } from "@/lib/prisma";

export const SESSION_COOKIE = "sib61_session";

const SESSION_DAYS = 30;
const SESSION_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	path: "/",
	maxAge: SESSION_DAYS * 24 * 60 * 60,
};

export type SessionUser = {
	id: string;
	email: string;
	name: string | null;
	avatarUrl: string | null;
	role: Role;
};

function toSessionUser(user: UserModel): SessionUser {
	return {
		id: user.id,
		email: user.email,
		name: user.name,
		avatarUrl: user.avatarUrl,
		role: user.role,
	};
}

function newToken(): string {
	return `sess_${randomBytes(32).toString("base64url")}`;
}

export async function createSession(userId: string): Promise<string> {
	const token = newToken();
	const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);

	await prisma.session.create({
		data: { token, userId, expiresAt },
	});

	setCookie(SESSION_COOKIE, token, SESSION_COOKIE_OPTIONS);
	return token;
}

/** Resolve the current session from the request cookie, returning the user or null. */
export async function getSessionUser(): Promise<SessionUser | null> {
	const token = getCookie(SESSION_COOKIE);
	if (!token) return null;

	const session = await prisma.session.findUnique({
		where: { token },
		include: { user: true },
	});
	if (!session || !session.user) return null;

	if (session.expiresAt.getTime() < Date.now()) {
		await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
		deleteCookie(SESSION_COOKIE, SESSION_COOKIE_OPTIONS);
		return null;
	}

	return toSessionUser(session.user);
}

export async function revokeSession(): Promise<void> {
	const token = getCookie(SESSION_COOKIE);
	if (token) {
		await prisma.session.deleteMany({ where: { token } });
	}
	deleteCookie(SESSION_COOKIE, SESSION_COOKIE_OPTIONS);
}

// Signing helpers for the short-lived OAuth state cookie (HMAC-SHA256).
export const OAUTH_COOKIE = "sib61_oauth";

export function signOAuthState(payload: string): string {
	const secret = process.env.SESSION_SECRET ?? "insecure-default-secret";
	const sig = createHash("sha256")
		.update(payload + secret)
		.digest("base64url");
	return `${sig}.${payload}`;
}

export function verifyOAuthState(sealed: string | undefined): string | null {
	if (!sealed) return null;
	const dot = sealed.indexOf(".");
	if (dot === -1) return null;
	const sig = sealed.slice(0, dot);
	const payload = sealed.slice(dot + 1);
	const expected = createHash("sha256")
		.update(payload + (process.env.SESSION_SECRET ?? "insecure-default-secret"))
		.digest("base64url");
	const a = Buffer.from(sig);
	const b = Buffer.from(expected);
	if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
	return payload;
}

export const OAUTH_COOKIE_OPTIONS = {
	httpOnly: true,
	secure: process.env.NODE_ENV === "production",
	sameSite: "lax" as const,
	path: "/",
	maxAge: 10 * 60,
};
