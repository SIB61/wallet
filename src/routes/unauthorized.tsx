import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/unauthorized")({
	component: Unauthorized,
	head: () => ({
		meta: [{ title: "Access denied · Ledgerly" }],
	}),
});

function Unauthorized() {
	return (
		<main className="page-wrap flex min-h-[60vh] items-center justify-center px-4 py-16">
			<section className="island-shell w-full max-w-md rounded-xl p-8 text-center sm:p-10">
				<span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl border border-[#c0392b]/25 bg-[#c0392b]/10 text-[#c0392b]">
					<LockIcon className="h-6 w-6" />
				</span>
				<p className="island-kicker mb-2 text-xs">403 · Forbidden</p>
				<h1 className="display-title text-2xl font-bold text-[var(--sea-ink)]">
					You don&apos;t have access
				</h1>
				<p className="m-0 mt-3 text-sm leading-6 text-[var(--sea-ink-soft)]">
					This area requires an admin account. If you believe this is a mistake,
					contact the site owner to request access.
				</p>
				<div className="mt-7 flex flex-col gap-3">
					<Link
						to="/"
						className="rounded-xl bg-[var(--lagoon-deep)] px-5 py-3 text-sm font-semibold text-[var(--sand)] no-underline transition hover:opacity-90"
					>
						Back to home
					</Link>
				</div>
			</section>
		</main>
	);
}

function LockIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<rect x="3" y="11" width="18" height="11" rx="2" />
			<path d="M7 11V7a5 5 0 0 1 10 0v4" />
		</svg>
	);
}
