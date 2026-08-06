import { createFileRoute, Link } from "@tanstack/react-router";
import type { SVGProps } from "react";
import { PROFILE } from "@/lib/portfolio";
import { TOOLS } from "../lib/tools";

export const Route = createFileRoute("/")({
	head: () => ({
		meta: [
			{ title: "SIB61 · Portfolio, Tools & Apps" },
			{
				name: "description",
				content:
					"SIB61 — a pocket workspace with tools, a personal finance app, and the portfolio of Md Sabit Islam Bhuiya.",
			},
		],
	}),
	component: App,
});

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
			<path d="M5 9.5V21h5v-6h4v6h5V9.5" />
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

function UserIcon(props: SVGProps<SVGSVGElement>) {
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
			<circle cx="12" cy="8" r="4" />
			<path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
		</svg>
	);
}

function BriefcaseIcon(props: SVGProps<SVGSVGElement>) {
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
			<rect x="3" y="7" width="18" height="13" rx="2" />
			<path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
			<path d="M3 13h18" />
		</svg>
	);
}

function RocketIcon(props: SVGProps<SVGSVGElement>) {
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
			<path d="M5 14c-1.5 1.5-2 4-2 4s2.5-.5 4-2" />
			<path d="M9 6c1.5-2 4-4 7-4 0 3-2 5.5-4 7l-4.5.5L9 6z" />
			<path d="m9 6-4 1.5L7.5 10" />
			<path d="m13 15.5-.5 4.5-4-1.5" />
			<path d="M17.5 14.5c2-1.5 4-4 4-7-3 0-5.5 2-7 4l-.5 4.5 3.5 2z" />
			<circle cx="15" cy="9" r="1.5" />
		</svg>
	);
}

function CompassIcon(props: SVGProps<SVGSVGElement>) {
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
			<circle cx="12" cy="12" r="9" />
			<path d="m15.5 8.5-2 5-5 2 2-5z" />
		</svg>
	);
}

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

function InfoIcon(props: SVGProps<SVGSVGElement>) {
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
			<circle cx="12" cy="12" r="9" />
			<path d="M12 16v-4" />
			<path d="M12 8h.01" />
		</svg>
	);
}

type NavCard = {
	href: string;
	title: string;
	description: string;
	Icon: (props: SVGProps<SVGSVGElement>) => React.JSX.Element;
};

const WALLET_CARDS: NavCard[] = [
	{
		href: "/apps/wallet",
		title: "Dashboard",
		description: "Balances, monthly totals and recent activity at a glance.",
		Icon: DashboardIcon,
	},
	{
		href: "/apps/wallet/accounts",
		title: "Accounts",
		description: "Track bank accounts, cash and money lent to people.",
		Icon: AccountsIcon,
	},
	{
		href: "/apps/wallet/transactions",
		title: "Transactions",
		description: "Log expenses, income and transfers between accounts.",
		Icon: TransactionsIcon,
	},
];

const PORTFOLIO_CARDS: NavCard[] = [
	{
		href: "/portfolio",
		title: "Overview",
		description: `${PROFILE.name} — skills, stats and career highlights.`,
		Icon: UserIcon,
	},
	{
		href: "/portfolio/experience",
		title: "Experience",
		description:
			"Roles and timelines across payments, realtime and microservices.",
		Icon: BriefcaseIcon,
	},
	{
		href: "/portfolio/projects",
		title: "Projects & Wins",
		description: "Personal projects, an npm package and hackathon placements.",
		Icon: RocketIcon,
	},
	{
		href: "/portfolio/contact",
		title: "Contact",
		description: "Reach out about roles, ideas or collaborations.",
		Icon: CompassIcon,
	},
];

