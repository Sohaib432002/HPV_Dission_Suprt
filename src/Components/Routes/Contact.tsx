import { useState } from 'react'
import type { FormEvent } from 'react'
import { Database, FlaskConical, Handshake, Mail, MapPin, Phone, Send } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button, Card, Container, Field, Input, Textarea, useToast } from '../ui'

const topics: { icon: LucideIcon; title: string; text: string }[] = [
  {
    icon: Handshake,
    title: 'Research Collaboration',
    text: 'We collaborate with universities, medical researchers, epidemiologists, and healthcare professionals to study HPV transmission dynamics and cervical cancer prevention strategies.',
  },
  {
    icon: FlaskConical,
    title: 'Scientific Support',
    text: 'Our team provides technical support related to mathematical modeling, disease simulation, and computational analysis of epidemiological data.',
  },
  {
    icon: Database,
    title: 'Data & Prediction',
    text: 'Our prediction system analyzes data to forecast HPV infection patterns and potential cervical cancer cases using computational modeling.',
  },
]

const details: { icon: LucideIcon; title: string; value: string }[] = [
  { icon: Mail, title: 'Email address', value: 'research@hpv-lab.org' },
  { icon: Phone, title: 'Phone', value: '+92 300 1234567' },
  {
    icon: MapPin,
    title: 'Research location',
    value: 'Department of Biomedical Research\nHealth Science Institute\nPakistan',
  },
]

const CONTACT_EMAIL = 'research@hpv-lab.org'

const Contact = () => {
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', org: '', message: '' })

  const update = (key: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  // The site has no contact endpoint, so the inquiry opens the visitor's mail app, pre-filled.
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const body = `${form.message}\n\n— ${form.name}${form.org ? `, ${form.org}` : ''}\n${form.email}`
    const subject = `Research inquiry from ${form.name}`
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    toast.info('Opening your email app to send the inquiry…')
  }

  return (
    <div>
      <section className="bg-gradient-to-b from-brand-soft to-bg">
        <Container className="py-16 text-center sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand">Contact</p>
          <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-extrabold text-ink sm:text-5xl">
            Contact our <span className="text-brand">HPV Research Lab</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">
            Our research platform studies the transmission, progression, and prevention of Human
            Papillomavirus and cervical cancer using mathematical models and computational
            simulation tools.
          </p>
        </Container>
      </section>

      <Container className="py-12 sm:py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {topics.map((t) => (
            <Card key={t.title} className="p-6">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand-soft text-brand">
                <t.icon className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-lg font-bold text-ink">{t.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{t.text}</p>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <Card className="p-6 sm:p-8">
            <h2 className="text-2xl font-extrabold text-ink">Send us a message</h2>
            <p className="mt-1 text-sm text-muted">We usually respond within a few working days.</p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Full name">
                  {(id) => (
                    <Input id={id} required autoComplete="name" value={form.name} onChange={update('name')} />
                  )}
                </Field>
                <Field label="Email address">
                  {(id) => (
                    <Input
                      id={id}
                      type="email"
                      required
                      autoComplete="email"
                      value={form.email}
                      onChange={update('email')}
                    />
                  )}
                </Field>
              </div>
              <Field label="Institution / organization">
                {(id) => (
                  <Input id={id} autoComplete="organization" value={form.org} onChange={update('org')} />
                )}
              </Field>
              <Field label="Your message">
                {(id) => (
                  <Textarea id={id} rows={5} required value={form.message} onChange={update('message')} />
                )}
              </Field>
              <Button type="submit" size="lg" full icon={<Send className="h-4 w-4" />}>
                Submit inquiry
              </Button>
            </form>
          </Card>

          <div className="space-y-4">
            {details.map((d) => (
              <Card key={d.title} className="flex items-start gap-4 p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-soft text-brand">
                  <d.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-ink">{d.title}</h3>
                  <p className="mt-1 whitespace-pre-line text-sm text-muted">{d.value}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Container>

      <section className="py-4 pb-16">
        <Container>
          <div className="rounded-3xl bg-brand-deep px-6 py-12 text-center sm:px-12">
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">Join our research mission</h2>
            <p className="mx-auto mt-4 max-w-3xl leading-relaxed text-white/70">
              Our mission is to advance scientific understanding of HPV infection and cervical
              cancer development through mathematical modeling, computational simulation, and
              predictive analytics. We welcome collaboration from researchers and healthcare
              professionals worldwide.
            </p>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default Contact
