import { useEffect, useState } from 'react'

/** Animated success check used when a pipeline stage finishes. */
const CompletedAnimation = ({ label = 'Completed' }: { label?: string }) => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div role="status" className="flex flex-col items-center gap-3 py-4">
      <span
        className={`grid h-14 w-14 place-items-center rounded-full bg-brand-soft text-brand transition-all duration-500 ${
          show ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} aria-hidden>
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-sm font-semibold text-ink">{label}</span>
    </div>
  )
}

export default CompletedAnimation
