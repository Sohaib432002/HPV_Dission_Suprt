import { useNavigate } from 'react-router-dom'
import {
  Activity,
  ArrowRight,
  Brain,
  Dna,
  FileText,
  FlaskConical,
  Microscope,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  Upload,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import HPVModelDiagram from './HPV-model'
import { Button, Container, LinkButton, SectionHeading } from '../ui'
import { useAuth } from '../../lib/auth'
import { asset } from '../../lib/config'

type Tone = 'brand' | 'info' | 'violet' | 'warn'

const toneBg: Record<Tone, string> = {
  brand: 'bg-brand-soft text-brand',
  info: 'bg-info-soft text-info',
  violet: 'bg-violet-soft text-violet',
  warn: 'bg-warn-soft text-warn',
}

const whySimulation: { icon: LucideIcon; title: string; desc: string; benefit: string }[] = [
  {
    icon: Dna,
    title: 'Biological System Modeling',
    desc: 'Simulate interactions between healthy cells, infected cells, and immune responses to understand viral behavior and disease progression.',
    benefit: 'Explore mechanisms • Predict viral behavior • Identify intervention points',
  },
  {
    icon: Activity,
    title: 'Disease Spread Simulation',
    desc: 'Model population-level transmission considering vaccination, behavior, and screening to predict infection trends.',
    benefit: 'Assess risk • Optimize prevention • Forecast outbreaks',
  },
  {
    icon: FlaskConical,
    title: 'Testing Intervention Strategies',
    desc: 'Evaluate vaccination programs, screening policies, and treatments before real-world implementation.',
    benefit: 'Reduce infection • Improve policy • Save resources',
  },
]

const workflow: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Upload,
    title: 'Image Upload',
    desc: 'Cervical microscopy images are uploaded into the platform. Images are preprocessed to normalize brightness, remove noise, and standardize resolution for AI processing.',
  },
  {
    icon: Brain,
    title: 'Cell Classification',
    desc: 'Deep learning models analyze each cell and classify it as healthy, infected, or abnormal, using cellular morphology and staining patterns.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Parameter Estimation',
    desc: 'From classified cells, the system calculates infection metrics such as the proportion of infected cells, which become epidemiological model parameters.',
  },
  {
    icon: TrendingUp,
    title: 'Simulation & Prediction',
    desc: 'Estimated parameters feed a mathematical model to simulate HPV dynamics, test interventions and predict long-term disease progression.',
  },
]

const capabilities: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: TrendingUp,
    title: 'Interactive Graphs',
    desc: 'Visualize infection dynamics through real-time simulation graphs that show how cell populations evolve over time.',
  },
  {
    icon: SlidersHorizontal,
    title: 'Parameter Control',
    desc: 'Adjust epidemiological parameters to explore different infection scenarios.',
  },
  {
    icon: Activity,
    title: 'Future Prediction',
    desc: 'The prediction module forecasts future HPV infection trends based on model inputs and simulation outputs.',
  },
]

