import { createFileRoute } from "@tanstack/react-router";
import { Deeplink } from "#/components/Deeplink";
import { DownloadCta } from "#/components/DownloadCta";
import { Features } from "#/components/Features";
import { Footer } from "#/components/Footer";
import { Hero } from "#/components/Hero";
import { Mockup } from "#/components/Mockup";
import { Nav } from "#/components/Nav";
import { Security } from "#/components/Security";
import { Stats } from "#/components/Stats";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	return (
		<>
			<Nav />
			<Hero />
			<Stats />
			<Features />
			<Mockup />
			<Deeplink />
			<Security />
			<DownloadCta />
			<Footer />
		</>
	);
}
