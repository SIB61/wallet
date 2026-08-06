import { createServerFn } from "@tanstack/react-start";
import { Role } from "@/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { requireAdminMiddleware } from "./auth/middleware";
import {
	getSessionUser,
	revokeSession,
	type SessionUser,
} from "./auth/session";

export type AuthState = {
	user: SessionUser | null;
	isAuthenticated: boolean;
	isAdmin: boolean;
};

export function toAuthState(user: SessionUser | null): AuthState {
	return {
		user,
		isAuthenticated: user !== null,
		isAdmin: user?.role === Role.ADMIN,
	};
}

export const getCurrentUserFn = createServerFn({ method: "GET" }).handler(
	async (): Promise<SessionUser | null> => {
		return getSessionUser();
	},
);

export const logoutFn = createServerFn({ method: "POST" }).handler(async () => {
	await revokeSession();
	return { ok: true };
});

export type AdminUserDTO = {
	id: string;
	email: string;
	name: string | null;
	avatarUrl: string | null;
	role: Role;
	createdAt: string;
};

export const listUsersFn = createServerFn({ method: "GET" })
	.middleware([requireAdminMiddleware])
	.handler(async (): Promise<AdminUserDTO[]> => {
		const users = await prisma.user.findMany({
			orderBy: [{ createdAt: "asc" }],
		});
		return users.map((u) => ({
			id: u.id,
			email: u.email,
			name: u.name,
			avatarUrl: u.avatarUrl,
			role: u.role,
			createdAt: u.createdAt.toISOString(),
		}));
	});

export const setUserRoleFn = createServerFn({ method: "POST" })
	.middleware([requireAdminMiddleware])
	.validator((input: { userId: string; role: Role }) => input)
	.handler(async ({ data, context }) => {
		if (data.userId === context.user.id) {
			throw new Error("You cannot change your own role.");
		}
		const role = data.role === Role.ADMIN ? Role.ADMIN : Role.USER;
		const user = await prisma.user.update({
			where: { id: data.userId },
			data: { role },
		});
		// Force a fresh login so the new role applies immediately.
		await prisma.session.deleteMany({ where: { userId: data.userId } });
		return {
			id: user.id,
			email: user.email,
			name: user.name,
			avatarUrl: user.avatarUrl,
			role: user.role,
			createdAt: user.createdAt.toISOString(),
		};
	});
