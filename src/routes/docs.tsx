import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { DocsSidebar } from "#/components/DocsSidebar";
import { Nav } from "#/components/Nav";

export const Route = createFileRoute("/docs")({
	component: DocsLayout,
});

function DocsLayout() {
	return (
		<>
			<Nav />
			<div className="docs-shell">
				<DocsSidebar />
				<main className="docs-main">
					<div className="docs-topbar">
						<span className="docs-topbar-label">SIGIL · INTEGRATION DOCS</span>
						<Link to="/">← Back to site</Link>
					</div>
					<Outlet />
				</main>
			</div>
		</>
	);
}
