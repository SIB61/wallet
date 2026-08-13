import {
	startAuthentication,
	startRegistration,
} from "@simplewebauthn/browser";

export const APP_LOCK_ENABLED_KEY = "app-lock-enabled";
export const APP_LOCK_PIN_KEY = "app-lock-pin";
export const APP_LOCK_CREDENTIAL_KEY = "app-lock-credential-id";
export const APP_LOCK_CREDENTIAL_RAW_KEY = "app-lock-credential-raw";

// A random string generator for challenge
function generateChallenge() {
	return window.crypto.randomUUID();
}

export function isAppLockEnabled() {
	if (typeof window === "undefined") return false;
	return window.localStorage.getItem(APP_LOCK_ENABLED_KEY) === "true";
}

export function getAppLockPin() {
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(APP_LOCK_PIN_KEY);
}

export async function setupBiometricLock(userId: string, userName: string) {
	try {
		const challenge = generateChallenge();
		// We manually construct the options since we don't have a backend
		const registration = await startRegistration({
			challenge,
			rp: {
				name: "Ledgerly App Lock",
				id: window.location.hostname,
			},
			user: {
				id: userId || "user-id",
				name: userName || "user",
				displayName: userName || "User",
			},
			pubKeyCredParams: [
				{ alg: -7, type: "public-key" }, // ES256
				{ alg: -257, type: "public-key" }, // RS256
			],
			authenticatorSelection: {
				userVerification: "required", // Force biometrics/PIN
				residentKey: "preferred",
			},
			timeout: 60000,
			attestation: "none",
		});

		window.localStorage.setItem(APP_LOCK_CREDENTIAL_KEY, registration.id);
		return true;
	} catch (error) {
		console.error("Biometric setup failed:", error);
		return false;
	}
}

export async function unlockWithBiometric() {
	try {
		const credentialId = window.localStorage.getItem(APP_LOCK_CREDENTIAL_KEY);
		if (!credentialId) return false;

		const challenge = generateChallenge();
		const authentication = await startAuthentication({
			challenge,
			rpId: window.location.hostname,
			userVerification: "required",
			timeout: 60000,
			allowCredentials: [
				{
					id: credentialId,
					type: "public-key",
					transports: ["internal"],
				},
			],
		});

		// For a fully local app lock, if startAuthentication succeeds and returns a valid
		// assertion for our requested credentialId, we consider it unlocked.
		if (authentication.id === credentialId) {
			return true;
		}
		return false;
	} catch (error) {
		console.error("Biometric unlock failed:", error);
		return false;
	}
}
