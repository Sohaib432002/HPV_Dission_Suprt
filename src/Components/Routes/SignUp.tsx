import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FlaskConical, TriangleAlert, UserRound } from 'lucide-react'
import { AuthShell } from '../ui/AuthShell'
import { PasswordInput } from '../ui/PasswordInput'
import { Button, Field, Input, Select, useToast } from '../ui'
import { apiFetch } from '../../lib/api'

const roles = [
  { value: 'patient', label: 'Patient', icon: UserRound, hint: 'View your reports' },
  { value: 'lab_engineer', label: 'Engineer', icon: FlaskConical, hint: 'Run tests and forecasts' },
]

/** Flatten DRF error payloads ({field: [msg]} or {detail}) into one readable line. */
function readError(result: Record<string, unknown>) {
  if (typeof result.detail === 'string') return result.detail
  const first = Object.entries(result)[0]
  if (!first) return 'Signup failed'
  const [field, msg] = first
  return `${field}: ${Array.isArray(msg) ? msg[0] : String(msg)}`
}

const Signup = () => {
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    age: '' as number | '',
    gender: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    // Age and gender belong to patients only: switching role clears them so they can never carry over.
    if (name === 'role') {
      setForm({ ...form, role: value, age: '', gender: '' })
      return
    }
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/
    if (!passwordRegex.test(form.password)) {
      setError('Password must contain an uppercase letter and a special character')
      return
    }
    if (!form.role) {
      setError('Please choose a role')
      return
    }

    setLoading(true)
    try {
      const response = await apiFetch('/api/auth/signup/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Engineers send no age/gender at all; patients send both.
        body: JSON.stringify(
          form.role === 'patient'
            ? { ...form, age: Number(form.age) }
            : { username: form.username, email: form.email, password: form.password, role: form.role }
        ),
      })
      const result = await response.json()

      if (response.ok) {
        toast.success('Account created. Please log in.')
        navigate('/Login')
      } else {
        setError(readError(result))
      }
    } catch (err) {
      console.error(err)
      setError('Server error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join the lab to run simulations, analyze images and manage reports."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/Login" className="font-semibold text-brand hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl bg-danger-soft p-3.5 text-sm text-danger"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {error}
          </div>
        )}

        <fieldset>
          <legend className="mb-1.5 text-sm font-medium text-ink-2">I am a (choose one)</legend>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((r) => (
              <label
                key={r.value}
                className="relative flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-surface p-3.5 transition-colors has-[:checked]:border-brand has-[:checked]:bg-brand-soft has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-brand/40"
              >
                <input
                  type="radio"
                  name="role"
                  value={r.value}
                  checked={form.role === r.value}
                  onChange={handleChange}
                  className="sr-only"
                  required
                />
                <r.icon className="h-5 w-5 shrink-0 text-brand" aria-hidden />
                <span>
                  <span className="block text-sm font-semibold text-ink">{r.label}</span>
                  <span className="block text-xs text-muted">{r.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <Field label="Full name">
          {(id) => (
            <Input id={id} name="username" autoComplete="username" value={form.username} onChange={handleChange} required />
          )}
        </Field>
        <Field label="Email address">
          {(id) => (
            <Input id={id} type="email" name="email" autoComplete="email" value={form.email} onChange={handleChange} required />
          )}
        </Field>

        {form.role === 'patient' && (
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Age">
              {(id) => (
                <Input id={id} type="number" name="age" min={0} max={120} value={form.age} onChange={handleChange} required />
              )}
            </Field>
            <Field label="Gender">
              {(id) => (
                <Select id={id} name="gender" value={form.gender} onChange={handleChange} required>
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </Select>
              )}
            </Field>
          </div>
        )}

        <Field label="Password" hint="Must include an uppercase letter and a special character (!@#$%^&*).">
          {(id) => (
            <PasswordInput id={id} name="password" autoComplete="new-password" value={form.password} onChange={handleChange} required />
          )}
        </Field>

        <Button type="submit" size="lg" full loading={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>
    </AuthShell>
  )
}

export default Signup
