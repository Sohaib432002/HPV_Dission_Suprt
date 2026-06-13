import  { Component, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="pt-16 p-4 container mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-red-600">Oops!</h1>
          <p className="mb-4">
            {this.state.error?.message || 'Something went wrong. Please try again later.'}
          </p>
          {this.state.error?.stack && (
            <pre className="w-full p-4 overflow-x-auto text-left bg-gray-100 rounded">
              <code>{this.state.error.stack}</code>
            </pre>
          )}
        </main>
      )
    }

    return this.props.children
  }
}
