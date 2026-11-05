import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CircleDot, Gauge, Image as ImageIcon, Info, Layers, Microscope, X } from 'lucide-react'
import { Badge, Button, Card, CardHeader, EmptyState, StatCard } from '../ui'
import { describeDots } from '../../lib/analysis'
import type { AnalysisResult, ReferenceSummary } from '../../lib/analysis'

interface DashboardProps {
  data: AnalysisResult
  setshowResult: React.Dispatch<React.SetStateAction<boolean>>
  /** Local preview URL of each uploaded picture, keyed by file name. */
  previews?: Record<string, string>
}

/** Counts up to `target` once on mount. */
const Counter = ({ target, digits = 0 }: { target: number; digits?: number }) => {
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
  return <>{val.toLocaleString(undefined, { minimumFractionDigits: digits, maximumFractionDigits: digits })}</>
}

const Thumb = ({ src }: { src?: string }) => {
  const [failed, setFailed] = useState(false)
  return (
    <span className="grid h-11 w-11 shrink-0 place-items-center overflow-hidden rounded-xl bg-surface-2 text-muted">
      {failed || !src ? (
        <ImageIcon className="h-5 w-5" aria-hidden />
      ) : (
        <img src={src} alt="" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      )}
    </span>
  )
}

/** A ruler of AgNOR dots per nucleus across all reference pictures, with this sample marked on it. */
function ReferenceScale({ value, reference }: { value: number; reference: ReferenceSummary }) {
  const max = Math.max(reference.p90 * 1.25, value * 1.1, 1)
  const pos = (v: number) => `${Math.min(100, (v / max) * 100)}%`
  const marks = [
    { v: reference.p25, label: 'Lower quarter' },
    { v: reference.median, label: 'Middle' },
    { v: reference.p75, label: 'Upper quarter' },
    { v: reference.p90, label: 'Top 10%' },
  ]
  return (
    <div>
      <div className="relative h-3 rounded-full bg-surface-2" role="img" aria-label={`Your sample: ${value.toFixed(2)} dots per nucleus`}>
        <div className="absolute inset-y-0 left-0 rounded-full bg-brand-soft" style={{ width: pos(reference.p75) }} />
        <div className="absolute inset-y-0 rounded-r-full bg-warn-soft" style={{ left: pos(reference.p75), width: `calc(${pos(reference.p90)} - ${pos(reference.p75)})` }} />
        <div className="absolute inset-y-0 rounded-r-full bg-danger-soft" style={{ left: pos(reference.p90), right: 0 }} />
        <span
          className="absolute top-1/2 h-6 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink shadow"
          style={{ left: pos(value) }}
        />
      </div>
      <div className="relative mt-2 h-9 text-[11px] text-muted">
        {marks.map((m) => (
          <span key={m.label} className="absolute -translate-x-1/2 text-center leading-tight" style={{ left: pos(m.v) }}>
            <span className="block font-semibold text-ink-2">{m.v}</span>
            {m.label}
          </span>
        ))}
      </div>
      <p className="mt-1 text-xs text-muted">
        Scale: AgNOR dots per nucleus in {reference.pictures.toLocaleString()} reference pictures. The black bar is your sample (
        {value.toFixed(2)}).
      </p>
    </div>
  )
}

