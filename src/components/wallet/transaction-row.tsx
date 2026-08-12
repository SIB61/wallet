import type { ReactNode, SVGProps } from "react";
import {
	formatDate,
	formatMoney,
	TRANSACTION_TYPE_COLORS,
} from "@/components/wallet/wallet-utils";
import type { TransactionType } from "@/generated/prisma/enums";
import type { TransactionDTO } from "@/lib/wallet";

export function TransactionRow({
	tx,
	trailing,
	showDate = true,
}: {
	tx: TransactionDTO;
	trailing?: ReactNode;
	showDate?: boolean;
}) {
	return (
		<li className="flex items-center gap-3 border-b border-[var(--line)] py-3 last:border-b-0">
			<span
				className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl ${
					tx.type === "EXPENSE"
						? "bg-[#c0392b]/10 text-[#c0392b]"
						: tx.type === "INCOME"
							? "bg-[var(--palm-14)] text-[var(--palm)]"
							: "bg-[var(--lagoon-14)] text-[var(--lagoon-deep)]"
				}`}
			>
				{tx.type === "TRANSFER" ? (
					<TransferIcon className="size-4" />
				) : tx.type === "INCOME" ? (
					<UpArrowIcon className="size-4" />
				) : (
					<DownArrowIcon className="size-4" />
				)}
			</span>
			<span className="min-w-0 flex-1">
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
			{showDate && (
				<span className="hidden text-xs text-[var(--sea-ink-soft)] sm:block">
					{formatDate(tx.date)}
				</span>
			)}
			<span
				className={`w-24 shrink-0 text-right text-sm font-bold ${TRANSACTION_TYPE_COLORS[tx.type as TransactionType]}`}
			>
				{tx.type === "EXPENSE" ? "−" : tx.type === "INCOME" ? "+" : ""}
				{formatMoney(tx.amount)}
			</span>
			{trailing}
		</li>
	);
}

function UpArrowIcon(props: SVGProps<SVGSVGElement>) {
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

function DownArrowIcon(props: SVGProps<SVGSVGElement>) {
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

function TransferIcon(props: SVGProps<SVGSVGElement>) {
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
			<path d="M4 6h13" />
			<path d="m13 2 5 4-5 4" />
			<path d="M20 18H7" />
			<path d="m11 14-5 4 5 4" />
		</svg>
	);
}
