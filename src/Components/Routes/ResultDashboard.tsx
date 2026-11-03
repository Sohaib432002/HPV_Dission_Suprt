import React, { useEffect, useState } from 'react'
import { ArrowLeft, Biohazard, Image as ImageIcon, Layers, Microscope, Percent, X } from 'lucide-react'
import { Badge, Button, Card, CardHeader, StatCard } from '../ui'
import { API_BASE } from '../../lib/config'

interface ImageResult {
  image: string
  result: string
  stage: string
  risk: string
  confidence: number
  total_cells: number
  infected_cells: number
  infection_rate: number
}

interface DashboardProps {
  data: {
    images_analyzed: number
    total_cells: number
    total_infected_cells: number
    overall_infection_rate: number
    image_results: ImageResult[]
  }
  setshowResult: React.Dispatch<React.SetStateAction<boolean>>
}

type BadgeTone = 'neutral' | 'brand' | 'danger' | 'warn' | 'info' | 'violet'

const RISK_TONE: Record<string, BadgeTone> = { High: 'danger', Medium: 'warn', Low: 'brand' }
const STAGE_TONE: Record<string, BadgeTone> = {
  'Stage 0': 'neutral',
  'Stage I': 'info',
  'Stage II': 'violet',
  'Stage III': 'danger',
  'Stage IV': 'danger',
}

/** Counts up to `target` once on mount. */
const Counter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900)
      setVal(target * (1 - Math.pow(1 - t, 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])
  return (
    <>
      {val.toLocaleString(undefined, { maximumFractionDigits: Number.isInteger(target) ? 0 : 2 })}
      {suffix}
    </>
  )
}

const Thumb = ({ image }: { image: string }) => {
  const [failed, setFailed] = useState(false)
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-2 text-muted">
      {failed ? (
        <ImageIcon className="h-5 w-5" aria-hidden />
      ) : (
        <img
          src={`${API_BASE}/media/${image}`}
          alt=""
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  )
}

const Confidence = ({ value }: { value: number }) => (
  <div className="flex items-center gap-2">
    <div className="h-1.5 w-14 overflow-hidden rounded-full bg-surface-2">
      <div className="h-full rounded-full bg-brand" style={{ width: `${value}%` }} />
    </div>
    <span className="text-sm font-semibold text-ink">{value}%</span>
  </div>
)

const ResultDashboard = ({ data, setshowResult }: DashboardProps) => {
  const close = () => setshowResult(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setshowResult(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [setshowResult])

  if (!data) return null

  const rate = Number(data.overall_infection_rate)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="HPV analysis dashboard"
      className="animate-rise fixed inset-0 z-[60] overflow-y-auto bg-bg"
    >
      <div className="sticky top-0 z-10 border-b border-line bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-brand">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand" aria-hidden /> Live analysis
            </p>
            <h2 className="text-lg font-extrabold text-ink sm:text-xl">HPV analysis dashboard</h2>
          </div>
          <Button variant="secondary" size="sm" onClick={close} icon={<X className="h-4 w-4" />}>
            Close
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Images analyzed" value={<Counter target={Number(data.images_analyzed)} />} icon={Microscope} tone="info" />
          <StatCard label="Total cells" value={<Counter target={Number(data.total_cells)} />} icon={Layers} />
          <StatCard label="Infected cells" value={<Counter target={Number(data.total_infected_cells)} />} icon={Biohazard} tone="danger" />
          <StatCard label="Infection rate" value={<Counter target={rate} suffix="%" />} icon={Percent} tone="violet" />
        </div>

        <details className="rounded-2xl border border-line bg-surface p-5 text-sm text-ink-2 shadow-card">
          <summary className="cursor-pointer font-semibold text-ink">New here? What do these results mean?</summary>
          <ul className="mt-3 space-y-1.5 leading-relaxed">
            <li><strong className="text-ink">Infection rate:</strong> out of all the cells counted, the share that show signs of HPV.</li>
            <li><strong className="text-ink">Disease:</strong> what the AI thinks it found in the picture.</li>
            <li><strong className="text-ink">Stage:</strong> how far along the changes in the cells appear to be.</li>
            <li><strong className="text-ink">Risk:</strong> Low, Medium or High, based on what was found.</li>
            <li><strong className="text-ink">Confidence:</strong> how sure the AI is about its answer.</li>
          </ul>
          <p className="mt-3 text-xs text-muted">These are research results, not a diagnosis. Please talk to a doctor about them.</p>
        </details>

        <Card className="p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-ink">Overall infection rate</h3>
            <span className="font-display text-lg font-extrabold text-danger">{data.overall_infection_rate}%</span>
          </div>
          <div
            className="mt-3 h-3 overflow-hidden rounded-full bg-surface-2"
            role="progressbar"
            aria-valuenow={rate}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Overall infection rate"
          >
            <div
              className="h-full rounded-full bg-danger transition-[width] duration-1000 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, rate))}%` }}
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[11px] text-muted" aria-hidden>
            {[0, 25, 50, 75, 100].map((v) => (
              <span key={v}>{v}%</span>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader
            title="Image analysis results"
            description={`${data.image_results.length} sample${data.image_results.length === 1 ? '' : 's'}`}
            icon={Microscope}
          />

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                  {['Image', 'Disease', 'Stage', 'Risk', 'Confidence', 'Total cells', 'Infected', 'Rate'].map((h) => (
                    <th key={h} scope="col" className="px-5 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {data.image_results.map((item, i) => (
                  <tr key={i} className="transition-colors hover:bg-surface-2">
                    <td className="px-5 py-3">
                      <Thumb image={item.image} />
                    </td>
                    <td className="px-5 py-3 font-semibold text-ink">{item.result}</td>
                    <td className="px-5 py-3">
                      <Badge tone={STAGE_TONE[item.stage] ?? 'neutral'}>{item.stage}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Badge tone={RISK_TONE[item.risk] ?? 'neutral'}>{item.risk}</Badge>
                    </td>
                    <td className="px-5 py-3">
                      <Confidence value={item.confidence} />
                    </td>
                    <td className="px-5 py-3 text-ink-2">{item.total_cells.toLocaleString()}</td>
                    <td className="px-5 py-3 font-semibold text-danger">{item.infected_cells.toLocaleString()}</td>
                    <td className="px-5 py-3">
                      <Badge tone="danger">{item.infection_rate}%</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="divide-y divide-line md:hidden">
            {data.image_results.map((item, i) => (
              <li key={i} className="space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <Thumb image={item.image} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{item.result}</p>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <Badge tone={STAGE_TONE[item.stage] ?? 'neutral'}>{item.stage}</Badge>
                      <Badge tone={RISK_TONE[item.risk] ?? 'neutral'}>{item.risk} risk</Badge>
                    </div>
                  </div>
                </div>
                <dl className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt className="text-xs text-muted">Confidence</dt>
                    <dd>
                      <Confidence value={item.confidence} />
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Infection rate</dt>
                    <dd className="font-semibold text-danger">{item.infection_rate}%</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Total cells</dt>
                    <dd className="text-ink-2">{item.total_cells.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Infected</dt>
                    <dd className="font-semibold text-danger">{item.infected_cells.toLocaleString()}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex justify-center pb-6">
          <Button variant="secondary" onClick={close} icon={<ArrowLeft className="h-4 w-4" />}>
            Back to pipeline
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResultDashboard
