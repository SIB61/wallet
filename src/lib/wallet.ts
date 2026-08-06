import { createServerFn } from "@tanstack/react-start";
import { AccountType, TransactionType } from "@/generated/prisma/enums";
import { requireUserMiddleware } from "@/lib/auth/middleware";
import { prisma } from "@/lib/prisma";

export const ACCOUNT_TYPE_LABELS: Record<AccountType, string> = {
	BANK: "Bank Account",
	MFS: "Mobile Financial Service",
	CASH: "Cash",
	CARD: "Card",
	WALLET: "Digital Wallet",
	PERSON: "Person (Borrow / Lend)",
	OTHER: "Other",
};

export const ACCOUNT_TYPES = Object.values(AccountType);

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
	EXPENSE: "Expense",
	INCOME: "Income",
	TRANSFER: "Transfer",
};

export const EXPENSE_CATEGORIES = [
	"Food & Dining",
	"Transport",
	"Shopping",
	"Utilities & Bills",
	"Rent & Housing",
	"Health",
	"Entertainment",
	"Education",
	"Travel",
	"Groceries",
	"Subscriptions",
	"EMI & Loans",
	"Other",
];

export const INCOME_CATEGORIES = [
	"Salary",
	"Freelance",
	"Business",
	"Gift",
	"Investment",
	"Refund",
	"Other",
];

export type AccountDTO = {
	id: string;
	name: string;
	type: AccountType;
	accountNumber: string | null;
	balance: number;
	createdAt: string;
	updatedAt: string;
};

export type TransactionDTO = {
	id: string;
	type: TransactionType;
	amount: number;
	category: string;
	note: string | null;
	date: string;
	accountId: string | null;
	accountName: string | null;
	toAccountId: string | null;
	toAccountName: string | null;
	createdAt: string;
};

function toAccountDTO(account: {
	id: string;
	name: string;
	type: AccountType;
	accountNumber: string | null;
	balance: { toNumber(): number };
	createdAt: Date;
	updatedAt: Date;
}): AccountDTO {
	return {
		id: account.id,
		name: account.name,
		type: account.type,
		accountNumber: account.accountNumber,
		balance: account.balance.toNumber(),
		createdAt: account.createdAt.toISOString(),
		updatedAt: account.updatedAt.toISOString(),
	};
}

function toTransactionDTO(transaction: {
	id: string;
	type: TransactionType;
	amount: { toNumber(): number };
	category: string;
	note: string | null;
	date: Date;
	accountId: string | null;
	accountName: string | null;
	toAccountId: string | null;
	toAccountName: string | null;
	createdAt: Date;
}): TransactionDTO {
	return {
		id: transaction.id,
		type: transaction.type,
		amount: transaction.amount.toNumber(),
		category: transaction.category,
		note: transaction.note,
		date: transaction.date.toISOString(),
		accountId: transaction.accountId,
		accountName: transaction.accountName,
		toAccountId: transaction.toAccountId,
		toAccountName: transaction.toAccountName,
		createdAt: transaction.createdAt.toISOString(),
	};
}

export type CreateAccountInput = {
	name: string;
	type: AccountType;
	accountNumber?: string | null;
	balance: number;
};

export const listAccountsFn = createServerFn({ method: "GET" })
	.middleware([requireUserMiddleware])
	.handler(async ({ context }) => {
		const accounts = await prisma.account.findMany({
			where: { userId: context.user.id },
			orderBy: [{ createdAt: "asc" }],
		});
		return accounts.map(toAccountDTO);
	});

export const getAccountFn = createServerFn({ method: "GET" })
	.middleware([requireUserMiddleware])
	.validator((input: { id: string }) => input)
	.handler(async ({ data, context }) => {
		const account = await prisma.account.findUnique({
			where: { id: data.id, userId: context.user.id },
		});
		if (!account) throw new Error("Account not found.");
		return toAccountDTO(account);
	});

export const listAccountTransactionsFn = createServerFn({ method: "GET" })
	.middleware([requireUserMiddleware])
	.validator((input: { accountId: string }) => input)
	.handler(async ({ data, context }) => {
		const transactions = await prisma.transaction.findMany({
			where: {
				OR: [
					{ accountId: data.accountId, account: { userId: context.user.id } },
					{
						toAccountId: data.accountId,
						toAccount: { userId: context.user.id },
					},
				],
			},
			orderBy: [{ date: "desc" }, { createdAt: "desc" }],
			include: {
				account: { select: { name: true } },
				toAccount: { select: { name: true } },
			},
		});
		return transactions.map((t) =>
			toTransactionDTO({
				id: t.id,
				type: t.type,
				amount: t.amount,
				category: t.category,
				note: t.note,
				date: t.date,
				accountId: t.accountId,
				accountName: t.account?.name ?? null,
				toAccountId: t.toAccountId,
				toAccountName: t.toAccount?.name ?? null,
				createdAt: t.createdAt,
			}),
		);
	});

