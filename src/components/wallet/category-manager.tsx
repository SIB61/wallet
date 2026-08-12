import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCategories } from "@/components/wallet/use-wallet-data";
import type { TransactionType } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";
import type { CategoryDTO } from "@/lib/wallet";

const TYPE_TABS: { value: TransactionType; label: string }[] = [
	{ value: "EXPENSE", label: "Expense" },
	{ value: "INCOME", label: "Income" },
];

export function CategoryManager({
	open,
	initialType = "EXPENSE",
	onClose,
	onSelect,
}: {
	open: boolean;
	initialType?: TransactionType;
	onClose: () => void;
	onSelect?: (name: string) => void;
}) {
	const { categories, loaded, create, update, remove } = useCategories();
	const [tab, setTab] = useState<TransactionType>(initialType);
	const [newName, setNewName] = useState("");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editName, setEditName] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [busy, setBusy] = useState(false);
	const editInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open) {
			setTab(initialType);
			setNewName("");
			setEditingId(null);
			setError(null);
		}
	}, [open, initialType]);

	useEffect(() => {
		if (editingId) editInputRef.current?.focus();
	}, [editingId]);

	if (!open) return null;

	const list = categories.filter((c) => c.type === tab);

	async function handleCreate(event: React.FormEvent) {
		event.preventDefault();
		setError(null);
		const name = newName.trim();
		if (!name) return;
		setBusy(true);
		try {
			const category = await create({ name, type: tab });
			setNewName("");
			onSelect?.(category.name);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to add category.");
		} finally {
			setBusy(false);
		}
	}

	async function handleRename(category: CategoryDTO) {
		if (editingId !== category.id) {
			setEditingId(category.id);
			setEditName(category.name);
			setError(null);
			return;
		}
		setError(null);
		const name = editName.trim();
		if (!name || name === category.name) {
			setEditingId(null);
			return;
		}
		setBusy(true);
		try {
			await update({ id: category.id, name });
			setEditingId(null);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to rename category.",
			);
		} finally {
			setBusy(false);
		}
	}

	async function handleDelete(category: CategoryDTO) {
		if (
			!confirm(
				`Delete the "${category.name}" category? Existing transactions keep their label.`,
			)
		) {
			return;
		}
		setError(null);
		setBusy(true);
		try {
			await remove(category.id);
			if (editingId === category.id) setEditingId(null);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to delete category.",
			);
		} finally {
			setBusy(false);
		}
	}

	return (
		<div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center">
			<button
				type="button"
				aria-label="Close category manager"
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
			/>
			<div className="relative flex max-h-[85vh] w-full max-w-lg flex-col gap-4 rounded-t-2xl border border-[var(--line)] bg-[var(--surface-strong)] p-5 shadow-[0_8px_40px_var(--shadow-strong)] sm:rounded-2xl">
				<div className="flex items-center justify-between gap-3">
					<div>
						<p className="m-0 text-xs font-semibold uppercase tracking-wide text-[var(--kicker)]">
							Customize
						</p>
						<h2 className="mt-0.5 text-lg font-bold text-[var(--sea-ink)]">
							Manage categories
						</h2>
					</div>
					<Button variant="ghost" size="sm" onClick={onClose}>
						Close
					</Button>
				</div>

				<div className="inline-flex w-fit rounded-xl border border-[var(--line)] bg-[var(--chip-bg)] p-1">
					{TYPE_TABS.map((option) => (
						<button
							key={option.value}
							type="button"
							onClick={() => {
								setTab(option.value);
								setEditingId(null);
								setError(null);
							}}
							className={cn(
								"rounded-lg px-4 py-1.5 text-sm font-semibold transition",
								tab === option.value
									? "bg-[var(--surface-strong)] text-[var(--lagoon-deep)] shadow-[0_1px_3px_var(--shadow-soft-08)]"
									: "text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)]",
							)}
						>
							{option.label}
						</button>
					))}
				</div>

				<form onSubmit={handleCreate} className="flex items-center gap-2">
					<Input
						value={newName}
						onChange={(e) => setNewName(e.target.value)}
						placeholder={`New ${tab.toLowerCase()} category…`}
						className="h-9"
					/>
					<Button type="submit" disabled={busy || !newName.trim()}>
						Add
					</Button>
				</form>

				{error && (
					<p className="m-0 text-sm font-medium text-[#c0392b]">{error}</p>
				)}

				<ul className="flex max-h-72 flex-col divide-y divide-[var(--line)] overflow-y-auto rounded-xl border border-[var(--line)]">
					{!loaded ? (
						<li className="px-4 py-3 text-sm text-[var(--sea-ink-soft)]">
							Loading categories…
						</li>
					) : list.length === 0 ? (
						<li className="px-4 py-3 text-sm text-[var(--sea-ink-soft)]">
							No {tab.toLowerCase()} categories yet.
						</li>
					) : (
						list.map((category) => (
							<li
								key={category.id}
								className="flex items-center gap-2 px-3 py-2"
							>
								{editingId === category.id ? (
									<input
										ref={editInputRef}
										value={editName}
										onChange={(e) => setEditName(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												void handleRename(category);
											}
											if (e.key === "Escape") setEditingId(null);
										}}
										className="h-8 w-full min-w-0 flex-1 rounded-md border border-input bg-transparent px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
									/>
								) : (
									<span className="min-w-0 flex-1 truncate text-sm font-medium text-[var(--sea-ink)]">
										{category.name}
									</span>
								)}
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={() => void handleRename(category)}
									disabled={busy}
									aria-label={`Rename ${category.name}`}
								>
									{editingId === category.id ? (
										<CheckIcon className="h-4 w-4" />
									) : (
										<PencilIcon className="h-4 w-4" />
									)}
								</Button>
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={() => void handleDelete(category)}
									disabled={busy}
									className="text-[var(--sea-ink-soft)] hover:text-[#c0392b]"
									aria-label={`Delete ${category.name}`}
								>
									<TrashIcon className="h-4 w-4" />
								</Button>
							</li>
						))
					)}
				</ul>

				{onSelect && (
					<p className="m-0 text-xs text-[var(--sea-ink-soft)]">
						Tap a category to use it in the form below.
					</p>
				)}
			</div>
		</div>
	);
}

function PencilIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
			<path d="m15 5 4 4" />
		</svg>
	);
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="M20 6 9 17l-5-5" />
		</svg>
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
