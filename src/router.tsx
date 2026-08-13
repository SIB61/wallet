import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import type { AuthState } from "./lib/auth";
import { routeTree } from "./routeTree.gen";

import { QueryClient } from "@tanstack/react-query";

type RouterContext = { auth: AuthState; queryClient: QueryClient };

const DEFAULT_AUTH: AuthState = {
	user: null,
	isAuthenticated: false,
	isAdmin: false,
};
import { GlobalPending } from "@/components/wallet/skeletons";

export function getRouter() {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 2 * 60 * 1000, // Never stale unless explicitly invalidated
				refetchOnWindowFocus: true,
				refetchOnMount: false,
			},
		},
	});

	const router = createTanStackRouter({
		routeTree,
		scrollRestoration: true,
		defaultPreload: "intent",
		defaultPreloadStaleTime: 0,
		defaultPendingMs: 0,
		defaultPendingMinMs: 0,
		defaultPendingComponent: GlobalPending,
		context: {
			auth: DEFAULT_AUTH,
			queryClient,
		} satisfies RouterContext,
	});

	return router;
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof getRouter>;
	}
}
