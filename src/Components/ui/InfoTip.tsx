import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { CircleHelp } from 'lucide-react'

/**
 * Small "?" button that explains a term in plain words.
 * Opens on hover, keyboard focus or tap; Escape or an outside tap closes it.
 */
export function InfoTip({ children, label = 'What does this mean?' }: { children: ReactNode; label?: string }) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [shift, setShift] = useState(0)
  const root = useRef<HTMLSpanElement>(null)
  const tip = useRef<HTMLSpanElement>(null)

  // Keep the bubble inside the screen on narrow devices.
  useLayoutEffect(() => {
    if (!open || !tip.current) return
    tip.current.style.transform = 'translateX(-50%)'
    const rect = tip.current.getBoundingClientRect()
    const margin = 12
    if (rect.left < margin) setShift(margin - rect.left)
    else if (rect.right > window.innerWidth - margin) setShift(window.innerWidth - margin - rect.right)
    else setShift(0)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
    }
  }, [open])

  return (
    <span
      ref={root}
      className="relative inline-flex align-middle"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="grid h-5 w-5 place-items-center rounded-full text-muted transition-colors hover:text-brand focus-visible:text-brand"
      >
        <CircleHelp className="h-4 w-4" aria-hidden />
      </button>
      {open && (
        <span
          ref={tip}
          id={id}
          role="tooltip"
          style={{ transform: `translateX(calc(-50% + ${shift}px))` }}
          className="pointer-events-none absolute bottom-full left-1/2 z-[65] mb-2 w-64 max-w-[80vw] rounded-xl border border-line bg-surface px-3.5 py-2.5 text-left text-xs font-normal normal-case leading-relaxed tracking-normal text-ink-2 shadow-pop"
        >
          {children}
        </span>
      )}
    </span>
  )
}