function App() {
	return (
		<main className="page-wrap flex flex-col gap-10 px-4 pb-16 pt-8">
			{/* ============ Hero ============ */}
			<section className="rise-in relative overflow-hidden rounded-[2rem] px-6 py-12 sm:px-10 sm:py-16">
				<div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,var(--lagoon-32),transparent_62%)]" />
				<div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,var(--palm-18),transparent_62%)]" />

				<div className="relative flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
					<div className="min-w-0">
						<p className="island-kicker mb-3 flex items-center gap-2">
							<span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--lagoon-deep-30)] bg-[var(--lagoon-12)] px-3 py-1 text-xs font-bold text-[var(--lagoon-deep)]">
								<HomeIcon className="size-3.5" />
								PWA Home
							</span>
						</p>
						<h1 className="display-title mb-4 text-4xl font-bold leading-[1.02] tracking-tight text-[var(--sea-ink)] sm:text-6xl">
							Your pocket <span className="gradient-text">workspace.</span>
						</h1>
						<p className="m-0 max-w-xl text-base leading-8 text-[var(--sea-ink-soft)] sm:text-lg">
							Tools, a personal finance app and a portfolio — all in one
							installable place. Tap a card to jump straight in.
						</p>
					</div>

					<div className="island-shell flex flex-row items-center gap-4 rounded-2xl px-5 py-4 sm:flex-col sm:px-6 sm:py-5">
						<span className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-[var(--lagoon-deep)] text-xl font-extrabold text-[var(--sand)]">
							{PROFILE.monogram}
						</span>
						<div className="min-w-0 sm:text-center">
							<p className="display-title truncate text-lg font-bold text-[var(--sea-ink)]">
								{PROFILE.shortName}
							</p>
							<p className="m-0 text-sm font-semibold text-[var(--lagoon-deep)]">
								{PROFILE.role}
							</p>
							<p className="mt-0.5 flex items-center gap-1.5 text-xs text-[var(--sea-ink-soft)] sm:justify-center">
								<span className="relative flex size-2">
									<span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--lagoon)] opacity-70" />
									<span className="relative inline-flex size-2 rounded-full bg-[var(--lagoon-deep)]" />
								</span>
								Available for new roles
							</p>
						</div>
					</div>
				</div>

				<div className="relative mt-8 grid gap-3 sm:grid-cols-3">
					{[
						["4", "Handy tools"],
						["3", "Wallet screens"],
						["1", "Portfolio"],
					].map(([count, label], index) => (
						<div
							key={label}
							className="feature-card rise-in flex items-baseline gap-2 rounded-2xl px-5 py-4"
							style={{ animationDelay: `${index * 90 + 120}ms` }}
						>
							<span className="display-title text-2xl font-bold text-[var(--lagoon-deep)]">
								{count}
							</span>
							<span className="text-sm font-semibold text-[var(--sea-ink-soft)]">
								{label}
							</span>
						</div>
					))}
				</div>
			</section>

			{/* ============ Apps ============ */}
			<section aria-labelledby="home-apps-title" className="rise-in">
				<div className="mb-4 flex items-center gap-3">
					<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--lagoon-16)] text-[var(--lagoon-deep)]">
						<WalletIcon className="size-5" />
					</span>
					<div>
						<p className="island-kicker mb-0.5 text-xs">Apps</p>
						<h2
							id="home-apps-title"
							className="display-title text-2xl font-bold text-[var(--sea-ink)]"
						>
							Wallet
						</h2>
					</div>
				</div>
				<div className="grid gap-4 sm:grid-cols-3">
					{WALLET_CARDS.map(({ href, title, description, Icon }, index) => (
						<Link
							key={href}
							to={href}
							className="island-shell feature-card group flex h-full flex-col rounded-2xl p-6 no-underline transition hover:-translate-y-0.5"
							style={{ animationDelay: `${index * 90 + 80}ms` }}
						>
							<span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--lagoon-14)] text-[var(--lagoon-deep)] transition group-hover:bg-[var(--lagoon-24)]">
								<Icon className="size-5" />
							</span>
							<span className="text-base font-semibold text-[var(--sea-ink)]">
								{title}
							</span>
							<span className="mt-1.5 flex-1 text-sm leading-6 text-[var(--sea-ink-soft)]">
								{description}
							</span>
							<span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--lagoon-deep)]">
								Open
								<ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
							</span>
						</Link>
					))}
				</div>
			</section>

			{/* ============ Tools ============ */}
			<section aria-labelledby="home-tools-title" className="rise-in">
				<div className="mb-4 flex items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--lagoon-16)] text-[var(--lagoon-deep)]">
							<svg
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="1.8"
								strokeLinecap="round"
								strokeLinejoin="round"
								aria-hidden="true"
								className="size-5"
							>
								<path d="M14.7 6.3a4.5 4.5 0 0 0-6 6L3 18l3 3 5.7-5.7a4.5 4.5 0 0 0 6-6L14 13l-3-3z" />
							</svg>
						</span>
						<div>
							<p className="island-kicker mb-0.5 text-xs">Tools</p>
							<h2
								id="home-tools-title"
								className="display-title text-2xl font-bold text-[var(--sea-ink)]"
							>
								Handy utilities
							</h2>
						</div>
					</div>
					<Link
						to="/tools"
						className="hidden items-center gap-1.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:underline sm:inline-flex"
					>
						All tools
						<ArrowRightIcon className="size-4" />
					</Link>
				</div>
				<div className="grid gap-4 sm:grid-cols-2">
					{TOOLS.map(({ id, name, description, href, Icon }, index) => (
						<Link
							key={id}
							to={href}
							className="island-shell feature-card group flex flex-col rounded-2xl p-6 no-underline transition hover:-translate-y-0.5"
							style={{ animationDelay: `${index * 90 + 80}ms` }}
						>
							<span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--lagoon-14)] text-[var(--lagoon-deep)] transition group-hover:bg-[var(--lagoon-24)]">
								<Icon className="size-5" />
							</span>
							<span className="text-base font-semibold text-[var(--sea-ink)]">
								{name}
							</span>
							<span className="mt-1.5 text-sm leading-6 text-[var(--sea-ink-soft)]">
								{description}
							</span>
							<span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--lagoon-deep)]">
								Open tool
								<ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
							</span>
						</Link>
					))}
				</div>
			</section>

			{/* ============ Portfolio ============ */}
			<section aria-labelledby="home-portfolio-title" className="rise-in">
				<div className="mb-4 flex items-center justify-between gap-3">
					<div className="flex items-center gap-3">
						<span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--lagoon-16)] text-[var(--lagoon-deep)]">
							<UserIcon className="size-5" />
						</span>
						<div>
							<p className="island-kicker mb-0.5 text-xs">Portfolio</p>
							<h2
								id="home-portfolio-title"
								className="display-title text-2xl font-bold text-[var(--sea-ink)]"
							>
								{PROFILE.shortName}&apos;s journey
							</h2>
						</div>
					</div>
					<Link
						to="/portfolio"
						className="hidden items-center gap-1.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:underline sm:inline-flex"
					>
						Full portfolio
						<ArrowRightIcon className="size-4" />
					</Link>
				</div>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
					{PORTFOLIO_CARDS.map(({ href, title, description, Icon }, index) => (
						<Link
							key={href}
							to={href}
							className="island-shell feature-card group flex h-full flex-col rounded-2xl p-6 no-underline transition hover:-translate-y-0.5"
							style={{ animationDelay: `${index * 90 + 80}ms` }}
						>
							<span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--lagoon-14)] text-[var(--lagoon-deep)] transition group-hover:bg-[var(--lagoon-24)]">
								<Icon className="size-5" />
							</span>
							<span className="text-base font-semibold text-[var(--sea-ink)]">
								{title}
							</span>
							<span className="mt-1.5 flex-1 text-sm leading-6 text-[var(--sea-ink-soft)]">
								{description}
							</span>
							<span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--lagoon-deep)]">
								Explore
								<ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
							</span>
						</Link>
					))}
				</div>
			</section>

			{/* ============ About footer link ============ */}
			<section className="rise-in">
				<Link
					to="/about"
					className="island-shell feature-card group flex items-center gap-4 rounded-2xl p-6 no-underline transition hover:-translate-y-0.5"
				>
					<span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--lagoon-14)] text-[var(--lagoon-deep)] transition group-hover:bg-[var(--lagoon-24)]">
						<InfoIcon className="size-5" />
					</span>
					<span className="min-w-0 flex-1">
						<span className="block text-base font-semibold text-[var(--sea-ink)]">
							About this workspace
						</span>
						<span className="block text-sm leading-6 text-[var(--sea-ink-soft)]">
							How SIB61 is built and what you can do with it.
						</span>
					</span>
					<ArrowRightIcon className="size-5 flex-shrink-0 text-[var(--lagoon-deep)] transition-transform group-hover:translate-x-1" />
				</Link>
			</section>
		</main>
	);
}
