import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Brain, CircleCheck, CircleX, FlaskConical, Microscope, ShieldCheck, Syringe } from 'lucide-react'
import { Badge, Card, Container, InfoTip, LinkButton, SectionHeading } from '../ui'
import { asset } from '../../lib/config'

const story = [
  { n: 1, title: 'HPV infection', text: 'A very common virus. Most people clear it on their own within a year or two.', tone: 'bg-brand', soft: 'bg-brand-soft' },
  { n: 2, title: 'The infection stays', text: 'In some women a “high-risk” type, such as HPV 16 or 18, does not clear.', tone: 'bg-warn', soft: 'bg-warn-soft' },
  { n: 3, title: 'Pre-cancer (CIN 1 to 3)', text: 'Cells start to look abnormal. CIN 1 often goes away. CIN 2 and 3 are usually treated.', tone: 'bg-warn', soft: 'bg-warn-soft' },
  { n: 4, title: 'Cervical cancer', text: 'Usually takes 10 to 20 years. Almost every case is linked to HPV.', tone: 'bg-danger', soft: 'bg-danger-soft' },
]

const cheatSheet = [
  ['AgNOR dot', 'A tiny black dot inside a cell nucleus, made visible by a silver stain.'],
  ['Cluster / satellite', 'A cluster is a group of touching dots. A satellite is a single small dot.'],
  ['Dots per nucleus', 'Total dots divided by the number of nuclei. A research marker of how active the cells are.'],
  ['Closest slide', "The AI's top guess among 15 reference slides. In our spot check it was often not the true slide, so treat it as a demo. It is not a diagnosis."],
  ['S1, S2, I, R, C', 'Groups of people in the model: healthy, vaccinated, infected, recovered, cancer.'],
  ['R0', 'How many people one infected person passes HPV to. Above 1 it spreads; below 1 it fades.'],
]

const cannot = [
  'Tell whether someone has HPV. That needs an HPV DNA test.',
  'Diagnose CIN or cancer. That needs a doctor, a cervical screening test and often a biopsy.',
  'Predict what will happen to one person. The forecast is about a population.',
  'Work well on pictures from new patients. The AI was trained on only 15 women and was never tested on new ones.',
]

/** The five groups of the model drawn as a map of people. */
function PeopleMap() {
  const box = (x: number, y: number, label: string, sub: string, tone: string) => (
    <g className={tone}>
      <rect x={x} y={y} width={132} height={58} rx={12} fill="currentColor" fillOpacity={0.12} stroke="currentColor" strokeWidth={1.5} />
      <text x={x + 66} y={y + 24} textAnchor="middle" fill="currentColor" className="font-display text-[15px] font-bold">
        {label}
      </text>
      <text x={x + 66} y={y + 43} textAnchor="middle" className="fill-ink-2 text-[11px]">
        {sub}
      </text>
    </g>
  )
  const arrow = (d: string) => <path d={d} fill="none" className="animate-flow stroke-muted" strokeWidth={2} markerEnd="url(#learn-arrow)" />
  const text = (x: number, y: number, t: string, anchor: 'middle' | 'start' = 'middle') => (
    <text x={x} y={y} textAnchor={anchor} className="fill-ink-2 text-[11.5px] font-semibold">
      {t}
    </text>
  )
  return (
    <svg viewBox="-34 0 714 330" role="img" aria-label="Map of how people move between groups" className="mx-auto w-full min-w-[560px]">
      <defs>
        <marker id="learn-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0 0 L8 4 L0 8 Z" className="fill-muted" />
        </marker>
      </defs>
      {box(24, 110, 'S1', 'Healthy, not vaccinated', 'text-info')}
      {box(182, 110, 'S2', 'Healthy, vaccinated', 'text-brand')}
      {box(340, 110, 'I', 'Infected with HPV', 'text-danger')}
      {box(524, 110, 'R', 'Recovered, protected', 'text-violet')}
      {box(340, 250, 'C', 'Became cancer', 'text-warn')}
      {arrow('M4 139 H22')}
      {text(14, 100, 'New people', 'middle')}
      {arrow('M156 139 H180')}
      {text(168, 102, 'Vaccinated')}
      {arrow('M314 139 H338')}
      {text(326, 102, 'Catch HPV')}
      {arrow('M472 139 H522')}
      {text(497, 102, 'Clear it')}
      {arrow('M406 168 V248')}
      {text(448, 214, 'A small share')}
      {arrow('M248 108 Q390 30 590 108')}
      {text(420, 52, 'Vaccine protects fully')}
    </svg>
  )
}

