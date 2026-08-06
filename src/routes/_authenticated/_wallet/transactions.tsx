import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
	useAccounts,
	useTransactions,
} from "@/components/wallet/use-wallet-data";
import {
	formatDate,
	formatMoney,
	TRANSACTION_TYPE_COLORS,
} from "@/components/wallet/wallet-utils";
import type { TransactionType } from "@/generated/prisma/enums";
import {
	createTransactionFn,
	deleteTransactionFn,
	EXPENSE_CATEGORIES,
	INCOME_CATEGORIES,
	type TransactionDTO,
} from "@/lib/wallet";

export const Route = createFileRoute(
	"/_authenticated/apps/wallet/transactions",
)({
	validateSearch: (search: Record<string, unknown>) => ({
		accountId:
			typeof search.accountId === "string" ? search.accountId : undefined,
	}),
	component: TransactionsPage,
});

const TYPE_OPTIONS: { value: TransactionType; label: string }[] = [
	{ value: "EXPENSE", label: "Expense" },
	{ value: "INCOME", label: "Income" },
	{ value: "TRANSFER", label: "Transfer" },
];

function TransactionsPage() {
	const { accountId: searchAccountId } = useSearch({
		from: "/_authenticated/apps/wallet/transactions",
	});
	const { accounts } = useAccounts();
	const { transactions, refresh } = useTransactions();

	const [type, setType] = useState<TransactionType>("EXPENSE");
	const [amount, setAmount] = useState("");
	const [category, setCategory] = useState(EXPENSE_CATEGORIES[0]);
	const [note, setNote] = useState("");
	const [date, setDate] = useState("");
	const [accountId, setAccountId] = useState(searchAccountId ?? "");
	const [toAccountId, setToAccountId] = useState("");
	const [filterAccount, setFilterAccount] = useState(searchAccountId ?? "");
	const [filterType, setFilterType] = useState("");
	const [creating, setCreating] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const categories = type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

	const filtered = useMemo(() => {
		return transactions.filter((tx) => {
			if (filterType && tx.type !== filterType) return false;
			if (filterAccount && tx.accountId !== filterAccount) return false;
			return true;
		});
	}, [transactions, filterType, filterAccount]);

	function resetForm() {
		setAmount("");
		setNote("");
		setDate("");
		setCategory(
			type === "INCOME" ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
		);
	}

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
			resetForm();
			await refresh();
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to add transaction.",
			);
		} finally {
			setCreating(false);
		}
	}

	async function handleDelete(tx: TransactionDTO) {
		if (
			!confirm(
				`Delete this ${tx.category} transaction of ${formatMoney(tx.amount)}?`,
			)
		) {
			return;
		}
		setDeletingId(tx.id);
		try {
			await deleteTransactionFn({ data: { id: tx.id } });
			await refresh();
		} finally {
			setDeletingId(null);
		}
	}

	return (
		<div className="flex flex-col gap-6">
			<Card className="rounded-2xl">
				<CardHeader>
					<CardTitle className="text-lg">Add Transaction</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-4">
						<div className="inline-flex w-fit rounded-full border border-[var(--chip-line)] bg-[var(--chip-bg)] p-1">
							{TYPE_OPTIONS.map((option) => (
								<button
									key={option.value}
									type="button"
									onClick={() => setType(option.value)}
									className={`rounded-full px-5 py-1.5 text-sm font-semibold transition ${
										type === option.value
											? "bg-[var(--lagoon-24)] text-[var(--lagoon-deep)]"
											: "text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]"
									}`}
								>
									{option.label}
								</button>
							))}
						</div>

						<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
							<div className="flex flex-col gap-1.5">
								<label
									htmlFor="tx-amount"
									className="text-xs font-semibold text-[var(--sea-ink-soft)]"
								>
									Amount
								</label>
								<Input
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
								<label
									htmlFor="tx-category"
									className="text-xs font-semibold text-[var(--sea-ink-soft)]"
								>
									Category
								</label>
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
										{categories.map((c) => (
											<option key={c} value={c}>
												{c}
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

							<div className="flex flex-col gap-1.5 sm:col-span-2 lg:col-span-1">
								<label
									htmlFor="tx-note"
									className="text-xs font-semibold text-[var(--sea-ink-soft)]"
								>
									Note (optional)
								</label>
								<Input
									id="tx-note"
									value={note}
									onChange={(e) => setNote(e.target.value)}
									placeholder="e.g. Dinner with friends"
								/>
							</div>
						</div>

						{error && (
							<p className="text-sm font-medium text-[#c0392b]">{error}</p>
						)}

						<div className="flex items-center gap-3">
							<Button type="submit" disabled={creating}>
								{creating ? "Adding…" : "Add Transaction"}
							</Button>
							<p className="m-0 text-xs text-[var(--sea-ink-soft)]">
								Account balances update automatically.
							</p>
						</div>
					</form>
				</CardContent>
			</Card>

			<Card className="rounded-2xl">
				<CardHeader>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<CardTitle className="text-lg">Transactions</CardTitle>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
							<Select
								value={filterAccount}
								onChange={(e) => setFilterAccount(e.target.value)}
								className="sm:w-52"
								aria-label="Filter by account"
							>
								<option value="">All accounts</option>
								{accounts.map((a) => (
									<option key={a.id} value={a.id}>
										{a.name}
									</option>
								))}
							</Select>
							<Select
								value={filterType}
								onChange={(e) => setFilterType(e.target.value)}
								className="sm:w-40"
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
					</div>
				</CardHeader>
				<CardContent>
					{filtered.length === 0 ? (
						<p className="m-0 py-6 text-center text-sm text-[var(--sea-ink-soft)]">
							No transactions found.
						</p>
					) : (
						<ul className="flex flex-col gap-1">
							{filtered.map((tx) => (
								<li
									key={tx.id}
									className="flex items-center gap-4 rounded-xl px-2 py-2.5 transition hover:bg-[var(--lagoon-08)]"
								>
									<span className="flex-1 min-w-0">
										<span className="block truncate text-sm font-semibold text-[var(--sea-ink)]">
											{tx.category}
											{tx.type === "TRANSFER" ? " · Transfer" : ""}
										</span>
										<span className="block truncate text-xs text-[var(--sea-ink-soft)]">
											{tx.type === "TRANSFER"
												? `${tx.accountName ?? "—"} → ${tx.toAccountName ?? "—"}`
												: (tx.accountName ?? "—")}
											{tx.note ? ` · ${tx.note}` : ""}
										</span>
									</span>
									<span className="hidden text-xs text-[var(--sea-ink-soft)] sm:block">
										{formatDate(tx.date)}
									</span>
									<span
										className={`w-24 text-right text-sm font-bold ${TRANSACTION_TYPE_COLORS[tx.type]}`}
									>
										{tx.type === "EXPENSE"
											? "−"
											: tx.type === "INCOME"
												? "+"
												: ""}
										{formatMoney(tx.amount)}
									</span>
									<Button
										variant="ghost"
										size="icon-xs"
										onClick={() => handleDelete(tx)}
										disabled={deletingId === tx.id}
										className="text-[var(--sea-ink-soft)] hover:text-[#c0392b]"
										aria-label={`Delete ${tx.category} transaction`}
									>
										<TrashIcon className="h-3.5 w-3.5" />
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

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="M3 6h18" />
			<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
			<path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
			<path d="M10 11v6" />
			<path d="M14 11v6" />
		</svg>
	);
}
