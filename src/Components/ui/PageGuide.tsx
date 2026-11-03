import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Lightbulb, X } from 'lucide-react'

import { GUIDE_PREFIX, GUIDES_RESET_EVENT } from './guideStorage'

const read = (id: string) => {
  try {
    return localStorage.getItem(GUIDE_PREFIX + id) === 'hidden'
  } catch {
    return false
  }
}

type PageGuideProps = {
  /** Unique per page; remembers when the visitor has dismissed it. */
  id: string
  title: string
  children: ReactNode
  steps?: string[]
}

/** Dismissible "what is this page?" panel shown once at the top of a tool page. */
export function PageGuide({ id, title, children, steps }: PageGuideProps) {
  const [hidden, setHidden] = useState(() => read(id))

  useEffect(() => {
    const onReset = () => setHidden(false)
    window.addEventListener(GUIDES_RESET_EVENT, onReset)
    return () => window.removeEventListener(GUIDES_RESET_EVENT, onReset)
  }, [])

  if (hidden) return null

  const dismiss = () => {
    try {
      localStorage.setItem(GUIDE_PREFIX + id, 'hidden')
    } catch {
      /* storage unavailable: it simply reappears next visit */
    }
    setHidden(true)
  }

  return (
    <aside
      aria-label={title}
      className="animate-rise relative rounded-2xl border border-brand/25 bg-brand-soft p-5 pr-12 sm:p-6 sm:pr-14"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Hide this tip"
        className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg text-ink-2 transition-colors hover:bg-surface/60 hover:text-ink"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3.5">
        <span className="mt-0.5 hidden h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand text-brand-fg sm:grid">
          <Lightbulb className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="text-base font-bold text-ink">{title}</h2>
          <div className="mt-1.5 text-sm leading-relaxed text-ink-2">{children}</div>
          {steps && (
            <ol className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s} className="flex items-start gap-2.5 text-sm text-ink">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-xs font-bold text-brand-fg">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </aside>
  )
}
