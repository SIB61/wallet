import { Link, useRouter } from "@tanstack/react-router";
import { type SVGProps, useState } from "react";
import { UserAvatar } from "@/components/auth/user-avatar";
import { LogoMark } from "@/components/logo";
import { type AuthState, logoutFn } from "@/lib/auth";
import { cn } from "@/lib/utils";

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

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
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
			<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
			<circle cx="12" cy="12" r="3" />
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

function HomeIcon(props: SVGProps<SVGSVGElement>) {
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
			<path d="M3 10.5 12 3l9 7.5" />
			<path d="M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5" />
		</svg>
	);
}

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
		href: "/dashboard",
		Icon: DashboardIcon,
	},
	{
		id: "accounts",
		label: "Accounts",
		href: "/accounts",
		Icon: AccountsIcon,
	},
	{
		id: "transactions",
		label: "Transactions",
		href: "/transactions",
		Icon: TransactionsIcon,
	},
	{
		id: "settings",
		label: "Settings",
		href: "/settings",
		Icon: SettingsIcon,
	},
];

const NAV_ACTIVE = "bg-[var(--lagoon-22)] text-[var(--sea-ink)]";
const NAV_IDLE =
	"text-[var(--sea-ink-soft)] hover:bg-[var(--lagoon-12)] hover:text-[var(--sea-ink)]";

export function AppNav({
	auth,
	pathname,
}: {
	auth: AuthState;
	pathname: string;
}) {
	const router = useRouter();
	const [collapsed, setCollapsed] = useState(
		() =>
			typeof window !== "undefined" &&
			window.localStorage.getItem("wallet-sidebar") === "collapsed",
	);
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

	return (
		<>
			<aside
				className={cn(
					"hidden flex-shrink-0 flex-col rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-2 shadow-[0_1px_3px_var(--shadow-soft-06)] transition-[width] duration-200 md:sticky md:top-6 md:flex",
					collapsed ? "w-16" : "w-60",
				)}
			>
				<div
					className={cn(
						"mb-2 flex items-center gap-2.5 border-b border-[var(--line)] pb-2",
						collapsed && "justify-center border-b-0",
					)}
				>
					<span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--lagoon-deep-30)] bg-[var(--lagoon-12)] text-[var(--lagoon-deep)]">
						<LogoMark className="h-4 w-4" />
					</span>
					{!collapsed && (
						<span className="truncate text-sm font-bold text-[var(--sea-ink)]">
							Ledgerly
						</span>
					)}
				</div>

				<nav className="flex flex-col gap-1">
					{NAV_ITEMS.map(({ id, label, href, Icon }) => (
						<Link
							key={id}
							to={href}
							activeOptions={{ exact: href === "/dashboard" }}
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

			{/* Mobile bottom tab bar */}
			<nav
				aria-label="Primary"
				className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--line)] bg-[var(--surface-strong)] md:hidden"
				style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
			>
				<div className="flex items-stretch">
					{NAV_ITEMS.map(({ id, label, href, Icon }) => {
						const active =
							href === "/dashboard"
								? pathname === href
								: pathname.startsWith(href);
						return (
							<Link
								key={id}
								to={href}
								title={label}
								className={cn(
									"flex min-w-0 flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold no-underline transition",
									active
										? "text-[var(--lagoon-deep)]"
										: "text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]",
								)}
							>
								<span className="flex h-6 w-6 items-center justify-center">
									<Icon className="h-5 w-5" />
								</span>
								<span className="hidden min-[360px]:block truncate">{label}</span>
							</Link>
						);
					})}
					{auth.isAdmin && (
						<Link
							to="/admin"
							title="Admin"
							className={cn(
								"flex min-w-0 flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-semibold no-underline transition",
								pathname.startsWith("/admin")
									? "text-[var(--lagoon-deep)]"
									: "text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]",
							)}
						>
							<span className="flex h-6 w-6 items-center justify-center">
								<ShieldIcon className="h-5 w-5" />
							</span>
							<span className="hidden min-[360px]:block truncate">Admin</span>
						</Link>
					)}
				</div>
			</nav>
		</>
	);
}
