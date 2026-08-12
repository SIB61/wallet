import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const STATS = [0, 1, 2, 3] as const;
const ROWS_4 = [0, 1, 2, 3] as const;
const ROWS_5 = [0, 1, 2, 3, 4] as const;
const ROWS_6 = [0, 1, 2, 3, 4, 5] as const;
const CARDS_6 = [0, 1, 2, 3, 4, 5] as const;

export function DashboardSkeleton() {
	return (
		<div className="flex flex-col gap-5" aria-hidden="true">
			<div>
				<Skeleton className="h-7 w-44" />
			</div>

			<Skeleton className="h-44 w-full rounded-2xl" />

			<div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
				{STATS.map((i) => (
					<Skeleton key={i} className="h-24 w-full" />
				))}
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="text-base">Recent Transactions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col">
						{ROWS_5.map((i) => (
							<TransactionRowSkeleton key={i} />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export function TransactionRowSkeleton() {
	return (
		<div className="flex items-center gap-3 border-b border-[var(--line)] py-3 last:border-b-0">
			<Skeleton className="h-9 w-9 rounded-xl" />
			<span className="min-w-0 flex-1">
				<Skeleton className="h-4 w-32" />
				<Skeleton className="mt-2 h-3 w-24" />
			</span>
			<Skeleton className="h-3 w-16" />
			<Skeleton className="h-4 w-16" />
		</div>
	);
}

export function TransactionsSkeleton() {
	return (
		<div className="flex flex-col gap-5" aria-hidden="true">
			<div>
				<Skeleton className="h-7 w-48" />
			</div>
			<Card>
				<CardHeader>
					<CardTitle className="text-base">History</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col">
						{ROWS_6.map((i) => (
							<TransactionRowSkeleton key={i} />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export function AccountsSkeleton() {
	return (
		<div
			className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
			aria-hidden="true"
		>
			{CARDS_6.map((i) => (
				<Card key={i}>
					<CardHeader className="pb-0">
						<div className="flex min-w-0 items-start gap-3">
							<Skeleton className="h-10 w-10 rounded-xl" />
							<div className="min-w-0 flex-1">
								<Skeleton className="h-4 w-28" />
								<Skeleton className="mt-2 h-3 w-16" />
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<Skeleton className="mt-2 h-7 w-32" />
					</CardContent>
				</Card>
			))}
		</div>
	);
}

export function AccountDetailSkeleton() {
	return (
		<div className="flex flex-col gap-5" aria-hidden="true">
			<div>
				<Skeleton className="h-7 w-40" />
			</div>
			<Card>
				<CardHeader className="pb-0">
					<Skeleton className="h-5 w-20" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-9 w-52" />
					<Skeleton className="mt-4 h-10 w-36" />
				</CardContent>
			</Card>
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Transactions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col">
						{ROWS_4.map((i) => (
							<TransactionRowSkeleton key={i} />
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}

export function AdminSkeleton() {
	return (
		<div className="flex flex-col gap-5" aria-hidden="true">
			<div>
				<Skeleton className="h-7 w-48" />
				<Skeleton className="mt-2 h-3 w-72" />
			</div>
			<Card>
				<CardHeader>
					<CardTitle className="text-base">Accounts</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col">
						{ROWS_4.map((i) => (
							<div
								key={i}
								className="flex flex-wrap items-center gap-3 border-b border-[var(--line)] py-3 last:border-b-0"
							>
								<Skeleton className="h-9 w-9 rounded-full" />
								<span className="min-w-0 flex-1">
									<Skeleton className="h-4 w-32" />
									<Skeleton className="mt-2 h-3 w-48" />
								</span>
								<Skeleton className="h-5 w-14" />
								<Skeleton className="h-8 w-24" />
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
