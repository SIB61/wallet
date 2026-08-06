import { useCallback, useEffect, useState } from "react";

import {
	getAccountFn,
	listAccountTransactionsFn,
	listAccountsFn,
	listTransactionsFn,
	type AccountDTO,
	type TransactionDTO,
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