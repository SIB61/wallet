import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	useAccount,
	useAccountTransactions,
} from "@/components/wallet/use-wallet-data";
import {
	ACCOUNT_TYPE_COLORS,
	formatDate,
	formatMoney,
	loanStatus,
	TRANSACTION_TYPE_COLORS,
} from "@/components/wallet/wallet-utils";
import type { TransactionDTO } from "@/lib/wallet";
import { ACCOUNT_TYPE_LABELS, deleteTransactionFn } from "@/lib/wallet";

export const Route = createFileRoute(
	"/_authenticated/apps/wallet/accounts/$accountId",
)({
	component: AccountDetails,
});

function AccountDetails() {
	const { accountId } = useParams({
		from: "/_authenticated/apps/wallet/accounts/$accountId",
	});
	const { account, error: accountError } = useAccount(accountId);
	const { transactions, refresh } = useAccountTransactions(accountId);
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
		} finally {
			setDeletingId(null);
		}
	}

	if (accountError && !account) {
		return (
			<Card className="rounded-2xl">
				<CardContent className="py-10 text-center">
					<p className="m-0 text-[var(--sea-ink-soft)]">{accountError}</p>
					<Link
						to="/apps/wallet/accounts"
						className="mt-4 inline-block text-sm font-semibold no-underline text-[var(--lagoon-deep)] hover:underline"
					>
						Back to accounts
					</Link>
				</CardContent>
			</Card>
		);
	}

	if (!account) {
		return (
			<Card className="rounded-2xl">
				<CardContent className="py-10 text-center text-[var(--sea-ink-soft)]">
					Loading…
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="flex flex-col gap-6">
			<Card className="rounded-2xl">
				<CardHeader className="pb-0">
					<div className="flex min-w-0 flex-col gap-1.5">
						<CardTitle className="text-xl">{account.name}</CardTitle>
						<div className="flex flex-wrap items-center gap-2">
							<span
								className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${ACCOUNT_TYPE_COLORS[account.type]}`}
							>
								{ACCOUNT_TYPE_LABELS[account.type]}
							</span>
							{account.accountNumber && (
								<span className="text-xs font-mono text-[var(--sea-ink-soft)]">
									{account.accountNumber}
								</span>
							)}
						</div>
					</div>
					<CardAction>
						<Link
							to="/apps/wallet/accounts"
							className="text-sm font-semibold no-underline text-[var(--lagoon-deep)] hover:underline"
						>
							Back
						</Link>
					</CardAction>
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
					<div className="flex flex-wrap gap-3">
						<Link
							to="/apps/wallet/transactions"
							search={{ accountId: account.id }}
							className="rounded-full border border-[var(--lagoon-deep-30)] bg-[var(--lagoon-14)] px-5 py-2.5 text-sm font-semibold text-[var(--lagoon-deep)] no-underline transition hover:bg-[var(--lagoon-24)]"
						>
							Add transaction
						</Link>
						<Link
							to="/apps/wallet/accounts"
							className="rounded-full border border-[var(--line)] bg-[var(--chip-bg)] px-5 py-2.5 text-sm font-semibold text-[var(--sea-ink-soft)] no-underline transition hover:text-[var(--sea-ink)]"
						>
							All accounts
						</Link>
					</div>
				</CardContent>
			</Card>

			<Card className="rounded-2xl">
				<CardHeader>
					<CardTitle className="text-lg">Transactions</CardTitle>
				</CardHeader>
				<CardContent>
					{transactions.length === 0 ? (
						<p className="m-0 py-6 text-center text-sm text-[var(--sea-ink-soft)]">
							No transactions for this account yet.
						</p>
					) : (
						<ul className="flex flex-col gap-1">
							{transactions.map((tx) => (
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
