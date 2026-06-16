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
  const navigate = useNavigate()
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const { theme } = useTheme()
  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])/
    if (!passwordRegex.test(form.password)) {
      alert('Password must contain an uppercase letter and a special character')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        'https://sohaib432002-hpv-dsion-support.hf.space/api/auth/signup/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      )

      const result = await response.json()

      if (response.ok) {
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
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-900 overflow-hidden">
      <div className=" inset-0">
        {/* BACKGROUND IMAGE */}
        {theme === 'dark' ? (
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-80"
            style={{
              backgroundImage:
                "url('https://thumbs.dreamstime.com/b/hand-analyzing-stock-data-ai-generated-image-holding-pen-financial-digital-screen-displaying-various-market-graphs-380385728.jpg')",
            }}
          ></div>
        ) : (
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-80"
            style={{
              backgroundImage:
                "url('https://www.shutterstock.com/image-photo/forex-market-graph-hologram-personal-600nw-2489218761.jpg')",
            }}
          ></div>
        )}
        <div
          className={`relative z-10 ${theme === 'dark' ? 'bg-white/10' : 'bg-black/50'}  backdrop-blur-lg border border-blue-300 rounded p-8 md:p-12 w-full max-w-md shadow-xl`}
        >
          {' '}
          <h1 className="text-3xl font-bold text-white text-center mb-6">Create Account</h1>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="mt-2 p-4 rounded-lg bg-blue-900/20 border border-blue-500/30 text-sm text-gray-300">
  <h4 className="font-semibold text-white mb-2">Important Instructions</h4>

  <ul className="list-disc list-inside space-y-1">
    <li>Username must not contain spaces.</li>
    <li>Use an underscore (_) instead of spaces if needed.</li>
    <li>Password must include at least one uppercase letter.</li>
    <li>Password must include at least one number.</li>
    <li>Password must include at least one special character.</li>
    <li>Example Username: <strong>sohaib_maqsood</strong></li>
    <li>Example Password: <strong>Sohaib@123</strong></li>
  </ul>
</div>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Full Name"
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
              <option value="lab_engineer" className="text-black">
                Engineer
              </option>
              <option value="patient" className="text-black">
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
                  <option value="Male" className="text-black">
                    Male
                  </option>
                  <option value="Female" className="text-black">
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
            <p className="text-sm text-gray-400">
              Password must include uppercase letter & special character
            </p>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded font-semibold shadow-lg"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
          </form>
          <p className="text-blue-200 text-center mt-6 text-sm">
            Already have an account?{' '}
            <Link to="/Login" className="text-white font-semibold underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Signup
