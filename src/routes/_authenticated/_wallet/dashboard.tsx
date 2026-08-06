import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	useAccounts,
	useTransactions,
} from "@/components/wallet/use-wallet-data";
import {
	formatDate,
	formatMoney,
	formatSignedMoney,
	TRANSACTION_TYPE_COLORS,
} from "@/components/wallet/wallet-utils";
import type { TransactionType } from "@/generated/prisma/enums";

export const Route = createFileRoute("/_authenticated/apps/wallet/")({
	component: Dashboard,
});

function Dashboard() {
	const { accounts } = useAccounts();
	const { transactions } = useTransactions();

	const now = new Date();
	function inCurrentMonth(dateString: string) {
		const date = new Date(dateString);
		return (
			date.getFullYear() === now.getFullYear() &&
			date.getMonth() === now.getMonth()
		);
	}

	const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);
	const totalLent = accounts
		.filter((a) => a.type === "PERSON" && a.balance > 0)
		.reduce((sum, a) => sum + a.balance, 0);
	const totalBorrowed = accounts
		.filter((a) => a.type === "PERSON" && a.balance < 0)
		.reduce((sum, a) => sum + Math.abs(a.balance), 0);
	const monthlyExpense = transactions
		.filter((t) => t.type === "EXPENSE" && inCurrentMonth(t.date))
		.reduce((sum, t) => sum + t.amount, 0);
	const monthlyIncome = transactions
		.filter((t) => t.type === "INCOME" && inCurrentMonth(t.date))
		.reduce((sum, t) => sum + t.amount, 0);
	const totalExpense = transactions
		.filter((t) => t.type === "EXPENSE")
		.reduce((sum, t) => sum + t.amount, 0);
	const totalIncome = transactions
		.filter((t) => t.type === "INCOME")
		.reduce((sum, t) => sum + t.amount, 0);
	const recentTxs = transactions.slice(0, 8);

	return (
		<div className="flex flex-col gap-6">
			<section className="island-shell relative overflow-hidden rounded-[2rem] px-6 py-8 sm:px-10">
				<div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,var(--lagoon-28),transparent_66%)]" />
				<p className="island-kicker mb-2">Total Balance</p>
				<p className="text-4xl font-extrabold tracking-tight text-[var(--sea-ink)] sm:text-5xl">
					{formatMoney(totalBalance)}
				</p>
				<div className="mt-5 flex flex-wrap gap-6 text-sm">
					<div>
						<span className="mr-1.5 text-[var(--sea-ink-soft)]">Expense</span>
						<span className="font-bold text-[#c0392b]">
							{formatSignedMoney(totalExpense)}
						</span>
					</div>
					<div>
						<span className="mr-1.5 text-[var(--sea-ink-soft)]">Income</span>
						<span className="font-bold text-[var(--palm)]">
							{formatSignedMoney(totalIncome)}
						</span>
					</div>
					<div>
						<span className="mr-1.5 text-[var(--sea-ink-soft)]">Accounts</span>
						<span className="font-bold text-[var(--sea-ink)]">
							{accounts.length}
						</span>
					</div>
				</div>
			</section>

			<section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<Card className="feature-card rounded-2xl">
					<CardHeader className="pb-0">
						<CardTitle className="text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
							Accounts
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-extrabold tracking-tight text-[var(--sea-ink)]">
							{accounts.length}
						</p>
					</CardContent>
				</Card>
				<Card className="feature-card rounded-2xl">
					<CardHeader className="pb-0">
						<CardTitle className="text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
							Total Lent
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-extrabold tracking-tight text-[var(--palm)]">
							{formatMoney(totalLent)}
						</p>
						{totalBorrowed > 0 && (
							<p className="mt-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
								Owed by others: {formatMoney(totalBorrowed)}
							</p>
						)}
					</CardContent>
				</Card>
				<Card className="feature-card rounded-2xl">
					<CardHeader className="pb-0">
						<CardTitle className="text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
							Monthly Expense
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-extrabold tracking-tight text-[#c0392b]">
							{formatMoney(monthlyExpense)}
						</p>
						<p className="mt-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
							Income: {formatMoney(monthlyIncome)}
						</p>
					</CardContent>
				</Card>
				<Card className="feature-card rounded-2xl">
					<CardHeader className="pb-0">
						<CardTitle className="text-xs font-semibold uppercase tracking-wide text-[var(--sea-ink-soft)]">
							All-time
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-extrabold tracking-tight text-[var(--sea-ink)]">
							{formatMoney(totalIncome - totalExpense)}
						</p>
						<p className="mt-1 text-xs font-semibold text-[var(--sea-ink-soft)]">
							In {formatMoney(totalIncome)} · Out {formatMoney(totalExpense)}
						</p>
					</CardContent>
				</Card>
			</section>

			<section>
				<Card className="rounded-2xl">
					<CardHeader>
						<CardTitle className="text-lg">Recent Transactions</CardTitle>
						<CardAction>
							<Link
								to="/apps/wallet/transactions"
								search={{ accountId: undefined }}
								className="text-sm font-semibold no-underline text-[var(--lagoon-deep)] hover:underline"
							>
								View all
							</Link>
						</CardAction>
					</CardHeader>
					<CardContent>
						{recentTxs.length === 0 ? (
							<p className="m-0 py-4 text-center text-sm text-[var(--sea-ink-soft)]">
								No transactions recorded yet.
							</p>
						) : (
							<ul className="flex flex-col gap-1">
								{recentTxs.map((tx) => (
									<li
										key={tx.id}
										className="flex items-center gap-4 rounded-xl px-2 py-2.5 transition hover:bg-[var(--lagoon-08)]"
									>
										<span className="flex-1 min-w-0">
											<span className="block truncate text-sm font-semibold text-[var(--sea-ink)]">
												{tx.category}
											</span>
											<span className="block truncate text-xs text-[var(--sea-ink-soft)]">
												{tx.type === "TRANSFER"
													? `${tx.accountName ?? "—"} → ${tx.toAccountName ?? "—"}`
													: (tx.accountName ?? "—")}
												{tx.note ? ` · ${tx.note}` : ""}
											</span>
										</span>
										<span className="text-xs text-[var(--sea-ink-soft)]">
											{formatDate(tx.date)}
										</span>
										<span
											className={`w-24 text-right text-sm font-bold ${TRANSACTION_TYPE_COLORS[tx.type as TransactionType]}`}
										>
											{tx.type === "EXPENSE"
												? "−"
												: tx.type === "INCOME"
													? "+"
													: ""}
											{formatSignedMoney(tx.amount)}
										</span>
									</li>
								))}
							</ul>
						)}
					</CardContent>
				</Card>
			</section>
		</div>
	);
}