const ResultDashboard = ({ data, setshowResult, previews = {} }: DashboardProps) => {
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

  const rows = data.image_results.filter((r) => !r.error)
  const failedRows = data.image_results.filter((r) => r.error)
  const verdict = describeDots(data.dots_per_nucleus, data.reference)

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Picture analysis results"
      className="animate-rise fixed inset-0 z-[60] overflow-y-auto bg-bg"
    >
      <div className="sticky top-0 z-10 border-b border-line bg-surface/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Research demo</p>
            <h2 className="text-lg font-extrabold text-ink sm:text-xl">Picture analysis results</h2>
          </div>
          <Button variant="secondary" size="sm" onClick={close} icon={<X className="h-4 w-4" />}>
            Close
          </Button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
        <div className="flex items-start gap-3 rounded-2xl bg-info-soft p-4 text-sm leading-relaxed text-ink-2">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-info" aria-hidden />
          <p>
            <strong className="text-ink">This is not a diagnosis.</strong> {data.note}{' '}
            <Link to="/learn" onClick={close} className="font-semibold text-brand hover:underline">
              How does this work?
            </Link>
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Pictures checked" value={<Counter target={data.images_analyzed} />} icon={Microscope} tone="info" />
          <StatCard
            label="Nuclei counted"
            value={data.annotated_images ? <Counter target={data.nuclei} /> : '–'}
            icon={Layers}
            hint={data.annotated_images ? `in ${data.annotated_images} picture${data.annotated_images === 1 ? '' : 's'} with expert counts` : 'no expert counts available'}
          />
          <StatCard label="AgNOR dots" value={data.annotated_images ? <Counter target={data.agnor_dots} /> : '–'} icon={CircleDot} tone="violet" hint="clusters + satellites" />
          <StatCard
            label="Dots per nucleus"
            value={data.dots_per_nucleus != null ? <Counter target={data.dots_per_nucleus} digits={2} /> : '–'}
            icon={Gauge}
            tone={verdict?.tone === 'danger' ? 'danger' : verdict?.tone === 'warn' ? 'warn' : 'brand'}
            hint={verdict?.label}
          />
        </div>

        {data.annotated_images > 0 && data.dots_per_nucleus != null ? (
          <Card className="p-5 sm:p-6">
            <h3 className="text-sm font-bold text-ink">Where your sample sits among the reference pictures</h3>
            <p className="mt-1 text-sm text-muted">
              AgNOR dots are tiny black dots in the nucleus. The average number per nucleus is a long-used research
              marker of how actively cells are dividing. It does not show whether HPV is present.
            </p>
            <div className="mt-6">
              <ReferenceScale value={data.dots_per_nucleus} reference={data.reference} />
            </div>
          </Card>
        ) : (
          <Card>
            <EmptyState
              icon={Microscope}
              title="No expert counts for these pictures"
              description="Counts exist only for pictures of the CCAgT reference set. Your pictures can still be compared with the reference slides below. To see counts, try the sample images."
              action={
                <Link to="/sample-images" onClick={close} className="text-sm font-semibold text-brand hover:underline">
                  Get sample images
                </Link>
              }
            />
          </Card>
        )}

        <Card>
          <CardHeader
            title="Picture by picture"
            description={`${rows.length} picture${rows.length === 1 ? '' : 's'}. “Closest slide” is one of 15 reference slides (A to O), each from a different woman. It is an unreliable demo: in our spot check the top guess often was not the picture's true slide.`}
            icon={Microscope}
          />

          {failedRows.length > 0 && (
            <div role="alert" className="border-b border-line bg-danger-soft px-5 py-3 text-sm text-danger sm:px-6">
              <p className="font-semibold">
                {failedRows.length} picture{failedRows.length === 1 ? '' : 's'} could not be checked:
              </p>
              <ul className="mt-1 list-disc pl-5">
                {failedRows.map((r, i) => (
                  <li key={i}>
                    {r.image}: {r.error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wider text-muted">
                  {['Picture', 'Nuclei', 'Clusters', 'Satellites', 'Dots per nucleus', 'Closest slide'].map((h) => (
                    <th key={h} scope="col" className="px-5 py-3 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((r, i) => (
                  <tr key={i} className="transition-colors hover:bg-surface-2">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Thumb src={previews[r.image]} />
                        <span className="max-w-[200px] truncate font-semibold text-ink">{r.image}</span>
                      </div>
                    </td>
                    {r.annotated ? (
                      <>
                        <td className="px-5 py-3 text-ink-2">{r.nuclei}</td>
                        <td className="px-5 py-3 text-ink-2">{r.clusters}</td>
                        <td className="px-5 py-3 text-ink-2">{r.satellites}</td>
                        <td className="px-5 py-3">
                          {r.dots_per_nucleus != null ? (
                            <span className="font-semibold text-ink">
                              {r.dots_per_nucleus.toFixed(2)}
                              {r.reference_percentile != null && (
                                <span className="ml-1.5 text-xs font-normal text-muted">
                                  (more than {Math.round(r.reference_percentile)}% of reference)
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="text-muted">no nucleus</span>
                          )}
                        </td>
                      </>
                    ) : (
                      <td colSpan={4} className="px-5 py-3 text-muted">
                        No expert counts (not a reference picture)
                      </td>
                    )}
                    <td className="px-5 py-3">
                      <Badge tone="violet">
                        Slide {r.best_slide} · {r.best_slide_similarity}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="divide-y divide-line md:hidden">
            {rows.map((r, i) => (
              <li key={i} className="space-y-3 p-4">
                <div className="flex items-center gap-3">
                  <Thumb src={previews[r.image]} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-ink">{r.image}</p>
                    <Badge tone="violet">
                      Slide {r.best_slide} · {r.best_slide_similarity}%
                    </Badge>
                  </div>
                </div>
                {r.annotated ? (
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-xs text-muted">Nuclei</dt>
                      <dd className="text-ink-2">{r.nuclei}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">Dots per nucleus</dt>
                      <dd className="font-semibold text-ink">{r.dots_per_nucleus != null ? r.dots_per_nucleus.toFixed(2) : '–'}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">Clusters</dt>
                      <dd className="text-ink-2">{r.clusters}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted">Satellites</dt>
                      <dd className="text-ink-2">{r.satellites}</dd>
                    </div>
                  </dl>
                ) : (
                  <p className="text-sm text-muted">No expert counts (not a reference picture).</p>
                )}
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex justify-center pb-6">
          <Button variant="secondary" onClick={close} icon={<ArrowLeft className="h-4 w-4" />}>
            Back
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ResultDashboard
