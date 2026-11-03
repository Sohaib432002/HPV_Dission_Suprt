import { Suspense, useEffect } from 'react'
import { Spinner } from '../ui'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../Navbar'
import Footer from '../Footer'
import { ErrorBoundary } from './ErrorBountry'

export default function Layout() {
  const { pathname } = useLocation()

  // Start every page at the top when navigating.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col bg-bg text-ink">
      <a
        href="#main"
        className="sr-only z-[90] rounded-lg bg-brand px-4 py-2 font-semibold text-brand-fg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <ErrorBoundary key={pathname}>
          <Suspense fallback={<Spinner label="Loading…" className="min-h-[60vh]" />}>
            <Outlet />
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  )
}
