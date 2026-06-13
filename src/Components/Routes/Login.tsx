/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import { Link } from 'react-router'
import { useTheme } from '../ThemeContext'
const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [, setdata] = useState(false)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }
  const { theme } = useTheme()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(
        'https://sohaib432002-hpv-dsion-support.hf.space/api/auth/login/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        }
      )

      const result = await response.json()

      if (response.ok) {
        localStorage.setItem('access', result.access)
        localStorage.setItem('refresh', result.refresh)
        window.location.href = '/'
      }
      setdata(result)
    } catch (error) {
      alert('Problem')
    }
    setLoading(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0">
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

        {/* ANIMATED COLOR BLOBS */}
        {/* <div className="absolute inset-0">
          <div className="absolute w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply opacity-20 animate-blob -top-10 -left-10"></div>
          <div className="absolute w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-2000 top-20 right-0"></div>
          <div className="absolute w-72 h-72 bg-cyan-400 rounded-full mix-blend-multiply opacity-20 animate-blob animation-delay-4000 bottom-10 left-1/3"></div>
        </div> */}
      </div>
      {/* Login Card */}
      <div
        className={`relative z-10 ${theme === 'dark' ? 'bg-white/10' : 'bg-black/50'}  backdrop-blur-lg border border-blue-300 rounded p-8 md:p-12 w-full max-w-md shadow-xl`}
      >
        <h1 className={`text-3xl font-bold text-white text-center mb-4`}>
          Mathematics & HPV Research Lab
        </h1>
        <p className="text-blue-200 text-center mb-8 text-sm">
          Welcome back! Login to access your research tools and simulations.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter Your Name"
            className="px-4 py-3 rounded border border-blue-300 bg-white/20 placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="px-4 py-3 rounded border border-blue-300 bg-white/20 placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="mt-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 rounded font-semibold shadow-lg hover:scale-105 transition transform disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-blue-200 text-center mt-6 text-sm">
          Don’t have an account?{' '}
          <Link to="/SignUp" className="text-white font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>

      {/* Tailwind blob animation */}
      <style>
        {`
          @keyframes blob {
            0%, 100% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob { animation: blob 7s infinite; }
          .animation-delay-2000 { animation-delay: 2s; }
          .animation-delay-4000 { animation-delay: 4s; }
        `}
      </style>
    </div>
  )
}

export default Login