export const createAccountFn = createServerFn({ method: "POST" })
	.middleware([requireUserMiddleware])
	.validator((input: CreateAccountInput) => input)
	.handler(async ({ data, context }) => {
		const name = data.name.trim();
		if (!name) throw new Error("Account name is required.");
		if (!ACCOUNT_TYPES.includes(data.type)) {
			throw new Error("Invalid account type.");
		}
		const balance = Number.isFinite(data.balance) ? data.balance : 0;

		const account = await prisma.account.create({
			data: {
				name,
				type: data.type,
				accountNumber: data.accountNumber?.trim() || null,
				balance,
				userId: context.user.id,
			},
		});
		return toAccountDTO(account);
	});

export const updateAccountFn = createServerFn({ method: "POST" })
	.middleware([requireUserMiddleware])
	.validator(
		(input: {
			id: string;
			name: string;
			type: AccountType;
			accountNumber?: string | null;
		}) => input,
	)
	.handler(async ({ data, context }) => {
		const name = data.name.trim();
		if (!name) throw new Error("Account name is required.");
		if (!ACCOUNT_TYPES.includes(data.type)) {
			throw new Error("Invalid account type.");
		}
		const account = await prisma.account.update({
			where: { id: data.id, userId: context.user.id },
			data: {
				name,
				type: data.type,
				accountNumber: data.accountNumber?.trim() || null,
			},
		});
		return toAccountDTO(account);
	});

export const adjustBalanceFn = createServerFn({ method: "POST" })
	.middleware([requireUserMiddleware])
	.validator((input: { id: string; balance: number }) => input)
	.handler(async ({ data, context }) => {
		if (!Number.isFinite(data.balance)) {
			throw new Error("Balance must be a number.");
		}
		const account = await prisma.account.update({
			where: { id: data.id, userId: context.user.id },
			data: { balance: data.balance },
		});
		return toAccountDTO(account);
	});

export const deleteAccountFn = createServerFn({ method: "POST" })
	.middleware([requireUserMiddleware])
	.validator((input: { id: string }) => input)
	.handler(async ({ data, context }) => {
		const deleted = await prisma.account.deleteMany({
			where: { id: data.id, userId: context.user.id },
		});
		if (deleted.count === 0) throw new Error("Account not found.");
		return { deleted: data.id };
	});

export type CreateTransactionInput = {
	type: TransactionType;
	amount: number;
	category: string;
	note?: string | null;
	date?: string;
	accountId?: string | null;
	toAccountId?: string | null;
};

