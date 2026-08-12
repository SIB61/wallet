import { useCallback, useEffect, useState } from "react";
import type { TransactionType } from "@/generated/prisma/enums";
import {
	type AccountDTO,
	type CategoryDTO,
	createCategoryFn,
	deleteCategoryFn,
	getAccountFn,
	listAccountsFn,
	listAccountTransactionsFn,
	listCategoriesFn,
	listTransactionsFn,
	listTransactionsPageFn,
	type TransactionDTO,
	type TransactionPage,
	updateCategoryFn,
} from "@/lib/wallet";

export function useAccount(accountId: string) {
	const [data, setData] = useState<AccountDTO | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loaded, setLoaded] = useState(false);

	const refresh = useCallback(async () => {
		try {
			const account = await getAccountFn({ data: { id: accountId } });
			setData(account);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load account.");
		} finally {
			setLoaded(true);
		}
	}, [accountId]);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	return { account: data, error, loaded, refresh };
}

export function useAccountTransactions(accountId: string) {
	const [data, setData] = useState<TransactionDTO[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loaded, setLoaded] = useState(false);

	const refresh = useCallback(async () => {
		try {
			const transactions = await listAccountTransactionsFn({
				data: { accountId },
			});
			setData(transactions);
			setError(null);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load transactions.",
			);
		} finally {
			setLoaded(true);
		}
	}, [accountId]);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	return { transactions: data, error, loaded, refresh };
}

export function useAccounts() {
	const [data, setData] = useState<AccountDTO[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loaded, setLoaded] = useState(false);

	const refresh = useCallback(async () => {
		try {
			const accounts = await listAccountsFn();
			setData(accounts);
			setError(null);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load accounts.");
		} finally {
			setLoaded(true);
		}
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	return { accounts: data, error, loaded, refresh };
}

export function useTransactions() {
	const [data, setData] = useState<TransactionDTO[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loaded, setLoaded] = useState(false);

	const refresh = useCallback(async () => {
		try {
			const transactions = await listTransactionsFn();
			setData(transactions);
			setError(null);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load transactions.",
			);
		} finally {
			setLoaded(true);
		}
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	return { transactions: data, error, loaded, refresh };
}

export function useTransactionPage({
	accountId,
	type,
	pageSize = 25,
}: {
	accountId?: string;
	type?: TransactionType;
	pageSize?: number;
}) {
	const [data, setData] = useState<TransactionPage | null>(null);
	const [page, setPage] = useState(1);
	const [error, setError] = useState<string | null>(null);
	const [loaded, setLoaded] = useState(false);

	const refresh = useCallback(async () => {
		try {
			const result = await listTransactionsPageFn({
				data: { page, pageSize, accountId, type },
			});
			setData(result);
			setError(null);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load transactions.",
			);
		} finally {
			setLoaded(true);
		}
	}, [page, pageSize, accountId, type]);

	useEffect(() => {
		setLoaded(false);
		void refresh();
	}, [refresh]);

	return {
		transactions: data?.items ?? [],
		total: data?.total ?? 0,
		page,
		totalPages: data?.totalPages ?? 1,
		error,
		loaded,
		setPage,
		refresh,
	};
}

export function useCategories() {
	const [data, setData] = useState<CategoryDTO[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loaded, setLoaded] = useState(false);

	const refresh = useCallback(async () => {
		try {
			const categories = await listCategoriesFn();
			setData(categories);
			setError(null);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to load categories.",
			);
		} finally {
			setLoaded(true);
		}
	}, []);

	useEffect(() => {
		void refresh();
	}, [refresh]);

	const create = useCallback(
		async (input: { name: string; type: TransactionType }) => {
			const category = await createCategoryFn({ data: input });
			setData((prev) => [...prev, category]);
			return category;
		},
		[],
	);

	const update = useCallback(async (input: { id: string; name: string }) => {
		const category = await updateCategoryFn({ data: input });
		setData((prev) => prev.map((c) => (c.id === category.id ? category : c)));
		return category;
	}, []);

	const remove = useCallback(async (id: string) => {
		await deleteCategoryFn({ data: { id } });
		setData((prev) => prev.filter((c) => c.id !== id));
	}, []);

	const categoriesByType = (type: TransactionType) =>
		data.filter((c) => c.type === type);

	return {
		categories: data,
		error,
		loaded,
		refresh,
		create,
		update,
		remove,
		categoriesByType,
	};
}
