import { createFileRoute } from '@tanstack/react-router'
import { Nav } from '#/components/Nav'
import { Hero } from '#/components/Hero'
import { Stats } from '#/components/Stats'
import { Features } from '#/components/Features'
import { Mockup } from '#/components/Mockup'
import { Deeplink } from '#/components/Deeplink'
import { Security } from '#/components/Security'
import { Download } from '#/components/Download'
import { Footer } from '#/components/Footer'

export const Route = createFileRoute('/')({ component: Home })

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
      <Download />
      <Footer />
    </>
  )
}
