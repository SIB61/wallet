import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddTransactionSheet } from "@/components/wallet/add-transaction-sheet";
import { ScreenHeader } from "@/components/wallet/screen-header";
import { AccountDetailSkeleton } from "@/components/wallet/skeletons";
import { TransactionRow } from "@/components/wallet/transaction-row";
import {
	useAccount,
	useAccounts,
	useAccountTransactions,
	useCategories,
} from "@/components/wallet/use-wallet-data";
import {
	ACCOUNT_TYPE_COLORS,
	formatMoney,
	loanStatus,
} from "@/components/wallet/wallet-utils";
import type { TransactionDTO } from "@/lib/wallet";
import { ACCOUNT_TYPE_LABELS, deleteTransactionFn } from "@/lib/wallet";

export const Route = createFileRoute(
	"/_authenticated/_wallet/accounts/$accountId",
)({
	component: AccountDetails,
});

function AccountDetails() {
	const { accountId } = useParams({
		from: "/_authenticated/_wallet/accounts/$accountId",
	});
	const { account, error: accountError } = useAccount(accountId);
	const {
		transactions,
		loaded: transactionsLoaded,
		refresh,
	} = useAccountTransactions(accountId);
	const { accounts } = useAccounts();
	const { categories } = useCategories();
	const [deletingId, setDeletingId] = useState<string | null>(null);
	const [addOpen, setAddOpen] = useState(false);

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

	if (accountError && !account) {
		return (
			<Card>
				<CardContent className="py-10 text-center">
					<p className="m-0 text-[var(--sea-ink-soft)]">{accountError}</p>
					<Link
						to="/accounts"
						className="mt-4 inline-block text-sm font-semibold no-underline text-[var(--lagoon-deep)] hover:underline"
					>
						Back to accounts
					</Link>
				</CardContent>
			</Card>
		);
	}

	if (!account || !transactionsLoaded) {
		return <AccountDetailSkeleton />;
	}

	return (
		<div className="flex flex-col gap-5">
			<ScreenHeader
				title={account.name}
				action={
					<Link
						to="/accounts"
						className="rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] px-4 py-2 text-sm font-semibold text-[var(--sea-ink-soft)] no-underline transition hover:text-[var(--sea-ink)]"
					>
						All accounts
					</Link>
				}
			/>

			<Card>
				<CardHeader className="pb-0">
					<div className="flex min-w-0 flex-col gap-1.5">
						<span
							className={`inline-flex w-fit items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${ACCOUNT_TYPE_COLORS[account.type]}`}
						>
							{ACCOUNT_TYPE_LABELS[account.type]}
						</span>
						{account.accountNumber && (
							<span className="text-xs font-mono text-[var(--sea-ink-soft)]">
								{account.accountNumber}
							</span>
						)}
					</div>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<p className="m-0 text-3xl font-extrabold tracking-tight text-[var(--sea-ink)]">
						{formatMoney(account.balance)}
					</p>
					{account.type === "PERSON" && (
						<p className="m-0 text-sm font-semibold text-[var(--sea-ink-soft)]">
							{loanStatus(account.balance)}
						</p>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Transactions</CardTitle>
				</CardHeader>
				<CardContent>
					{transactions.length === 0 ? (
						<p className="m-0 py-8 text-center text-sm text-[var(--sea-ink-soft)]">
							No transactions for this account yet.
						</p>
					) : (
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
				initialAccountId={account.id}
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
