import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
	useRouter,
} from "@tanstack/react-router";
import { type SVGProps, useEffect, useRef, useState } from "react";
import { UserAvatar } from "@/components/auth/user-avatar";
import { logoutFn } from "@/lib/auth";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_authenticated/apps/wallet")({
	component: WalletLayout,
});

function DashboardIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<rect x="3" y="3" width="7" height="9" rx="1.5" />
			<rect x="14" y="3" width="7" height="5" rx="1.5" />
			<rect x="14" y="12" width="7" height="9" rx="1.5" />
			<rect x="3" y="16" width="7" height="5" rx="1.5" />
		</svg>
	);
}

function AccountsIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M3 7.5A2.5 2.5 0 0 1 5.5 5h13A2.5 2.5 0 0 1 21 7.5v9a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 16.5z" />
			<path d="M3 10h18" />
			<path d="M7 15h4" />
		</svg>
	);
}

function TransactionsIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M4 6h13" />
			<path d="m13 2 5 4-5 4" />
			<path d="M20 18H7" />
			<path d="m11 14-5 4 5 4" />
		</svg>
	);
}

function ChevronLeftIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="m15 18-6-6 6-6" />
		</svg>
	);
}

function ChevronDownIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 16 16"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M3.5 6 8 10.5 12.5 6" />
		</svg>
	);
}

function WalletIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M20 7H5a2 2 0 0 1 0-4h13" />
			<path d="M20 7v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7" />
			<path d="M16 13h.01" />
		</svg>
	);
}

type NavItem = {
	id: string;
	label: string;
	href: string;
	Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
};

const NAV_ITEMS: NavItem[] = [
	{
		id: "dashboard",
		label: "Dashboard",
		href: "/apps/wallet",
		Icon: DashboardIcon,
	},
	{
		id: "accounts",
		label: "Accounts",
		href: "/apps/wallet/accounts",
		Icon: AccountsIcon,
	},
	{
		id: "transactions",
		label: "Transactions",
		href: "/apps/wallet/transactions",
		Icon: TransactionsIcon,
	},
];

const NAV_ACTIVE = "bg-[var(--lagoon-22)] text-[var(--sea-ink)]";
const NAV_IDLE =
	"text-[var(--sea-ink-soft)] hover:bg-[var(--lagoon-12)] hover:text-[var(--sea-ink)]";

function ShieldIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M12 3 4 6v6c0 4.5 3.4 8 8 9 4.6-1 8-4.5 8-9V6z" />
			<path d="m9.5 12 1.8 1.8L14.8 10" />
		</svg>
	);
}

function LogoutIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M10 17l5-5-5-5" />
			<path d="M15 12H3" />
			<path d="M15 3h4a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1h-4" />
		</svg>
	);
}

