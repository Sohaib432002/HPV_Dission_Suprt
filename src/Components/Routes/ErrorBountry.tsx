import { Component, type ReactNode } from 'react'
import { Compass, TriangleAlert } from 'lucide-react'
import { Button, LinkButton } from '../ui'

interface ErrorBoundaryProps {
  children?: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
}

/** Catches render errors below it so one broken page never blanks the whole app. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error('ErrorBoundary caught an error:', error, info)
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-danger-soft text-danger">
          <TriangleAlert className="h-6 w-6" aria-hidden />
        </span>
        <h1 className="mt-5 text-2xl font-extrabold text-ink">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted">
          {this.state.error.message || 'An unexpected error occurred. Please try again.'}
        </p>
        <div className="mt-6 flex gap-3">
          <Button onClick={() => this.setState({ error: null })}>Try again</Button>
          <LinkButton to="/" variant="secondary">
            Back to home
          </LinkButton>
        </div>
      </div>
    )
  }
}

/** 404 page for unknown routes. */
export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-soft text-brand">
        <Compass className="h-6 w-6" aria-hidden />
      </span>
      <p className="mt-5 font-display text-6xl font-extrabold text-brand">404</p>
      <h1 className="mt-2 text-2xl font-extrabold text-ink">Page not found</h1>
      <p className="mt-2 text-sm text-muted">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <LinkButton to="/" className="mt-6">
        Back to home
      </LinkButton>
    </div>
  )
}
