import { useState } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2, Database, FlaskConical, Handshake, Mail, MapPin, Phone, Send, TriangleAlert } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Button, Card, Container, Field, Input, Textarea, useToast } from '../ui'
import { apiFetch } from '../../lib/api'

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

type FormState = { name: string; email: string; org: string; subject: string; message: string; website: string }
const EMPTY: FormState = { name: '', email: '', org: '', subject: '', message: '', website: '' }
type FieldErrors = Partial<Record<'name' | 'email' | 'organization' | 'subject' | 'message', string>>

const Contact = () => {
  const toast = useToast()
  const [form, setForm] = useState<FormState>(EMPTY)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const update = (key: keyof FormState) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  // The server stores the inquiry and emails it to the lab. `sending` blocks double submissions.
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (sending) return
    setSending(true)
    setError('')
    setFieldErrors({})

    try {
      const res = await apiFetch('/api/inquiries/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          organization: form.org,
          subject: form.subject,
          message: form.message,
          website: form.website,
        }),
      })
      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setSent(true)
        setForm(EMPTY)
        toast.success(data.detail || 'Your inquiry has been sent.')
      } else if (res.status === 400) {
        const errors: FieldErrors = {}
        Object.entries(data).forEach(([field, msgs]) => {
          errors[field as keyof FieldErrors] = Array.isArray(msgs) ? String(msgs[0]) : String(msgs)
        })
        setFieldErrors(errors)
        setError('Please check the highlighted fields and try again.')
      } else if (res.status === 429) {
        setError('You are sending messages too quickly. Please wait a minute and try again.')
      } else {
        setError(data.detail || 'We could not send your message right now. Please try again in a few minutes.')
      }
    } catch {
      setError('We could not reach the server. Please check your connection and try again.')
    } finally {
      setSending(false)
    }
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
            {sent ? (
              <div role="status" className="mt-6 rounded-2xl bg-brand-soft p-8 text-center">
                <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-brand text-brand-fg">
                  <CheckCircle2 className="h-7 w-7" aria-hidden />
                </span>
                <h3 className="mt-4 text-xl font-bold text-ink">Thank you! Your message was sent.</h3>
                <p className="mt-2 text-sm text-ink-2">
                  We have received your inquiry and will reply to the email address you gave.
                </p>
                <Button variant="secondary" className="mt-6" onClick={() => setSent(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                {error && (
                  <div role="alert" className="flex items-start gap-2.5 rounded-xl bg-danger-soft p-3.5 text-sm text-danger">
                    <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    <span>
                      {error}{' '}
                      <a
                        href={`mailto:${CONTACT_EMAIL}`}
                        className="font-semibold underline underline-offset-2"
                      >
                        Or email us directly.
                      </a>
                    </span>
                  </div>
                )}

                {/* Hidden spam trap: people never see it, bots fill it in. */}
                <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label>
                    Website
                    <input tabIndex={-1} autoComplete="off" value={form.website} onChange={update('website')} />
                  </label>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Full name" error={fieldErrors.name}>
                    {(id) => (
                      <Input id={id} required maxLength={120} autoComplete="name" value={form.name} onChange={update('name')} />
                    )}
                  </Field>
                  <Field label="Email address" error={fieldErrors.email}>
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
                <Field label="Institution / organization (optional)" error={fieldErrors.organization}>
                  {(id) => (
                    <Input id={id} maxLength={200} autoComplete="organization" value={form.org} onChange={update('org')} />
                  )}
                </Field>
                <Field label="Subject" error={fieldErrors.subject}>
                  {(id) => (
                    <Input id={id} required maxLength={200} value={form.subject} onChange={update('subject')} />
                  )}
                </Field>
                <Field label="Your message" error={fieldErrors.message} hint="At least 10 characters.">
                  {(id) => (
                    <Textarea id={id} rows={5} required maxLength={5000} value={form.message} onChange={update('message')} />
                  )}
                </Field>
                <Button type="submit" size="lg" full loading={sending} icon={<Send className="h-4 w-4" />}>
                  {sending ? 'Sending…' : 'Send inquiry'}
                </Button>
              </form>
            )}
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
