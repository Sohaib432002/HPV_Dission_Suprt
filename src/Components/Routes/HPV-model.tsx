/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef } from 'react'

const NODES = {
  S1: {
    id: 'S1',
    label: 'S₁',
    sublabel: 'Unvaccinated',
    x: 90,
    y: 130,
    color: '#3b82f6',
    glow: 'rgba(59,130,246,0.45)',
    border: '#60a5fa',
    textColor: '#bfdbfe',
    description:
      'Susceptible individuals who have NOT received the HPV vaccine. They are fully exposed to infection risk through contact with infected individuals.',
    formula: 'dS₁/dt = A − δS₁ − μS₁',
  },
  S2: {
    id: 'S2',
    label: 'S₂',
    sublabel: 'Vaccinated',
    x: 270,
    y: 130,
    color: '#0d9488',
    glow: 'rgba(13,148,136,0.45)',
    border: '#2dd4bf',
    textColor: '#99f6e4',
    description:
      'Susceptible individuals who have received the HPV vaccine. They have reduced — but not zero — risk of infection. A fraction m gets full immunity and moves directly to R.',
    formula: 'dS₂/dt = δS₁ − (1−m)βS₂I − mS₂ − μS₂',
  },
  I: {
    id: 'I',
    label: 'I',
    sublabel: 'Infected',
    x: 450,
    y: 130,
    color: '#dc2626',
    glow: 'rgba(220,38,38,0.45)',
    border: '#f87171',
    textColor: '#fecaca',
    description:
      'Actively infected individuals. A fraction η recovers naturally, while the remaining (1−η) progress toward cervical cancer (C).',
    formula: 'dI/dt = (1−m)βS₂I − ηI − (1−η)I − μI',
  },
  R: {
    id: 'R',
    label: 'R',
    sublabel: 'Recovered',
    x: 620,
    y: 130,
    color: '#7c3aed',
    glow: 'rgba(124,58,237,0.45)',
    border: '#c4b5fd',
    textColor: '#ddd6fe',
    description:
      'Recovered and immune individuals — either through natural recovery from infection (ηI) or via vaccine-derived immunity (mS₂).',
    formula: 'dR/dt = ηI + mS₂ − μR',
  },
  C: {
    id: 'C',
    label: 'C',
    sublabel: 'Cancer',
    x: 450,
    y: 310,
    color: '#b45309',
    glow: 'rgba(180,83,9,0.45)',
    border: '#fbbf24',
    textColor: '#fde68a',
    description:
      'Individuals who have progressed to cervical cancer due to persistent HPV infection. This compartment represents the severe outcome of untreated infection.',
    formula: 'dC/dt = (1−η)I − μ_c·C',
  },
}


const NODE_R = 44 // radius of node circle

function getCenter(node: { id?: string; label?: string; sublabel?: string; x: any; y: any; color?: string; glow?: string; border?: string; textColor?: string; description?: string; formula?: string }) {
  return { x: node.x + NODE_R, y: node.y + NODE_R }
}

// Straight arrow between two nodes
function straightArrow(from, to, nodes) {
  const f = getCenter(nodes[from])
  const t = getCenter(nodes[to])
  const dx = t.x - f.x
  const dy = t.y - f.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  const ux = dx / dist
  const uy = dy / dist
  const sx = f.x + ux * NODE_R
  const sy = f.y + uy * NODE_R
  const ex = t.x - ux * (NODE_R + 6)
  const ey = t.y - uy * (NODE_R + 6)
  return { sx, sy, ex, ey, mx: (sx + ex) / 2, my: (sy + ey) / 2 }
}

