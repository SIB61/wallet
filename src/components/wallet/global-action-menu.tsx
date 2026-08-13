import { useEffect, useRef, useState } from "react";
import { AddAccountSheet } from "./add-account-sheet";
import { AddTransactionSheet } from "./add-transaction-sheet";
import { useAccounts, useCategories } from "./use-wallet-data";
import { cn } from "@/lib/utils";

export function GlobalActionMenu() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [addAccountOpen, setAddAccountOpen] = useState(false);
	const [addTransactionOpen, setAddTransactionOpen] = useState(false);
	const menuRef = useRef<HTMLDivElement>(null);
	
	const { accounts } = useAccounts();
	const { categories } = useCategories();

	useEffect(() => {
		if (!menuOpen) return;
		function onPointerDown(event: PointerEvent) {
			if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
				setMenuOpen(false);
			}
		}
		function onKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") setMenuOpen(false);
		}
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [menuOpen]);

	function handleCreated() {
		window.dispatchEvent(new CustomEvent("wallet-data-changed"));
	}

	return (
		<>
			<div ref={menuRef} className="fixed bottom-20 right-4 z-40 md:bottom-6 md:right-6">
				{menuOpen && (
					<div className="absolute bottom-full right-0 mb-4 flex flex-col gap-2 w-48 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--menu-solid)] p-1.5 shadow-lg">
						<button
							type="button"
							onClick={() => {
								setMenuOpen(false);
								setAddTransactionOpen(true);
							}}
							className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
						>
							Add Transaction
						</button>
						<button
							type="button"
							onClick={() => {
								setMenuOpen(false);
								setAddAccountOpen(true);
							}}
							className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-[var(--sea-ink-soft)] transition hover:bg-[var(--link-bg-hover)] hover:text-[var(--sea-ink)]"
						>
							Add Account
						</button>
					</div>
				)}
				
				<button
					type="button"
					onClick={() => setMenuOpen((open) => !open)}
					aria-label="Add new"
					title="Add new"
					className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface-strong)] text-[var(--lagoon-deep)] shadow-[0_2px_8px_var(--shadow-soft-08)] backdrop-blur transition hover:bg-[var(--lagoon-12)] active:scale-95"
				>
					<PlusIcon className={cn("h-6 w-6 transition-transform", menuOpen ? "rotate-45" : "")} />
				</button>
			</div>

			<AddAccountSheet
				open={addAccountOpen}
				onClose={() => setAddAccountOpen(false)}
				onCreated={handleCreated}
			/>
			
			<AddTransactionSheet
				open={addTransactionOpen}
				accounts={accounts}
				categories={categories}
				onClose={() => setAddTransactionOpen(false)}
				onCreated={handleCreated}
			/>
		</>
	);
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			aria-hidden="true"
			{...props}
		>
			<path d="M12 5v14" />
			<path d="M5 12h14" />
		</svg>
	);
}
