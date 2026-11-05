import { useMemo, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Badge, Card, Container, LinkButton, SectionHeading } from '../ui'

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

type Level = 'simple' | 'research'

/** A block of equations. Scrolls sideways on small screens instead of breaking. */
const Eq = ({ children }: { children: ReactNode }) => (
  <pre className="overflow-x-auto rounded-xl bg-surface-2 px-4 py-3 font-mono text-[13px] leading-7 text-ink">{children}</pre>
)

const Say = ({ children }: { children: ReactNode }) => (
  <p className="mt-2 rounded-xl border-l-4 border-brand bg-brand-soft px-4 py-2.5 text-sm leading-relaxed text-ink-2">
    <strong className="text-ink">In words: </strong>
    {children}
  </p>
)

const Note = ({ title, children }: { title: string; children: ReactNode }) => (
  <div className="rounded-2xl border border-line bg-surface p-5">
    <h3 className="text-base font-bold text-ink">{title}</h3>
    <div className="mt-2 space-y-2 text-sm leading-relaxed text-ink-2">{children}</div>
  </div>
)

const P = ({ children }: { children: ReactNode }) => <p className="text-base leading-relaxed text-ink-2">{children}</p>

/* ------------------------------------------------------------------ */
/* The model in code, so the live graph uses the same equations        */
/* ------------------------------------------------------------------ */

const FIXED = { A: 50, mu: 0.014, delta: 0.1, c: 0.01 }

function equilibriumI(m: number, beta: number) {
  const { A, mu, delta } = FIXED
  const S1 = A / (delta + mu)
  const r0 = ((1 - m) * beta * delta * A) / ((mu + 1) * (delta + mu) * (mu + m))
  if (r0 <= 1) return { r0, I: 0 }
  const S2 = (mu + 1) / ((1 - m) * beta)
  return { r0, I: (delta * S1 - (mu + m) * S2) / (mu + 1) }
}

/** Non-standard finite difference run (same scheme as the server's NSFD solver). */
function simulateInfected(m: number, beta: number, h = 0.5, horizon = 200) {
  const { A, mu, delta, c } = FIXED
  const eta = 1 - c
  let [S1, S2, I, R, C] = [0.6, 0.2, 0.1, 0.05, 0.05]
  const out: number[] = [I]
  for (let t = 0; t < horizon; t += h) {
    const n1 = (S1 + h * A) / (1 + h * (delta + mu))
    const n2 = (S2 + h * delta * S1) / (1 + h * (mu + m) + h * (1 - m) * beta * I)
    const nI = (I + h * (1 - m) * beta * S2 * I) / (1 + h * (mu + 1))
    const nR = (R + h * m * S2 + h * eta * I) / (1 + h * mu)
    const nC = (C + h * c * I) / (1 + h * mu)
    ;[S1, S2, I, R, C] = [n1, n2, nI, nR, nC]
    out.push(I)
  }
  return out
}

