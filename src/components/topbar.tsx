import { Link, useRouterState } from "@tanstack/react-router";
import { LedgerlyLogo } from "@/components/logo";
import { ThemeSwitcher } from "@/components/theme-switcher";

function ArrowRightIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="M5 12h14" />
			<path d="m13 6 6 6-6 6" />
		</svg>
	);
}

export function GlobalTopbar() {
	const signedIn = useRouterState({
		select: (state) =>
			Boolean(state.matches[0]?.context?.auth?.isAuthenticated),
	});

	return (
		<header className="sticky top-0 z-40 border-b border-[var(--line)] bg-[var(--bg-base)]/90 backdrop-blur">
			<div className="page-wrap flex h-16 items-center justify-between">
				<Link to="/" className="no-underline">
					<LedgerlyLogo />
				</Link>
				<div className="flex items-center gap-2.5">
					<ThemeSwitcher />
					{!signedIn && (
						<Link
							to="/login"
							search={{ redirect: undefined, error: undefined }}
							className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-strong)] px-4 py-2 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:border-[var(--lagoon-deep)] hover:text-[var(--lagoon-deep)]"
						>
							Sign in
							<ArrowRightIcon className="size-4" />
						</Link>
					)}
				</div>
			</div>
		</header>
	);
}
