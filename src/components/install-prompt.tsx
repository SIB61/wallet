import { Button } from "@/components/ui/button";

function DownloadIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="M12 3v12" />
			<path d="m7 10 5 5 5-5" />
			<path d="M5 21h14" />
		</svg>
	);
}

function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2.4"
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

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="M18 6 6 18" />
			<path d="m6 6 12 12" />
		</svg>
	);
}

export function InstallPromptButton({
	showPopup,
	install,
	dismissPopup,
}: {
	showPopup: boolean;
	install: () => void;
	dismissPopup: () => void;
}) {
	return (
		<div className="relative">
			<Button
				type="button"
				variant="outline"
				className="install-pulse rounded-lg border border-[var(--lagoon-deep)] bg-[var(--surface-strong)] text-sm font-semibold text-[var(--sea-ink)] transition hover:border-[var(--lagoon-deep)] hover:text-[var(--lagoon-deep)]"
				onClick={install}
			>
				<DownloadIcon className="size-4 text-[var(--lagoon-deep)]" />
				<span className="hidden sm:inline">Install app</span>
				<span className="sm:hidden">Install</span>
			</Button>

			{showPopup && (
				<div
					className="pop-in absolute right-0 top-[calc(100%+10px)] z-50 w-72"
					aria-live="polite"
				>
					<ArrowUpIcon className="pointer-nudge absolute -top-5 right-7 size-5 text-[var(--lagoon-deep)] drop-shadow" />
					<div className="install-popup-card relative rounded-2xl border border-[var(--line)] bg-[var(--menu-solid)] p-4 shadow-[0_18px_34px_var(--shadow-ink-16),0_4px_14px_var(--shadow-soft-08)]">
						<div className="flex items-start gap-3">
							<span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--lagoon-16)] text-[var(--lagoon-deep)]">
								<DownloadIcon className="size-4" />
							</span>
							<div className="min-w-0">
								<p className="text-sm font-bold text-[var(--sea-ink)]">
									Install Ledgerly
								</p>
								<p className="mt-0.5 text-[13px] leading-snug text-[var(--sea-ink-soft)]">
									Tap the{" "}
									<span className="font-semibold text-[var(--lagoon-deep)]">
										Install app
									</span>{" "}
									button above to add it to your device and get a faster,
									home-screen experience.
								</p>
							</div>
							<button
								type="button"
								onClick={dismissPopup}
								aria-label="Dismiss install prompt"
								className="ml-1 flex size-6 shrink-0 items-center justify-center rounded-md text-[var(--sea-ink-soft)] transition hover:bg-[var(--lagoon-10)] hover:text-[var(--sea-ink)]"
							>
								<CloseIcon className="size-3.5" />
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