/** Live R0 calculator using the same formula as the simulation lab. */
function WhatIf() {
  const [m, setM] = useState(0.5)
  const [beta, setBeta] = useState(0.42)
  const A = 50
  const mu = 0.014
  const delta = 0.1
  const r0 = ((1 - m) * beta * delta * A) / ((mu + 1) * (delta + mu) * (mu + m))
  const spreading = r0 > 1
  const lo = Math.log10(0.1)
  const hi = Math.log10(2000)
  const pos = (v: number) => `${Math.min(100, Math.max(0, ((Math.log10(Math.max(v, 0.1)) - lo) / (hi - lo)) * 100))}%`

  return (
    <Card className="p-5 sm:p-7">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <label className="block">
            <span className="flex items-center justify-between text-sm font-semibold text-ink">
              <span>
                Vaccine protection <InfoTip>The share of vaccinated people who are protected. 1 means fully protected.</InfoTip>
              </span>
              <span className="font-mono">{m.toFixed(2)}</span>
            </span>
            <input type="range" min={0} max={1} step={0.01} value={m} onChange={(e) => setM(+e.target.value)} className="range mt-3" style={{ '--fill': `${m * 100}%` } as React.CSSProperties} />
          </label>
          <label className="block">
            <span className="flex items-center justify-between text-sm font-semibold text-ink">
              <span>
                How easily HPV spreads <InfoTip>Higher means each contact is more likely to pass the virus on.</InfoTip>
              </span>
              <span className="font-mono">{beta.toFixed(2)}</span>
            </span>
            <input type="range" min={0.01} max={3} step={0.01} value={beta} onChange={(e) => setBeta(+e.target.value)} className="range mt-3" style={{ '--fill': `${(beta / 3) * 100}%` } as React.CSSProperties} />
          </label>
        </div>

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">R0 for these settings</p>
          <p className={`mt-1 font-display text-5xl font-extrabold ${spreading ? 'text-danger' : 'text-brand'}`}>{r0 >= 100 ? Math.round(r0).toLocaleString() : r0.toFixed(2)}</p>
          <div className="mt-4">
            <div className="relative h-3 rounded-full bg-surface-2" role="img" aria-label={`R0 is ${r0.toFixed(2)}`}>
              <div className="absolute inset-y-0 left-0 rounded-l-full bg-brand-soft" style={{ width: pos(1) }} />
              <div className="absolute inset-y-0 right-0 rounded-r-full bg-danger-soft" style={{ left: pos(1) }} />
              <span className="absolute top-1/2 h-6 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink" style={{ left: pos(r0) }} />
            </div>
            <div className="mt-1.5 flex justify-between text-[11px] text-muted">
              <span>Fades out</span>
              <span>R0 = 1</span>
              <span>Spreads</span>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-2">
            {spreading
              ? 'Each infected person passes HPV to more than one other person, so the infection keeps spreading.'
              : 'Each infected person passes HPV to fewer than one other person, so the infection slowly dies out.'}
          </p>
        </div>
      </div>
      <details className="mt-6 rounded-xl bg-surface-2 p-4 text-sm text-ink-2">
        <summary className="cursor-pointer font-semibold text-ink">Show the formula</summary>
        <p className="mt-3 font-mono text-[13px]">R0 = (1 − m) · β · δ · A / ((μ + 1) · (δ + μ) · (μ + m))</p>
        <p className="mt-2">
          Here δ = 0.1 (vaccination rate), μ = 0.014 (natural death rate) and A = 50 (new people per month), the same
          starting values as the simulation lab.
        </p>
      </details>
    </Card>
  )
}

