export const THEME_KEY = "theme-palette";
export const MODE_KEY = "theme";

export type PaletteId = "island" | "sunset" | "forest" | "midnight" | "rose";
export type Mode = "light" | "dark" | "auto";

export const PALETTES: {
	id: PaletteId;
	name: string;
	tagline: string;
	swatch: readonly [string, string];
}[] = [
	{
		id: "island",
		name: "Island",
		tagline: "Sea breeze teal & palm",
		swatch: ["#328f97", "#2f6a4a"],
	},
	{
		id: "sunset",
		name: "Sunset",
		tagline: "Warm coral & ember",
		swatch: ["#ee7f4f", "#b4522f"],
	},
	{
		id: "forest",
		name: "Forest",
		tagline: "Deep woods green",
		swatch: ["#3f7f5b", "#2f6a4a"],
	},
	{
		id: "midnight",
		name: "Midnight",
		tagline: "Indigo & violet",
		swatch: ["#5f6be0", "#4b4f9e"],
	},
	{
		id: "rose",
		name: "Rose",
		tagline: "Blush pink & mauve",
		swatch: ["#d96a8f", "#a4456b"],
	},
];

export const MODES: { id: Mode; name: string }[] = [
	{ id: "light", name: "Light" },
	{ id: "dark", name: "Dark" },
	{ id: "auto", name: "System" },
];

export function isMode(value: string | null): value is Mode {
	return value === "light" || value === "dark" || value === "auto";
}

export function isPaletteId(value: string | null): value is PaletteId {
	return PALETTES.some((p) => p.id === value);
}

/**
 * Applies a palette id + resolved mode to the document root, mirroring the
 * logic in the inline init script so both stay in sync.
 */
export function applyTheme(palette: PaletteId, mode: Mode) {
	if (typeof document === "undefined") return;

	const prefersDark =
		typeof window !== "undefined" &&
		window.matchMedia("(prefers-color-scheme: dark)").matches;
	const resolved = mode === "auto" ? (prefersDark ? "dark" : "light") : mode;

	const root = document.documentElement;
	root.classList.remove("light", "dark");
	root.classList.add(resolved);
	if (palette === "island") {
		root.removeAttribute("data-palette");
	} else {
		root.setAttribute("data-palette", palette);
	}
	if (mode === "auto") {
		root.removeAttribute("data-theme");
	} else {
		root.setAttribute("data-theme", mode);
	}
	root.style.colorScheme = resolved;
}
