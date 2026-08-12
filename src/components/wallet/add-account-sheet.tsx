import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { AccountType } from "@/generated/prisma/enums";
import {
	ACCOUNT_TYPE_LABELS,
	ACCOUNT_TYPES,
	createAccountFn,
} from "@/lib/wallet";

const TYPE_OPTIONS = ACCOUNT_TYPES.map((type) => ({
	value: type,
	label: ACCOUNT_TYPE_LABELS[type as AccountType],
}));

export function AddAccountSheet({
	open,
	onClose,
	onCreated,
}: {
	open: boolean;
	onClose: () => void;
	onCreated: () => Promise<void> | void;
}) {
	const [name, setName] = useState("");
	const [type, setType] = useState<AccountType>("BANK");
	const [accountNumber, setAccountNumber] = useState("");
	const [balance, setBalance] = useState("");
	const [creating, setCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const nameInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open) {
			setName("");
			setType("BANK");
			setAccountNumber("");
			setBalance("");
			setError(null);
			setTimeout(() => nameInputRef.current?.focus(), 0);
		}
	}, [open]);

	if (!open) return null;

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		setError(null);
		if (!name.trim()) {
			setError("Please enter an account name.");
			return;
		}
		setCreating(true);
		try {
			const parsedBalance = balance.trim() === "" ? 0 : Number(balance);
			await createAccountFn({
				data: {
					name,
					type,
					accountNumber: accountNumber.trim() || null,
					balance: Number.isFinite(parsedBalance) ? parsedBalance : 0,
				},
			});
			onClose();
			await onCreated();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to create account.",
			);
		} finally {
			setCreating(false);
		}
	}

	return (
		<div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
			<button
				type="button"
				aria-label="Close add account"
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
			/>
			<div className="relative flex max-h-[85vh] w-full max-w-lg flex-col gap-4 rounded-t-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_8px_40px_var(--shadow-strong)] sm:rounded-2xl">
				<div className="flex items-center justify-between gap-3">
					<div>
						<p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--kicker)]">
							Wallet
						</p>
						<h2 className="mt-0.5 text-lg font-bold text-[var(--sea-ink)]">
							Add Account
						</h2>
					</div>
					<Button variant="ghost" size="sm" onClick={onClose}>
						Close
					</Button>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="add-name"
							className="text-xs font-semibold text-[var(--sea-ink-soft)]"
						>
							Account name
						</label>
						<Input
							ref={nameInputRef}
							id="add-name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							placeholder="e.g. bKash, DBBL, Cash"
							required
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="add-type"
							className="text-xs font-semibold text-[var(--sea-ink-soft)]"
						>
							Account type
						</label>
						<Select
							id="add-type"
							value={type}
							onChange={(e) => setType(e.target.value as AccountType)}
						>
							{TYPE_OPTIONS.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</Select>
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="add-balance"
							className="text-xs font-semibold text-[var(--sea-ink-soft)]"
						>
							Opening balance
						</label>
						<Input
							id="add-balance"
							type="number"
							inputMode="decimal"
							step="0.01"
							value={balance}
							onChange={(e) => setBalance(e.target.value)}
							placeholder={
								type === "PERSON"
									? "Negative = you owe"
									: "Optional, defaults to 0"
							}
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="add-account-number"
							className="text-xs font-semibold text-[var(--sea-ink-soft)]"
						>
							Account number <span className="font-normal">(optional)</span>
						</label>
						<Input
							id="add-account-number"
							value={accountNumber}
							onChange={(e) => setAccountNumber(e.target.value)}
							placeholder="e.g. 01XX-XXXXXXX"
						/>
					</div>

					{error && (
						<p className="m-0 text-sm font-medium text-[#c0392b]">{error}</p>
					)}

					<Button type="submit" disabled={creating} className="mt-1">
						{creating ? "Adding…" : "Add Account"}
					</Button>
				</form>
			</div>
		</div>
	);
}
