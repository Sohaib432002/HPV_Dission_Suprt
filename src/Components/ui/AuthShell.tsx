import type { ReactNode } from 'react'
import { Brain, FileText, FlaskConical } from 'lucide-react'
import { asset } from '../../lib/config'

const points = [
  { icon: FlaskConical, text: 'Simulate HPV transmission with three numerical solvers' },
  { icon: Brain, text: 'Analyze cervical cell images with deep learning' },
  { icon: FileText, text: 'Generate and store professional PDF reports' },
]

/** Two-column shell shared by the Login and Sign-up pages. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      <aside className="relative hidden overflow-hidden bg-brand-deep lg:block">
        <img
          src={asset('hpv-pic.jpg')}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/70 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-12 xl:p-16">
          <h2 className="max-w-md text-4xl font-extrabold leading-tight text-white">
            Mathematics & HPV Research Lab
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
            Your workspace for research-grade infection modeling, prediction and reporting.
          </p>
          <ul className="mt-8 space-y-4">
            {points.map((p) => (
              <li key={p.text} className="flex items-center gap-3 text-sm text-white/85">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white/10">
                  <p.icon className="h-[18px] w-[18px]" aria-hidden />
                </span>
                {p.text}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="animate-rise w-full max-w-md">
          <h1 className="text-3xl font-extrabold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-muted">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-sm text-muted">{footer}</p>
        </div>
      </div>
    </div>
  )
}
