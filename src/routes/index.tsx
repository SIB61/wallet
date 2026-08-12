import { createFileRoute, Link } from "@tanstack/react-router";
import type { SVGProps } from "react";
import { LedgerlyLogo } from "@/components/logo";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "Ledgerly · Personal finance, made simple" },
			{
				name: "description",
				content:
					"Ledgerly — track bank accounts, cash, and money lent to people. Log expenses, income and transfers in one clean ledger.",
			},
		],
	}),
	component: Landing,
});

function ArrowRightIcon(props: SVGProps<SVGSVGElement>) {
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

function ArrowUpIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M12 19V5" />
			<path d="m5 12 7-7 7 7" />
		</svg>
	);
}

function ArrowDownIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M12 5v14" />
			<path d="m5 12 7 7 7-7" />
		</svg>
	);
}

function TransferIcon(props: SVGProps<SVGSVGElement>) {
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

const FEATURES = [
	{
		title: "One ledger",
		description:
			"Every account in a single view — bank, wallet, cash, cards and people you've lent to.",
		href: "/accounts",
	},
	{
		title: "Auto-balanced",
		description:
			"Log a transaction and balances update themselves. No manual math, no drift.",
		href: "/transactions",
	},
	{
		title: "Clear overview",
		description:
			"Monthly income and expense, totals and recent activity — at a glance.",
		href: "/dashboard",
	},
];

const STATS = [
	{ label: "Account types", value: "06" },
	{ label: "Transaction types", value: "03" },
	{ label: "Auto sync", value: "100%" },
];

function Landing() {
	const { auth } = Route.useRouteContext();
	const signedIn = auth.isAuthenticated;

	return (
		<main className="min-h-screen">
			{/* ============ Hero ============ */}
			<section className="relative overflow-hidden border-b border-[var(--line)]">
				<div className="blueprint-grid pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black_40%,transparent)]" />
				<div className="page-wrap relative grid items-center gap-12 px-4 py-20 sm:py-24 lg:grid-cols-2 lg:py-28">
					<div>
						<p className="rise-in mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--lagoon-deep-30)] bg-[var(--lagoon-12)] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--lagoon-deep)]">
							<span className="size-1.5 rounded-full bg-[var(--lagoon-deep)]" />
							Personal finance
						</p>
						<h1 className="display-title rise-in rise-in-delay-1 text-4xl font-bold leading-[1.05] tracking-tight text-[var(--sea-ink)] sm:text-5xl lg:text-6xl">
							Money, kept in order.
						</h1>
						<p className="rise-in rise-in-delay-2 m-0 mt-6 max-w-md text-base leading-8 text-[var(--sea-ink-soft)] sm:text-lg">
							Ledgerly is a clean ledger for your accounts, expenses, income
							and transfers. Every balance stays in sync — automatically.
						</p>
						<div className="rise-in rise-in-delay-3 mt-9 flex flex-wrap items-center gap-3">
							<Link
								to={signedIn ? "/dashboard" : "/login"}
								className="inline-flex items-center gap-2 rounded-lg bg-[var(--lagoon-deep)] px-6 py-3 text-sm font-semibold text-[var(--sand)] no-underline transition hover:bg-[var(--lagoon-deep)]/90"
							>
								{signedIn ? "Open dashboard" : "Get started"}
								<ArrowRightIcon className="size-4" />
							</Link>
							<a
								href="#features"
								className="inline-flex items-center gap-2 rounded-lg border border-[var(--line)] px-6 py-3 text-sm font-semibold text-[var(--sea-ink)] no-underline transition hover:border-[var(--lagoon-deep)] hover:text-[var(--lagoon-deep)]"
							>
								See how it works
							</a>
						</div>

						{/* Stats */}
						<dl className="rise-in rise-in-delay-4 mt-12 grid grid-cols-3 divide-x divide-[var(--line)] border-y border-[var(--line)]">
							{STATS.map(({ label, value }) => (
								<div key={label} className="px-4 py-4 first:pl-0 last:pr-0">
									<dt className="text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
										{label}
									</dt>
									<dd className="font-mono text-2xl font-bold text-[var(--sea-ink)]">
										{value}
									</dd>
								</div>
							))}
						</dl>
					</div>

					{/* Product preview */}
					<div className="rise-in rise-in-delay-2 hidden lg:block">
						<div className="overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-strong)]">
							<div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-3">
								<p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
									Dashboard
								</p>
								<div className="flex items-center gap-1.5">
									<span className="size-2 rounded-full bg-[var(--lagoon-24)]" />
									<span className="size-2 rounded-full bg-[var(--lagoon-24)]" />
									<span className="size-2 rounded-full bg-[var(--lagoon-24)]" />
								</div>
							</div>
							<div className="grid grid-cols-3 divide-x divide-[var(--line)]">
								<div className="p-4">
									<p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
										Balance
									</p>
									<p className="m-0 font-mono text-lg font-bold text-[var(--sea-ink)]">
										₿ 12,480.50
									</p>
								</div>
								<div className="p-4">
									<p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
										Income
									</p>
									<p className="m-0 font-mono text-lg font-bold text-[var(--palm)]">
										+ 3,200.00
									</p>
								</div>
								<div className="p-4">
									<p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
										Expense
									</p>
									<p className="m-0 font-mono text-lg font-bold text-[#c0392b]">
										− 1,145.75
									</p>
								</div>
							</div>
							<ul className="divide-y divide-[var(--line)] border-t border-[var(--line)]">
								{[
									{ label: "Salary · bKash", value: "+ 32,000.00", tone: "text-[var(--palm)]" },
									{ label: "Groceries · Cash", value: "− 1,240.00", tone: "text-[#c0392b]" },
									{ label: "Transfer · bKash → DBBL", value: "↔ 5,000.00", tone: "text-[var(--sea-ink-soft)]" },
									{ label: "Rent · DBBL", value: "− 12,000.00", tone: "text-[#c0392b]" },
								].map((row) => (
									<li
										key={row.label}
										className="flex items-center justify-between px-5 py-3"
									>
										<span className="min-w-0 truncate text-sm font-medium text-[var(--sea-ink)]">
											{row.label}
										</span>
										<span className={`ml-4 font-mono text-sm font-bold ${row.tone}`}>
											{row.value}
										</span>
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</section>

			{/* ============ Features ============ */}
			<section id="features" className="page-wrap px-4 py-20 sm:py-24">
				<div className="mb-10 max-w-xl">
					<p className="m-0 text-xs font-bold uppercase tracking-wider text-[var(--lagoon-deep)]">
						Why Ledgerly
					</p>
					<h2 className="display-title mt-2 text-3xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-4xl">
						A simple ledger for real money.
					</h2>
				</div>

				<div className="grid gap-0 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--surface-strong)] md:grid-cols-3 md:divide-x md:divide-[var(--line)]">
					{FEATURES.map(({ title, description, href }, index) => (
						<Link
							key={title}
							to={signedIn ? href : "/login"}
							className={`group flex flex-col gap-4 p-6 no-underline transition sm:p-8 ${index === 0 ? "" : "border-t border-[var(--line)] md:border-t-0"} hover:bg-[var(--lagoon-05)]`}
						>
							<span className="flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--lagoon-deep-30)] text-[var(--lagoon-deep)]">
								{index === 0 ? (
									<LedgerIcon className="size-5" />
								) : index === 1 ? (
									<ArrowUpIcon className="size-5" />
								) : (
									<ArrowDownIcon className="size-5" />
								)}
							</span>
							<span className="text-lg font-semibold text-[var(--sea-ink)]">
								{title}
							</span>
							<span className="m-0 flex-1 text-sm leading-7 text-[var(--sea-ink-soft)]">
								{description}
							</span>
							<span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--lagoon-deep)]">
								Explore
								<ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
							</span>
						</Link>
					))}
				</div>
			</section>

			{/* ============ Transfer strip ============ */}
			<section className="border-y border-[var(--line)] bg-[var(--surface-strong)]">
				<div className="page-wrap grid items-center gap-10 px-4 py-16 sm:py-20 lg:grid-cols-2">
					<div className="flex items-center gap-4">
						<span className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl border border-[var(--lagoon-deep-30)] text-[var(--lagoon-deep)]">
							<TransferIcon className="size-6" />
						</span>
						<div>
							<p className="m-0 text-lg font-semibold text-[var(--sea-ink)]">
								Transfers, done right
							</p>
							<p className="m-0 mt-1 text-sm leading-6 text-[var(--sea-ink-soft)]">
								Move money between accounts with a single transaction. Both
								sides update instantly.
							</p>
						</div>
					</div>
					<div className="rounded-lg border border-[var(--line)] px-5 py-4 font-mono text-sm text-[var(--sea-ink-soft)]">
						<p className="m-0">
							<span className="text-[var(--lagoon-deep)]">bKash</span> →
							<span className="text-[var(--lagoon-deep)]">DBBL</span> · 5,000.00
						</p>
						<p className="m-0 mt-1">
							<span className="text-[var(--sea-ink)]">bKash</span> · 18,400.00
						</p>
						<p className="m-0 mt-1">
							<span className="text-[var(--sea-ink)]">DBBL</span> · 27,080.50
						</p>
					</div>
				</div>
			</section>

			{/* ============ CTA ============ */}
			<section className="page-wrap px-4 py-20 text-center sm:py-24">
				<h2 className="display-title mx-auto max-w-2xl text-3xl font-bold tracking-tight text-[var(--sea-ink)] sm:text-4xl">
					Stop reconciling by hand.
				</h2>
				<p className="m-0 mx-auto mt-4 max-w-md text-base leading-7 text-[var(--sea-ink-soft)]">
					Sign in, set up your accounts, and your money starts making sense in
					minutes.
				</p>
				<div className="mt-9">
					<Link
						to={signedIn ? "/dashboard" : "/login"}
						className="inline-flex items-center gap-2 rounded-lg bg-[var(--lagoon-deep)] px-8 py-3.5 text-sm font-semibold text-[var(--sand)] no-underline transition hover:bg-[var(--lagoon-deep)]/90"
					>
						{signedIn ? "Open dashboard" : "Get started free"}
						<ArrowRightIcon className="size-4" />
					</Link>
				</div>
			</section>

			{/* ============ Footer ============ */}
			<footer className="border-t border-[var(--line)]">
				<div className="page-wrap flex flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
					<LedgerlyLogo compact />
					<p className="m-0 text-sm text-[var(--sea-ink-soft)]">
						Personal finance, kept in order.
					</p>
				</div>
			</footer>
		</main>
	);
}

function LedgerIcon(props: SVGProps<SVGSVGElement>) {
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
			<rect x="3" y="4" width="18" height="16" rx="2" />
			<path d="M7 9h10" />
			<path d="M7 13h7" />
			<path d="M7 17h4" />
		</svg>
	);
}