const Learn = () => (
  <div>
    <section className="bg-gradient-to-b from-brand-soft to-bg">
      <Container className="py-14 text-center sm:py-20">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">How it works</p>
        <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold leading-tight text-ink sm:text-5xl">
          What this website does, <span className="text-brand">in plain words</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">
          No medical or maths background needed. Three ideas: look at cells, count what experts counted, and play with a
          model of how HPV spreads.
        </p>
        <div className="mx-auto mt-10 grid max-w-3xl gap-4 text-left sm:grid-cols-3">
          {[
            { icon: Microscope, t: '1. Look', d: 'Microscope pictures of cervical cells.' },
            { icon: Brain, t: '2. Count and compare', d: 'AgNOR dots, and which reference slide a picture looks like.' },
            { icon: FlaskConical, t: '3. Explore', d: 'A what-if model of how HPV spreads in a population.' },
          ].map((s) => (
            <div key={s.t} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
                <s.icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-3 text-base font-bold text-ink">{s.t}</h2>
              <p className="mt-1 text-sm text-ink-2">{s.d}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>

    {/* 1. the medical story */}
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="Why this matters"
          title="From HPV to cervical cancer"
          description="Cervical cancer is slow. That is good news: there are many chances to stop it."
        />
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {story.map((s) => (
            <li key={s.n} className="relative overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
              <div className={`h-1.5 ${s.tone}`} />
              <div className="p-5">
                <span className={`grid h-8 w-8 place-items-center rounded-full text-sm font-bold text-ink ${s.soft}`}>{s.n}</span>
                <h3 className="mt-3 text-base font-bold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-2">{s.text}</p>
              </div>
              {s.n < 4 && <ArrowRight className="absolute right-3 top-4 hidden h-4 w-4 text-muted md:block" aria-hidden />}
            </li>
          ))}
        </ol>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Syringe, t: 'Vaccine', d: 'Works best before a person is ever exposed to HPV.' },
            { icon: Microscope, t: 'Screening', d: 'A Pap smear or HPV test finds changes early.' },
            { icon: ShieldCheck, t: 'Treatment', d: 'Pre-cancer can be removed before it becomes cancer.' },
          ].map((c) => (
            <div key={c.t} className="flex items-start gap-3 rounded-2xl bg-brand-soft p-4">
              <c.icon className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
              <p className="text-sm text-ink-2">
                <strong className="text-ink">{c.t}.</strong> {c.d}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>

    {/* 2. the pictures */}
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="The pictures"
          title="What the microscope shows"
          description="Our reference pictures use a silver stain that turns a part of the nucleus called the nucleolus into tiny black dots (AgNORs). Cells that divide faster tend to show more dots."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <figure>
            <img src={asset('learn/agnor-original.jpg')} alt="Microscope picture of cervical cell nuclei with dark dots" loading="lazy" className="w-full rounded-2xl border border-line object-cover shadow-card" />
            <figcaption className="mt-2 text-center text-sm text-muted">What a lab technician sees</figcaption>
          </figure>
          <figure>
            <img src={asset('learn/agnor-annotated.jpg')} alt="The same picture with experts' boxes around nuclei and dots" loading="lazy" className="w-full rounded-2xl border border-line object-cover shadow-card" />
            <figcaption className="mt-2 flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-sm text-muted">
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm border-2 border-[#46be46]" aria-hidden /> Nucleus
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm border-2 border-[#eb3232]" aria-hidden /> Cluster of dots
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm border-2 border-[#f59a1e]" aria-hidden /> Single dot (satellite)
              </span>
            </figcaption>
          </figure>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed text-ink-2">
          Experts drew these boxes by hand for 9,339 pictures from 15 women. The average number of dots per nucleus is a
          research marker of cell activity. <strong className="text-ink">It is not an HPV test and not a diagnosis.</strong>
        </p>
      </Container>
    </section>

    {/* 3. what the computer does */}
    <section className="py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="The computer part"
          title="What happens when you upload a picture"
          description="Two separate things, and we are honest about what each one can and cannot do."
        />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          <Card className="p-6">
            <Badge tone="brand">Expert counts</Badge>
            <h3 className="mt-3 text-lg font-bold text-ink">Reference pictures only</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              If your picture is one of the 9,339 reference pictures, we look up the experts' counts: how many nuclei and
              how many dots. Then we show where its dots-per-nucleus value sits among all reference pictures. A picture that
              is not in the set has no expert counts, and we never invent numbers for it.
            </p>
          </Card>
          <Card className="p-6">
            <Badge tone="violet">AI comparison (demo)</Badge>
            <h3 className="mt-3 text-lg font-bold text-ink">Which reference slide does it look like?</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              The AI (a ResNet50 network) was trained to tell the 15 reference slides apart. Given a new picture it says
              “this looks most like slide D”. It was <strong className="text-ink">trained on only 15 women and never tested on new patients</strong>,
              so this is a demonstration of the technique, not a way to find disease.
            </p>
          </Card>
        </div>
      </Container>
    </section>

    {/* 4. maths */}
    <section className="bg-surface py-16 sm:py-20">
      <Container>
        <SectionHeading
          eyebrow="The maths"
          title="A map of people, not a crystal ball"
          description="The simulation lab sorts a population into five groups and moves people between them month by month. Change the settings and see what would happen if they were true."
        />
        <Card className="mt-12 overflow-x-auto p-4 sm:p-6">
          <PeopleMap />
        </Card>
        <ul className="mx-auto mt-6 grid max-w-4xl gap-3 text-sm text-ink-2 sm:grid-cols-2">
          <li>
            <strong className="text-ink">Why most people end up in “Recovered”:</strong> almost every HPV infection clears on its own. Only a very small share (the setting “infections that turn into cancer”) reaches C.
          </li>
          <li>
            <strong className="text-ink">Why three solvers?</strong> They are three ways of doing the same arithmetic. They should agree, and if one looks odd you can try another.
          </li>
        </ul>

        <h3 className="mt-14 text-center text-xl font-extrabold text-ink">Try it: can vaccination stop the spread?</h3>
        <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted">
          Move the sliders. When R0 drops below 1, the infection fades out.
        </p>
        <div className="mx-auto mt-6 max-w-4xl">
          <WhatIf />
        </div>
      </Container>
    </section>

    {/* 5. cheat sheet + limits */}
    <section className="py-16 sm:py-20">
      <Container className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="text-2xl font-extrabold text-ink">Words you will see</h2>
          <dl className="mt-6 divide-y divide-line rounded-2xl border border-line bg-surface">
            {cheatSheet.map(([k, v]) => (
              <div key={k} className="grid gap-1 px-5 py-4 sm:grid-cols-[150px_1fr] sm:gap-4">
                <dt className="font-bold text-ink">{k}</dt>
                <dd className="text-sm leading-relaxed text-ink-2">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-ink">What this website can and cannot do</h2>
          <ul className="mt-6 space-y-3">
            {[
              ['Show how to read AgNOR pictures and expert counts', true],
              ['Let you explore how vaccination and spread change an epidemic', true],
              ['Create a clear PDF of what you looked at', true],
            ].map(([t]) => (
              <li key={t as string} className="flex items-start gap-3 text-sm text-ink-2">
                <CircleCheck className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
                {t as string}
              </li>
            ))}
            {cannot.map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm text-ink-2">
                <CircleX className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden />
                <span>
                  <strong className="text-ink">Cannot:</strong> {t}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>

    <section className="pb-20">
      <Container>
        <div className="rounded-3xl bg-brand-deep px-6 py-12 text-center sm:px-12">
          <h2 className="text-3xl font-extrabold text-white">Ready to try it?</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">Start with the sample pictures or jump straight into the what-if lab.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <LinkButton to="/sample-images" size="lg" variant="secondary">
              Get sample pictures
            </LinkButton>
            <LinkButton to="/future-predict" size="lg">
              Analyse pictures
            </LinkButton>
            <Link to="/maths" className="inline-flex h-12 items-center px-4 font-semibold text-white/80 hover:text-white">
              Read the maths explained
            </Link>
            <Link to="/simulation" className="inline-flex h-12 items-center px-4 font-semibold text-white/80 hover:text-white">
              Open the what-if lab
            </Link>
          </div>
        </div>
      </Container>
    </section>
  </div>
)

export default Learn
