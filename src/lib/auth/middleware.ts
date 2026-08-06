import { createMiddleware } from "@tanstack/react-start";

import { getSessionUser, type SessionUser } from "./session";

export const requireUserMiddleware = createMiddleware({
	type: "function",
}).server(async ({ next }) => {
	const user = await getSessionUser();
	if (!user) throw new Error("Unauthorized");
	return next({ context: { user } });
});

export const requireAdminMiddleware = createMiddleware({ type: "function" })
	.middleware([requireUserMiddleware])
	.server(async ({ next, context }) => {
		if (context.user.role !== "ADMIN") throw new Error("Forbidden");
		return next({ context: { user: context.user } });
	});

export type AuthContextWithUser = { user: SessionUser };
