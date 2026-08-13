import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";

import { ScreenHeader } from "@/components/wallet/screen-header";
import { AccountsSkeleton } from "@/components/wallet/skeletons";
import { useAccounts } from "@/components/wallet/use-wallet-data";
import {
	ACCOUNT_TYPE_COLORS,
	formatMoney,
	loanStatus,
} from "@/components/wallet/wallet-utils";
import type { AccountType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import {
	ACCOUNT_TYPE_LABELS,
	ACCOUNT_TYPES,
	type AccountDTO,
	adjustBalanceFn,
	deleteAccountFn,
	updateAccountFn,
} from "@/lib/wallet";

export const Route = createFileRoute("/_authenticated/_wallet/accounts/")({
	component: AccountsPage,
});

const TYPE_OPTIONS = ACCOUNT_TYPES.map((type) => ({
	value: type,
	label: ACCOUNT_TYPE_LABELS[type as AccountType],
}));

const ACCOUNT_TYPE_ICONS: Record<AccountType, React.JSX.Element> = {
	BANK: <BankIcon className="h-4 w-4" />,
	MFS: <MfsIcon className="h-4 w-4" />,
	CASH: <CashIcon className="h-4 w-4" />,
	CARD: <CardIcon className="h-4 w-4" />,
	WALLET: <WalletIcon className="h-4 w-4" />,
	PERSON: <PersonIcon className="h-4 w-4" />,
	OTHER: <OtherIcon className="h-4 w-4" />,
};

function MoreVerticalIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
			<circle cx="12" cy="5" r="1.6" />
			<circle cx="12" cy="12" r="1.6" />
			<circle cx="12" cy="19" r="1.6" />
		</svg>
	);
}