export const createTransactionFn = createServerFn({ method: "POST" })
	.middleware([requireUserMiddleware])
	.validator((input: CreateTransactionInput) => input)
	.handler(async ({ data, context }) => {
		const amount = data.amount;
		if (!Number.isFinite(amount) || amount < 0) {
			throw new Error("Amount must be a positive number.");
		}

		if (data.type === TransactionType.TRANSFER) {
			if (!data.accountId || !data.toAccountId) {
				throw new Error(
					"Transfers require both a source and destination account.",
				);
			}
			if (data.accountId === data.toAccountId) {
				throw new Error("Source and destination accounts must be different.");
			}

			const from = await prisma.account.findFirst({
				where: { id: data.accountId, userId: context.user.id },
			});
			const to = await prisma.account.findFirst({
				where: { id: data.toAccountId, userId: context.user.id },
			});
			if (!from || !to) throw new Error("One of the accounts was not found.");

			const transaction = await prisma.$transaction(async (tx) => {
				await tx.account.update({
					where: { id: from.id },
					data: { balance: from.balance.toNumber() - amount },
				});
				await tx.account.update({
					where: { id: to.id },
					data: { balance: to.balance.toNumber() + amount },
				});
				return tx.transaction.create({
					data: {
						type: TransactionType.TRANSFER,
						amount,
						category: "Transfer",
						note: data.note?.trim() || null,
						date: data.date ? new Date(data.date) : new Date(),
						accountId: from.id,
						toAccountId: to.id,
					},
					include: {
						account: { select: { name: true } },
						toAccount: { select: { name: true } },
					},
				});
			});

			return toTransactionDTO({
				id: transaction.id,
				type: transaction.type,
				amount: transaction.amount,
				category: transaction.category,
				note: transaction.note,
				date: transaction.date,
				accountId: transaction.accountId,
				accountName: transaction.account?.name ?? null,
				toAccountId: transaction.toAccountId,
				toAccountName: transaction.toAccount?.name ?? null,
				createdAt: transaction.createdAt,
			});
		}

		if (!data.accountId) {
			throw new Error("Please select an account.");
		}
		const account = await prisma.account.findFirst({
			where: { id: data.accountId, userId: context.user.id },
		});
		if (!account) throw new Error("Account not found.");

		const category = data.category?.trim();
		if (!category) throw new Error("Please select a category.");

		const categoryName =
			data.type === TransactionType.INCOME
				? INCOME_CATEGORIES.includes(category)
					? category
					: "Other"
				: EXPENSE_CATEGORIES.includes(category)
					? category
					: "Other";

		const delta = data.type === TransactionType.INCOME ? amount : -amount;

		const transaction = await prisma.$transaction(async (tx) => {
			await tx.account.update({
				where: { id: account.id },
				data: { balance: account.balance.toNumber() + delta },
			});
			return tx.transaction.create({
				data: {
					type: data.type,
					amount,
					category: categoryName,
					note: data.note?.trim() || null,
					date: data.date ? new Date(data.date) : new Date(),
					accountId: account.id,
				},
				include: { account: { select: { name: true } } },
			});
		});

		return toTransactionDTO({
			id: transaction.id,
			type: transaction.type,
			amount: transaction.amount,
			category: transaction.category,
			note: transaction.note,
			date: transaction.date,
			accountId: transaction.accountId,
			accountName: transaction.account?.name ?? null,
			toAccountId: null,
			toAccountName: null,
			createdAt: transaction.createdAt,
		});
	});

export const listTransactionsFn = createServerFn({ method: "GET" })
	.middleware([requireUserMiddleware])
	.handler(async ({ context }) => {
		const transactions = await prisma.transaction.findMany({
			where: {
				OR: [
					{ account: { userId: context.user.id } },
					{ toAccount: { userId: context.user.id } },
				],
			},
			orderBy: [{ date: "desc" }, { createdAt: "desc" }],
			include: {
				account: { select: { name: true } },
				toAccount: { select: { name: true } },
			},
		});
		return transactions.map((t) =>
			toTransactionDTO({
				id: t.id,
				type: t.type,
				amount: t.amount,
				category: t.category,
				note: t.note,
				date: t.date,
				accountId: t.accountId,
				accountName: t.account?.name ?? null,
				toAccountId: t.toAccountId,
				toAccountName: t.toAccount?.name ?? null,
				createdAt: t.createdAt,
			}),
		);
	});

export const deleteTransactionFn = createServerFn({ method: "POST" })
	.middleware([requireUserMiddleware])
	.validator((input: { id: string }) => input)
	.handler(async ({ data, context }) => {
		const transaction = await prisma.transaction.findFirst({
			where: {
				id: data.id,
				OR: [
					{ account: { userId: context.user.id } },
					{ toAccount: { userId: context.user.id } },
				],
			},
			include: {
				account: true,
				toAccount: true,
			},
		});
		if (!transaction) throw new Error("Transaction not found.");

		await prisma.$transaction(async (tx) => {
			if (transaction.type === TransactionType.EXPENSE) {
				if (!transaction.accountId || !transaction.account) {
					throw new Error("Expense account is missing.");
				}
				await tx.account.update({
					where: { id: transaction.accountId },
					data: {
						balance:
							transaction.account.balance.toNumber() +
							transaction.amount.toNumber(),
					},
				});
			} else if (transaction.type === TransactionType.INCOME) {
				if (!transaction.accountId || !transaction.account) {
					throw new Error("Income account is missing.");
				}
				await tx.account.update({
					where: { id: transaction.accountId },
					data: {
						balance:
							transaction.account.balance.toNumber() -
							transaction.amount.toNumber(),
					},
				});
			} else if (transaction.type === TransactionType.TRANSFER) {
				const amount = transaction.amount.toNumber();
				if (transaction.account) {
					await tx.account.update({
						where: { id: transaction.account.id },
						data: { balance: transaction.account.balance.toNumber() + amount },
					});
				}
				if (transaction.toAccount) {
					await tx.account.update({
						where: { id: transaction.toAccount.id },
						data: {
							balance: transaction.toAccount.balance.toNumber() - amount,
						},
					});
				}
			}
			await tx.transaction.delete({ where: { id: data.id } });
		});

		return { deleted: data.id };
	});