const Home = () => {
  const navigate = useNavigate()
  const { isAuth } = useAuth()

  const handleSimulationClick = () => navigate(isAuth ? '/simulation' : '/Login')
  const handlePredictionClick = () => navigate(isAuth ? '/future-predict' : '/Login')

  const services: {
    icon: LucideIcon
    tone: Tone
    title: string
    desc: string
    onClick: () => void
  }[] = [
    {
      icon: FlaskConical,
      tone: 'brand',
      title: 'Simulation Lab',
      desc: 'Run Runge-Kutta, Euler and NSFD solvers on the HPV model.',
      onClick: handleSimulationClick,
    },
    {
      icon: Microscope,
      tone: 'info',
      title: 'Image Prediction',
      desc: 'Upload cell images for AI infection analysis and forecasting.',
      onClick: handlePredictionClick,
    },
    {
      icon: FileText,
      tone: 'violet',
      title: 'Patient Reports',
      desc: 'Generate, save and download professional PDF reports.',
      onClick: () => navigate(isAuth ? '/PatientProfile' : '/Login'),
    },
    {
      icon: Users,
      tone: 'warn',
      title: 'Collaboration',
      desc: 'Partner with our team of researchers and clinicians.',
      onClick: () => navigate('/contact'),
    },
  ]

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-soft via-bg to-bg">
        <Container className="grid items-center gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:py-24">
          <div className="animate-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-1.5 text-xs font-semibold text-ink-2 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
              Biomedical research platform
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.08] text-ink sm:text-5xl lg:text-6xl">
              Modeling the
              <span className="block text-brand">Dynamics of HPV</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-ink-2 sm:text-lg">
              Human Papillomavirus (HPV) is one of the most common viral infections associated with
              cervical cancer. This platform brings mathematical modeling, AI and epidemiological
              simulation together to explore infection dynamics and predict disease progression.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" onClick={handleSimulationClick} icon={<FlaskConical className="h-5 w-5" />}>
                Open Simulation Lab
              </Button>
              <Button size="lg" variant="secondary" onClick={handlePredictionClick}>
                Run Prediction Model <ArrowRight className="h-4 w-4" aria-hidden />
              </Button>
            </div>
            <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-ink-2">
              {[
                [Brain, 'Deep-learning image analysis'],
                [Activity, 'Three numerical solvers'],
                [ShieldCheck, 'Role-based secure access'],
              ].map(([Icon, text]) => {
                const I = Icon as LucideIcon
                return (
                  <li key={text as string} className="flex items-center gap-2">
                    <I className="h-[18px] w-[18px] text-brand" aria-hidden />
                    {text as string}
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -right-6 -top-6 h-3/4 w-3/4 rounded-full bg-brand/10" aria-hidden />
            <img
              src={asset('hpv-pic.jpg')}
              alt="3D rendering of human papillomavirus particles"
              className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-pop ring-1 ring-line"
            />
            <div className="absolute -bottom-5 left-4 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 pr-5 shadow-pop sm:-left-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                <Upload className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-bold text-ink">Upload cell images</p>
                <p className="text-xs text-muted">Get infection analysis in seconds</p>
              </div>
            </div>
            <div className="absolute -top-3 right-2 rounded-2xl border border-line bg-surface px-4 py-3 shadow-pop sm:right-6">
              <p className="font-display text-2xl font-extrabold text-brand">5</p>
              <p className="text-xs font-medium text-muted">compartments modeled</p>
            </div>
          </div>
        </Container>
      </section>

      {/* SERVICES */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Platform"
            title="Everything you need for HPV research"
            description="From microscope images to long-range forecasts, each step of the workflow lives in one place."
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <button
                key={s.title}
                type="button"
                onClick={s.onClick}
                className="group rounded-2xl border border-line bg-surface p-6 text-left shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-brand/50 hover:shadow-pop"
              >
                <span className={`grid h-12 w-12 place-items-center rounded-xl ${toneBg[s.tone]}`}>
                  <s.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.desc}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand">
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
                </span>
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* WHY SIMULATION */}
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Why simulation"
            title="Why study HPV through simulation?"
            description="Studying HPV in real populations is challenging due to ethical, logistical, and temporal constraints. Computational simulations provide a controlled digital environment to model virus dynamics, evaluate interventions, and predict outcomes safely and efficiently."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {whySimulation.map((c) => (
              <article key={c.title} className="rounded-2xl border border-line bg-bg p-7">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                  <c.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-bold text-ink">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{c.desc}</p>
                <p className="mt-4 border-t border-line pt-4 text-xs font-medium text-muted">
                  <span className="font-bold text-ink-2">Benefits:</span> {c.benefit}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* MODEL DIAGRAM */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Compartmental transmission model"
            title="HPV infection dynamics"
            description="Click any compartment to explore its role in the model."
          />
          <div className="mt-12">
            <HPVModelDiagram />
          </div>
        </Container>
      </section>

      {/* AI IMAGE ANALYSIS */}
      <section className="bg-surface py-16 sm:py-20">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <img
            src={asset('hpv-pic.jpg')}
            alt="HPV particles under analysis"
            loading="lazy"
            className="aspect-[4/3] w-full rounded-3xl object-cover shadow-card ring-1 ring-line"
          />
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Computer vision</p>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">
              AI-Driven Cellular Image Analysis
            </h2>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-2">
              <p>
                Advanced artificial intelligence models interpret complex cervical microscopy data
                with high precision, identifying subtle cellular patterns linked to HPV infection.
              </p>
              <p>
                Using deep learning classification, cells are automatically categorized into{' '}
                <strong className="text-ink">healthy</strong> and{' '}
                <strong className="text-ink">infected</strong> groups, enabling accurate
                quantification of infection severity.
              </p>
              <p>
                These insights feed directly into simulation models, allowing biologically realistic
                predictions of HPV progression and supporting data-driven medical research.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {['Deep Learning', 'Biomedical Imaging', 'Predictive Analytics'].map((t) => (
                <span key={t} className="rounded-full bg-brand-soft px-3.5 py-1.5 text-xs font-semibold text-brand">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* WORKFLOW */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeading
            eyebrow="Research workflow"
            title="From image to forecast in four steps"
            description="The workflow connects image analysis with epidemiological modeling to produce accurate simulations, predict disease spread, and support public health interventions."
          />
          <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {workflow.map((step, i) => (
              <li key={step.title} className="relative rounded-2xl border border-line bg-surface p-6 shadow-card">
                <div className="flex items-center justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand text-brand-fg">
                    <step.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="font-display text-3xl font-extrabold text-line">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 text-base font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{step.desc}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* CAPABILITIES + PUBLIC HEALTH */}
      <section className="bg-surface py-16 sm:py-20">
        <Container>
          <SectionHeading eyebrow="Capabilities" title="Platform capabilities" />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {capabilities.map((c) => (
              <div key={c.title} className="flex gap-4 rounded-2xl border border-line bg-bg p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                  <c.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-base font-bold text-ink">{c.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{c.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Public health</p>
              <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">HPV and Public Health</h2>
            </div>
            <div className="space-y-4 text-base leading-relaxed text-ink-2">
              <p>
                Persistent infection with high-risk HPV types is the leading cause of cervical
                cancer. Early detection, vaccination, and screening programs play a crucial role in
                reducing mortality rates.
              </p>
              <p>
                Computational models allow researchers to evaluate intervention strategies, simulate
                potential outcomes, and understand the long-term impact of public health policies.
                This platform acts as a digital laboratory for exploring HPV control strategies
                safely and effectively.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="relative overflow-hidden rounded-3xl bg-brand-deep px-6 py-14 text-center sm:px-12">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5" aria-hidden />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/5" aria-hidden />
            <h2 className="relative text-3xl font-extrabold text-white sm:text-4xl">
              Explore the HPV simulation environment
            </h2>
            <p className="relative mx-auto mt-4 max-w-2xl text-base leading-relaxed text-white/70">
              Experiment with epidemiological parameters, visualize infection dynamics, and analyze
              future HPV trends through interactive computational simulations.
            </p>
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={handleSimulationClick}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-white px-6 text-base font-semibold text-brand-deep transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
              >
                Launch Simulation <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
              <LinkButton
                to="/about"
                size="lg"
                variant="ghost"
                className="!text-white hover:!bg-white/10"
              >
                Learn about HPV
              </LinkButton>
            </div>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default Home
