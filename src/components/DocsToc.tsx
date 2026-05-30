import { useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface TocItem {
	id: string;
	text: string;
	level: 2 | 3;
}

export function DocsToc() {
	const { pathname } = useLocation();
	const [items, setItems] = useState<TocItem[]>([]);
	const [activeId, setActiveId] = useState("");

	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname not used inside closure but must trigger re-scan on navigation
	useEffect(() => {
		const scan = () => {
			const content = document.querySelector(".docs-content");
			if (!content) return;
			const headings = content.querySelectorAll<HTMLElement>("h2[id], h3[id]");
			const next: TocItem[] = [];
			for (const h of headings) {
				if (h.id) {
					next.push({
						id: h.id,
						text: h.textContent?.trim() ?? "",
						level: h.tagName === "H3" ? 3 : 2,
					});
				}
			}
			setItems(next);
		};

		// Wait one tick for Outlet to render
		const t = setTimeout(scan, 0);
		return () => clearTimeout(t);
	}, [pathname]);

	useEffect(() => {
		if (!items.length) return;

		const obs = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) setActiveId(e.target.id);
				}
			},
			{ rootMargin: "-10% 0% -80% 0%", threshold: 0 },
		);

		for (const { id } of items) {
			const el = document.getElementById(id);
			if (el) obs.observe(el);
		}
		return () => obs.disconnect();
	}, [items]);

	if (!items.length) return null;

	return (
		<aside className="docs-toc">
			<div className="docs-toc-label">[ ON THIS PAGE ]</div>
			<nav>
				{items.map((item) => (
					<a
						key={item.id}
						href={`#${item.id}`}
						className={[
							"docs-toc-link",
							item.level === 3 ? "sub" : "",
							activeId === item.id ? "active" : "",
						]
							.filter(Boolean)
							.join(" ")}
					>
						{item.text}
					</a>
				))}
			</nav>
		</aside>
	);
}
