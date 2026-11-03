import { useState } from 'react'

type NodeId = 'S1' | 'S2' | 'I' | 'R' | 'C'

type ModelNode = {
  id: NodeId
  label: string
  sublabel: string
  x: number
  y: number
  tone: string // tailwind text colour, drives currentColor in the SVG
  description: string
  formula: string
}

const R = 42 // node radius

const NODES: ModelNode[] = [
  {
    id: 'S1',
    label: 'S₁',
    sublabel: 'Unvaccinated',
    x: 130,
    y: 150,
    tone: 'text-info',
    description:
      'Susceptible individuals who have NOT received the HPV vaccine. They are fully exposed to infection risk through contact with infected individuals.',
    formula: 'dS₁/dt = A − δS₁ − μS₁',
  },
  {
    id: 'S2',
    label: 'S₂',
    sublabel: 'Vaccinated',
    x: 310,
    y: 150,
    tone: 'text-brand',
    description:
      'Susceptible individuals who have received the HPV vaccine. They have reduced — but not zero — risk of infection. A fraction m gets full immunity and moves directly to R.',
    formula: 'dS₂/dt = δS₁ − (1−m)βS₂I − mS₂ − μS₂',
  },
  {
    id: 'I',
    label: 'I',
    sublabel: 'Infected',
    x: 490,
    y: 150,
    tone: 'text-danger',
    description:
      'Actively infected individuals. A fraction η recovers naturally, while the remaining (1−η) progress toward cervical cancer (C).',
    formula: 'dI/dt = (1−m)βS₂I − ηI − (1−η)I − μI',
  },
  {
    id: 'R',
    label: 'R',
    sublabel: 'Recovered',
    x: 670,
    y: 150,
    tone: 'text-violet',
    description:
      'Recovered and immune individuals — either through natural recovery from infection (ηI) or via vaccine-derived immunity (mS₂).',
    formula: 'dR/dt = ηI + mS₂ − μR',
  },
  {
    id: 'C',
    label: 'C',
    sublabel: 'Cancer',
    x: 490,
    y: 320,
    tone: 'text-warn',
    description:
      'Individuals who have progressed to cervical cancer due to persistent HPV infection. This compartment represents the severe outcome of untreated infection.',
    formula: 'dC/dt = (1−η)I − μ_c·C',
  },
]

const PARAMS: [string, string][] = [
  ['A', 'recruitment rate'],
  ['δ', 'vaccination rate'],
  ['β', 'transmission rate'],
  ['m', 'vaccine efficacy'],
  ['η', 'recovery rate'],
  ['μ', 'natural death rate'],
]

function Arrow({ d, label, lx, ly }: { d: string; label: string; lx: number; ly: number }) {
  return (
    <g>
      <path
        d={d}
        fill="none"
        className="animate-flow stroke-muted"
        strokeWidth={2}
        markerEnd="url(#arrowhead)"
      />
      <text x={lx} y={ly} textAnchor="middle" className="fill-ink-2 text-[13px] font-semibold">
        {label}
      </text>
    </g>
  )
}

export default function HPVModelDiagram() {
  const [active, setActive] = useState<NodeId | null>(null)
  const selected = NODES.find((n) => n.id === active)

  const toggle = (id: NodeId) => setActive((cur) => (cur === id ? null : id))

  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-x-auto rounded-2xl border border-line bg-surface p-4 shadow-card sm:p-6">
        <svg
          viewBox="0 0 760 390"
          role="group"
          aria-label="HPV compartmental model diagram"
          className="mx-auto min-w-[560px] w-full"
        >
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
              <path d="M0 0 L8 4 L0 8 Z" className="fill-muted" />
            </marker>
          </defs>

          <Arrow d="M20 150 H86" label="A" lx={53} ly={136} />
          <Arrow d="M176 150 H262" label="δ" lx={219} ly={136} />
          <Arrow d="M356 150 H442" label="(1−m)βS₂I" lx={399} ly={136} />
          <Arrow d="M536 150 H622" label="η" lx={579} ly={136} />
          <Arrow d="M490 196 V272" label="(1−η)" lx={522} ly={238} />
          <Arrow d="M310 106 Q490 20 670 106" label="mS₂" lx={490} ly={50} />

          {NODES.map((n) => {
            const isActive = active === n.id
            return (
              <g
                key={n.id}
                role="button"
                tabIndex={0}
                aria-pressed={isActive}
                aria-label={`${n.sublabel} compartment`}
                onClick={() => toggle(n.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    toggle(n.id)
                  }
                }}
                className={`${n.tone} cursor-pointer outline-none [&:focus-visible>circle]:stroke-[4]`}
              >
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={R}
                  fill="currentColor"
                  fillOpacity={isActive ? 0.28 : 0.12}
                  stroke="currentColor"
                  strokeWidth={isActive ? 3 : 2}
                  className="transition-all duration-200 hover:fill-opacity-25"
                />
                <text
                  x={n.x}
                  y={n.y + 7}
                  textAnchor="middle"
                  fill="currentColor"
                  className="font-display text-[22px] font-bold"
                >
                  {n.label}
                </text>
                <text
                  x={n.x}
                  y={n.y + R + 20}
                  textAnchor="middle"
                  className="fill-muted text-[12px] font-medium"
                >
                  {n.sublabel}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      <div className="mt-4 min-h-[112px]" aria-live="polite">
        {selected ? (
          <div className="animate-rise rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
            <div className="flex items-center gap-2.5">
              <span className={`font-display text-xl font-bold ${selected.tone}`}>{selected.label}</span>
              <span className="text-sm font-semibold text-ink">{selected.sublabel}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{selected.description}</p>
            <code className="mt-3 block overflow-x-auto rounded-lg bg-surface-2 px-3 py-2 font-mono text-sm text-ink">
              {selected.formula}
            </code>
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-line p-5 text-center text-sm text-muted">
            Select a compartment to see its role and governing equation.
          </p>
        )}
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 rounded-2xl bg-surface-2 p-5 text-sm sm:grid-cols-3">
        {PARAMS.map(([symbol, meaning]) => (
          <div key={symbol} className="flex gap-2">
            <dt className="font-display font-bold text-ink">{symbol}</dt>
            <dd className="text-muted">= {meaning}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
