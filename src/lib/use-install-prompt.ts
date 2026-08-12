import { useCallback, useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
	prompt: () => Promise<void>;
	userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
}

function isStandalone() {
	if (window.matchMedia("(display-mode: standalone)").matches) return true;
	return Boolean(
		navigator.userAgent.includes("Mac OS X") &&
			"standalone" in navigator &&
			navigator.standalone,
	);
}

export function useInstallPrompt() {
	const [deferredPrompt, setDeferredPrompt] =
		useState<BeforeInstallPromptEvent | null>(null);
	const [installed, setInstalled] = useState(false);
	const [popupDismissed, setPopupDismissed] = useState(false);

	useEffect(() => {
		if (isStandalone()) return;

		function onBeforeInstallPrompt(event: Event) {
			event.preventDefault();
			setDeferredPrompt(event as BeforeInstallPromptEvent);
		}

		function onAppInstalled() {
			setDeferredPrompt(null);
			setInstalled(true);
		}

		window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
		window.addEventListener("appinstalled", onAppInstalled);

		return () => {
			window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
			window.removeEventListener("appinstalled", onAppInstalled);
		};
	}, []);

	const install = useCallback(async () => {
		const prompt = deferredPrompt;
		if (!prompt) return;
		await prompt.prompt();
		const choice = await prompt.userChoice;
		if (choice.outcome === "accepted") {
			setDeferredPrompt(null);
			setInstalled(true);
		}
	}, [deferredPrompt]);

	const dismissPopup = useCallback(() => setPopupDismissed(true), []);

	const canInstall = Boolean(deferredPrompt) && !installed;
	const showPopup = canInstall && !popupDismissed;

	return { canInstall, showPopup, install, dismissPopup };
}
