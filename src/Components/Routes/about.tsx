import { useNavigate } from 'react-router-dom'
import { Activity, ArrowRight, Brain, HeartPulse, Microscope, ShieldCheck, Syringe, Users } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button, Container, SectionHeading } from '../ui'
import { useAuth } from '../../lib/auth'
import { asset } from '../../lib/config'

const features: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Microscope,
    title: 'AI Image Analysis',
    desc: 'Deep learning models classify cervical cells for infection detection.',
  },
  {
    icon: Brain,
    title: 'Mathematical Modeling',
    desc: 'Differential equations simulate HPV infection dynamics.',
  },
  {
    icon: Activity,
    title: 'Predictive Simulation',
    desc: 'Forecast infection trends and evaluate interventions.',
  },
]

const spread = [
  {
    title: 'Sexual Contact',
    text: 'HPV is most commonly transmitted through vaginal, anal, or oral sexual contact. Using protection and regular screenings significantly reduce the risk of infection.',
  },
  {
    title: 'Skin-to-Skin Contact',
    text: 'Direct contact with infected skin or mucosal surfaces, even without sexual activity, can transmit HPV. Maintaining awareness and hygiene can help reduce exposure.',
  },
  {
    title: 'Persistent Infection',
    text: 'If the immune system cannot clear HPV, the infection may persist and increase the risk of cervical and other HPV-related cancers. Vaccination and early detection are crucial preventive measures.',
  },
]

const equations: [string, string, string][] = [
  ['dS₁/dt', 'A − (δ + μ) S₁', 'Newly susceptible population'],
  ['dS₂/dt', 'δ S₁ − (μ + m) S₂ − (1−m) β S₂ I', 'Susceptible at risk'],
  ['dI/dt', '(1−m) β S₂ I − (μ + 1) I', 'Infected population'],
  ['dR/dt', 'm S₂ + n I − μ R', 'Recovered population'],
  ['dC/dt', '(1−n) I − μ C', 'Cancerous population'],
]

const impact = [
  {
    stat: '600K+',
    text: 'New cervical cancer cases worldwide each year, highlighting the urgent need for preventive strategies and early detection.',
  },
  {
    stat: '99%',
    text: 'Of cervical cancer cases are caused by HPV infection, emphasizing the critical role of vaccination programs in prevention.',
  },
  {
    stat: '300K+',
    text: 'Deaths occur annually due to cervical cancer, reflecting the need for improved access to screening and treatment globally.',
  },
]

const prevention: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Syringe,
    title: 'HPV Vaccination',
    text: 'Vaccination is one of the most effective methods to prevent HPV infection and cervical cancer, offering long-term protection and reducing the prevalence of high-risk HPV strains.',
  },
  {
    icon: ShieldCheck,
    title: 'Screening',
    text: 'Regular cervical screening helps detect early cellular abnormalities before they develop into cancer, enabling timely intervention and improved survival rates.',
  },
  {
    icon: HeartPulse,
    title: 'Early Treatment',
    text: 'Early diagnosis and treatment significantly reduce mortality caused by cervical cancer, ensuring better outcomes and higher quality of life for patients.',
  },
]