function AccountsPage() {
	const { accounts, loaded, refresh } = useAccounts();

	const [filterType, setFilterType] = useState("");

	const [editingId, setEditingId] = useState<string | null>(null);
	const [adjustingId, setAdjustingId] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const filteredAccounts =
		filterType === ""
			? accounts
			: accounts.filter((account) => account.type === filterType);

	async function handleSaveEdit(
		account: AccountDTO,
		nextName: string,
		nextType: AccountType,
		nextAccountNumber: string | null,
	) {
		await updateAccountFn({
			data: {
				id: account.id,
				name: nextName,
				type: nextType,
				accountNumber: nextAccountNumber,
			},
		});
		await refresh();
	}

	async function handleAdjust(account: AccountDTO, nextBalance: number) {
		await adjustBalanceFn({ data: { id: account.id, balance: nextBalance } });
		await refresh();
	}

	async function handleDelete(account: AccountDTO) {
		if (
			!confirm(
				`Delete account "${account.name}"? Its transactions will be kept but unlinked.`,
			)
		) {
			return;
		}
		setDeletingId(account.id);
		try {
			await deleteAccountFn({ data: { id: account.id } });
			await refresh();
			if (account.id === editingId) setEditingId(null);
			if (account.id === adjustingId) setAdjustingId(null);
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<div className="flex flex-col gap-5">
			<ScreenHeader
				title="Accounts"
				subtitle="Your bank, wallets and people you owe"
			/>

			<Card>
				<CardHeader>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<CardTitle className="text-base">All accounts</CardTitle>
						<Select
							value={filterType}
							onChange={(e) => setFilterType(e.target.value)}
							className="sm:w-56"
							aria-label="Filter by type"
						>
							<option value="">All types</option>
							{TYPE_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</Select>
					</div>
				</CardHeader>
				<CardContent>
					{!loaded ? (
						<AccountsSkeleton />
					) : filteredAccounts.length === 0 ? (
						<p className="m-0 py-8 text-center text-sm text-[var(--sea-ink-soft)]">
							{accounts.length === 0
								? "No accounts yet. Tap the + button to add one."
								: "No accounts match this type."}
						</p>
					) : (
						<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
							{filteredAccounts.map((account) => (
								<AccountCard
									key={account.id}
									account={account}
									editing={editingId === account.id}
									adjusting={adjustingId === account.id}
									deleting={deletingId === account.id}
									onEdit={() => {
										setEditingId(editingId === account.id ? null : account.id);
										setAdjustingId(null);
									}}
									onAdjust={() => {
										setAdjustingId(
											adjustingId === account.id ? null : account.id,
										);
										setEditingId(null);
									}}
									onSaveEdit={handleSaveEdit}
									onAdjustSave={handleAdjust}
									onDelete={() => handleDelete(account)}
								/>
							))}
						</div>
					)}
				</CardContent>
			</Card>

		</div>
	);
}

function AccountCard({
	account,
	editing,
	adjusting,
	deleting,
	onEdit,
	onAdjust,
	onSaveEdit,
	onAdjustSave,
	onDelete,
}: {
	account: AccountDTO;
	editing: boolean;
	adjusting: boolean;
	deleting: boolean;
	onEdit: () => void;
	onAdjust: () => void;
	onSaveEdit: (
		account: AccountDTO,
		name: string,
		type: AccountType,
		accountNumber: string | null,
	) => Promise<void>;
	onAdjustSave: (account: AccountDTO, balance: number) => Promise<void>;
	onDelete: () => void;
}) {
	const [editName, setEditName] = useState(account.name);
	const [editType, setEditType] = useState<AccountType>(account.type);
	const [editAccountNumber, setEditAccountNumber] = useState(
		account.accountNumber ?? "",
	);
	const [editBalance, setEditBalance] = useState(String(account.balance));
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [menuOpen, setMenuOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	const navigate = useNavigate();

	function handleCardClick(event: React.MouseEvent) {
		if (editing || adjusting) return;
		if (menuRef.current?.contains(event.target as Node)) {
			return;
		}
		navigate({
			to: "/accounts/$accountId",
			params: { accountId: account.id },
		});
	}

	useEffect(() => {
		if (!menuOpen) return;
		function onPointerDown(event: PointerEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		}
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") setMenuOpen(false);
		}
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [menuOpen]);

	function choose(action: () => void) {
		setMenuOpen(false);
		action();
	}

	async function submitEdit() {
		setError(null);
		if (!editName.trim()) {
			setError("Name is required.");
			return;
		}
		setSaving(true);
		try {
			await onSaveEdit(
				account,
				editName.trim(),
				editType,
				editAccountNumber.trim() || null,
			);
			onEdit();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save.");
		} finally {
			setSaving(false);
		}
	}

	async function submitAdjust() {
		setError(null);
		const value = Number(editBalance);
		if (!Number.isFinite(value)) {
			setError("Enter a valid number.");
			return;
		}
		setSaving(true);
		try {
			await onAdjustSave(account, value);
			onAdjust();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to save.");
		} finally {
			setSaving(false);
		}
	}

	return (
		<Card
			onClick={handleCardClick}
			className={cn(
				"transition hover:shadow-[0_2px_8px_var(--shadow-soft-08)]",
				editing || adjusting ? "" : "cursor-pointer",
			)}
		>
			<CardHeader className="pb-0">
				<div className="flex min-w-0 items-start gap-3">
					<span
						className={cn(
							"flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl",
							ACCOUNT_TYPE_COLORS[account.type],
						)}
					>
						{ACCOUNT_TYPE_ICONS[account.type]}
					</span>
					<div className="flex min-w-0 flex-col gap-1">
						<CardTitle className="truncate text-base">{account.name}</CardTitle>
						<span className="text-xs font-semibold text-[var(--sea-ink-soft)]">
							{ACCOUNT_TYPE_LABELS[account.type]}
						</span>
						{account.accountNumber && (
							<span className="truncate text-xs font-mono text-[var(--sea-ink-soft)]">
								{account.accountNumber}
							</span>
						)}
					</div>
				</div>
				<CardAction>
					<div ref={menuRef} className="relative">
						<button
							type="button"
							onClick={() => setMenuOpen((open) => !open)}
							aria-haspopup="menu"
							aria-expanded={menuOpen}
							aria-label={`Actions for ${account.name}`}
							className="rounded-lg p-1.5 text-[var(--sea-ink-soft)] transition hover:bg-[var(--lagoon-14)] hover:text-[var(--sea-ink)]"
						>
							<MoreVerticalIcon className="h-4 w-4" />
						</button>

						{menuOpen && (
							<div
								role="menu"
								className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--menu-solid)] p-1.5 text-[var(--sea-ink)]"
							>
								<Link
									to="/accounts/$accountId"
									params={{ accountId: account.id }}
									onClick={() => setMenuOpen(false)}
									className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[var(--sea-ink-soft)] no-underline transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
								>
									View details
								</Link>
								<button
									type="button"
									role="menuitem"
									onClick={() => choose(onEdit)}
									className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
								>
									Edit details
								</button>
								<button
									type="button"
									role="menuitem"
									onClick={() => choose(onAdjust)}
									className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
								>
									Adjust balance
								</button>
								<div className="my-1 h-px bg-[var(--line)]" />
								<button
									type="button"
									role="menuitem"
									onClick={() => choose(onDelete)}
									disabled={deleting}
									className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[#c0392b] transition hover:bg-[var(--link-bg-hover)] disabled:pointer-events-none disabled:opacity-50"
								>
									{deleting ? "Deleting…" : "Delete account"}
								</button>
							</div>
						)}
					</div>
				</CardAction>
			</CardHeader>

			<CardContent>
				{editing ? (
					<div className="flex flex-col gap-2">
						<Input
							value={editName}
							onChange={(e) => setEditName(e.target.value)}
							aria-label="Account name"
						/>
						<Select
							value={editType}
							onChange={(e) => setEditType(e.target.value as AccountType)}
							aria-label="Account type"
						>
							{TYPE_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</Select>
						<Input
							value={editAccountNumber}
							onChange={(e) => setEditAccountNumber(e.target.value)}
							placeholder="Account number (optional)"
							aria-label="Account number"
						/>
						<div className="flex items-center gap-2">
							<Button size="sm" onClick={submitEdit} disabled={saving}>
								{saving ? "Saving…" : "Save"}
							</Button>
							<Button size="sm" variant="ghost" onClick={onEdit}>
								Cancel
							</Button>
						</div>
					</div>
				) : adjusting ? (
					<div className="flex flex-col gap-2">
						<Input
							type="number"
							inputMode="decimal"
							step="0.01"
							value={editBalance}
							onChange={(e) => setEditBalance(e.target.value)}
							aria-label="New balance"
							placeholder="New balance"
						/>
						<div className="flex items-center gap-2">
							<Button size="sm" onClick={submitAdjust} disabled={saving}>
								{saving ? "Saving…" : "Set balance"}
							</Button>
							<Button size="sm" variant="ghost" onClick={onAdjust}>
								Cancel
							</Button>
						</div>
					</div>
				) : (
					<div>
						<p className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--sea-ink)]">
							{formatMoney(account.balance)}
						</p>
						{account.type === "PERSON" && (
							<p className="mt-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
								{loanStatus(account.balance)}
							</p>
						)}
					</div>
				)}
				{error && (
					<p className="mt-2 text-xs font-medium text-[#c0392b]">{error}</p>
				)}
			</CardContent>
		</Card>
	);
}

function BankIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="M3 21h18" />
			<path d="M5 21V10" />
			<path d="M9 21V10" />
			<path d="M15 21V10" />
			<path d="M19 21V10" />
			<path d="m3 10 9-6 9 6" />
			<path d="M12 4v1" />
		</svg>
	);
}

function MfsIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<rect x="7" y="2.5" width="10" height="19" rx="2.5" />
			<path d="M11 18.5h2" />
		</svg>
	);
}

function CashIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<rect x="2" y="6" width="20" height="12" rx="2" />
			<circle cx="12" cy="12" r="2.5" />
			<path d="M6 12h.01" />
			<path d="M18 12h.01" />
		</svg>
	);
}

function CardIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<rect x="2" y="5" width="20" height="14" rx="2.5" />
			<path d="M2 10h20" />
			<path d="M6 15h4" />
		</svg>
	);
}

function WalletIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="M20 7H6a3 3 0 0 1 0-6h11v4" />
			<rect x="2" y="7" width="20" height="14" rx="2.5" />
			<path d="M16 14h2" />
		</svg>
	);
}

function PersonIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<circle cx="12" cy="8" r="4" />
			<path d="M4 21a8 8 0 0 1 16 0" />
		</svg>
	);
}

function OtherIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="M21 8.5V5a2 2 0 0 0-2-2h-3.5" />
			<path d="M3 5v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-3.5" />
			<path d="M12 12l8.5-8.5" />
			<circle cx="16.5" cy="5.5" r="2" />
		</svg>
	);
}


