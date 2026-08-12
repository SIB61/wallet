import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Card,
	CardAction,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScreenHeader } from "@/components/wallet/screen-header";
import { DashboardSkeleton } from "@/components/wallet/skeletons";
import { TransactionRow } from "@/components/wallet/transaction-row";
import {
	useAccounts,
	useTransactions,
} from "@/components/wallet/use-wallet-data";
import {
	formatMoney,
	formatSignedMoney,
} from "@/components/wallet/wallet-utils";

export const Route = createFileRoute("/_authenticated/_wallet/dashboard")({
	component: Dashboard,
});

function Dashboard() {
	const { accounts, loaded: accountsLoaded } = useAccounts();
	const { transactions, loaded: transactionsLoaded } = useTransactions();
	const loaded = accountsLoaded && transactionsLoaded;

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

	if (!loaded) {
		return <DashboardSkeleton />;
	}

	return (
		<div className="flex flex-col gap-5">
			<ScreenHeader title="Dashboard" subtitle="Your money at a glance" />

			{/* Balance hero */}
			<section className="relative overflow-hidden rounded-2xl bg-[var(--lagoon-deep)] p-6 text-[var(--sand)] shadow-[0_8px_24px_var(--lagoon-deep-40)]">
				<div className="blueprint-grid pointer-events-none absolute inset-0 opacity-20" />
				<div className="relative">
					<p className="text-[11px] font-bold uppercase tracking-[0.16em] opacity-80">
						Total Balance
					</p>
					<p className="mt-2 font-mono text-3xl font-bold tracking-tight sm:text-4xl">
						{formatMoney(totalBalance)}
					</p>
					<div className="mt-5 flex flex-wrap gap-x-6 gap-y-1.5 text-sm">
						<span className="inline-flex items-center gap-1.5">
							<DownArrowIcon className="size-3.5" />
							<span className="opacity-80">Expense</span>
							<span className="font-bold">
								{formatSignedMoney(totalExpense)}
							</span>
						</span>
						<span className="inline-flex items-center gap-1.5">
							<UpArrowIcon className="size-3.5" />
							<span className="opacity-80">Income</span>
							<span className="font-bold">
								{formatSignedMoney(totalIncome)}
							</span>
						</span>
					</div>
				</div>
			</section>

			{/* Stats */}
			<section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				<StatCard
					label="Accounts"
					value={String(accounts.length)}
					accent="text-[var(--sea-ink)]"
				/>
				<StatCard
					label="Total Lent"
					value={formatMoney(totalLent)}
					accent="text-[var(--palm)]"
				/>
				<StatCard
					label="Monthly Expense"
					value={formatMoney(monthlyExpense)}
					accent="text-[#c0392b]"
				/>
				<StatCard
					label="Monthly Income"
					value={formatMoney(monthlyIncome)}
					accent="text-[var(--palm)]"
				/>
			</section>

			{/* Recent transactions */}
			<section>
				<Card>
					<CardHeader>
						<CardTitle className="text-base">Recent Transactions</CardTitle>
						<CardAction>
							<Link
								to="/transactions"
								search={{ accountId: undefined }}
								className="text-sm font-semibold no-underline text-[var(--lagoon-deep)] hover:underline"
							>
								View all
							</Link>
						</CardAction>
					</CardHeader>
					<CardContent>
						{recentTxs.length === 0 ? (
							<p className="m-0 py-8 text-center text-sm text-[var(--sea-ink-soft)]">
								No transactions recorded yet.{" "}
								<Link
									to="/transactions"
									search={{ accountId: undefined }}
									className="font-semibold no-underline text-[var(--lagoon-deep)] hover:underline"
								>
									Add your first one
								</Link>
								.
							</p>
						) : (
							<ul className="flex flex-col">
								{recentTxs.map((tx) => (
									<TransactionRow key={tx.id} tx={tx} />
								))}
							</ul>
						)}
					</CardContent>
				</Card>
			</section>

			{/* Lender summary */}
			{(totalLent > 0 || totalBorrowed > 0) && (
				<section className="grid grid-cols-2 gap-3">
					{totalLent > 0 && (
						<Card>
							<CardContent>
								<p className="m-0 text-xs font-semibold text-[var(--sea-ink-soft)]">
									You lent out
								</p>
								<p className="m-0 mt-1 font-mono text-xl font-bold text-[var(--palm)]">
									{formatMoney(totalLent)}
								</p>
							</CardContent>
						</Card>
					)}
					{totalBorrowed > 0 && (
						<Card>
							<CardContent>
								<p className="m-0 text-xs font-semibold text-[var(--sea-ink-soft)]">
									You owe
								</p>
								<p className="m-0 mt-1 font-mono text-xl font-bold text-[#c0392b]">
									{formatMoney(totalBorrowed)}
								</p>
							</CardContent>
						</Card>
					)}
				</section>
			)}
		</div>
	);
}

function StatCard({
	label,
	value,
	accent,
}: {
	label: string;
	value: string;
	accent: string;
}) {
	return (
		<Card>
			<CardContent>
				<p className="m-0 text-[11px] font-bold uppercase tracking-wide text-[var(--sea-ink-soft)]">
					{label}
				</p>
				<p
					className={`m-0 mt-1.5 truncate font-mono text-lg font-bold ${accent}`}
				>
					{value}
				</p>
			</CardContent>
		</Card>
	);
}

function UpArrowIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M12 19V5" />
			<path d="m5 12 7-7 7 7" />
		</svg>
	);
}

function DownArrowIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M12 5v14" />
			<path d="m5 12 7 7 7-7" />
		</svg>
	);
}