function HPVModelDiagram({ theme }: any) {
  const [active, setActive] = useState(null)
  const [hovered, setHovered] = useState(null)
  const [, setPulse] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Animate pulse on entry
  useEffect(() => {
    timerRef.current = setTimeout(() => setPulse(false), 3000)
    return () => clearTimeout(timerRef.current)
  }, [])


  return (
    <div
      style={{
        fontFamily: "'Syne', sans-serif",
        // background: '#07090f',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 16px 60px',
        boxSizing: 'border-box',
      }}
      className={` ${theme === 'dark' ? 'bg-[#0f172a] bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900' : 'bg-gradient-to-br from-blue-100 via-purple-200 to-indigo-400'} py-32 px-6`}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:wght@400;500&display=swap');
        .node-g { cursor: pointer; transition: filter 0.2s; }
        .node-g:hover .node-circle { filter: brightness(1.25); }
        .node-g:active .node-circle { transform: scale(0.96); }
        .node-circle { transition: r 0.2s, filter 0.2s; }
        @keyframes nodePulse {
          0%, 100% { r: 44; opacity: 1; }
          50% { r: 50; opacity: 0.7; }
        }
        @keyframes flowDash {
          to { stroke-dashoffset: -24; }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { opacity: 0.55; }
          50% { opacity: 0.9; }
        }
        .flow-line {
          stroke-dasharray: 6 4;
          animation: flowDash 1.4s linear infinite;
        }
        .info-panel {
          animation: fadeIn 0.3s ease;
        }
        .legend-dot { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 8px; }
      `}</style>

      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 32, maxWidth: 700 }}>
        <div
          style={{
            fontSize: 11,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#22d3ee',
            fontWeight: 600,
            marginBottom: 10,
          }}
        >
          ● Compartmental Transmission Model
        </div>
        <h1
          style={{
            fontSize: 'clamp(1.6rem,4vw,2.5rem)',
            fontWeight: 800,
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}
          className={`${theme === 'dark' ? 'text-cyan-300' : 'text-blue-500'}`}
        >
          HPV Infection{' '}
          <span
            style={{
              background: 'linear-gradient(110deg,#38bdf8,#818cf8,#c084fc)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Dynamics
          </span>
        </h1>
        <p
          style={{
            fontSize: 13,
            color: '#6b7fa3',
            marginTop: 10,
            fontFamily: "'DM Mono', monospace",
            fontWeight: 400,
          }}
        >
          Click any compartment to explore its role
        </p>
      </div>

      {/* SVG Diagram */}
      <div
        style={{
          width: '100%',
          maxWidth: 820,
          background: 'rgba(13,17,30,0.9)',
          border: '1px solid rgba(99,179,237,0.1)',
          borderRadius: 5,
          padding: '32px 16px 24px',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        {/* Grid texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 5,
            backgroundImage:
              'linear-gradient(rgba(99,179,237,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(99,179,237,0.03) 1px,transparent 1px)',
            backgroundSize: '36px 36px',
            pointerEvents: 'none',
          }}
        />

        <svg
          width="100%"
          viewBox="0 0 800 430"
          xmlns="http://www.w3.org/2000/svg"
          style={{ overflow: 'visible' }}
        >
          <defs>
            {/* Arrow markers per color */}
            {['blue', 'teal', 'red', 'violet', 'amber', 'green'].map((c) => {
              const colors = {
                blue: '#60a5fa',
                teal: '#2dd4bf',
                red: '#f87171',
                violet: '#c4b5fd',
                amber: '#fbbf24',
                green: '#34d399',
              }
              return (
                <marker
                  key={c}
                  id={`arr-${c}`}
                  viewBox="0 0 10 10"
                  refX="8"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path
                    d="M2 1L8 5L2 9"
                    fill="none"
                    stroke={colors[c]}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </marker>
              )
            })}
            {/* Glow filters */}
            {Object.values(NODES).map((n) => (
              <filter key={n.id} id={`glow-${n.id}`} x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="8" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            ))}
          </defs>

          {/* ── Entry arrow ── */}
          <line
            x1="10"
            y1="174"
            x2="82"
            y2="174"
            stroke="#60a5fa"
            strokeWidth="1.8"
            markerEnd="url(#arr-blue)"
            strokeDasharray="5 3"
          />
          <text
            x="46"
            y="161"
            textAnchor="middle"
            fill="#60a5fa"
            fontSize="12"
            fontFamily="'DM Mono',monospace"
          >
            A
          </text>
          <text
            x="46"
            y="191"
            textAnchor="middle"
            fill="#3b5a8a"
            fontSize="10"
            fontFamily="'DM Mono',monospace"
          >
            recruit
          </text>

          {/* ── S1 → S2 ── */}
          {(() => {
            const { sx, sy, ex, ey, mx, my } = straightArrow('S1', 'S2', NODES)
            return (
              <>
                <line
                  x1={sx}
                  y1={sy}
                  x2={ex}
                  y2={ey}
                  stroke="#2dd4bf"
                  strokeWidth="1.8"
                  markerEnd="url(#arr-teal)"
                  className="flow-line"
                />
                <text
                  x={mx}
                  y={my - 12}
                  textAnchor="middle"
                  fill="#2dd4bf"
                  fontSize="12"
                  fontFamily="'DM Mono',monospace"
                >
                  δS₁
                </text>
              </>
            )
          })()}

          {/* ── S2 → I ── */}
          {(() => {
            const { sx, sy, ex, ey, mx, my } = straightArrow('S2', 'I', NODES)
            return (
              <>
                <line
                  x1={sx}
                  y1={sy}
                  x2={ex}
                  y2={ey}
                  stroke="#f87171"
                  strokeWidth="1.8"
                  markerEnd="url(#arr-red)"
                  className="flow-line"
                />
                <text
                  x={mx}
                  y={my - 13}
                  textAnchor="middle"
                  fill="#f87171"
                  fontSize="11"
                  fontFamily="'DM Mono',monospace"
                >
                  (1−m)βS₂I
                </text>
              </>
            )
          })()}

          {/* ── I → R ── */}
          {(() => {
            const { sx, sy, ex, ey, mx, my } = straightArrow('I', 'R', NODES)
            return (
              <>
                <line
                  x1={sx}
                  y1={sy}
                  x2={ex}
                  y2={ey}
                  stroke="#c4b5fd"
                  strokeWidth="1.8"
                  markerEnd="url(#arr-violet)"
                  className="flow-line"
                />
                <text
                  x={mx}
                  y={my - 12}
                  textAnchor="middle"
                  fill="#c4b5fd"
                  fontSize="12"
                  fontFamily="'DM Mono',monospace"
                >
                  ηI
                </text>
              </>
            )
          })()}

          {/* ── I → C (vertical down) ── */}
          {(() => {
            const fc = getCenter(NODES.I)
            const tc = getCenter(NODES.C)
            const sx = fc.x,
              sy = fc.y + NODE_R + 2
            const ex = tc.x,
              ey = tc.y - NODE_R - 6
            const mx = (sx + ex) / 2,
              my = (sy + ey) / 2
            return (
              <>
                <line
                  x1={sx}
                  y1={sy}
                  x2={ex}
                  y2={ey}
                  stroke="#fbbf24"
                  strokeWidth="1.8"
                  markerEnd="url(#arr-amber)"
                  className="flow-line"
                />
                <text
                  x={mx + 16}
                  y={my}
                  textAnchor="start"
                  fill="#fbbf24"
                  fontSize="11"
                  fontFamily="'DM Mono',monospace"
                >
                  (1−η)I
                </text>
              </>
            )
          })()}

          {/* ── S2 → R (arc over top) ── */}
          {(() => {
            const f = getCenter(NODES.S2)
            const t = getCenter(NODES.R)
            const cx = (f.x + t.x) / 2
            return (
              <>
                <path
                  d={`M ${f.x + 10} ${f.y - NODE_R + 6} Q ${cx} 28 ${t.x - 10} ${t.y - NODE_R + 6}`}
                  fill="none"
                  stroke="#34d399"
                  strokeWidth="1.8"
                  markerEnd="url(#arr-green)"
                  strokeDasharray="5 3"
                />
                <text
                  x={cx}
                  y={22}
                  textAnchor="middle"
                  fill="#34d399"
                  fontSize="12"
                  fontFamily="'DM Mono',monospace"
                >
                  mS₂
                </text>
                <text
                  x={cx}
                  y={38}
                  textAnchor="middle"
                  fill="#1a6643"
                  fontSize="10"
                  fontFamily="'DM Mono',monospace"
                >
                  vaccine immunity
                </text>
              </>
            )
          })()}

          {/* ── NODES ── */}
          {Object.values(NODES).map((node) => {
            const cx = node.x + NODE_R
            const cy = node.y + NODE_R
            const isActive = active === node.id
            const isHovered = hovered === node.id
            return (
              <g
                key={node.id}
                className="node-g"
                onClick={() => setActive(active === node.id ? null : node.id)}
                onMouseEnter={() => setHovered(node.id)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* Outer glow ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isActive || isHovered ? 56 : 52}
                  fill="none"
                  stroke={node.border}
                  strokeWidth={isActive ? 1.5 : 0.5}
                  opacity={isActive ? 0.6 : isHovered ? 0.35 : 0.15}
                  style={{ transition: 'all 0.3s' }}
                />
                {/* Glow blob */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={48}
                  fill={node.color}
                  opacity={isActive ? 0.22 : isHovered ? 0.15 : 0.08}
                  style={{ filter: `blur(12px)`, transition: 'opacity 0.3s' }}
                />
                {/* Main circle */}
                <circle
                  className="node-circle"
                  cx={cx}
                  cy={cy}
                  r={NODE_R}
                  fill={node.color}
                  fillOpacity={isActive ? 0.95 : 0.7}
                  stroke={node.border}
                  strokeWidth={isActive ? 2 : 1.2}
                  style={{
                    transition: 'all 0.3s',
                    filter: isActive ? `drop-shadow(0 0 12px ${node.glow})` : 'none',
                  }}
                />
                {/* Label */}
                <text
                  x={cx}
                  y={cy - 6}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fill={node.textColor}
                  fontSize="22"
                  fontWeight="700"
                  fontFamily="'Syne',sans-serif"
                >
                  {node.label}
                </text>
                {/* Sublabel */}
                <text
                  x={cx}
                  y={cy + 16}
                  textAnchor="middle"
                  fill={node.textColor}
                  fontSize="9"
                  fontWeight="500"
                  fontFamily="'DM Mono',monospace"
                  opacity={0.75}
                  letterSpacing="0.08em"
                >
                  {node.sublabel.toUpperCase()}
                </text>
              </g>
            )
          })}
        </svg>
      </div>

      {/* Info Panel */}

      {/* Legend */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px 24px',
          marginTop: 24,
          justifyContent: 'center',
          maxWidth: 820,
        }}
      >
        {Object.values(NODES).map((n) => (
          <div
            key={n.id}
            onClick={() => setActive(active === n.id ? null : n.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: 999,
              background: active === n.id ? `${n.color}22` : 'rgba(13,17,30,0.7)',
              border: `1px solid ${active === n.id ? `${n.border}88` : 'rgba(99,179,237,0.1)'}`,
              transition: 'all 0.2s ease',
            }}
          >
            <span
              className="legend-dot"
              style={{ background: n.color, boxShadow: `0 0 6px ${n.glow}` }}
            />
            <span style={{ fontSize: 12, color: '#94a3c4', fontFamily: "'DM Mono',monospace" }}>
              <strong style={{ color: n.textColor }}>{n.label}</strong> — {n.sublabel}
            </span>
          </div>
        ))}
      </div>

      {/* Parameter key */}
      <div
        style={{
          marginTop: 28,
          maxWidth: 820,
          width: '100%',
          background: 'rgba(13,17,30,0.7)',
          border: '1px solid rgba(99,179,237,0.07)',
          borderRadius: 12,
          padding: '16px 24px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px 32px',
        }}
      >
        <div
          style={{
            fontSize: 10,
            color: '#3d5070',
            letterSpacing: '0.12em',
            fontFamily: "'DM Mono',monospace",
            textTransform: 'uppercase',
            width: '100%',
            marginBottom: 6,
          }}
        >
          Parameter key
        </div>
        {[
          ['A', 'recruitment rate'],
          ['δ', 'vaccination rate'],
          ['β', 'transmission rate'],
          ['m', 'vaccine efficacy'],
          ['η', 'recovery rate'],
          ['μ', 'natural death rate'],
        ].map(([p, d]) => (
          <div
            key={p}
            style={{ fontSize: 12, fontFamily: "'DM Mono',monospace", color: '#6b7fa3' }}
          >
            <span style={{ color: '#e2e8f0', fontWeight: 500 }}>{p}</span> = {d}
          </div>
        ))}
      </div>
    </div>
  )
}

export default HPVModelDiagram
