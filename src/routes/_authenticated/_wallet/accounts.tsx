import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/_wallet/accounts")({
	component: AccountsLayout,
});

function AccountsLayout() {
	return (
		<div className="flex flex-col gap-5">
			<Outlet />
		</div>
	);
}
