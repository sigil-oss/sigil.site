<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Sigil landing site. `PostHogProvider` was added to the root shell component (`src/routes/__root.tsx`) so that every page automatically captures pageviews, sessions, and web vitals. A reverse proxy was configured in `vite.config.ts` so PostHog requests route through `/ingest` rather than directly to PostHog servers, improving reliability and ad-blocker resistance. Custom event tracking was added to four components covering the landing page's primary conversion points: download button clicks (with platform and location properties), hero CTA clicks, navigation link clicks, and external link clicks to GitHub and the changelog.

| Event | Description | File |
|---|---|---|
| `download_clicked` | Platform-specific download button clicked in the download section. Properties: `platform` (mac, windows, linux), `location` (download_section) | `src/components/Download.tsx` |
| `hero_cta_clicked` | "Download free" CTA clicked in the hero section. Properties: `location` (hero) | `src/components/Hero.tsx` |
| `source_code_clicked` | "View source" GitHub link clicked from the hero. Properties: `location` (hero) | `src/components/Hero.tsx` |
| `external_link_clicked` | GitHub / Changelog external links clicked from the footer. Properties: `location` (footer), `link` (github, changelog) | `src/components/Footer.tsx` |
| `nav_link_clicked` | Navigation link clicked. Properties: `section` (features, apps, security, download, docs, brand) | `src/components/Nav.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1647355)
- [Download clicks over time](/insights/IdJbJa6n)
- [Downloads by platform](/insights/n79xaUwb)
- [GitHub / source code link clicks](/insights/JbstwRW8)
- [Nav section clicks](/insights/6WGg4nVV)
- [Hero CTA vs download section clicks](/insights/Bu9a86s2)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
