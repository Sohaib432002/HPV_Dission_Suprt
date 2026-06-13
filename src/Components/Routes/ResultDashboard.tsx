/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from 'react'

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

const RISK_STYLE: Record<string, { color: string; bg: string }> = {
  High: { color: '#fca5a5', bg: 'rgba(239,68,68,0.15)' },
  Medium: { color: '#fcd34d', bg: 'rgba(245,158,11,0.12)' },
  Low: { color: '#86efac', bg: 'rgba(34,197,94,0.12)' },
}

const STAGE_COLOR: Record<string, string> = {
  'Stage 0': '#94a3b8',
  'Stage I': '#22d3ee',
  'Stage II': '#a78bfa',
  'Stage III': '#f87171',
  'Stage IV': '#ef4444',
}

const Counter = ({ target, suffix = '' }: { target: number; suffix?: string }) => {
  const [val, setVal] = useState(0)
  useEffect(() => {
    let start = 0
    const step = Math.ceil(target / 40)
    const id = setInterval(() => {
      start = Math.min(start + step, target)
      setVal(start)
      if (start >= target) clearInterval(id)
    }, 30)
    return () => clearInterval(id)
  }, [target])
  return (
    <>
      {val.toLocaleString()}
      {suffix}
    </>
  )
}

const ResultDashboard = ({ data, setshowResult }: DashboardProps) => {
  const [visible, setVisible] = useState(false)
  if (!data) return null

  useEffect(() => {
    setTimeout(() => setVisible(true), 50)
  }, [])

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes dashFade  { from { opacity:0 } to { opacity:1 } }
        @keyframes dashSlide { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes barGrow   { from { width:0 } }
        @keyframes rowFade   { from { opacity:0; transform:translateX(-8px) } to { opacity:1; transform:translateX(0) } }
        .result-row:hover { background: rgba(34,211,238,0.04) !important; }
      `}</style>

      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(3,7,18,0.97)',
          zIndex: 100,
          overflowY: 'auto',
          fontFamily: "'Inter', sans-serif",
          animation: 'dashFade 0.35s ease',
        }}
        className="p-t-[40px]"
      >
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(34,211,238,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }}
        />

        <div
          style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '36px 24px' }}
        >
          {/* Top bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 47,
              marginBottom: 36,
              opacity: visible ? 1 : 0,
              transform: visible ? 'none' : 'translateY(-10px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: '0.12em',
                  color: '#22d3ee',
                  textTransform: 'uppercase',
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                ● LIVE ANALYSIS
              </div>
              <h1
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: '#f1f5f9',
                  letterSpacing: '-0.02em',
                }}
              >
                HPV{' '}
                <span
                  style={{
                    background: 'linear-gradient(135deg,#22d3ee,#a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Analysis
                </span>{' '}
                Dashboard
              </h1>
            </div>
            <button
              onClick={() => setshowResult(false)}
              style={{
                background: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.35)',
                borderRadius: 10,
                color: '#fca5a5',
                fontSize: 12,
                fontWeight: 500,
                letterSpacing: '0.08em',
                padding: '10px 18px',
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239,68,68,0.2)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(239,68,68,0.1)'
              }}
            >
              ✕ Close
            </button>
          </div>

          {/* Summary cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: 16,
              marginBottom: 28,
            }}
          >
            {[
              {
                label: 'Images Analyzed',
                value: data.images_analyzed,
                suffix: '',
                accent: '#3b82f6',
                icon: '🔬',
              },
              {
                label: 'Total Cells',
                value: data.total_cells,
                suffix: '',
                accent: '#22d3ee',
                icon: '🧫',
              },
              {
                label: 'Infected Cells',
                value: data.total_infected_cells,
                suffix: '',
                accent: '#f87171',
                icon: '🦠',
              },
              {
                label: 'Infection Rate',
                value: data.overall_infection_rate,
                suffix: '%',
                accent: '#a78bfa',
                icon: '📊',
              },
            ].map((card, i) => (
              <div
                key={card.label}
                style={{
                  background: 'rgba(15,23,42,0.8)',
                  border: `1px solid ${card.accent}22`,
                  borderRadius: 16,
                  padding: '22px 22px',
                  backdropFilter: 'blur(10px)',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'none' : 'translateY(16px)',
                  transition: `opacity 0.5s ease ${i * 80}ms, transform 0.5s ease ${i * 80}ms`,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{ position: 'absolute', top: 16, right: 16, fontSize: 22, opacity: 0.15 }}
                >
                  {card.icon}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    letterSpacing: '0.14em',
                    color: '#64748b',
                    textTransform: 'uppercase',
                    marginBottom: 10,
                  }}
                >
                  {card.label}
                </div>
                <div style={{ fontSize: 28, fontWeight: 700, color: card.accent }}>
                  {visible ? <Counter target={Number(card.value)} suffix={card.suffix} /> : '0'}
                </div>
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: `linear-gradient(90deg, ${card.accent}66, transparent)`,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Infection progress */}
          <div
            style={{
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              padding: '22px 24px',
              marginBottom: 28,
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.5s ease 0.35s',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 14,
              }}
            >
              <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase' }}>
                Overall Infection Rate
              </span>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#f87171' }}>
                {data.overall_infection_rate}%
              </span>
            </div>
            <div
              style={{
                background: 'rgba(30,41,59,0.9)',
                borderRadius: 100,
                height: 20,
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #7c3aed, #ef4444)',
                  borderRadius: 100,
                  width: visible ? `${data.overall_infection_rate}%` : '0%',
                  transition: 'width 1.4s cubic-bezier(0.34,1.56,0.64,1) 0.5s',
                  boxShadow: '0 0 16px rgba(239,68,68,0.5)',
                }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              {[0, 25, 50, 75, 100].map((v) => (
                <span key={v} style={{ fontSize: 10, color: '#334155' }}>
                  {v}%
                </span>
              ))}
            </div>
          </div>

          {/* Table */}
          <div
            style={{
              background: 'rgba(15,23,42,0.8)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 18,
              overflow: 'hidden',
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.5s ease 0.5s',
            }}
          >
            <div
              style={{
                padding: '18px 22px',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span style={{ fontSize: 16 }}>📊</span>
              <span style={{ fontWeight: 600, fontSize: 14, color: '#f1f5f9' }}>
                Image Analysis Results
              </span>
              <span style={{ marginLeft: 'auto', fontSize: 11, color: '#64748b' }}>
                {data.image_results.length} samples
              </span>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <thead>
                  <tr style={{ background: 'rgba(34,211,238,0.05)' }}>
                    {[
                      'Image',
                      'Disease',
                      'Stage',
                      'Risk',
                      'Confidence',
                      'Total Cells',
                      'Infected',
                      'Rate',
                    ].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: '12px 16px',
                          fontSize: 11,
                          color: '#475569',
                          textTransform: 'uppercase',
                          fontWeight: 500,
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.image_results.map((item, i) => {
                    const rStyle = RISK_STYLE[item.risk] ?? {
                      color: '#94a3b8',
                      bg: 'rgba(148,163,184,0.1)',
                    }
                    const stageColor = STAGE_COLOR[item.stage] ?? '#94a3b8'
                    return (
                      <tr
                        key={i}
                        className="result-row"
                        style={{
                          borderBottom: '1px solid rgba(255,255,255,0.04)',
                          animation: visible ? `rowFade 0.4s ease ${i * 70 + 600}ms both` : 'none',
                        }}
                      >
                        <td style={{ padding: '12px 16px' }}>
                          <div
                            style={{
                              width: 46,
                              height: 46,
                              borderRadius: 10,
                              background: 'linear-gradient(135deg,#1e293b,#0f172a)',
                              border: '1px solid rgba(34,211,238,0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 20,
                              overflow: 'hidden',
                            }}
                          >
                            <img
                              src={`http://127.0.0.1:8000/media/${item.image}`}
                              alt="cell"
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).style.display = 'none'
                              }}
                            />
                            🔬
                          </div>
                        </td>
                        <td
                          style={{
                            padding: '12px 16px',
                            fontWeight: 600,
                            fontSize: 13,
                            color: '#a78bfa',
                          }}
                        >
                          {item.result}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              padding: '3px 10px',
                              borderRadius: 100,
                              fontSize: 11,
                              background: `${stageColor}18`,
                              color: stageColor,
                              border: `1px solid ${stageColor}44`,
                            }}
                          >
                            {item.stage}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              padding: '3px 10px',
                              borderRadius: 100,
                              fontSize: 11,
                              background: rStyle.bg,
                              color: rStyle.color,
                            }}
                          >
                            {item.risk}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div
                              style={{
                                width: 40,
                                height: 4,
                                background: 'rgba(30,41,59,0.9)',
                                borderRadius: 100,
                                overflow: 'hidden',
                              }}
                            >
                              <div
                                style={{
                                  height: '100%',
                                  width: `${item.confidence}%`,
                                  background: '#34d399',
                                  borderRadius: 100,
                                }}
                              />
                            </div>
                            <span style={{ fontSize: 13, fontWeight: 600, color: '#34d399' }}>
                              {item.confidence}%
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: '#94a3b8' }}>
                          {item.total_cells.toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: '12px 16px',
                            fontSize: 13,
                            fontWeight: 600,
                            color: '#f87171',
                          }}
                        >
                          {item.infected_cells.toLocaleString()}
                        </td>
                        <td
                          style={{
                            padding: '12px 16px',
                            fontSize: 11,
                            background: 'rgba(239,68,68,0.12)',
                            color: '#fca5a5',
                            borderRadius: 100,
                            textAlign: 'center',
                          }}
                        >
                          {item.infection_rate}%
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <button
              onClick={() => setshowResult(false)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(34,211,238,0.3)',
                borderRadius: 10,
                color: '#22d3ee',
                fontSize: 12,
                fontWeight: 500,
                padding: '12px 32px',
                cursor: 'pointer',
              }}
            >
              ← Back to Pipeline
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ResultDashboard