/** Live graph: drag the sliders and watch the infected group settle at its equilibrium. */
function LiveModel() {
  const [m, setM] = useState(0.5)
  const [beta, setBeta] = useState(0.42)
  const { series, eq } = useMemo(() => ({ series: simulateInfected(m, beta), eq: equilibriumI(m, beta) }), [m, beta])

  const W = 640
  const H = 220
  const pad = { l: 46, r: 12, t: 12, b: 28 }
  const top = Math.max(1, ...series, eq.I) * 1.12
  const x = (i: number) => pad.l + (i / (series.length - 1)) * (W - pad.l - pad.r)
  const y = (v: number) => H - pad.b - (v / top) * (H - pad.t - pad.b)
  const line = series.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')

  const slider = (label: string, value: number, set: (v: number) => void, min: number, max: number, step: number) => (
    <label className="block">
      <span className="flex items-center justify-between text-sm font-semibold text-ink">
        {label}
        <span className="font-mono">{value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(+e.target.value)}
        className="range mt-2"
        style={{ '--fill': `${((value - min) / (max - min)) * 100}%` } as CSSProperties}
      />
    </label>
  )

  return (
    <Card className="p-5 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="space-y-5">
          {slider('Vaccine protection (m)', m, setM, 0, 1, 0.01)}
          {slider('How easily HPV spreads (β)', beta, setBeta, 0.01, 3, 0.01)}
          <div className="rounded-xl bg-surface-2 p-4 text-sm text-ink-2">
            <p>
              R₀ = <strong className="font-mono text-ink">{eq.r0.toFixed(2)}</strong>
            </p>
            <p className="mt-1">
              Equilibrium infected I* = <strong className="font-mono text-ink">{eq.I.toFixed(1)}</strong>
            </p>
            <p className="mt-2 text-xs text-muted">
              {eq.r0 > 1 ? 'R₀ is above 1, so the infection settles at a steady level.' : 'R₀ is 1 or less, so the infection dies out.'}
            </p>
          </div>
        </div>
        <div>
          <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Infected people over time" className="w-full">
            <line x1={pad.l} x2={W - pad.r} y1={H - pad.b} y2={H - pad.b} className="stroke-line" />
            <line x1={pad.l} x2={pad.l} y1={pad.t} y2={H - pad.b} className="stroke-line" />
            <line x1={pad.l} x2={W - pad.r} y1={y(eq.I)} y2={y(eq.I)} strokeDasharray="5 5" className="stroke-brand" />
            <text x={W - pad.r} y={y(eq.I) - 6} textAnchor="end" className="fill-brand text-[11px] font-semibold">
              equilibrium I*
            </text>
            <path d={line} fill="none" strokeWidth={2.5} className="stroke-danger" />
            <text x={pad.l - 6} y={y(top) + 12} textAnchor="end" className="fill-muted text-[10px]">
              {Math.round(top)}
            </text>
            <text x={pad.l - 6} y={H - pad.b} textAnchor="end" className="fill-muted text-[10px]">
              0
            </text>
            <text x={W / 2} y={H - 6} textAnchor="middle" className="fill-muted text-[11px]">
              time
            </text>
          </svg>
          <p className="mt-1 text-center text-xs text-muted">
            Red line: infected people over time (computed in your browser with the NSFD scheme). Dashed line: the
            equilibrium predicted by the formula. They meet.
          </p>
        </div>
      </div>
    </Card>
  )
}

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */

const groups: [string, string, string][] = [
  ['S₁', 'Healthy, not vaccinated', 'Can catch HPV with nothing protecting them.'],
  ['S₂', 'Healthy, vaccinated', 'Partly protected. Some become fully immune.'],
  ['I', 'Infected', 'Currently carry HPV and can pass it on.'],
  ['R', 'Recovered / immune', 'Cleared the virus or were fully protected by the vaccine.'],
  ['C', 'Cancer', 'A small share of infections that became cervical cancer.'],
]

const params: [string, string, string, string][] = [
  ['A', 'New people entering per unit time', '50', 'Births or people reaching the age group.'],
  ['β', 'Transmission rate', '0.42', 'How easily HPV passes between people. Higher spreads faster.'],
  ['μ', 'Natural death rate', '0.014', 'Everyone leaves each group at this rate.'],
  ['δ', 'Vaccination rate', '0.1', 'How fast S₁ people become S₂.'],
  ['m', 'Vaccine protection', '0.5', 'Between 0 and 1. 1 means fully protected.'],
  ['c', 'Share of infections that become cancer', '0.01', 'The rest (η = 1 − c) clear on their own.'],
]

const solverRows: [string, string, string, string, string][] = [
  ['Exact (analytic)', '438.6', '4.83', '40.81', '29.15'],
  ['RK / LSODA', '438.6', '4.83', '40.81', '29.14'],
  ['Euler (h = 0.1)', '438.6', '4.83', '40.81', '29.14'],
  ['NSFD (h = 0.1)', '438.6', '4.83', '40.81', '29.14'],
]

