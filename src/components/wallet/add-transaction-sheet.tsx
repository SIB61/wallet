import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { CategoryManager } from "@/components/wallet/category-manager";
import type { TransactionType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { AccountDTO } from "@/lib/wallet";
import { createTransactionFn } from "@/lib/wallet";

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
	{ value: "EXPENSE", label: "Expense" },
	{ value: "INCOME", label: "Income" },
	{ value: "TRANSFER", label: "Transfer" },
];

export function AddTransactionSheet({
	open,
	accounts,
	categories,
	initialAccountId,
	onClose,
	onCreated,
}: {
	open: boolean;
	accounts: AccountDTO[];
	categories: { id: string; name: string; type: TransactionType }[];
	initialAccountId?: string;
	onClose: () => void;
	onCreated: () => Promise<void> | void;
}) {
	const [type, setType] = useState<TransactionType>("EXPENSE");
	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState("");
	const [note, setNote] = useState("");
	const [date, setDate] = useState("");
	const [accountId, setAccountId] = useState("");
	const [toAccountId, setToAccountId] = useState("");
	const [creating, setCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [managerOpen, setManagerOpen] = useState(false);
	const amountInputRef = useRef<HTMLInputElement>(null);

	const categoriesForType = categories
		.filter((c) => c.type === type)
		.sort((a, b) => {
			if (a.name === "Other") return 1;
			if (b.name === "Other") return -1;
			return a.name.localeCompare(b.name);
		});

	useEffect(() => {
		if (open) {
			setType("EXPENSE");
			setAmount("");
			setNote("");
			setDate("");
			setCategory("");
			setAccountId(initialAccountId ?? "");
			setToAccountId("");
			setError(null);
			setTimeout(() => amountInputRef.current?.focus(), 0);
		}
	}, [open, initialAccountId]);

	useEffect(() => {
		const available = categories.filter((c) => c.type === type);
		if (!available.some((c) => c.name === category) && available.length > 0) {
			setCategory(available[0].name);
		}
	}, [type, categories, category]);

	if (!open) return null;

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		setError(null);
		const parsedAmount = Number(amount);
		if (!Number.isFinite(parsedAmount) || parsedAmount < 0) {
			setError("Enter a valid amount.");
			return;
		}
		setCreating(true);
		try {
			await createTransactionFn({
				data: {
					type,
					amount: parsedAmount,
					category,
					note: note.trim() || null,
					date: date || undefined,
					accountId: accountId || null,
					toAccountId: toAccountId || null,
				},
			});
			onClose();
			await onCreated();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to add transaction.",
			);
		} finally {
			setCreating(false);
		}
	}

	return (
		<div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
			<button
				type="button"
				aria-label="Close add transaction"
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
			/>
			<div className="relative flex max-h-[85vh] w-full max-w-lg flex-col gap-4 overflow-y-auto rounded-t-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_8px_40px_var(--shadow-strong)] sm:rounded-2xl">
				<div className="flex items-center justify-between gap-3">
					<div>
						<p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--kicker)]">
							Wallet
						</p>
						<h2 className="mt-0.5 text-lg font-bold text-[var(--sea-ink)]">
							Add Transaction
						</h2>
					</div>
					<Button variant="ghost" size="sm" onClick={onClose}>
						Close
					</Button>
				</div>

				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<div className="inline-flex w-fit rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] p-1">
						{TYPE_OPTIONS.map((option) => (
							<button
								key={option.value}
								type="button"
								onClick={() => setType(option.value)}
								className={cn(
									"rounded-lg px-4 py-1.5 text-sm font-semibold transition sm:px-5",
									type === option.value
										? "bg-[var(--surface-strong)] text-[var(--lagoon-deep)] shadow-[0_1px_3px_var(--shadow-soft-08)]"
										: "text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]",
								)}
							>
								{option.label}
							</button>
						))}
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="tx-amount"
							className="text-xs font-semibold text-[var(--sea-ink-soft)]"
						>
							Amount
						</label>
						<Input
							ref={amountInputRef}
							id="tx-amount"
							type="number"
							inputMode="decimal"
							step="0.01"
							min="0"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							placeholder="0.00"
							required
						/>
					</div>

					<div className="flex flex-col gap-1.5">
						<div className="flex items-center justify-between">
							<label
								htmlFor="tx-category"
								className="text-xs font-semibold text-[var(--sea-ink-soft)]"
							>
								Category
							</label>
							<button
								type="button"
								onClick={() => setManagerOpen(true)}
								className="text-xs font-semibold text-[var(--lagoon-deep)] hover:underline"
							>
								Manage
							</button>
						</div>
						{type === "TRANSFER" ? (
							<Select id="tx-category" value="Transfer" disabled>
								<option value="Transfer">Transfer</option>
							</Select>
						) : (
							<Select
								id="tx-category"
								value={category}
								onChange={(e) => setCategory(e.target.value)}
							>
								{categoriesForType.map((c) => (
									<option key={c.id} value={c.name}>
										{c.name}
									</option>
								))}
							</Select>
						)}
					</div>

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="tx-date"
							className="text-xs font-semibold text-[var(--sea-ink-soft)]"
						>
							Date
						</label>
						<Input
							id="tx-date"
							type="date"
							value={date}
							max={new Date().toISOString().slice(0, 10)}
							onChange={(e) => setDate(e.target.value)}
						/>
					</div>

					{type === "TRANSFER" ? (
						<>
							<div className="flex flex-col gap-1.5">
								<label
									htmlFor="tx-account-from"
									className="text-xs font-semibold text-[var(--sea-ink-soft)]"
								>
									From account
								</label>
								<Select
									id="tx-account-from"
									value={accountId}
									onChange={(e) => setAccountId(e.target.value)}
									required
								>
									<option value="" disabled>
										Select account
									</option>
									{accounts.map((a) => (
										<option key={a.id} value={a.id}>
											{a.name}
										</option>
									))}
								</Select>
							</div>
							<div className="flex flex-col gap-1.5">
								<label
									htmlFor="tx-account-to"
									className="text-xs font-semibold text-[var(--sea-ink-soft)]"
								>
									To account
								</label>
								<Select
									id="tx-account-to"
									value={toAccountId}
									onChange={(e) => setToAccountId(e.target.value)}
									required
								>
									<option value="" disabled>
										Select account
									</option>
									{accounts.map((a) => (
										<option key={a.id} value={a.id}>
											{a.name}
										</option>
									))}
								</Select>
							</div>
						</>
					) : (
						<div className="flex flex-col gap-1.5">
							<label
								htmlFor="tx-account"
								className="text-xs font-semibold text-[var(--sea-ink-soft)]"
							>
								Account
							</label>
							<Select
								id="tx-account"
								value={accountId}
								onChange={(e) => setAccountId(e.target.value)}
								required
							>
								<option value="" disabled>
									Select account
								</option>
								{accounts.map((a) => (
									<option key={a.id} value={a.id}>
										{a.name}
									</option>
								))}
							</Select>
						</div>
					)}

					<div className="flex flex-col gap-1.5">
						<label
							htmlFor="tx-note"
							className="text-xs font-semibold text-[var(--sea-ink-soft)]"
						>
							Note <span className="font-normal">(optional)</span>
						</label>
						<Input
							id="tx-note"
							value={note}
							onChange={(e) => setNote(e.target.value)}
							placeholder="e.g. Dinner with friends"
						/>
					</div>

					{error && (
						<p className="m-0 text-sm font-medium text-[#c0392b]">{error}</p>
					)}

					<Button type="submit" disabled={creating} className="mt-1">
						{creating ? "Adding…" : "Add Transaction"}
					</Button>
					<p className="m-0 text-xs text-[var(--sea-ink-soft)]">
						Account balances update automatically.
					</p>
				</form>
			</div>

			<CategoryManager
				open={managerOpen}
				initialType={type === "TRANSFER" ? "EXPENSE" : type}
				onClose={() => setManagerOpen(false)}
				onSelect={(name) => {
					setCategory(name);
					setManagerOpen(false);
				}}
			/>
		</div>
	);
}
