/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useMemo, useRef, useState } from 'react'
import { Calculator, CheckCircle2, Circle, Download, ExternalLink, FileDown, Info, Loader2, RefreshCw, TriangleAlert } from 'lucide-react'

import { generateProfessionalPDF } from './Report'
import { useTheme } from '../ThemeContext'
import { Badge, Button, InfoTip, Modal, Spinner, buttonClass, useToast } from '../ui'

import { apiFetch } from '../../lib/api'
import { getAccessToken, useAuth } from '../../lib/auth'

interface SimulationChartProps {
  mainResult: any
  data: any
  startYear?: number
  Limitaions: any
  PatientDetails: any
}

type SeriesKey = 'S1' | 'S2' | 'Infected' | 'Recovered' | 'Cancer' | 'Rt'

const SERIES: { key: SeriesKey; label: string; name: string; color: string }[] = [
  { key: 'S1', label: 'S1 Population', name: 'S1 Population', color: '#3b82f6' },
  { key: 'S2', label: 'S2 Population', name: 'S2 Population', color: '#10b981' },
  { key: 'Infected', label: 'Infected', name: 'Infected', color: '#ef4444' },
  { key: 'Recovered', label: 'Recovered', name: 'Recovered', color: '#8b5cf6' },
  { key: 'Cancer', label: 'Cancer cases', name: 'Cancer Cases', color: '#64748b' },
  { key: 'Rt', label: 'Rₜ', name: 'Rₜ (Effective Reproduction Number)', color: '#f59e0b' },
]

const DEFAULT_VISIBLE: Record<SeriesKey, boolean> = {
  S1: true,
  S2: true,
  Infected: true,
  Recovered: true,
  Cancer: true,
  Rt: false,
}

type ReportStage = 'idle' | 'building' | 'saving' | 'done' | 'error'
type ReportState = { stage: ReportStage; fileName: string; url: string | null; saved: boolean }
const IDLE_REPORT: ReportState = { stage: 'idle', fileName: '', url: null, saved: false }

