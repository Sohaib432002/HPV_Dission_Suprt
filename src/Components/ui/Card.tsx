import type { HTMLAttributes, ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'

export function Card({ className = '', ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-line bg-surface shadow-card ${className}`}
      {...rest}
    />
  )
}

type CardHeaderProps = {
  title: string
  description?: string
  action?: ReactNode
  icon?: LucideIcon
}

export function CardHeader({ title, description, action, icon: Icon }: CardHeaderProps) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
      <div className="flex items-start gap-3">
        {Icon && (
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-soft text-brand">
            <Icon className="h-[18px] w-[18px]" aria-hidden />
          </span>
        )}
        <div>
          <h2 className="text-base font-bold text-ink sm:text-lg">{title}</h2>
          {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

type Tone = 'brand' | 'danger' | 'info' | 'violet' | 'warn'

const tones: Record<Tone, string> = {
  brand: 'bg-brand-soft text-brand',
  danger: 'bg-danger-soft text-danger',
  info: 'bg-info-soft text-info',
  violet: 'bg-violet-soft text-violet',
  warn: 'bg-warn-soft text-warn',
}

type StatCardProps = {
  label: string
  value: ReactNode
  icon: LucideIcon
  tone?: Tone
  hint?: string
}

export function StatCard({ label, value, icon: Icon, tone = 'brand', hint }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted">{label}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-lg ${tones[tone]}`}>
          <Icon className="h-[18px] w-[18px]" aria-hidden />
        </span>
      </div>
      <p className="mt-3 font-display text-3xl font-bold tracking-tight text-ink">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
    </Card>
  )
}
