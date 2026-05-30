import { createServerFn } from "@tanstack/react-start";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
let _cache: { data: SponsorData; at: number } | null = null;

export const DONATION_IDENTITY =
	"UVYAOYTNYCRBVFBHNFIJUEOUEPEDIDUWWEAXKFSJEBJVASCQEROJOVOEEATL";

const ARCHIVE_URL = "https://rpc.qubic.org/query/v1";
const PAGE_SIZE = 100;

interface QubicTx {
	hash?: string;
	source?: string;
	destination?: string;
	amount?: string;
	moneyFlew?: boolean;
	timestamp?: string | number | null;
}

export interface Sponsor {
	identity: string;
	name: string;
	/** Total QU donated — serializable number (safe up to 2^53 QU) */
	amountQu: number;
}

export interface SponsorData {
	sponsors: Sponsor[];
	totalQu: number;
	donationCount: number;
}

async function fetchAllTransactions(): Promise<QubicTx[]> {
	const all: QubicTx[] = [];
	let offset = 0;
	while (true) {
		const res = await fetch(`${ARCHIVE_URL}/getTransactionsForIdentity`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				identity: DONATION_IDENTITY,
				pagination: { size: PAGE_SIZE, offset },
			}),
		});
		if (!res.ok) break;
		const data = (await res.json()) as { transactions?: QubicTx[] };
		const page = data.transactions ?? [];
		all.push(...page);
		if (page.length < PAGE_SIZE) break;
		offset += PAGE_SIZE;
	}
	return all;
}

export const fetchSponsorData = createServerFn().handler(
	async (): Promise<SponsorData> => {
		if (_cache && Date.now() - _cache.at < CACHE_TTL) return _cache.data;
		try {
			const [txs, nameMap] = await Promise.all([
				fetchAllTransactions(),
				fetch(
					"https://raw.githubusercontent.com/sigil-oss/sigil.app/main/sponsor-names.json",
				)
					.then((r) => (r.ok ? r.json() : {}))
					.catch(() => ({})) as Promise<Record<string, string>>,
			]);

			const totals = new Map<string, number>();
			let donationCount = 0;

			for (const tx of txs) {
				if (tx.destination !== DONATION_IDENTITY) continue;
				if (!tx.moneyFlew) continue;
				if (!tx.source || !tx.amount) continue;
				totals.set(tx.source, (totals.get(tx.source) ?? 0) + Number(tx.amount));
				donationCount++;
			}

			const sponsors = [...totals.entries()]
				.sort(([, a], [, b]) => b - a)
				.map(([identity, amountQu]) => ({
					identity,
					name:
						(nameMap as Record<string, string>)[identity] ??
						`${identity.slice(0, 8)}…${identity.slice(-4)}`,
					amountQu,
				}));

			const totalQu = sponsors.reduce((s, sp) => s + sp.amountQu, 0);
			const data = { sponsors, totalQu, donationCount };
			_cache = { data, at: Date.now() };
			return data;
		} catch {
			return { sponsors: [], totalQu: 0, donationCount: 0 };
		}
	},
);

export function formatQu(qu: number): string {
	if (qu >= 1_000_000_000) return `${(qu / 1_000_000_000).toFixed(1)}B QU`;
	if (qu >= 1_000_000) return `${(qu / 1_000_000).toFixed(1)}M QU`;
	if (qu >= 1_000) return `${(qu / 1_000).toFixed(1)}k QU`;
	return `${qu} QU`;
}
