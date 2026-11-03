import type { CSSProperties } from 'react'

type ParamSliderProps = {
  label: string
  hint?: string
  value: number | ''
  onChange: (value: number) => void
  min: number
  max: number
  step: number
  decimals?: number
}

/** Range slider paired with a numeric input so values can be dragged or typed exactly. */
export function ParamSlider({ label, hint, value, onChange, min, max, step, decimals = 3 }: ParamSliderProps) {
  const numeric = value === '' ? min : Number(value)
  const fill = Math.min(100, Math.max(0, ((numeric - min) / (max - min)) * 100))

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-ink-2">{label}</span>
        <input
          type="number"
          aria-label={`${label} value`}
          min={min}
          max={max}
          step="any"
          value={Number.isFinite(numeric) ? Number(numeric.toFixed(decimals)) : 0}
          onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
          className="h-8 w-24 rounded-lg border border-line bg-surface px-2 text-right font-mono text-sm font-semibold text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
        />
      </div>
      <input
        type="range"
        aria-label={label}
        min={min}
        max={max}
        step={step}
        value={numeric}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="range mt-2.5"
        style={{ '--fill': `${fill}%` } as CSSProperties}
      />
      {hint && <p className="mt-1.5 text-xs leading-snug text-muted">{hint}</p>}
    </div>
  )
}
