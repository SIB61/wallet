import type * as React from "react";

import { cn } from "@/lib/utils";

function Select({
	className,
	children,
	...props
}: React.ComponentProps<"select">) {
	return (
		<select
			data-slot="select"
			className={cn(
				"h-9 w-full min-w-0 appearance-none rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:bg-input/30",
				"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
				"bg-[linear-gradient(45deg,transparent_50%,var(--sea-ink-soft)_50%),linear-gradient(135deg,var(--sea-ink-soft)_50%,transparent_50%)] bg-[position:calc(100%-16px)_50%,calc(100%-11px)_50%] bg-[size:5px_5px] bg-no-repeat pr-8",
				className,
			)}
			{...props}
		>
			{children}
		</select>
	);
}

export { Select };