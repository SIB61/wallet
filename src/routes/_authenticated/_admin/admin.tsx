import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { UserAvatar } from "@/components/auth/user-avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Role } from "@/generated/prisma/enums";
import { type AdminUserDTO, listUsersFn, setUserRoleFn } from "@/lib/auth";

export const Route = createFileRoute("/_authenticated/_admin/admin")({
	component: AdminDashboard,
	head: () => ({
		meta: [{ title: "Admin · SIB61" }],
	}),
});

function AdminDashboard() {
	const [users, setUsers] = useState<AdminUserDTO[]>([]);
	const [loaded, setLoaded] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [busyId, setBusyId] = useState<string | null>(null);
	const [message, setMessage] = useState<string | null>(null);

	const refresh = useCallback(async () => {
		try {
			const data = await listUsersFn();
			setUsers(data);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load users.");
		} finally {
			setLoaded(true);
		}
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	async function toggleRole(user: AdminUserDTO) {
		const nextRole = user.role === Role.ADMIN ? Role.USER : Role.ADMIN;
		setBusyId(user.id);
		setMessage(null);
		try {
			await setUserRoleFn({
				data: { userId: user.id, role: nextRole },
			});
			setMessage(
				`${user.email} is now ${nextRole === Role.ADMIN ? "an admin" : "a regular user"}. They'll need to sign in again.`,
			);
			await refresh();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update role.");
		} finally {
			setBusyId(null);
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<header>
				<p className="island-kicker mb-1 text-xs">Admin</p>
				<h1 className="display-title text-2xl font-bold text-[var(--sea-ink)]">
					User management
				</h1>
				<p className="m-0 mt-1 text-sm text-[var(--sea-ink-soft)]">
					Grant or revoke admin access. Changing a role signs that user out.
				</p>
			</header>

			{message && (
				<div
					className="rounded-xl border border-[var(--palm)]/40 bg-[var(--palm)]/10 px-4 py-3 text-sm font-medium text-[var(--palm)]"
					aria-live="polite"
				>
					{message}
				</div>
			)}
			{error && (
				<div
					role="alert"
					className="rounded-xl border border-[#c0392b]/30 bg-[#c0392b]/10 px-4 py-3 text-sm font-medium text-[#c0392b]"
				>
					{error}
				</div>
			)}

			<Card className="rounded-2xl">
				<CardHeader>
					<CardTitle className="text-lg">Accounts</CardTitle>
				</CardHeader>
				<CardContent>
					{!loaded ? (
						<p className="m-0 py-4 text-center text-sm text-[var(--sea-ink-soft)]">
							Loading…
						</p>
					) : users.length === 0 ? (
						<p className="m-0 py-4 text-center text-sm text-[var(--sea-ink-soft)]">
							No users yet.
						</p>
					) : (
						<ul className="flex flex-col gap-1">
							{users.map((user) => (
								<li
									key={user.id}
									className="flex flex-wrap items-center gap-3 rounded-xl px-2 py-2.5 transition hover:bg-[var(--lagoon-08)]"
								>
									<UserAvatar
										src={user.avatarUrl}
										name={user.name}
										className="h-9 w-9 rounded-full"
									/>
									<span className="min-w-0 flex-1">
										<span className="block truncate text-sm font-semibold text-[var(--sea-ink)]">
											{user.name ?? "No name"}
										</span>
										<span className="block truncate text-xs text-[var(--sea-ink-soft)]">
											{user.email}
										</span>
									</span>
									<span
										className={
											user.role === Role.ADMIN
												? "rounded-full bg-[var(--lagoon-16)] px-2.5 py-1 text-xs font-bold text-[var(--lagoon-deep)]"
												: "rounded-full bg-[var(--lagoon-08)] px-2.5 py-1 text-xs font-semibold text-[var(--sea-ink-soft)]"
										}
									>
										{user.role === Role.ADMIN ? "Admin" : "User"}
									</span>
									<Button
										variant={user.role === Role.ADMIN ? "outline" : "default"}
										size="sm"
										disabled={busyId === user.id}
										onClick={() => void toggleRole(user)}
									>
										{busyId === user.id
											? "Updating…"
											: user.role === Role.ADMIN
												? "Revoke admin"
												: "Make admin"}
									</Button>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
