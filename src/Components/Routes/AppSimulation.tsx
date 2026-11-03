import { useState } from 'react'
import { Activity, FlaskConical, LineChart, RotateCcw } from 'lucide-react'
import SimulationChart from './Graph'
import {
  Button,
  Card,
  CardHeader,
  Container,
  EmptyState,
  PageHeader,
  ParamSlider,
  Spinner,
  useToast,
} from '../ui'
import { apiFetch } from '../../lib/api'

const methodLimitations = {
  rungeKutta: [
    { title: 'Runge-Kutta Method Limitations' },
    'Requires multiple function evaluations per step, which increases computational cost.',
    'Becomes inefficient for large systems of differential equations with many variables.',
    'Accuracy and stability depend strongly on the chosen step size.',
    'Not well suited for stiff differential equations without adaptive step-size techniques.',
    'Consumes more processing time and memory compared to simpler methods like Euler’s method.',
  ],
  eulerMethod: [
    { title: "Euler's Method Limitations" },
    'Has low accuracy because it is a first-order numerical method.',
    'Numerical errors accumulate quickly over time, especially in long simulations.',
    'Requires very small step sizes to achieve reasonable accuracy.',
    'Can become unstable or diverge for nonlinear or stiff differential equations.',
    'Poorly represents complex dynamics in systems such as biological or epidemiological models.',
  ],
  nsfdMethod: [
    { title: 'NSFD Method Limitations' },
    'Designing suitable denominator functions and discretization schemes can be complex.',
    'The formulation often depends on the specific mathematical model being studied.',
    'More difficult to implement compared to classical methods like Euler or Runge–Kutta.',
    'Less standardized and not widely supported in common numerical libraries.',
    'Requires deeper mathematical understanding to construct stable and accurate schemes.',
  ],
}

type Method = keyof typeof methodLimitations

const methods: { key: Method; label: string; endpoint: string; variant: 'primary' | 'secondary' }[] = [
  { key: 'rungeKutta', label: 'Run Runge-Kutta (RK)', endpoint: '/simulation/', variant: 'primary' },
  { key: 'eulerMethod', label: "Run Euler's method", endpoint: '/simulation/hpv-EulersMethod', variant: 'secondary' },
  { key: 'nsfdMethod', label: 'Run NSFD', endpoint: '/simulation/hpv-NSFDmethod', variant: 'secondary' },
]

const DEFAULTS = {
  recruitmentRate: 50,
  transmissionRate: 0.42,
  naturalDeathRate: 0.014,
  transitionRate: 0.1,
  recoveryProportion: 0.98,
  cancerProgressionRate: 0.003,
  stepSize: 1,
}

/** Compartment flow chart (A → S1 → S2 → I → R, with I → C and S2 → R). */
function ModelFlow() {
  const box = (x: number, y: number, label: string, tone: string) => (
    <g className={tone}>
      <rect x={x} y={y} width={80} height={50} rx={12} fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeWidth={2} />
      <text x={x + 40} y={y + 31} textAnchor="middle" fill="currentColor" className="font-display text-[18px] font-bold">
        {label}
      </text>
    </g>
  )
  const arrow = (d: string) => (
    <path d={d} fill="none" className="animate-flow stroke-muted" strokeWidth={2} markerEnd="url(#sim-arrow)" />
  )
  const text = (x: number, y: number, t: string) => (
    <text x={x} y={y} textAnchor="middle" className="fill-ink-2 text-[13px] font-semibold">
      {t}
    </text>
  )

  return (
    <svg viewBox="0 0 720 310" role="img" aria-label="Compartment flow of the HPV model" className="mx-auto w-full min-w-[520px] max-w-3xl">
      <defs>
        <marker id="sim-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" className="fill-muted" />
        </marker>
      </defs>
      {box(100, 130, 'S₁', 'text-info')}
      {box(260, 130, 'S₂', 'text-brand')}
      {box(420, 130, 'I', 'text-danger')}
      {box(580, 130, 'R', 'text-violet')}
      {box(420, 250, 'C', 'text-warn')}
      {arrow('M30 155 H98')}
      {text(64, 142, 'A')}
      {arrow('M182 155 H258')}
      {text(220, 142, 'δS₁')}
      {arrow('M342 155 H418')}
      {text(380, 142, '(1−m)βS₂I')}
      {arrow('M502 155 H578')}
      {text(540, 142, 'ηI')}
      {arrow('M460 182 V248')}
      {text(494, 218, '(1−η)I')}
      {arrow('M300 128 Q460 40 620 128')}
      {text(460, 66, 'mS₂')}
    </svg>
  )
}

