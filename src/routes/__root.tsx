import { TanStackDevtools } from "@tanstack/react-devtools";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { GlobalTopbar } from "@/components/topbar";
import { type AuthState, getCurrentUserFn, toAuthState } from "@/lib/auth";

import appCss from "../styles.css?url";

const THEME_INIT_SCRIPT = `(function(){try{var THEMES=['island','sunset','forest','midnight','rose'];var stored=window.localStorage.getItem('theme-palette');var palette=THEMES.indexOf(stored)>-1?stored:'island';var modeStored=window.localStorage.getItem('theme');var mode=(modeStored==='light'||modeStored==='dark'||modeStored==='auto')?modeStored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(palette==='island'){root.removeAttribute('data-palette')}else{root.setAttribute('data-palette',palette)}if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRouteWithContext<{ auth: AuthState }>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "Ledgerly",
			},
			{
				name: "theme-color",
				content: "#4fb8b2",
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes",
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "default",
			},
			{
				name: "apple-mobile-web-app-title",
				content: "Ledgerly",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "manifest",
				href: `/manifest.webmanifest`,
			},
			{
				rel: "apple-touch-icon",
				href: "/pwa/apple-touch-icon.png",
			},
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg",
			},
		],
	}),
	beforeLoad: async () => {
		const user = await getCurrentUserFn();
		return { auth: toAuthState(user) };
	},
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: static theme init script
					dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
				/>
				<HeadContent />
			</head>
			<body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[var(--lagoon-24)]">
				<script
					// biome-ignore lint/security/noDangerouslySetInnerHtml: static SW registration snippet
					dangerouslySetInnerHTML={{
						__html: `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js',{scope:'/'}).catch(function(){})})}`,
					}}
				/>
				<GlobalTopbar />
				{children}
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
