import { useEffect, useState } from "react";
import { LockIcon, FingerprintIcon } from "lucide-react";
import { getAppLockPin, unlockWithBiometric, isAppLockEnabled } from "@/lib/app-lock";

export function AppLockScreen({ children }: { children: React.ReactNode }) {
	const [locked, setLocked] = useState(false);
	const [pinInput, setPinInput] = useState("");
	const [error, setError] = useState(false);

	useEffect(() => {
		// Only enable if installed as PWA and app lock is enabled
		const isPWA = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone;
		if (isPWA && isAppLockEnabled()) {
			setLocked(true);
			// Automatically prompt biometric when it mounts
			attemptBiometricUnlock();
		}
	}, []);

	async function attemptBiometricUnlock() {
		const success = await unlockWithBiometric();
		if (success) {
			setLocked(false);
		} else {
			// failed or cancelled, let them use PIN
			setError(true);
			setTimeout(() => setError(false), 2000);
		}
	}

	function handlePinSubmit(e: React.FormEvent) {
		e.preventDefault();
		const savedPin = getAppLockPin();
		if (savedPin && pinInput === savedPin) {
			setLocked(false);
		} else {
			setError(true);
			setPinInput("");
			setTimeout(() => setError(false), 2000);
		}
	}

	if (!locked) {
		return <>{children}</>;
	}

	return (
		<div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[var(--bg-base)] p-4 backdrop-blur-md">
			<div className="flex max-w-sm flex-col items-center w-full gap-6 rounded-3xl border border-[var(--line)] bg-[var(--surface-strong)] p-8 shadow-2xl">
				<div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--lagoon-14)] text-[var(--lagoon-deep)]">
					<LockIcon className="h-8 w-8" />
				</div>
				
				<div className="text-center">
					<h1 className="text-2xl font-bold text-[var(--sea-ink)]">App Locked</h1>
					<p className="mt-2 text-sm text-[var(--sea-ink-soft)]">
						Use your fingerprint/FaceID or PIN to unlock
					</p>
				</div>

				<form onSubmit={handlePinSubmit} className="w-full">
					<input
						type="password"
						value={pinInput}
						onChange={(e) => setPinInput(e.target.value)}
						placeholder="Enter PIN"
						className={`w-full rounded-xl border p-4 text-center text-xl font-bold tracking-[0.5em] transition ${
							error ? "border-red-500 bg-red-500/10 text-red-500" : "border-[var(--line)] bg-[var(--bg-base)] text-[var(--sea-ink)] focus:border-[var(--lagoon-deep)] focus:ring-1 focus:ring-[var(--lagoon-deep)]"
						}`}
						autoFocus
					/>
					<button
						type="submit"
						className="mt-4 w-full rounded-xl bg-[var(--sea-ink)] p-4 font-bold text-white transition hover:bg-[var(--sea-ink-soft)]"
					>
						Unlock
					</button>
				</form>

				<button
					type="button"
					onClick={attemptBiometricUnlock}
					className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--line)] p-4 font-bold text-[var(--sea-ink)] transition hover:bg-[var(--lagoon-12)]"
				>
					<FingerprintIcon className="h-5 w-5" />
					Use Biometrics
				</button>
			</div>
		</div>
	);
}