const done: [string, string][] = [
  ['One model, three solvers', 'The three solvers (RK, Euler, NSFD) used to disagree because each had slightly different equations. They now all call one shared definition, so any difference between them is only numerical error.'],
  ['Fixed a reversed parameter', 'The old “recovery” input actually controlled the cancer share. It is now clearly c (share who get cancer) and η = 1 − c (share who clear).'],
  ['Corrected the steady-state formulas', 'The equilibrium values (S₁*, S₂*, I*, R*, C*) are now derived from the equations. When R₀ ≤ 1 the correct answer is “no infection” and we report that.'],
  ['Stopped inventing the spread rate from images', 'β used to be computed from the “infected cells” in pictures. That count was not an infection measure, so β is now a number you choose.'],
  ['Made the solvers safe', 'Inputs are checked (for example μ must be positive, m and c between 0 and 1). If numbers blow up, you get a readable message instead of a crash. Very small step sizes are limited, and long results are thinned to at most 1,200 points.'],
  ['Checked the maths against itself', 'Automated tests confirm that a long simulation lands on the formula values, that all three solvers agree, and that bad input is rejected. 26 tests pass.'],
]

const limits = [
  'Time has no fixed unit. Because infected people leave I at rate 1, one time unit is roughly one average infection.',
  'The settings are assumptions you choose. They were not fitted to real patient data, so results are “what if”, not forecasts.',
  'One average population. There are no age groups, no separate HPV types (like 16 and 18), and no screening or treatment compartment.',
  'Cancer is a one-way end state here. Real progression passes through CIN stages over many years.',
  'The pictures and the maths are separate. Nothing measured in an image feeds the equations.',
]

