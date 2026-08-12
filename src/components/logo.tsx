import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export function LogoMark(props: SVGProps<SVGSVGElement>) {
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
			<rect x="2.5" y="2.5" width="19" height="19" rx="3" />
			<path d="M7 8.5h10" />
			<path d="M7 12h7" />
			<path d="M7 15.5h4" />
		</svg>
	);
}

export function LedgerlyLogo({
	className,
	iconClassName,
	compact = false,
}: {
	className?: string;
	iconClassName?: string;
	compact?: boolean;
}) {
	return (
		<span className={cn("inline-flex items-center gap-2", className)}>
			<LogoMark
				className={cn(
					"h-6 w-6 text-[var(--lagoon-deep)]",
					iconClassName,
				)}
			/>
			<span
				className={cn(
					"display-title font-bold tracking-tight text-[var(--sea-ink)]",
					compact ? "text-base" : "text-lg",
				)}
			>
				Ledgerly
			</span>
		</span>
	);
}