const AppSimulation = () => {
  const toast = useToast()
  const [p, setP] = useState(DEFAULTS)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [Limitaions, setLimitations] = useState(methodLimitations.rungeKutta)

  const set = (key: keyof typeof DEFAULTS) => (value: number) => setP((prev) => ({ ...prev, [key]: value }))

  const validateParams = () => {
    if (Object.values(p).some((v) => v === 0)) {
      toast.error('Please fill all parameters')
      return false
    }
    return true
  }

  const run = async (method: Method, endpoint: string) => {
    if (!validateParams()) return
    setLoading(true)
    setData(null)
    setLimitations(methodLimitations[method])
    try {
      const response = await apiFetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recruitment_rate: p.recruitmentRate,
          transmission_rate: p.transmissionRate,
          natural_death_rate: p.naturalDeathRate,
          transition_rate: p.transitionRate,
          recovery_proportion: p.recoveryProportion,
          cancer_progression_rate: p.cancerProgressionRate,
          stepSize: p.stepSize,
        }),
      })
      const result = await response.json()
      if (result?.error) {
        toast.error(`Simulation failed: ${result.error}`)
      } else {
        setData(result)
      }
    } catch {
      toast.error(
        method === 'eulerMethod'
          ? 'The graph shows divergent behavior or overly complex calculations. Try different parameters.'
          : 'Simulation failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const resetParams = () => {
    setP(DEFAULTS)
    setData(null)
  }

  const params = [
    { key: 'recruitmentRate', label: 'Growth rate (α)', hint: 'Rate at which new individuals enter the population', min: 0.001, max: 50, step: 0.001 },
    { key: 'transmissionRate', label: 'Transmission rate (β)', hint: 'Probability of infection per contact', min: 0.001, max: 3, step: 0.001 },
    { key: 'naturalDeathRate', label: 'Natural death rate (μ)', hint: 'Rate at which individuals naturally die', min: 0.001, max: 3, step: 0.001 },
    { key: 'transitionRate', label: 'Transition rate (δ)', hint: 'Rate of progression between susceptible stages', min: 0.001, max: 3, step: 0.001 },
    { key: 'recoveryProportion', label: 'Recovery proportion (m)', hint: 'Fraction of infected who recover', min: 0.001, max: 3, step: 0.001 },
    { key: 'cancerProgressionRate', label: 'Cancer progression rate (n)', hint: 'Rate at which infected progress to cancer', min: 0.001, max: 3, step: 0.001 },
    { key: 'stepSize', label: 'Step size (h)', hint: 'Increment used by the numerical solver', min: 1, max: 500, step: 1, decimals: 0 },
  ] as const

  return (
    <Container className="space-y-8 py-10 sm:py-12">
      <PageHeader
        title="HPV infection simulation lab"
        description="Adjust epidemiological parameters and compare numerical solvers to explore how HPV spreads and may progress to cervical cancer, and to evaluate vaccination, screening and treatment strategies."
      />

      <div className="grid items-start gap-6 lg:grid-cols-[400px_1fr]">
        <Card className="lg:sticky lg:top-24">
          <CardHeader
            title="Epidemiological parameters"
            description="Drag a slider or type an exact value."
            icon={Activity}
          />
          <div className="scrollbar-thin max-h-[520px] space-y-5 overflow-y-auto p-5 sm:p-6">
            {params.map(({ key, ...rest }) => (
              <ParamSlider key={key} {...rest} value={p[key]} onChange={set(key)} />
            ))}
          </div>
          <div className="space-y-2.5 border-t border-line p-5 sm:p-6">
            {methods.map((m) => (
              <Button
                key={m.key}
                full
                variant={m.variant}
                disabled={loading}
                onClick={() => run(m.key, m.endpoint)}
                icon={<FlaskConical className="h-4 w-4" />}
              >
                {m.label}
              </Button>
            ))}
            <Button full variant="ghost" onClick={resetParams} icon={<RotateCcw className="h-4 w-4" />}>
              Reset parameters
            </Button>
          </div>
        </Card>

        <div className="min-w-0 space-y-6">
          <Card>
            <CardHeader
              title="Simulation results"
              description="Infection trends, recovered individuals and possible cancer progression over time."
              icon={LineChart}
            />
            <div className="flex min-h-[460px] items-center justify-center p-4 sm:p-6">
              {loading ? (
                <Spinner label="Running simulation…" />
              ) : data ? (
                <SimulationChart
                  mainResult={null}
                  Limitaions={Limitaions}
                  data={data}
                  startYear={2026}
                  PatientDetails={undefined}
                />
              ) : (
                <EmptyState
                  icon={LineChart}
                  title="No simulation yet"
                  description="Choose a solver on the left to visualize infection dynamics."
                />
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Model structure" description="How individuals move between compartments." />
            <div className="overflow-x-auto p-4 sm:p-6">
              <ModelFlow />
            </div>
          </Card>
        </div>
      </div>
    </Container>
  )
}

export default AppSimulation
