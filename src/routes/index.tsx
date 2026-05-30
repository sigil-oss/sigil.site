import { createFileRoute } from '@tanstack/react-router'
import { Nav } from '#/components/Nav'
import { Hero } from '#/components/Hero'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  return (
    <>
      <Nav />
      <Hero />
    </>
  )
}
