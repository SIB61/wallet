import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { AppNav } from "@/components/wallet/app-nav";
import { GlobalActionMenu } from "@/components/wallet/global-action-menu";

export const Route = createFileRoute("/_authenticated/_wallet")({
	component: WalletLayout,
});

function WalletLayout() {
	const { auth } = Route.useRouteContext();
	const pathname = useLocation().pathname;

	return (
		<main className="page-wrap flex flex-col gap-4 px-4 pb-24 pt-6 md:flex-row md:items-start md:gap-5 md:pb-16">
			<AppNav auth={auth} pathname={pathname} />

			<div className="min-w-0 flex-1">
				<Outlet />
			</div>

			<GlobalActionMenu />
		</main>
	);
}