const About = () => {
  const navigate = useNavigate()
  const { isAuth } = useAuth()
  const handleSimulationClick = () => navigate(isAuth ? '/simulation' : '/Login')

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-b from-brand-soft to-bg">
        <Container className="py-16 text-center sm:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">About the platform</p>
          <h1 className="mx-auto mt-4 max-w-4xl text-4xl font-extrabold leading-tight text-ink sm:text-5xl lg:text-6xl">
            Human Papillomavirus
            <span className="block text-brand">Research & Simulation Platform</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-base leading-relaxed text-ink-2 sm:text-lg">
            A next-generation digital research environment that integrates{' '}
            <strong className="text-ink">AI-powered image analysis</strong>,{' '}
            <strong className="text-ink">mathematical modeling</strong>, and{' '}
            <strong className="text-ink">epidemiological simulation</strong> to understand,
            predict, and control HPV infection dynamics.
          </p>
          <Button size="lg" className="mt-8" onClick={handleSimulationClick}>
            Open Simulation Lab <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>

          <div className="mt-14 grid gap-4 text-left sm:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-line bg-surface p-6 shadow-card">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                  <f.icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-bold text-ink">{f.title}</h2>
                <p className="mt-1.5 text-sm text-muted">{f.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* WHAT IS HPV */}
      <section className="py-16 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <img
            src={asset('hpv-pic.jpg')}
            alt="Illustration of HPV particles"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-card ring-1 ring-line"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">The virus</p>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              What is Human Papillomavirus (HPV)?
            </h2>
            <div className="mt-5 space-y-4 leading-relaxed text-ink-2">
              <p>
                Human Papillomavirus (HPV) is one of the most common viral infections affecting
                humans. It spreads primarily through skin-to-skin contact, especially during sexual
                activity.
              </p>
              <p>
                There are over 200 types of HPV. Most infections are harmless and resolve naturally,
                but certain high-risk strains can cause cervical cancer and other cancers if
                persistent.
              </p>
              <p>
                Persistent infection with high-risk HPV strains accounts for nearly all cervical
                cancer cases worldwide, making early detection and vaccination critical for public
                health.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* HOW HPV SPREADS */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Transmission"
            title="How HPV Spreads"
            description="Understanding the modes of HPV transmission is essential for prevention and early detection. Persistent infections may lead to serious health complications."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {spread.map((s, i) => (
              <article key={s.title} className="rounded-2xl border border-line bg-bg p-7">
                <span className="font-display text-sm font-bold text-brand">0{i + 1}</span>
                <h3 className="mt-2 text-xl font-bold text-ink">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">{s.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* MATHEMATICAL MODELING */}
      <section className="py-16 sm:py-24">
        <Container className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">The model</p>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">Mathematical Modeling</h2>
            <div className="mt-5 space-y-4 leading-relaxed text-ink-2">
              <p>
                Mathematical modeling provides a structured way to understand how HPV spreads and
                progresses within a population. By breaking the population into compartments for
                different infection stages, we can simulate disease dynamics, predict outcomes, and
                evaluate prevention strategies such as vaccination or screening programs.
              </p>
              <p>
                Here, <strong className="text-ink">S</strong> represents susceptible cells,{' '}
                <strong className="text-ink">I</strong> infected cells, and{' '}
                <strong className="text-ink">C</strong> cancerous cells. The equations show how each
                compartment evolves over time based on infection rates, recovery, and progression to
                cancer.
              </p>
              <p>
                Using these models, researchers can simulate different scenarios, assess public
                health interventions, and improve understanding of HPV transmission dynamics.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted">System of equations</p>
            <ul className="mt-4 divide-y divide-line">
              {equations.map(([lhs, rhs, note]) => (
                <li key={lhs} className="py-3.5">
                  <p className="overflow-x-auto font-mono text-sm text-ink">
                    <span className="font-bold text-brand">{lhs}</span> = {rhs}
                  </p>
                  <p className="mt-1 text-xs text-muted">{note}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* AI IMAGE ANALYSIS */}
      <section className="bg-surface py-16 sm:py-24">
        <Container className="mx-auto max-w-4xl">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Computer vision</p>
          <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">AI Image Analysis</h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-2">
            <p>
              Artificial intelligence techniques analyze cervical microscopy images, enabling rapid
              and highly accurate detection of infected cells. This automation accelerates
              diagnostic workflows, reduces human error, and ensures consistent results across
              large-scale screenings.
            </p>
            <p>
              Advanced deep learning models classify cells into infected and normal categories,
              generating rich datasets for epidemiological modeling, predictive simulations, and
              public health decision-making.
            </p>
            <p>
              By combining AI with statistical modeling, healthcare professionals can better
              understand HPV transmission dynamics, monitor outbreaks in real time, and evaluate the
              effectiveness of preventive measures such as screening and immunization campaigns.
            </p>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {['AI', 'Deep Learning', 'Image Processing', 'Epidemiology', 'Simulation'].map((t) => (
              <span key={t} className="rounded-full bg-brand-soft px-3.5 py-1.5 text-xs font-semibold text-brand">
                {t}
              </span>
            ))}
          </div>
        </Container>
      </section>

      {/* GLOBAL IMPACT */}
      <section className="py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Global impact"
            title="Global Impact of Cervical Cancer"
            description="Cervical cancer remains a major global health challenge, largely caused by persistent HPV infection. Understanding its prevalence and mortality helps guide vaccination, screening, and intervention strategies."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {impact.map((i) => (
              <div key={i.stat} className="rounded-2xl border border-line bg-surface p-7 shadow-card">
                <p className="font-display text-5xl font-extrabold text-brand">{i.stat}</p>
                <p className="mt-4 text-sm leading-relaxed text-ink-2">{i.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* PREVENTION */}
      <section className="bg-surface py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Prevention"
            title="Prevention & Control"
            description="Preventing HPV infection and cervical cancer requires a combination of vaccination, regular screening, and early treatment. These interventions significantly reduce infection rates and improve outcomes worldwide."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {prevention.map((p) => (
              <article key={p.title} className="rounded-2xl border border-line bg-bg p-7">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                  <p.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{p.text}</p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* MISSION */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="rounded-3xl bg-brand-deep px-6 py-14 text-center sm:px-12">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-xl bg-white/10 text-white">
              <Users className="h-6 w-6" aria-hidden />
            </span>
            <h2 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">Our Mission</h2>
            <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-white/70">
              Our mission is to integrate advanced mathematical modeling, artificial intelligence,
              and simulation techniques to gain deeper insights into HPV infection dynamics. By
              leveraging these technologies, we aim to support global public health initiatives,
              optimize vaccination and screening strategies, and ultimately reduce the burden of
              cervical cancer worldwide.
            </p>
            <p className="mt-6 font-display text-lg font-bold text-brand">Science. Prevention. Impact.</p>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default About
