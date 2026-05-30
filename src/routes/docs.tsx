import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { DocsSidebar } from "#/components/DocsSidebar";
import { DocsToc } from "#/components/DocsToc";

export const Route = createFileRoute("/docs")({
	component: DocsLayout,
});

function DocsLayout() {
	return (
		<div className="docs-shell">
			<DocsSidebar />
			<div className="docs-main">
				<div className="docs-topbar">
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
