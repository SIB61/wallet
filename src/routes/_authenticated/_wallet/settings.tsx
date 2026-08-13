import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { 
	APP_LOCK_ENABLED_KEY, 
	APP_LOCK_PIN_KEY, 
	setupBiometricLock,
	isAppLockEnabled
} from "@/lib/app-lock";
import { logoutFn } from "@/lib/auth";
import { UserAvatar } from "@/components/auth/user-avatar";

export const Route = createFileRoute("/_authenticated/_wallet/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	const { auth } = Route.useRouteContext();
	const router = useRouter();
	const [lockEnabled, setLockEnabled] = useState(false);
	const [pin, setPin] = useState("");
	const [statusMsg, setStatusMsg] = useState("");
	const [loggingOut, setLoggingOut] = useState(false);

	useEffect(() => {
		setLockEnabled(isAppLockEnabled());
	}, []);

	async function handleLogout() {
		setLoggingOut(true);
		try {
			await logoutFn();
			await router.invalidate();
			router.navigate({ to: "/" });
		} catch {
			setLoggingOut(false);
		}
	}

	async function handleEnableLock() {
		if (pin.length < 4) {
			setStatusMsg("PIN must be at least 4 characters.");
			return;
		}
		
		setStatusMsg("Setting up biometrics... Please authenticate.");
		const success = await setupBiometricLock(auth.user?.id || "user", auth.user?.name || "User");
		
		if (success) {
			window.localStorage.setItem(APP_LOCK_ENABLED_KEY, "true");
			window.localStorage.setItem(APP_LOCK_PIN_KEY, pin);
			setLockEnabled(true);
			setStatusMsg("App lock enabled successfully!");
		} else {
			setStatusMsg("Biometric setup failed or was cancelled.");
		}
	}

	function handleDisableLock() {
		window.localStorage.removeItem(APP_LOCK_ENABLED_KEY);
		window.localStorage.removeItem(APP_LOCK_PIN_KEY);
		window.localStorage.removeItem("app-lock-credential-id");
		setLockEnabled(false);
		setPin("");
		setStatusMsg("App lock disabled.");
	}

	return (
		<div className="flex flex-col gap-6">
			<div>
				<h1 className="text-2xl font-bold text-[var(--sea-ink)]">Settings</h1>
				<p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
					Manage your app settings and security.
				</p>
			</div>

			<div className="rounded-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-6 shadow-sm">
				<h2 className="text-lg font-bold text-[var(--sea-ink)]">App Lock</h2>
				<p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
					Require fingerprint, FaceID, or PIN when opening the app. This feature works best when installed as a PWA.
				</p>
				
				<div className="mt-6 flex max-w-sm flex-col gap-4">
					{!lockEnabled ? (
						<>
							<div className="flex flex-col gap-1.5">
								<label htmlFor="pin" className="text-sm font-semibold text-[var(--sea-ink)]">
									Set a Backup PIN
								</label>
								<input
									id="pin"
									type="password"
									value={pin}
									onChange={(e) => setPin(e.target.value)}
									placeholder="e.g. 1234"
									className="rounded-xl border border-[var(--line)] bg-[var(--bg-base)] px-4 py-2.5 text-sm transition focus:border-[var(--lagoon-deep)] focus:ring-1 focus:ring-[var(--lagoon-deep)] outline-none"
								/>
							</div>
							<button
								type="button"
								onClick={handleEnableLock}
								className="rounded-xl bg-[var(--sea-ink)] px-4 py-2.5 font-bold text-white transition hover:bg-[var(--sea-ink-soft)]"
							>
								Enable App Lock
							</button>
						</>
					) : (
						<button
							type="button"
							onClick={handleDisableLock}
							className="rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-2.5 font-bold transition hover:bg-red-500/20"
						>
							Disable App Lock
						</button>
					)}
					{statusMsg && (
						<p className="text-sm font-semibold text-[var(--lagoon-deep)]">{statusMsg}</p>
					)}
				</div>
			</div>

			<div className="rounded-2xl border border-red-500/20 bg-[var(--surface-strong)] p-6 shadow-sm">
				<h2 className="text-lg font-bold text-[var(--sea-ink)]">Account</h2>
				<p className="mt-1 text-sm text-[var(--sea-ink-soft)]">
					Sign out of your account on this device.
				</p>
				{auth.user && (
					<div className="mt-4 flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg-base)] px-4 py-3">
						<UserAvatar
							src={auth.user.avatarUrl}
							name={auth.user.name}
							className="h-10 w-10"
						/>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-semibold text-[var(--sea-ink)]">
								{auth.user.name ?? "Signed in"}
							</p>
							<p className="truncate text-xs text-[var(--sea-ink-soft)]">
								{auth.user.email}
							</p>
						</div>
						<span className="rounded-md bg-[var(--lagoon-14)] px-2 py-0.5 text-xs font-semibold text-[var(--lagoon-deep)]">
							{auth.user.role === "ADMIN" ? "Admin" : "User"}
						</span>
					</div>
				)}
				<div className="mt-4">
					<button
						type="button"
						onClick={() => void handleLogout()}
						disabled={loggingOut}
						className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-500 transition hover:bg-red-500/20 disabled:pointer-events-none disabled:opacity-50"
					>
						{loggingOut ? "Signing out…" : "Sign out"}
					</button>
				</div>
			</div>
		</div>
	);
}