function WalletLayout() {
	const router = useRouter();
	const { auth } = Route.useRouteContext();
	const [collapsed, setCollapsed] = useState(
		() =>
			typeof window !== "undefined" &&
			window.localStorage.getItem("wallet-sidebar") === "collapsed",
	);
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const pathname = useLocation().pathname;
	const [loggingOut, setLoggingOut] = useState(false);

	async function handleLogout() {
		setLoggingOut(true);
		try {
			await logoutFn();
			await router.invalidate();
			router.navigate({ to: "/" });
		} catch {
			setLoggingOut(false);
		}
	}

	useEffect(() => {
		if (!menuOpen) return;
		function onPointerDown(event: PointerEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		}
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") setMenuOpen(false);
		}
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [menuOpen]);

	function toggle() {
		setCollapsed((prev) => {
			const next = !prev;
			window.localStorage.setItem(
				"wallet-sidebar",
				next ? "collapsed" : "expanded",
			);
			return next;
		});
	}

	const current =
		NAV_ITEMS.find((item) => pathname.startsWith(item.href)) ?? NAV_ITEMS[0];
	const CurrentIcon = current.Icon;

	return (
		<main className="page-wrap flex flex-col gap-4 px-4 pb-16 pt-6 md:flex-row md:items-start md:gap-5">
			<header className="relative flex flex-wrap items-center justify-between gap-3 md:hidden">
				<div className="flex items-center gap-2.5">
					<span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--lagoon-16)] text-[var(--lagoon-deep)]">
						<WalletIcon className="h-5 w-5" />
					</span>
					<div>
						<p className="island-kicker text-xs">Personal Finance</p>
						<h1 className="display-title text-xl font-bold text-[var(--sea-ink)]">
							Wallet
						</h1>
					</div>
				</div>
				<button
					type="button"
					onClick={() => setMenuOpen((open) => !open)}
					aria-haspopup="listbox"
					aria-expanded={menuOpen}
					className={cn(
						"flex h-11 items-center justify-between gap-2 rounded-xl border bg-[var(--surface-strong)] px-3 text-sm font-semibold text-[var(--sea-ink)] transition",
						menuOpen
							? "border-[var(--lagoon-deep)] shadow-[0_0_0_3px_var(--lagoon-24)]"
							: "border-[var(--line)] hover:border-[var(--lagoon-deep)]",
					)}
				>
					<span className="flex min-w-0 items-center gap-2.5">
						<span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--lagoon-14)] text-[var(--lagoon-deep)]">
							<CurrentIcon className="h-4 w-4" />
						</span>
						<span className="truncate">{current.label}</span>
					</span>
					<ChevronDownIcon
						className={cn(
							"h-4 w-4 flex-shrink-0 text-[var(--sea-ink-soft)] transition-transform duration-200",
							menuOpen && "rotate-180",
						)}
					/>
				</button>

				{menuOpen && (
					<div
						ref={menuRef}
						role="listbox"
						className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--menu-solid)] p-1.5 shadow-[0_18px_34px_var(--shadow-ink-16),0_6px_16px_var(--shadow-soft-10)]"
					>
						{NAV_ITEMS.map(({ id, label, href, Icon }) => {
							const active = pathname.startsWith(href);
							return (
								<Link
									key={id}
									to={href}
									onClick={() => setMenuOpen(false)}
									className={cn(
										"flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-semibold no-underline transition",
										active ? NAV_ACTIVE : NAV_IDLE,
									)}
								>
									<span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--lagoon-14)] text-[var(--lagoon-deep)]">
										<Icon className="h-4 w-4" />
									</span>
									<span className="flex-1">{label}</span>
								</Link>
							);
						})}
						{auth.isAdmin && (
							<Link
								to="/admin"
								onClick={() => setMenuOpen(false)}
								className={cn(
									"flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-semibold no-underline transition",
									pathname.startsWith("/admin") ? NAV_ACTIVE : NAV_IDLE,
								)}
							>
								<span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--lagoon-14)] text-[var(--lagoon-deep)]">
									<ShieldIcon className="h-4 w-4" />
								</span>
								<span className="flex-1">Admin</span>
							</Link>
						)}
						{auth.user && (
							<div className="mt-1 flex items-center gap-2.5 rounded-lg border-t border-[var(--line)] px-2.5 pt-2">
								<span className="flex min-w-0 flex-1 items-center gap-2.5">
									<UserAvatar
										src={auth.user.avatarUrl}
										name={auth.user.name}
										className="h-8 w-8"
									/>
									<span className="min-w-0 flex-1">
										<span className="block truncate text-sm font-semibold text-[var(--sea-ink)]">
											{auth.user.name ?? "Signed in"}
										</span>
										<span className="block truncate text-xs text-[var(--sea-ink-soft)]">
											{auth.user.email}
										</span>
									</span>
								</span>
								<button
									type="button"
									onClick={() => void handleLogout()}
									disabled={loggingOut}
									title="Sign out"
									aria-label="Sign out"
									className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[var(--sea-ink-soft)] transition hover:bg-[var(--lagoon-12)] hover:text-[var(--sea-ink)] disabled:opacity-50"
								>
									<LogoutIcon className="h-4 w-4" />
								</button>
							</div>
						)}
					</div>
				)}
			</header>

			<aside
				className={cn(
					"hidden flex-shrink-0 flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-2 shadow-[0_18px_34px_var(--shadow-ink-10)] backdrop-blur transition-[width] duration-200 md:sticky md:top-6 md:flex",
					collapsed ? "w-16" : "w-60",
				)}
			>
				<div
					className={cn(
						"mb-2 flex items-center gap-2.5 border-b border-[var(--line)] pb-2",
						collapsed && "justify-center border-b-0",
					)}
				>
					<span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--lagoon-16)] text-[var(--lagoon-deep)]">
						<WalletIcon className="h-4 w-4" />
					</span>
					{!collapsed && (
						<span className="truncate text-sm font-bold text-[var(--sea-ink)]">
							Wallet
						</span>
					)}
				</div>

				<nav className="flex flex-col gap-1">
					{NAV_ITEMS.map(({ id, label, href, Icon }) => (
						<Link
							key={id}
							to={href}
							activeOptions={{ exact: href === "/apps/wallet" }}
							activeProps={{ className: NAV_ACTIVE }}
							title={label}
							className={cn(
								"flex flex-shrink-0 items-center gap-2.5 rounded-xl px-2 py-2 text-sm font-semibold no-underline transition",
								NAV_IDLE,
								collapsed && "justify-center px-0",
							)}
						>
							<span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--lagoon-14)] text-[var(--lagoon-deep)]">
								<Icon className="h-4 w-4" />
							</span>
							{!collapsed && <span className="truncate">{label}</span>}
						</Link>
					))}
					{auth.isAdmin && (
						<Link
							to="/admin"
							activeOptions={{ exact: true }}
							activeProps={{ className: NAV_ACTIVE }}
							title="Admin"
							className={cn(
								"mt-1 flex flex-shrink-0 items-center gap-2.5 rounded-xl px-2 py-2 text-sm font-semibold no-underline transition",
								NAV_IDLE,
								collapsed && "justify-center px-0",
							)}
						>
							<span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--lagoon-14)] text-[var(--lagoon-deep)]">
								<ShieldIcon className="h-4 w-4" />
							</span>
							{!collapsed && <span className="truncate">Admin</span>}
						</Link>
					)}
				</nav>

				<div className="mt-auto flex flex-col gap-2 pt-2">
					{auth.user && (
						<div
							className={cn(
								"flex items-center gap-2.5 border-t border-[var(--line)] pt-2",
								collapsed && "justify-center",
							)}
							title={auth.user.email}
						>
							<UserAvatar
								src={auth.user.avatarUrl}
								name={auth.user.name}
								className="h-8 w-8"
							/>
							{!collapsed && (
								<span className="min-w-0 flex-1">
									<span className="block truncate text-sm font-semibold text-[var(--sea-ink)]">
										{auth.user.name ?? "Signed in"}
									</span>
									<span className="block truncate text-xs text-[var(--sea-ink-soft)]">
										{auth.user.role === "ADMIN" ? "Admin" : "User"}
									</span>
								</span>
							)}
							{!collapsed && (
								<button
									type="button"
									onClick={() => void handleLogout()}
									disabled={loggingOut}
									title="Sign out"
									aria-label="Sign out"
									className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-[var(--sea-ink-soft)] transition hover:bg-[var(--lagoon-12)] hover:text-[var(--sea-ink)] disabled:opacity-50"
								>
									<LogoutIcon className="h-4 w-4" />
								</button>
							)}
						</div>
					)}
					<button
						type="button"
						onClick={toggle}
						title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
						aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
						className={cn(
							"flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--line)] py-2 text-sm font-semibold text-[var(--sea-ink-soft)] transition hover:bg-[var(--lagoon-12)] hover:text-[var(--sea-ink)]",
							collapsed && "border-0",
						)}
					>
						<ChevronLeftIcon
							className={cn(
								"h-4 w-4 transition-transform duration-200",
								!collapsed && "rotate-180",
							)}
						/>
						{!collapsed && <span>Collapse</span>}
					</button>
				</div>
			</aside>

			<div className="min-w-0 flex-1">
				<Outlet />
			</div>
		</main>
	);
}
