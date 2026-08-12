import type { AccountType, TransactionType } from "@/generated/prisma/enums";

export const CURRENCY = "BDT";

const moneyFormatter = new Intl.NumberFormat("en-US", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2,
});

export function formatMoney(value: number): string {
	const sign = value < 0 ? "−" : "";
	return `${sign}Tk ${moneyFormatter.format(Math.abs(value))}`;
}

export function formatSignedMoney(value: number): string {
	return `Tk ${moneyFormatter.format(Math.abs(value))}`;
}

export const ACCOUNT_TYPE_COLORS: Record<AccountType, string> = {
	BANK: "text-[var(--lagoon-deep)] bg-[rgba(79,184,178,0.16)]",
	MFS: "text-[var(--palm)] bg-[rgba(47,106,74,0.16)]",
	CASH: "text-amber-700 bg-amber-500/15 dark:text-amber-300",
	CARD: "text-indigo-700 bg-indigo-500/15 dark:text-indigo-300",
	WALLET: "text-emerald-700 bg-emerald-500/15 dark:text-emerald-300",
	PERSON: "text-purple-700 bg-purple-500/15 dark:text-purple-300",
	OTHER: "text-[var(--sea-ink-soft)] bg-[var(--chip-bg)]",
};

export function loanStatus(balance: number): string {
	if (balance > 0) return "You lent";
	if (balance < 0) return "You borrowed";
	return "Settled";
}

export const TRANSACTION_TYPE_COLORS: Record<TransactionType, string> = {
	EXPENSE: "text-[#c0392b]",
	INCOME: "text-[var(--palm)]",
	TRANSFER: "text-[var(--lagoon-deep)]",
};

export function formatDate(dateString: string): string {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-GB", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}
