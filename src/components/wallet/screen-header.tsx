import type { ReactNode } from "react";

export function ScreenHeader({
	kicker,
	title,
	subtitle,
	action,
}: {
	kicker?: string;
	title: string;
	subtitle?: string;
	action?: ReactNode;
}) {
	return (
		<header className="flex flex-wrap items-start justify-between gap-3">
			<div className="min-w-0">
				{kicker && (
					<p className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--kicker)]">
						{kicker}
					</p>
				)}
				<h1 className="text-2xl font-extrabold tracking-tight text-[var(--sea-ink)]">
					{title}
				</h1>
				{subtitle && (
					<p className="m-0 mt-1.5 text-sm leading-6 text-[var(--sea-ink-soft)]">
						{subtitle}
					</p>
				)}
			</div>
			{action && (
				<div className="flex flex-shrink-0 items-center gap-2">{action}</div>
			)}
		</header>
	);
}