const glossary: [string, string][] = [
  ['ODE', 'Ordinary differential equation: a rule that says how fast each group is changing right now.'],
  ['Compartment', 'One of the boxes (S₁, S₂, I, R, C) that people are sorted into.'],
  ['Equilibrium', 'A steady state where nothing changes any more.'],
  ['Disease-free equilibrium', 'The steady state with no infection (I = 0).'],
  ['Endemic equilibrium', 'The steady state where infection stays at a constant positive level.'],
  ['R₀', 'Basic reproduction number: people one infected person infects at the start. Above 1 spreads, below 1 fades.'],
  ['Rₜ', 'The same number at time t. It changes as fewer people remain susceptible.'],
  ['Step size h', 'How much time passes in one calculation step of Euler or NSFD.'],
  ['Stable / stiff', 'A solver is stable if small errors die out. Euler is only stable for small h.'],
]

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const Maths = () => {
  const [level, setLevel] = useState<Level>('simple')
  const R = level === 'research'

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-soft to-bg">
        <Container className="py-14 text-center sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">The maths</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
            Everything we did in the <span className="text-brand">mathematics</span>, explained
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">
            What the model is, which equations it uses, how we solve them, what we fixed, and how we checked it. Written
            so a new student can follow it, with extra detail for researchers.
          </p>

          <div role="group" aria-label="Reading level" className="mx-auto mt-8 inline-flex rounded-2xl border border-line bg-surface p-1 shadow-card">
            {(
              [
                ['simple', 'Beginner'],
                ['research', 'Researcher'],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                aria-pressed={level === k}
                onClick={() => setLevel(k)}
                className={`rounded-xl px-5 py-2 text-sm font-semibold transition-colors ${
                  level === k ? 'bg-brand text-white' : 'text-ink-2 hover:text-ink'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted">
            {R ? 'Researcher view adds derivations, conservation laws, stability limits and references.' : 'Beginner view explains every idea in plain words.'}
          </p>
        </Container>
      </section>

      {/* 1. big picture */}
      <section className="py-16 sm:py-20">
        <Container className="mx-auto max-w-4xl space-y-5">
          <SectionHeading eyebrow="Step 1" title="The idea in one minute" align="left" />
          <P>
            Imagine a town. We do not follow every person. We only count how many people are in each of five groups, and
            we write down a rule for how fast people move from one group to the next. A rule that says “how fast
            something changes” is called a <strong className="text-ink">differential equation</strong>. Five groups give
            five equations.
          </P>
          <P>
            Then we let a computer repeat the rules many times, step by step. That is a <strong className="text-ink">simulation</strong>. It
            shows, for example, whether HPV spreads or fades out if more people are vaccinated. No real patient data is
            used. It is a what-if tool.
          </P>
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['1. Sort', 'People go into five groups.'],
              ['2. Write rules', 'One equation per group.'],
              ['3. Solve', 'The computer repeats the rules over time.'],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-line bg-surface p-4">
                <p className="font-bold text-ink">{t}</p>
                <p className="mt-1 text-sm text-ink-2">{d}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 2. groups */}
      <section className="bg-surface py-16 sm:py-20">
        <Container className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Step 2" title="The five groups" align="left" />
          <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Group</th>
                  <th className="px-4 py-3">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {groups.map(([s, n, d]) => (
                  <tr key={s}>
                    <td className="px-4 py-3 font-mono text-base font-bold text-brand">{s}</td>
                    <td className="px-4 py-3 font-semibold text-ink">{n}</td>
                    <td className="px-4 py-3 text-ink-2">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-sm text-ink-2">
            See the picture of how people move between these groups on the{' '}
            <Link to="/learn" className="font-semibold text-brand underline">
              How it works page
            </Link>
            .
          </p>
        </Container>
      </section>

      {/* 3. equations */}
      <section className="py-16 sm:py-20">
        <Container className="mx-auto max-w-4xl space-y-6">
          <SectionHeading eyebrow="Step 3" title="The five equations" align="left" description="dX/dt means “how fast group X is changing at this moment”." />
          <div className="space-y-5">
            <div>
              <Eq>dS₁/dt = A − (δ + μ) · S₁</Eq>
              <Say>The unvaccinated group grows by the new people (A). It shrinks when people get vaccinated (δ) or die (μ).</Say>
            </div>
            <div>
              <Eq>dS₂/dt = δ · S₁ − (μ + m) · S₂ − (1 − m) · β · S₂ · I</Eq>
              <Say>
                The vaccinated group gains the people vaccinated from S₁. It loses people who die (μ), people the vaccine fully
                protects (m, they move to R) and people who still catch HPV. The infection term has (1 − m) because
                protection reduces it.
              </Say>
            </div>
            <div>
              <Eq>dI/dt = (1 − m) · β · S₂ · I − (μ + 1) · I</Eq>
              <Say>
                New infections come from vaccinated people meeting infected people. Infected people leave at rate 1 (they
                clear the virus or progress) plus the natural death rate.
              </Say>
            </div>
            <div>
              <Eq>dR/dt = m · S₂ + η · I − μ · R</Eq>
              <Say>The recovered group gets the fully protected people and the share η of infected who clear HPV. People leave only by natural death.</Say>
            </div>
            <div>
              <Eq>dC/dt = c · I − μ · C</Eq>
              <Say>A small share c of infected people move to the cancer group. Here η = 1 − c, so every infected person ends up in exactly one place: R or C.</Say>
            </div>
          </div>

          {R && (
            <div className="space-y-4">
              <Note title="Why the equations are consistent (conservation)">
                <p>Add all five equations. Every transfer between groups appears once with a minus and once with a plus, so it cancels:</p>
                <Eq>{`d(S₁+S₂+I+R+C)/dt = A − μ·(S₁+S₂+I+R+C)`}</Eq>
                <p>
                  So the total population N obeys dN/dt = A − μN and tends to N* = A/μ. With A = 50 and μ = 0.014 that is
                  3,571. Because η + c = 1, no one is lost or created by the infection step. This is why η and c must add
                  up to 1.
                </p>
              </Note>
              <Note title="Positivity">
                <p>
                  All inflow terms are non-negative when every group is non-negative, so solutions that start at or above 0
                  stay at or above 0. The NSFD scheme (below) keeps this property for every step size.
                </p>
              </Note>
            </div>
          )}
        </Container>
      </section>

      {/* 4. parameters */}
      <section className="bg-surface py-16 sm:py-20">
        <Container className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Step 4" title="The settings (parameters)" align="left" description="These are the dials you can turn in the simulation lab. Defaults shown." />
          <div className="mt-8 overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Symbol</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Default</th>
                  <th className="px-4 py-3">What it does</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {params.map(([s, n, v, d]) => (
                  <tr key={s}>
                    <td className="px-4 py-3 font-mono text-base font-bold text-brand">{s}</td>
                    <td className="px-4 py-3 font-semibold text-ink">{n}</td>
                    <td className="px-4 py-3 font-mono text-ink">{v}</td>
                    <td className="px-4 py-3 text-ink-2">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {R && (
            <p className="mt-4 text-sm text-ink-2">
              Start values used by the solvers: (S₁, S₂, I, R, C) = (0.6, 0.2, 0.1, 0.05, 0.05). The run covers 600 time
              units. The infected leave rate (1) is fixed, not an input.
            </p>
          )}
        </Container>
      </section>

      {/* 5. R0 */}
      <section className="py-16 sm:py-20">
        <Container className="mx-auto max-w-4xl space-y-5">
          <SectionHeading eyebrow="Step 5" title="R₀: will the infection spread?" align="left" />
          <P>
            R₀ (“R-zero”) answers one question: <strong className="text-ink">at the start, how many people does one infected person infect?</strong> If
            it is above 1, each case makes more than one new case and HPV spreads. If it is below 1, it fades out.
          </P>
          <Eq>{`R₀ = (1 − m) · β · δ · A  /  ( (μ + 1) · (δ + μ) · (μ + m) )`}</Eq>
          <Say>
            More vaccine protection (m) or a lower spread rate (β) makes R₀ smaller. With the defaults R₀ ≈ 17.67, so HPV
            spreads. Try the slider below.
          </Say>
          {R && (
            <Note title="Derivation">
              <p>
                With no infection, the first two equations settle at S₁⁰ = A/(δ+μ) and S₂⁰ = δS₁⁰/(μ+m). One infected person
                stays infected for 1/(μ+1) time units on average, and in that time infects (1−m)·β·S₂⁰ people per unit time.
              </p>
              <Eq>{`R₀ = (1 − m)·β·S₂⁰ / (μ + 1)`}</Eq>
              <p>
                Substituting S₂⁰ gives the formula above. It is the same value the next-generation method (van den
                Driessche and Watmough, 2002) gives for this one-infected-class model. The time-varying version is
                Rₜ = (1 − m)·β·S₂(t)/(μ + 1), which falls below R₀ as S₂ is used up.
              </p>
            </Note>
          )}
        </Container>
      </section>

      {/* 6. equilibria + live */}
      <section className="bg-surface py-16 sm:py-20">
        <Container className="mx-auto max-w-4xl space-y-5">
          <SectionHeading eyebrow="Step 6" title="Where does it settle? (equilibrium)" align="left" description="If you wait long enough, the groups stop changing. Those final numbers can be written as formulas." />
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-5">
              <Badge tone="brand">If R₀ ≤ 1</Badge>
              <p className="mt-2 text-sm font-bold text-ink">Disease-free</p>
              <Eq>{`S₁* = A/(δ+μ)
S₂* = δ·S₁*/(μ+m)
I* = 0,  C* = 0
R* = m·S₂*/μ`}</Eq>
              <p className="mt-2 text-sm text-ink-2">The infection dies out.</p>
            </Card>
            <Card className="p-5">
              <Badge tone="danger">If R₀ &gt; 1</Badge>
              <p className="mt-2 text-sm font-bold text-ink">Endemic (stays at a steady level)</p>
              <Eq>{`S₁* = A/(δ+μ)
S₂* = (μ+1) / ((1−m)·β)
I* = (δ·S₁* − (μ+m)·S₂*) / (μ+1)
R* = (m·S₂* + η·I*) / μ
C* = c·I* / μ`}</Eq>
              <p className="mt-2 text-sm text-ink-2">HPV stays in the population.</p>
            </Card>
          </div>
          <p className="text-sm text-ink-2">
            With the defaults: S₁* = 438.6, S₂* = 4.83, I* = 40.81, R* = 3,058, C* = 29.15. They add up to about 3,571, the
            same N* = A/μ as before.
          </p>
          {R && (
            <Note title="Derivation and existence condition">
              <p>
                Set the right-hand side of dI/dt to zero with I ≠ 0. That forces (1−m)·β·S₂ = μ + 1, which gives S₂*. Put it
                in dS₂/dt = 0: δS₁* − (μ+m)S₂* = (1−m)β S₂* I* = (μ+1) I*, which gives I*.
              </p>
              <p>
                I* is positive exactly when δS₁*/(μ+m) &gt; S₂*, and the left side is S₂⁰. That is S₂⁰ &gt; (μ+1)/((1−m)β),
                which is R₀ &gt; 1. So the endemic state exists only when R₀ &gt; 1, and for R₀ ≤ 1 only the disease-free
                state is valid. By the standard threshold theorem for this kind of model, the disease-free state is locally
                stable when R₀ &lt; 1 and unstable when R₀ &gt; 1. We checked the endemic values numerically (below) but have
                not written a full stability proof here.
              </p>
            </Note>
          )}
          <h3 className="pt-4 text-center text-xl font-extrabold text-ink">Watch it settle</h3>
          <p className="text-center text-sm text-muted">
            Drag the sliders. The red line starts anywhere and ends on the dashed equilibrium line from the formula.
          </p>
          <LiveModel />
        </Container>
      </section>

      {/* 7. solvers */}
      <section className="py-16 sm:py-20">
        <Container className="mx-auto max-w-4xl space-y-5">
          <SectionHeading eyebrow="Step 7" title="Three ways to solve it" align="left" description="Most differential equations cannot be solved with pen and paper. Computers solve them in small time steps." />
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="p-5">
              <h3 className="font-bold text-ink">Runge–Kutta (RK)</h3>
              <p className="mt-2 text-sm text-ink-2">A careful, adaptive method (we use SciPy’s LSODA). It picks its own step size and is the most accurate of the three.</p>
            </Card>
            <Card className="p-5">
              <h3 className="font-bold text-ink">Euler</h3>
              <p className="mt-2 text-sm text-ink-2">The simplest: take the current rates and move forward by h. Easy to understand, but it needs small steps.</p>
              <Eq>yₙ₊₁ = yₙ + h · f(yₙ)</Eq>
            </Card>
            <Card className="p-5">
              <h3 className="font-bold text-ink">NSFD</h3>
              <p className="mt-2 text-sm text-ink-2">“Non-standard finite difference”. Built to keep numbers positive and stable, whatever the step size.</p>
            </Card>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-line">
            <table className="w-full min-w-[480px] text-left text-sm">
              <caption className="bg-surface-2 px-4 py-2 text-left text-xs text-muted">
                Final values after a long run with the default settings. All solvers reach the formula values.
              </caption>
              <thead className="text-xs uppercase tracking-wider text-muted">
                <tr>
                  <th className="px-4 py-3">Method</th>
                  <th className="px-4 py-3">S₁</th>
                  <th className="px-4 py-3">S₂</th>
                  <th className="px-4 py-3">I</th>
                  <th className="px-4 py-3">C</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {solverRows.map(([n, a, b, c, d]) => (
                  <tr key={n}>
                    <td className="px-4 py-3 font-semibold text-ink">{n}</td>
                    <td className="px-4 py-3 font-mono">{a}</td>
                    <td className="px-4 py-3 font-mono">{b}</td>
                    <td className="px-4 py-3 font-mono">{c}</td>
                    <td className="px-4 py-3 font-mono">{d}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Say>If all three agree with the formulas, the equations and the code describe the same model. That is the check we rely on.</Say>

          {R && (
            <div className="space-y-4">
              <Note title="NSFD update used by the server">
                <Eq>{`S₁ⁿ⁺¹ = (S₁ⁿ + h·A) / (1 + h·(δ+μ))
S₂ⁿ⁺¹ = (S₂ⁿ + h·δ·S₁ⁿ) / (1 + h·(μ+m) + h·(1−m)·β·Iⁿ)
Iⁿ⁺¹  = (Iⁿ + h·(1−m)·β·S₂ⁿ·Iⁿ) / (1 + h·(μ+1))
Rⁿ⁺¹  = (Rⁿ + h·m·S₂ⁿ + h·η·Iⁿ) / (1 + h·μ)
Cⁿ⁺¹  = (Cⁿ + h·c·Iⁿ) / (1 + h·μ)`}</Eq>
                <p>
                  Loss terms are treated implicitly (they sit in the denominator) and gains explicitly. Every numerator and
                  denominator is positive, so no group can become negative, for any h. At a fixed point the update reduces
                  to the same algebraic equations as the ODE, so it has the same equilibria (Mickens, 1994).
                </p>
              </Note>
              <Note title="Why Euler needs a small step">
                <p>
                  Explicit Euler is stable only when h times the fastest rate in the Jacobian is below about 2. At the
                  default endemic state the infection term (1−m)·β·I* is about 8.6, so h has to be below roughly 0.23. In our
                  runs h = 0.2 converged to the formulas and h = 0.5 diverged. That is why the default step is 0.1 and the
                  server rejects non-finite results with a clear message.
                </p>
              </Note>
              <Note title="API (for researchers)">
                <p>
                  POST JSON with recruitment_rate, transmission_rate, natural_death_rate, transition_rate,
                  recovery_proportion (this is m), cancer_progression_rate (this is c) and optional stepSize. The reply holds the
                  time series plus R_0, S_1, S_2, I_eq, R_eq, C_eq and endemic. The three endpoints share one model file so
                  results are comparable.
                </p>
              </Note>
            </div>
          )}
        </Container>
      </section>

      {/* 8. what we did */}
      <section className="bg-surface py-16 sm:py-20">
        <Container className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Step 8" title="What we did and fixed in the maths" align="left" />
          <ol className="mt-8 space-y-4">
            {done.map(([t, d], i) => (
              <li key={t} className="flex gap-4 rounded-2xl border border-line bg-bg p-5">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand text-sm font-bold text-white">{i + 1}</span>
                <div>
                  <h3 className="font-bold text-ink">{t}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-2">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* 9. limits */}
      <section className="py-16 sm:py-20">
        <Container className="mx-auto max-w-4xl">
          <SectionHeading eyebrow="Step 9" title="What the model cannot do" align="left" description="Honest limits matter as much as the equations." />
          <ul className="mt-8 space-y-3">
            {limits.map((t) => (
              <li key={t} className="flex gap-3 text-sm leading-relaxed text-ink-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-warn" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      {/* 10. glossary + refs */}
      <section className="bg-surface py-16 sm:py-20">
        <Container className="mx-auto max-w-4xl space-y-10">
          <div>
            <SectionHeading eyebrow="Reference" title="Words you may meet" align="left" />
            <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-bg">
              {glossary.map(([k, v]) => (
                <div key={k} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[190px_1fr] sm:gap-4">
                  <dt className="font-bold text-ink">{k}</dt>
                  <dd className="text-sm leading-relaxed text-ink-2">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          {R && (
            <div>
              <h2 className="text-xl font-extrabold text-ink">Further reading</h2>
              <ul className="mt-3 space-y-2 text-sm text-ink-2">
                <li>Kermack WO, McKendrick AG (1927). A contribution to the mathematical theory of epidemics. Proc R Soc A 115.</li>
                <li>van den Driessche P, Watmough J (2002). Reproduction numbers and sub-threshold endemic equilibria for compartmental models of disease transmission. Math Biosci 180.</li>
                <li>Mickens RE (1994). Nonstandard Finite Difference Models of Differential Equations. World Scientific.</li>
              </ul>
            </div>
          )}
        </Container>
      </section>

      <section className="pb-20 pt-16">
        <Container>
          <div className="rounded-3xl bg-brand-deep px-6 py-12 text-center sm:px-12">
            <h2 className="text-3xl font-extrabold text-white">Try the equations yourself</h2>
            <p className="mx-auto mt-3 max-w-xl text-white/70">Change the settings in the simulation lab and compare the three solvers.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <LinkButton to="/simulation" size="lg">
                Open the simulation lab
              </LinkButton>
              <LinkButton to="/learn" size="lg" variant="secondary">
                Back to How it works
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default Maths
