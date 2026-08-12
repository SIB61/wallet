import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { AddTransactionSheet } from "@/components/wallet/add-transaction-sheet";
import { ScreenHeader } from "@/components/wallet/screen-header";
import { TransactionsSkeleton } from "@/components/wallet/skeletons";
import { TransactionRow } from "@/components/wallet/transaction-row";
import {
	useAccounts,
	useCategories,
	useTransactionPage,
} from "@/components/wallet/use-wallet-data";
import { formatMoney } from "@/components/wallet/wallet-utils";
import type { TransactionType } from "@/generated/prisma/enums";
import {
	deleteTransactionFn,
	type TransactionDTO,
} from "@/lib/wallet";

export const Route = createFileRoute("/_authenticated/_wallet/transactions")({
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
		from: "/_authenticated/_wallet/transactions",
	});
	const { accounts, loaded: accountsLoaded } = useAccounts();
	const { categories, loaded: categoriesLoaded } = useCategories();
	const [filterAccount, setFilterAccount] = useState(searchAccountId ?? "");
	const [filterType, setFilterType] = useState("");
	const {
		transactions,
		total,
		page,
		totalPages,
		loaded: transactionsLoaded,
		setPage,
		refresh,
	} = useTransactionPage({
		accountId: filterAccount || undefined,
		type: (filterType || undefined) as TransactionType | undefined,
	});
	const loaded = accountsLoaded && transactionsLoaded && categoriesLoaded;

	const [addOpen, setAddOpen] = useState(false);
	const [deletingId, setDeletingId] = useState<string | null>(null);

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
			if (transactions.length === 1 && page > 1) {
				setPage(page - 1);
			}
		} finally {
			setDeletingId(null);
		}
	}

	if (!loaded) {
		return <TransactionsSkeleton />;
	}

	return (
		<div className="flex flex-col gap-5">
			<ScreenHeader
				title="Transactions"
				subtitle="Record money in and money out"
			/>

			<Card>
				<CardHeader>
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<CardTitle className="text-base">History</CardTitle>
						<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
							<Select
								value={filterAccount}
								onChange={(e) => {
									setFilterAccount(e.target.value);
									setPage(1);
								}}
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
								onChange={(e) => {
									setFilterType(e.target.value);
									setPage(1);
								}}
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
					{!transactionsLoaded ? (
						<div className="flex flex-col">
							{[0, 1, 2, 3, 4].map((i) => (
								<div
									key={i}
									className="flex items-center gap-3 border-b border-[var(--line)] py-3 last:border-b-0"
									aria-hidden="true"
								>
									<span className="skeleton h-9 w-9 rounded-xl" />
									<span className="min-w-0 flex-1">
										<span className="skeleton block h-4 w-32" />
										<span className="skeleton mt-2 block h-3 w-24" />
									</span>
									<span className="skeleton h-3 w-16" />
									<span className="skeleton h-4 w-16" />
								</div>
							))}
						</div>
					) : transactions.length === 0 ? (
						<p className="m-0 py-8 text-center text-sm text-[var(--sea-ink-soft)]">
							No transactions found.
						</p>
					) : (
						<>
							<ul className="flex flex-col">
								{transactions.map((tx) => (
									<TransactionRow
										key={tx.id}
										tx={tx}
										trailing={
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
										}
									/>
								))}
							</ul>
							{totalPages > 1 && (
								<div className="mt-4 flex items-center justify-between gap-3 border-t border-[var(--line)] pt-4">
									<p className="m-0 text-xs text-[var(--sea-ink-soft)]">
										Page {page} of {totalPages} · {total} transaction
										{total === 1 ? "" : "s"}
									</p>
									<div className="flex items-center gap-2">
										<Button
											variant="outline"
											size="sm"
											disabled={page <= 1}
											onClick={() => setPage(page - 1)}
										>
											Previous
										</Button>
										<Button
											variant="outline"
											size="sm"
											disabled={page >= totalPages}
											onClick={() => setPage(page + 1)}
										>
											Next
										</Button>
									</div>
								</div>
							)}
						</>
					)}
				</CardContent>
			</Card>

			<button
				type="button"
				onClick={() => setAddOpen(true)}
				aria-label="Add transaction"
				title="Add transaction"
				className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--lagoon-deep)] shadow-[0_2px_8px_var(--shadow-soft-08)] backdrop-blur transition hover:bg-[var(--lagoon-12)] active:scale-95 md:bottom-6 md:right-6"
			>
				<PlusIcon className="h-6 w-6" />
			</button>

			<AddTransactionSheet
				open={addOpen}
				accounts={accounts}
				categories={categories}
				onClose={() => setAddOpen(false)}
				onCreated={refresh}
			/>
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

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M12 5v14" />
			<path d="M5 12h14" />
		</svg>
	);
}
