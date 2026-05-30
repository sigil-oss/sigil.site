import {
  HeadContent,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { PostHogProvider } from '@posthog/react'

import TanStackQueryDevtools from '../integrations/tanstack-query/devtools'

import { getLocale } from '#/paraglide/runtime'

import appCss from '../styles.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  beforeLoad: async () => {
    // Other redirect strategies are possible; see
    // https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#offline-redirect
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', getLocale())
    }
  },

  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Sigil — Your QUBIC, on your computer' },
      { name: 'description', content: 'A desktop wallet for QUBIC that stays on your computer. Your keys, your control — no signups, no servers. Mac, Windows, Linux.' },
      { property: 'og:title', content: 'Sigil — Your QUBIC, on your computer' },
      { property: 'og:description', content: 'A desktop wallet that stays yours. Your keys never leave your device.' },
      { property: 'og:image', content: '/og-image-dark.png' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Sigil — Your QUBIC, on your computer' },
      { name: 'twitter:description', content: 'A desktop wallet that stays yours. Your keys never leave your device.' },
      { name: 'twitter:image', content: '/og-image-dark.png' },
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&family=Space+Mono:wght@400;700&family=Doto:wght@400;700&display=swap' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()}>
      <head>
        <HeadContent />
      </head>
      <body>
        <PostHogProvider
          apiKey={import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN || ''}
          options={{
            api_host: '/ingest',
            ui_host: import.meta.env.VITE_PUBLIC_POSTHOG_HOST || 'https://us.posthog.com',
            defaults: '2025-05-24',
            capture_exceptions: true,
            debug: import.meta.env.DEV,
          }}
        >
          {children}
        </PostHogProvider>
        <TanStackDevtools
          config={{
            position: 'bottom-right',
          }}
          plugins={[
            {
              name: 'Tanstack Router',
              render: <TanStackRouterDevtoolsPanel />,
            },
            TanStackQueryDevtools,
          ]}
        />
        <Scripts />
      </body>
    </html>
  )
}
