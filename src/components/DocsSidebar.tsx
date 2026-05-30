import { Link } from "@tanstack/react-router";

interface NavSection {
	section: string;
	links: { to: string; label: string }[];
}

const NAV: NavSection[] = [
	{
		section: "[ GETTING STARTED ]",
		links: [{ to: "/docs", label: "Overview & protocol" }],
	},
	{
		section: "[ REFERENCE ]",
		links: [
			{ to: "/docs/payload", label: "Payload & callback" },
			{ to: "/docs/request-types", label: "Request types" },
		],
	},
	{
		section: "[ SDK ]",
		links: [{ to: "/docs/sdk", label: "@sigil-oss/connect" }],
	},
	{
		section: "[ MORE ]",
		links: [{ to: "/docs/reference", label: "Errors & examples" }],
	},
];

export function DocsSidebar() {
	return (
		<aside className="docs-aside">
			<Link to="/" className="docs-brand">
				<img src="/favicon.svg" alt="Sigil" />
				<div>
					<div className="docs-brand-name">SIGIL</div>
					<span className="docs-brand-sub">DOCS · v1</span>
				</div>
			</Link>
			<nav className="docs-nav">
				{NAV.map(({ section, links }) => (
					<div key={section}>
						<div className="docs-nav-section">{section}</div>
						{links.map(({ to, label }) => (
							<Link
								key={to}
								to={to}
								className="docs-nav-link"
								activeProps={{ className: "docs-nav-link active" }}
								activeOptions={{ exact: to === "/docs" }}
							>
								{label}
							</Link>
						))}
					</div>
				))}
			</nav>
		</aside>
	);
}
