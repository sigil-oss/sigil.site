import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { DocsSidebar } from "#/components/DocsSidebar";
import { DocsToc } from "#/components/DocsToc";

export const Route = createFileRoute("/docs")({
	component: DocsLayout,
});

function DocsLayout() {
	const [menuOpen, setMenuOpen] = useState(false);
	const { pathname } = useLocation();

	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname triggers close on navigation
	useEffect(() => {
		setMenuOpen(false);
	}, [pathname]);

	return (
		<div className="docs-shell">
			{menuOpen && (
				<div
					className="docs-backdrop"
					onClick={() => setMenuOpen(false)}
					aria-hidden="true"
				/>
			)}
			<DocsSidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
			<div className="docs-main">
				<div className="docs-topbar">
					<button
						className="docs-menu-btn"
						onClick={() => setMenuOpen((o) => !o)}
						aria-label="Toggle navigation"
						aria-expanded={menuOpen}
						type="button"
					>
						<span className="docs-menu-bar" />
						<span className="docs-menu-bar" />
						<span className="docs-menu-bar" />
					</button>
					<span className="docs-topbar-label">SIGIL · INTEGRATION DOCS</span>
					<Link to="/">← Back to site</Link>
				</div>
				<div className="docs-body">
					<Outlet />
					<DocsToc />
				</div>
			</div>
		</div>
	);
}
