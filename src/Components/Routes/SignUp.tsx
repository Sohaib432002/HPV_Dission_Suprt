
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../ThemeContext'

const Signup = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    age: 0,
    gender: 'unknown',
  })

  const [loading, setLoading] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)

  const navigate = useNavigate()
  const { theme } = useTheme()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const usernameRegex = /^\S+$/

    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]+$/

    if (!usernameRegex.test(form.username)) {
      alert(
        'Username must not contain spaces. Use underscore (_) instead.'
      )
      setLoading(false)
      return
    }

    if (!passwordRegex.test(form.password)) {
      alert(
        'Password must contain at least one uppercase letter, one number, and one special character.'
      )
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        'https://sohaib432002-hpv-dsion-support.hf.space/api/auth/signup/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        }
      )

      const result = await response.json()

      if (response.ok) {
        alert('Account created successfully!')
        navigate('/Login')
      } else {
        alert(result.detail || 'Signup failed')
      }
    } catch (error) {
      console.error(error)
      alert('Server error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">


      {theme === 'dark' ? (
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-80"
          style={{
            backgroundImage:
              "url('https://thumbs.dreamstime.com/b/hand-analyzing-stock-data-ai-generated-image-holding-pen-financial-digital-screen-displaying-various-market-graphs-380385728.jpg')",
          }}
        />
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-80"
          style={{
            backgroundImage:
              "url('https://www.shutterstock.com/image-photo/forex-market-graph-hologram-personal-600nw-2489218761.jpg')",
          }}
        />
      )}

    
      <div
        className={`relative z-10 ${
          theme === 'dark'
            ? 'bg-white/10'
            : 'bg-black/50'
        } backdrop-blur-lg border border-blue-300 rounded-xl p-8 md:p-12 w-full max-w-md shadow-xl`}
      >
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          Create Account
        </h2>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="input-style"
            required
          />

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="input-style"
            required
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="input-style text-white"
            required
          >
            <option value="" className="text-black">
              Select Role
            </option>

            <option
              value="lab_engineer"
              className="text-black"
            >
              Engineer
            </option>

            <option
              value="patient"
              className="text-black"
            >
              Patient
            </option>
          </select>

          {form.role === 'patient' && (
            <>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                placeholder="Enter Your Age"
                className="input-style"
                required
              />

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="input-style text-white"
                required
              >
                <option value="" className="text-black">
                  Select Gender
                </option>

                <option
                  value="Male"
                  className="text-black"
                >
                  Male
                </option>

                <option
                  value="Female"
                  className="text-black"
                >
                  Female
                </option>
              </select>
            </>
          )}

          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="input-style"
            required
          />

          <button
            type="button"
            onClick={() => setShowInstructions(true)}
            className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-semibold"
          >
            View Signup Instructions
          </button>

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded-lg font-semibold shadow-lg"
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>
        </form>

        <p className="text-blue-200 text-center mt-6 text-sm">
          Already have an account?{' '}
          <Link
            to="/Login"
            className="text-white font-semibold underline"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Instructions Modal */}
      {showInstructions && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-white text-black p-6 rounded-xl shadow-2xl max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              Signup Instructions
            </h2>

            <ul className="list-disc pl-5 space-y-2">
              <li>
                Username must not contain spaces.
              </li>

              <li>
                Use underscore (_) if you want to separate
                words.
              </li>

              <li>
                Password must contain:
                <ul className="list-disc pl-5 mt-2">
                  <li>One uppercase letter (A-Z)</li>
                  <li>One number (0-9)</li>
                  <li>
                    One special character (!@#$%^&*)
                  </li>
                </ul>
              </li>

              <li>
                Example Username:
                <strong> sohaib_maqsood</strong>
              </li>

              <li>
                Example Password:
                <strong> Sohaib@123</strong>
              </li>
            </ul>

            <button
              onClick={() => setShowInstructions(false)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
export default Signup

