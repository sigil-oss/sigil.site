import { PostHogProvider } from "@posthog/react";
import { TanStackDevtools } from "@tanstack/react-devtools";
import type { QueryClient } from "@tanstack/react-query";
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import { getLocale } from "#/paraglide/runtime";
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools";
import appCss from "../styles.css?url";

interface MyRouterContext {
	queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async () => {
		// Other redirect strategies are possible; see
		// https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#offline-redirect
		if (typeof document !== "undefined") {
			document.documentElement.setAttribute("lang", getLocale());
		}
	},

	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1" },
			{ title: "Sigil — QUBIC Desktop Wallet for Mac, Windows & Linux" },
			{
				name: "description",
				content:
					"Sigil is a free, open-source QUBIC desktop wallet for Mac, Windows, and Linux. Send, receive, stake with Qearn, sign messages, and connect dApps — your keys never leave your device.",
			},
			{ name: "theme-color", content: "#000000" },
			{ name: "author", content: "Sigil OSS" },
			{ property: "og:site_name", content: "Sigil" },
			{ property: "og:type", content: "website" },
			{ property: "og:url", content: "https://sigilwallet.org" },
			{
				property: "og:title",
				content: "Sigil — QUBIC Desktop Wallet for Mac, Windows & Linux",
			},
			{
				property: "og:description",
				content:
					"Free, open-source QUBIC wallet. Send, stake with Qearn, sign messages, connect dApps — your keys never leave your device.",
			},
			{
				property: "og:image",
				content: "https://www.sigilwallet.org/og-image-dark.png",
			},
			{ property: "og:image:width", content: "1200" },
			{ property: "og:image:height", content: "630" },
			{ property: "og:locale", content: "en_US" },
			{ name: "twitter:card", content: "summary_large_image" },
			{
				name: "twitter:title",
				content: "Sigil — QUBIC Desktop Wallet for Mac, Windows & Linux",
			},
			{
				name: "twitter:description",
				content:
					"Free, open-source QUBIC wallet. Send, stake with Qearn, sign messages, connect dApps — your keys never leave your device.",
			},
			{
				name: "twitter:image",
				content: "https://www.sigilwallet.org/og-image-dark.png",
			},
		],
		links: [
			{ rel: "stylesheet", href: appCss },
			{ rel: "canonical", href: "https://sigilwallet.org" },
			{ rel: "manifest", href: "/manifest.json" },
			{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
			{
				rel: "icon",
				type: "image/png",
				sizes: "32x32",
				href: "/favicon-32.png",
			},
			{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous",
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Space+Mono:wght@400;700&family=Doto:wght@400;700&display=swap",
			},
		],
		scripts: [
			{
				type: "application/ld+json",
				children: JSON.stringify([
					{
						"@context": "https://schema.org",
						"@type": "SoftwareApplication",
						name: "Sigil",
						applicationCategory: "FinanceApplication",
						applicationSubCategory: "Cryptocurrency Wallet",
						operatingSystem: "macOS, Windows, Linux",
						offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
						description:
							"A free, open-source desktop wallet for QUBIC. Send, receive, stake with Qearn, call smart contracts, sign messages, and connect web dApps via the sigil:// deep-link protocol.",
						url: "https://sigilwallet.org",
						downloadUrl: "https://sigilwallet.org/download",
						license: "https://github.com/sigil-oss/sigil.app/blob/main/LICENSE",
						isAccessibleForFree: true,
						image: "https://www.sigilwallet.org/og-image-dark.png",
					},
					{
						"@context": "https://schema.org",
						"@type": "WebSite",
						name: "Sigil",
						url: "https://sigilwallet.org",
					},
				]),
			},
		],
	}),
	shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang={getLocale()}>
			<head>
				<HeadContent />
			</head>
			<body>
				<PostHogProvider
					apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN || ""}
					options={{
						api_host: "/ingest",
						ui_host:
							import.meta.env.VITE_PUBLIC_POSTHOG_HOST ||
							"https://us.posthog.com",
						defaults: "2025-05-24",
						capture_exceptions: true,
						debug: import.meta.env.DEV,
					}}
				>
					{children}
				</PostHogProvider>
				<TanStackDevtools
					config={{ position: "bottom-right" }}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
