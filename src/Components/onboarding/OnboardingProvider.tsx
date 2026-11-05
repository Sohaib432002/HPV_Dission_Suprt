import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, FileText, HeartPulse, LineChart, Microscope, UserPlus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button, Modal } from '../ui'
import { resetGuides } from '../ui/guideStorage'
import { useAuth } from '../../lib/auth'
import { OnboardingContext, WELCOME_KEY } from './OnboardingContext'

type Step = {
  title: string
  description: string
  body: ReactNode
}

const Point = ({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) => (
  <li className="flex items-start gap-3.5">
    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
      <Icon className="h-5 w-5" aria-hidden />
    </span>
    <div>
      <p className="text-sm font-bold text-ink">{title}</p>
      <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{text}</p>
    </div>
  </li>
)

const steps: Step[] = [
  {
    title: 'Welcome! Here is what this website does',
    description: 'In simple words, so you know what to expect.',
    body: (
      <div className="space-y-4 text-sm leading-relaxed text-ink-2">
        <p>
          HPV is a very common virus. In some people it stays in the body for years and can lead to
          cervical cancer.
        </p>
        <p>
          <strong className="text-ink">This website looks at microscope pictures of cervical cells</strong>, tells you
          how many of the cells show signs of HPV, and{' '}
          <strong className="text-ink">shows a simple graph of how the infection could spread</strong> over the coming years.
        </p>
        <p className="rounded-xl bg-surface-2 p-3.5 text-xs">
          This is a research tool. It does not replace a doctor, and results should always be
          checked with a medical professional.
        </p>
      </div>
    ),
  },
  {
    title: 'What you can do here',
    description: 'Three things, all in one place.',
    body: (
      <ul className="space-y-4">
        <Point
          icon={Microscope}
          title="Check cell pictures"
          text="Upload microscope images. The website shows expert-counted AgNOR dots per nucleus for reference pictures. It is not a diagnosis."
        />
        <Point
          icon={LineChart}
          title="See what may happen next"
          text="Move a few sliders and watch a graph show how many people could be healthy, infected or recovered."
        />
        <Point
          icon={FileText}
          title="Keep your results"
          text="Download a clear PDF report. Patients can log in at any time to find their reports again."
        />
      </ul>
    ),
  },
  {
    title: 'How to get started',
    description: 'It only takes a minute.',
    body: (
      <ol className="space-y-3.5">
        {[
          ['Create an account', 'Choose “Patient” if you want to see your reports, or “Engineer” if you run tests.'],
          ['Log in', 'Use the name and password you just chose.'],
          ['Pick a tool', 'Open “Prediction” to upload pictures, or “Simulation” to try the sliders.'],
        ].map(([t, d], i) => (
          <li key={t} className="flex items-start gap-3.5">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-brand-fg">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-bold text-ink">{t}</p>
              <p className="mt-0.5 text-sm leading-relaxed text-ink-2">{d}</p>
            </div>
          </li>
        ))}
      </ol>
    ),
  },
]

/** Provides the first-visit welcome tour and a way to reopen it later. */
export function OnboardingProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { isAuth } = useAuth()
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)

  // Show automatically once, shortly after a brand-new visitor lands.
  useEffect(() => {
    let seen = true
    try {
      seen = localStorage.getItem(WELCOME_KEY) === '1'
    } catch {
      /* storage blocked: don't nag on every page */
    }
    if (seen) return
    const timer = setTimeout(() => setOpen(true), 900)
    return () => clearTimeout(timer)
  }, [])

  const close = useCallback(() => {
    try {
      localStorage.setItem(WELCOME_KEY, '1')
    } catch {
      /* ignore */
    }
    setOpen(false)
  }, [])

  const openTour = useCallback(() => {
    setIndex(0)
    setOpen(true)
  }, [])

  const api = useMemo(() => ({ openTour }), [openTour])
  const step = steps[index]
  const last = index === steps.length - 1

  const go = (to: string) => {
    close()
    navigate(to)
  }

  return (
    <OnboardingContext.Provider value={api}>
      {children}
      <Modal open={open} onClose={close} title={step.title} description={step.description} size="lg">
        <div key={index} className="animate-rise min-h-[220px]">
          {step.body}
        </div>

        <div className="mt-6 flex items-center justify-center gap-2" aria-hidden>
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-brand' : 'w-2 bg-line'}`}
            />
          ))}
        </div>
        <p className="sr-only">
          Step {index + 1} of {steps.length}
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
          {index > 0 ? (
            <Button variant="ghost" onClick={() => setIndex(index - 1)} icon={<ArrowLeft className="h-4 w-4" />}>
              Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={close}>
              Skip for now
            </Button>
          )}

          {!last ? (
            <Button onClick={() => setIndex(index + 1)}>
              Next <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          ) : isAuth ? (
            <Button onClick={() => go('/future-predict')} icon={<Microscope className="h-4 w-4" />}>
              Open Prediction
            </Button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={close}>
                Just look around
              </Button>
              <Button onClick={() => go('/SignUp')} icon={<UserPlus className="h-4 w-4" />}>
                Create account
              </Button>
            </div>
          )}
        </div>

        <p className="mt-4 flex flex-wrap items-center justify-center gap-x-1.5 text-center text-xs text-muted">
          <HeartPulse className="h-3.5 w-3.5" aria-hidden /> Need this again? Press the{' '}
          <strong className="text-ink-2">?</strong> button at the top of any page.
          <button
            type="button"
            onClick={() => {
              resetGuides()
              close()
            }}
            className="font-semibold text-brand hover:underline"
          >
            Show all page tips again
          </button>
        </p>
      </Modal>
    </OnboardingContext.Provider>
  )
}
