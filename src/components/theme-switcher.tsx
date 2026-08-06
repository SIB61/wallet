import { useEffect, useState } from "react";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import {
	applyTheme,
	isMode,
	isPaletteId,
	MODE_KEY,
	MODES,
	PALETTES,
	THEME_KEY,
	type PaletteId,
	type Mode,
} from "@/lib/themes";

function PaletteIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<circle cx="12" cy="12" r="5" />
			<circle cx="12" cy="12" r="0.5" fill="currentColor" />
		</svg>
	);
}

function ModeIcon({ mode }: { mode: Mode }) {
	if (mode === "dark") {
		return (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
				className="size-4"
			>
				<path d="M20 12a8 8 0 1 1-8-8 6 6 0 0 0 8 8Z" />
			</svg>
		);
	}
	if (mode === "light") {
		return (
			<svg
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				strokeWidth="1.8"
				strokeLinecap="round"
				strokeLinejoin="round"
				aria-hidden="true"
				className="size-4"
			>
				<circle cx="12" cy="12" r="4" />
				<path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
			</svg>
		);
	}
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			className="size-4"
		>
			<circle cx="12" cy="12" r="4" />
			<path d="M12 9a3 3 0 0 0 0 6V2" />
			<path d="M2 12a10 10 0 0 1 20 0H2Z" />
		</svg>
	);
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			className="size-4"
			{...props}
		>
			<path d="M20 6 9 17l-5-5" />
		</svg>
	);
}

export function ThemeSwitcher({ className }: { className?: string }) {
	const [palette, setPalette] = useState<PaletteId>("island");
	const [mode, setMode] = useState<Mode>("auto");

	useEffect(() => {
		const storedTheme = window.localStorage.getItem(THEME_KEY);
		const storedMode = window.localStorage.getItem(MODE_KEY);
		setPalette(isPaletteId(storedTheme) ? storedTheme : "island");
		setMode(isMode(storedMode) ? (storedMode as Mode) : "auto");
	}, []);

	function choosePalette(next: PaletteId) {
		setPalette(next);
		window.localStorage.setItem(THEME_KEY, next);
		applyTheme(next, mode);
	}

	function chooseMode(next: Mode) {
		setMode(next);
		window.localStorage.setItem(MODE_KEY, next);
		applyTheme(palette, next);
	}

	const currentPalette =
		PALETTES.find((p) => p.id === palette) ?? PALETTES[0];

	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className={cn(
					"inline-flex items-center gap-2 rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] px-3.5 py-2 text-sm font-semibold text-[var(--sea-ink-soft)] outline-none transition hover:border-[var(--lagoon-deep)] hover:text-[var(--sea-ink)] focus-visible:ring-[3px] focus-visible:ring-[var(--lagoon-50)]",
					className,
				)}
			>
				<PaletteIcon className="size-4 text-[var(--lagoon-deep)]" />
				<span className="hidden sm:inline">{currentPalette.name}</span>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align="start"
				sideOffset={6}
				className="max-w-[calc(100vw-1rem)]"
			>
				<DropdownMenuLabel>Theme</DropdownMenuLabel>
				{PALETTES.map((p) => {
					const active = p.id === palette;
					return (
						<DropdownMenuItem
							key={p.id}
							onSelect={() => choosePalette(p.id)}
						>
							<span className="flex size-4 items-center justify-center">
								<span
									className={cn(
										"flex h-3.5 w-3.5 rounded-full border border-[var(--line)]",
										active &&
											"ring-2 ring-[var(--lagoon-deep)] ring-offset-2 ring-offset-[var(--menu-solid)]",
									)}
									style={{
										background: `linear-gradient(135deg, ${p.swatch[0]}, ${p.swatch[1]})`,
									}}
								/>
							</span>
							<span className="flex flex-col leading-tight">
								<span className="text-[var(--sea-ink)]">{p.name}</span>
								<span className="text-xs font-medium text-[var(--sea-ink-soft)] opacity-80">
									{p.tagline}
								</span>
							</span>
							{active && (
								<span className="ml-auto text-[var(--lagoon-deep)]">
									<CheckIcon />
								</span>
							)}
						</DropdownMenuItem>
					);
				})}
				<DropdownMenuSeparator />
				<DropdownMenuLabel>Mode</DropdownMenuLabel>
				{MODES.map((m) => {
					const active = m.id === mode;
					return (
						<DropdownMenuItem key={m.id} onSelect={() => chooseMode(m.id)}>
							<ModeIcon mode={m.id} />
							{m.name}
							{active && (
								<span className="ml-auto text-[var(--lagoon-deep)]">
									<CheckIcon />
								</span>
							)}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}