const SimulationChart = ({
  mainResult,
  data,
  Limitaions,
  PatientDetails,
  startYear = 2026,
}: SimulationChartProps) => {
  const { theme } = useTheme()
  const toast = useToast()
  const { user, isAuth } = useAuth()

  const [visible, setVisible] = useState(DEFAULT_VISIBLE)
  const [showLimitation, setShowLimitation] = useState(false)
  const [showR0, setShowR0] = useState(false)
  const [reportOpen, setReportOpen] = useState(false)
  const [report, setReport] = useState<ReportState>(IDLE_REPORT)
  const pdfBlob = useRef<Blob | null>(null)

  // Chart rows are derived from the API response, so they are computed, not stored in state.
  const { mode, chartData } = useMemo<{ mode: 'ode' | 'ml'; chartData: any[] }>(() => {
    if (data?.data) {
      const { time, S1, S2, Infected, Recovered, Cancer, Rt } = data.data
      return {
        mode: 'ode',
        chartData: time.map((t: number, i: number) => ({
          year: startYear + Math.floor(t / 12),
          S1: S1[i],
          S2: S2[i],
          Infected: Infected[i],
          Recovered: Recovered[i],
          Cancer: Cancer[i],
          Rt: Rt[i],
        })),
      }
    }
    if (data?.future_time) {
      const { future_time, ml_prediction } = data
      return {
        mode: 'ml',
        chartData: future_time.map((t: number, i: number) => ({
          year: startYear + Math.floor(t / 12),
          prediction: ml_prediction[i],
        })),
      }
    }
    return { mode: 'ode', chartData: [] }
  }, [data, startYear])

  const axis = useMemo(
    () =>
      theme === 'dark'
        ? { text: '#a9bbb2', grid: '#ffffff1a', tipBg: '#101b17', tipBorder: '#22312a', tipText: '#e9f2ee' }
        : { text: '#52625b', grid: '#0e1f1914', tipBg: '#ffffff', tipBorder: '#e1eae6', tipText: '#0e1f19' },
    [theme]
  )

  if (chartData.length === 0) return <Spinner label="Loading chart…" className="h-64" />

  const toggle = (key: SeriesKey) => setVisible((v) => ({ ...v, [key]: !v[key] }))

  const running = report.stage === 'building' || report.stage === 'saving'

  const closeReport = () => {
    setReportOpen(false)
    if (!running) {
      if (report.url) URL.revokeObjectURL(report.url)
      pdfBlob.current = null
      setReport(IDLE_REPORT)
    }
  }

  const triggerDownload = (url: string, fileName: string) => {
    const a = document.createElement('a')
    a.href = url
    a.download = fileName
    a.click()
  }

  const uploadReport = async (blob: Blob, fileName: string) => {
    const formData = new FormData()
    formData.append('document', blob, fileName)
    formData.append('result', 'HPV Analysis Completed')
    const response = await apiFetch('/api/reports/upload/', {
      method: 'POST',
      headers: { Authorization: `Bearer ${getAccessToken()}` },
      body: formData,
    })
    if (!response.ok) console.error(await response.json().catch(() => ({})))
    return response.ok
  }

  const handleSubmit = async () => {
    setReportOpen(true)
    if (running) return
    if (report.url) URL.revokeObjectURL(report.url)
    setReport({ ...IDLE_REPORT, stage: 'building' })
    try {
      const blob: Blob = await generateProfessionalPDF({
        logo_url: '/logo.png',
        patient_name: user?.username || 'anonyumus',
        // SimpleJWT stores user_id as a number; the PDF writer only accepts strings.
        patient_id: String(user?.user_id || 'Unknown'),
        age: user?.age ? parseInt(String(user.age), 10) : 0,
        gender: user?.gender || 'Unknown',
        analysis: mainResult,
        S_1_Cal: data.data.S_1,
        S_2_Cal: data.data.S_2,
        I_Cal: data.data.I_eq,
        R_Cal: data.data.R_eq,
        C_Cal: data.data.C_eq,
        R0_Cal: data.data.R_0,
        PatientDetails: PatientDetails,
      })
      pdfBlob.current = blob

      const fileName =
        user?.role === 'lab_engineer'
          ? `HPV_Report_${PatientDetails?.Name || 'Patient'}.pdf`
          : `HPV_Report_${user?.username || 'Patient'}.pdf`

      const url = URL.createObjectURL(blob)
      triggerDownload(url, fileName)
      setReport({ stage: 'saving', fileName, url, saved: false })

      const saved = await uploadReport(blob, fileName).catch(() => false)
      setReport({ stage: 'done', fileName, url, saved })
    } catch (error) {
      console.error(error)
      setReport({ ...IDLE_REPORT, stage: 'error' })
    }
  }

  const retrySave = async () => {
    if (!pdfBlob.current) return
    setReport((r) => ({ ...r, stage: 'saving' }))
    const saved = await uploadReport(pdfBlob.current, report.fileName).catch(() => false)
    setReport((r) => ({ ...r, stage: 'done', saved }))
    if (saved) toast.success('Report saved to your account.')
  }

  const stepState = (step: 1 | 2 | 3): 'done' | 'active' | 'pending' | 'warn' => {
    const { stage, saved } = report
    if (stage === 'building') return step === 1 ? 'active' : 'pending'
    if (stage === 'saving') return step < 3 ? 'done' : 'active'
    if (stage === 'done') return step === 3 && !saved ? 'warn' : 'done'
    return 'pending'
  }

  return (
    <>
      <div className="w-full min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg font-bold text-ink">
              {mode === 'ml' ? 'ML prediction graph' : 'HPV mathematical model'}
            </h3>
            <Badge tone="brand">{mode === 'ml' ? 'Machine learning' : 'ODE solver'}</Badge>
          </div>
          <div className="flex flex-wrap gap-2">
            {mainResult !== null && isAuth && (
              <Button size="sm" loading={running} onClick={handleSubmit} icon={<FileDown className="h-4 w-4" />}>
                Download &amp; save report
              </Button>
            )}
            {mode !== 'ml' && Limitaions && (
              <Button size="sm" variant="secondary" onClick={() => setShowLimitation(true)} icon={<Info className="h-4 w-4" />}>
                Method limitations
              </Button>
            )}
          </div>
        </div>

        <div className="mt-5">
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={axis.grid} />
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: axis.text }}
                stroke={axis.grid}
                label={{ value: 'Year', position: 'insideBottom', offset: -3, fill: axis.text }}
              />
              <YAxis tick={{ fontSize: 12, fill: axis.text }} stroke={axis.grid} />
              <Tooltip
                contentStyle={{
                  backgroundColor: axis.tipBg,
                  border: `1px solid ${axis.tipBorder}`,
                  borderRadius: 12,
                  color: axis.tipText,
                  boxShadow: '0 8px 24px rgb(0 0 0 / 0.15)',
                }}
              />
              <Legend wrapperStyle={{ color: axis.text, fontSize: 13 }} />

              {mode === 'ode' &&
                SERIES.filter((s) => visible[s.key]).map((s) => (
                  <Line
                    key={s.key}
                    type="monotone"
                    dataKey={s.key}
                    stroke={s.color}
                    name={s.name}
                    dot={false}
                    strokeWidth={2.25}
                  />
                ))}

              {mode === 'ml' && (
                <Line
                  type="monotone"
                  dataKey="prediction"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="ML Predicted Infected"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {mode === 'ode' && (
          <>
            <div className="mt-4 flex flex-wrap items-center gap-2" role="group" aria-label="Visible series">
              {SERIES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  aria-pressed={visible[s.key]}
                  onClick={() => toggle(s.key)}
                  className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    visible[s.key]
                      ? 'border-transparent bg-surface-2 text-ink'
                      : 'border-line text-muted hover:text-ink'
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: visible[s.key] ? s.color : 'transparent', border: `2px solid ${s.color}` }}
                    aria-hidden
                  />
                  {s.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setVisible({ S1: true, S2: true, Infected: true, Recovered: true, Cancer: true, Rt: true })}
                className="rounded-full px-3 py-1.5 text-sm font-semibold text-brand hover:underline"
              >
                Show all
              </button>
            </div>

            <details className="mt-4 rounded-xl border border-line bg-surface-2 p-4 text-sm text-ink-2">
              <summary className="cursor-pointer font-semibold text-ink">What do these lines mean?</summary>
              <ul className="mt-3 space-y-1.5 leading-relaxed">
                <li><strong className="text-ink">S1 Population:</strong> healthy people who are not vaccinated.</li>
                <li><strong className="text-ink">S2 Population:</strong> healthy people who are vaccinated.</li>
                <li><strong className="text-ink">Infected:</strong> people who currently have HPV.</li>
                <li><strong className="text-ink">Recovered:</strong> people who got better or are protected.</li>
                <li><strong className="text-ink">Cancer cases:</strong> people whose infection has turned into cancer.</li>
                <li><strong className="text-ink">Rₜ:</strong> how many people one infected person passes the virus to right now.</li>
              </ul>
              <p className="mt-3 text-xs text-muted">Click the coloured buttons above to show or hide a line.</p>
            </details>

            <div className="mt-4 flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                aria-expanded={showR0}
                onClick={() => setShowR0(!showR0)}
                icon={<Calculator className="h-4 w-4" />}
              >
                Calculate R₀
              </Button>
              <InfoTip>
                R₀ is the number of people one infected person is expected to pass HPV to. Above 1 the
                infection keeps spreading. Below 1 it slowly dies out.
              </InfoTip>
            </div>

            {showR0 && (
              <div className="animate-rise mt-4 rounded-2xl bg-brand-soft p-5 text-center">
                <h4 className="text-base font-bold text-ink">Basic reproduction number (R₀)</h4>
                <p className="mt-2 overflow-x-auto font-mono text-sm text-ink-2">
                  R₀ = ((1 − m) × β × δ × A) / ((μ + n + (1 − n)) × (μ² + δm + δμ + μm))
                </p>
                <p className="mt-3 font-display text-3xl font-extrabold text-brand">
                  {data?.data?.R_0?.toFixed(4)}
                </p>
              </div>
            )}
          </>
        )}

        {Limitaions === '' && (
          <div className="mt-5 flex justify-center">
            <a
              href={`${import.meta.env.BASE_URL}future-predict`}
              className={buttonClass({ variant: 'secondary', size: 'sm' })}
            >
              <RefreshCw className="h-4 w-4" aria-hidden /> Try again
            </a>
          </div>
        )}
      </div>

      <Modal
        open={reportOpen}
        onClose={closeReport}
        title={report.stage === 'done' ? 'Your report is ready' : report.stage === 'error' ? 'Something went wrong' : 'Creating your report'}
        description={
          report.stage === 'done'
            ? 'It was downloaded to this device and saved to your account.'
            : report.stage === 'error'
              ? 'We could not create the PDF. Nothing was saved.'
              : 'This takes a few seconds. Please keep this page open.'
        }
      >
        {report.stage !== 'error' && (
          <ol className="space-y-3">
            {[
              [1, 'Creating your PDF', 'Putting your results into a clear report'],
              [2, 'Downloading to this device', 'The file goes to your Downloads folder'],
              [3, 'Saving to your account', 'So you can find it again later'],
            ].map(([n, title, hint]) => {
              const st = stepState(n as 1 | 2 | 3)
              return (
                <li key={n as number} className="flex items-start gap-3.5 rounded-xl border border-line bg-surface p-3.5">
                  <span
                    className={`mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full ${
                      st === 'done'
                        ? 'bg-brand text-brand-fg'
                        : st === 'warn'
                          ? 'bg-warn-soft text-warn'
                          : st === 'active'
                            ? 'bg-brand-soft text-brand'
                            : 'bg-surface-2 text-muted'
                    }`}
                    aria-hidden
                  >
                    {st === 'done' ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : st === 'warn' ? (
                      <TriangleAlert className="h-4 w-4" />
                    ) : st === 'active' ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Circle className="h-4 w-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className={`text-sm font-bold ${st === 'pending' ? 'text-muted' : 'text-ink'}`}>
                      {title}
                      <span className="sr-only"> ({st})</span>
                    </p>
                    <p className="text-xs text-muted">
                      {st === 'warn' ? 'Could not save it to your account this time.' : hint}
                    </p>
                  </div>
                </li>
              )
            })}
          </ol>
        )}

        {report.stage === 'done' && (
          <div className="mt-5 space-y-4">
            <div className="flex items-center gap-3 rounded-xl bg-brand-soft p-3.5">
              <FileDown className="h-5 w-5 shrink-0 text-brand" aria-hidden />
              <p className="min-w-0 truncate text-sm font-semibold text-ink">{report.fileName}</p>
            </div>
            {!report.saved && (
              <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-warn-soft p-3.5 text-sm text-ink-2">
                <span>Your PDF was downloaded, but it could not be saved to your account.</span>
                <Button size="sm" variant="secondary" onClick={retrySave}>
                  Try saving again
                </Button>
              </div>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <Button variant="secondary" onClick={() => report.url && triggerDownload(report.url, report.fileName)} icon={<Download className="h-4 w-4" />}>
                Download again
              </Button>
              {report.url && (
                <a href={report.url} target="_blank" rel="noreferrer" className={buttonClass({})}>
                  <ExternalLink className="h-4 w-4" aria-hidden /> Open report
                </a>
              )}
            </div>
          </div>
        )}

        {report.stage === 'error' && (
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={closeReport}>
              Close
            </Button>
            <Button onClick={handleSubmit} icon={<RefreshCw className="h-4 w-4" />}>
              Try again
            </Button>
          </div>
        )}
      </Modal>

      <Modal
        open={showLimitation && !!Limitaions && Limitaions !== ''}
        onClose={() => setShowLimitation(false)}
        title={Limitaions?.[0]?.title ?? 'Method limitations'}
      >
        <ul className="list-disc space-y-2.5 pl-5 text-sm leading-relaxed text-ink-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <li key={i}>{Limitaions?.[i]}</li>
          ))}
        </ul>
        <div className="mt-6 flex justify-end">
          <Button onClick={() => setShowLimitation(false)}>Close</Button>
        </div>
      </Modal>

    </>
  )
}

export default SimulationChart
