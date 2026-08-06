import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/unauthorized")({
	component: Unauthorized,
	head: () => ({
		meta: [{ title: "Access denied · SIB61" }],
	}),
});

function Unauthorized() {
	return (
		<main className="page-wrap flex min-h-[60vh] items-center justify-center px-4 py-16">
			<section className="island-shell w-full max-w-md rounded-3xl p-8 text-center sm:p-10">
				<span className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#c0392b]/12 text-2xl text-[#c0392b]">
					🔒
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
						className="rounded-2xl bg-[var(--lagoon-deep)] px-5 py-3 text-sm font-semibold text-[var(--sand)] no-underline transition hover:opacity-90"
					>
						Back to home
					</Link>
				</div>
			</section>
		</main>
	);
}
