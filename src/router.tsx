import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import type { AuthState } from "./lib/auth";
import { routeTree } from "./routeTree.gen";

type RouterContext = { auth: AuthState };

const DEFAULT_AUTH: AuthState = {
	user: null,
	isAuthenticated: false,
	isAdmin: false,
};

export function getRouter() {
	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		context: {
			auth: DEFAULT_AUTH,
		} satisfies RouterContext,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
