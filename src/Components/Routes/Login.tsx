import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { TriangleAlert } from 'lucide-react'
import { AuthShell } from '../ui/AuthShell'
import { PasswordInput } from '../ui/PasswordInput'
import { Button, Field, Input } from '../ui'
import { apiFetch } from '../../lib/api'
import { setTokens } from '../../lib/auth'

const Login = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await apiFetch('/api/auth/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json()

      if (response.ok) {
        setTokens(result.access, result.refresh)
        navigate('/')
        return
      }
      setError(result.detail || 'Login failed. Please check your credentials.')
    } catch {
      setError('Could not reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to access your research tools, simulations and reports."
      footer={
        <>
          Don’t have an account?{' '}
          <Link to="/SignUp" className="font-semibold text-brand hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
        {error && (
          <div
            role="alert"
            className="flex items-start gap-2.5 rounded-xl bg-danger-soft p-3.5 text-sm text-danger"
          >
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
            {error}
          </div>
        )}
        <Field label="Username">
          {(id) => (
            <Input
              id={id}
              name="username"
              autoComplete="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          )}
        </Field>
        <Field label="Password">
          {(id) => (
            <PasswordInput
              id={id}
              name="password"
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          )}
        </Field>
        <Button type="submit" size="lg" full loading={loading}>
          {loading ? 'Logging in…' : 'Log in'}
        </Button>
      </form>
    </AuthShell>
  )
}

export default Login
