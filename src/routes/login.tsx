import { createFileRoute, Link, redirect } from "@tanstack/react-router";

function sanitizeRedirect(value: unknown): string {
	if (
		typeof value !== "string" ||
		!value.startsWith("/") ||
		value.startsWith("//")
	) {
		return "/";
	}
	return value;
}

export const Route = createFileRoute("/login")({
	validateSearch: (search: Record<string, unknown>) => ({
		redirect:
			typeof search.redirect === "string"
				? sanitizeRedirect(search.redirect)
				: undefined,
		error: typeof search.error === "string" ? search.error : undefined,
	}),
	beforeLoad: ({ context, search }) => {
		if (context.auth.isAuthenticated) {
			throw redirect({ to: search.redirect ?? "/" });
		}
	},
	component: Login,
	head: () => ({
		meta: [{ title: "Sign in · SIB61" }],
	}),
});

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true" className="size-5" {...props}>
			<path
				fill="#4285F4"
				d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
			/>
			<path
				fill="#34A853"
				d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
			/>
			<path
				fill="#FBBC05"
				d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
			/>
			<path
				fill="#EA4335"
				d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
			/>
		</svg>
	);
}

function Login() {
	const search = Route.useSearch();

	return (
		<main className="page-wrap flex min-h-[70vh] items-center justify-center px-4 py-16">
			<section className="island-shell w-full max-w-md rounded-3xl p-8 sm:p-10">
				<div className="mb-8 text-center">
					<span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--lagoon-deep)] text-2xl font-extrabold text-[var(--sand)]">
						SIB61
					</span>
					<p className="island-kicker mb-2 text-xs">Private workspace</p>
					<h1 className="display-title text-2xl font-bold text-[var(--sea-ink)]">
						Sign in to continue
					</h1>
					<p className="m-0 mt-2 text-sm leading-6 text-[var(--sea-ink-soft)]">
						Access your wallet and admin tools with your Google account.
					</p>
				</div>

				{search.error && (
					<div
						role="alert"
						className="mb-5 rounded-xl border border-[#c0392b]/30 bg-[#c0392b]/10 px-4 py-3 text-sm font-medium text-[#c0392b]"
					>
						{search.error}
					</div>
				)}

				<a
					href={`/api/auth/google/start?redirect=${encodeURIComponent(search.redirect ?? "/")}`}
					className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] px-5 py-3.5 text-sm font-semibold text-[var(--sea-ink)] shadow-[0_10px_20px_var(--shadow-ink-8)] transition hover:-translate-y-0.5 hover:border-[var(--lagoon-deep)]"
				>
					<GoogleIcon />
					Sign in with Google
				</a>

				<p className="m-0 mt-6 text-center text-xs leading-5 text-[var(--sea-ink-soft)]">
					Only authorized accounts can access protected areas. Need access?{" "}
					<Link
						to="/about"
						className="font-semibold text-[var(--lagoon-deep)] no-underline hover:underline"
					>
						Contact the owner
					</Link>
					.
				</p>
			</section>
		</main>
	);
}
