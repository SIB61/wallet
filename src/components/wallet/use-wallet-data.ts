import { useCallback, useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
	const { data, error, isSuccess, refetch } = useQuery({
		queryKey: ["account", accountId],
		queryFn: () => getAccountFn({ data: { id: accountId } }),
	});

	useEffect(() => {
		const listener = () => { void refetch(); };
		window.addEventListener("wallet-data-changed", listener);
		return () => window.removeEventListener("wallet-data-changed", listener);
	}, [refetch]);

	return { 
		account: data ?? null, 
		error: error ? (error as Error).message : null, 
		loaded: isSuccess, 
		refresh: refetch 
	};
}

export function useAccountTransactions(accountId: string) {
	const { data, error, isSuccess, refetch } = useQuery({
		queryKey: ["accountTransactions", accountId],
		queryFn: () => listAccountTransactionsFn({ data: { accountId } }),
	});

	useEffect(() => {
		const listener = () => { void refetch(); };
		window.addEventListener("wallet-data-changed", listener);
		return () => window.removeEventListener("wallet-data-changed", listener);
	}, [refetch]);

	return { 
		transactions: data ?? [], 
		error: error ? (error as Error).message : null, 
		loaded: isSuccess, 
		refresh: refetch 
	};
}

export function useAccounts() {
	const { data, error, isSuccess, refetch } = useQuery({
		queryKey: ["accounts"],
		queryFn: () => listAccountsFn(),
	});

	useEffect(() => {
		const listener = () => { void refetch(); };
		window.addEventListener("wallet-data-changed", listener);
		return () => window.removeEventListener("wallet-data-changed", listener);
	}, [refetch]);

	return { 
		accounts: data ?? [], 
		error: error ? (error as Error).message : null, 
		loaded: isSuccess, 
		refresh: refetch 
	};
}

export function useTransactions() {
	const { data, error, isSuccess, refetch } = useQuery({
		queryKey: ["transactions"],
		queryFn: () => listTransactionsFn(),
	});

	useEffect(() => {
		const listener = () => { void refetch(); };
		window.addEventListener("wallet-data-changed", listener);
		return () => window.removeEventListener("wallet-data-changed", listener);
	}, [refetch]);

	return { 
		transactions: data ?? [], 
		error: error ? (error as Error).message : null, 
		loaded: isSuccess, 
		refresh: refetch 
	};
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
	const [page, setPage] = useState(1);
	
	const { data, error, isSuccess, refetch } = useQuery({
		queryKey: ["transactionsPage", page, pageSize, accountId, type],
		queryFn: () => listTransactionsPageFn({ data: { page, pageSize, accountId, type } }),
	});

	useEffect(() => {
		const listener = () => { void refetch(); };
		window.addEventListener("wallet-data-changed", listener);
		return () => window.removeEventListener("wallet-data-changed", listener);
	}, [refetch]);

	return {
		transactions: data?.items ?? [],
		total: data?.total ?? 0,
		page,
		totalPages: data?.totalPages ?? 1,
		error: error ? (error as Error).message : null,
		loaded: isSuccess,
		setPage,
		refresh: refetch,
	};
}

export function useCategories() {
	const queryClient = useQueryClient();
	const { data, error, isSuccess, refetch } = useQuery({
		queryKey: ["categories"],
		queryFn: () => listCategoriesFn(),
	});

	useEffect(() => {
		const listener = () => { void refetch(); };
		window.addEventListener("wallet-data-changed", listener);
		return () => window.removeEventListener("wallet-data-changed", listener);
	}, [refetch]);

	const createMut = useMutation({
		mutationFn: (input: { name: string; type: TransactionType }) => createCategoryFn({ data: input }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] })
	});

	const updateMut = useMutation({
		mutationFn: (input: { id: string; name: string }) => updateCategoryFn({ data: input }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] })
	});

	const removeMut = useMutation({
		mutationFn: (id: string) => deleteCategoryFn({ data: { id } }),
		onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] })
	});

	const create = useCallback(async (input: { name: string; type: TransactionType }) => {
		return createMut.mutateAsync(input);
	}, [createMut]);

	const update = useCallback(async (input: { id: string; name: string }) => {
		return updateMut.mutateAsync(input);
	}, [updateMut]);

	const remove = useCallback(async (id: string) => {
		await removeMut.mutateAsync(id);
	}, [removeMut]);

	const categoriesByType = (type: TransactionType) => (data ?? []).filter((c) => c.type === type);

	return {
		categories: data ?? [],
		error: error ? (error as Error).message : null,
		loaded: isSuccess,
		refresh: refetch,
		create,
		update,
		remove,
		categoriesByType,
	};
}
