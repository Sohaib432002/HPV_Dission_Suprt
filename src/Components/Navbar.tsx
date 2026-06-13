/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from 'react'
import { jwtDecode } from 'jwt-decode'
import { Link, useNavigate } from 'react-router-dom'
import { useTheme } from '../Components/ThemeContext'

const Navbar = () => {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [isAuth, setIsAuth] = useState(false)
  const [role, setRole] = useState<string | null>(null)

  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const token = localStorage.getItem('access')
    setIsAuth(!!token)
    if (token) {
      const decoded: { role?: string } = jwtDecode(token)
      setRole(decoded?.role ?? null)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setIsAuth(false)
    navigate('/Login')
    setMenuOpen(false)
  }

  const navbarBg =
    theme === 'dark'
      ? 'bg-[#0B0F2A] border-[#1F2340] shadow-[0_4px_20px_rgba(103,76,255,0.3)]'
      : 'bg-white border-gray-200 shadow-lg'
  const linkColor = theme === 'dark' ? 'text-slate-300' : 'text-gray-700'

  return (
    <>
      {/* NAVBAR */}
      <header
        className={`w-full fixed top-0 z-50 backdrop-blur-xl border-b ${navbarBg} transition-colors duration-500`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
          {/* LOGO */}
          <div className="flex items-center gap-3 cursor-pointer">
            <img src="/logo.png" className="w-11 h-11 drop-shadow-lg" />
            <h1 className="text-xl font-bold tracking-wide bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
              HPV Research Lab
            </h1>
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex">
            <ul className={`flex gap-8 text-sm font-semibold ${linkColor}`}>
              {isAuth && (
                <li className="transition-all">
                  <Link to={role === 'patient' ? '/PatientProfile' : '/LabEngProfile'}>
                    Profile
                  </Link>
                </li>
              )}
              <li className="transition-all">
                <Link to="/">Home</Link>
              </li>
              <li className="transition-all">
                <Link to="/about">About</Link>
              </li>
              <li className="transition-all">
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
          <button
            onClick={toggleTheme}
            className={`relative w-14 h-8 flex items-center rounded p-1 transition-all duration-300 ${theme === 'dark' ? 'bg-slate-700' : 'bg-gray-300'}`}
          >
            <div
              className={`w-6 h-6 rounded bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 shadow-lg transform transition-all duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`}
            />
          </button>
          {/* RIGHT BUTTONS */}
          <div className="hidden md:flex gap-3 items-center">
            {/* THEME TOGGLE */}

            {isAuth ? (
              <>
                {role !== 'patient' && (
                  <Link
                    to="/simulation"
                    className="px-5 py-2 rounded text-white font-semibold
                    bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600
                    shadow-md hover:shadow-[0_0_25px_rgba(103,76,255,0.5)] transition-all duration-300"
                  >
                    Simulation
                  </Link>
                )}
                <Link
                  to="/future-predict"
                  className="px-5 py-2 rounded font-semibold border border-violet-500 text-violet-400
                  hover:bg-violet-500 hover:text-white transition-all duration-300"
                >
                  Prediction
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded text-white font-semibold bg-gradient-to-r from-red-500 to-pink-500 shadow-md hover:shadow-[0_0_20px_rgba(255,77,77,0.5)] transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/Login"
                  className={`px-5 py-2 rounded font-semibold ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-gray-200 text-gray-800'} transition-all duration-300`}
                >
                  Login
                </Link>
                <Link
                  to="/SignUp"
                  className="px-5 py-2 rounded text-white font-semibold
                  bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 shadow-md hover:shadow-[0_0_25px_rgba(103,76,255,0.5)] transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className={`md:hidden text-2xl z-50  ${theme === 'dark' ? '  dark:text-slate-200' : 'text-gray-700 text-black'}`}
          >
            ☰
          </button>
        </div>
      </header>

      {/* MOBILE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-72 z-40 transition-transform duration-300
          ${theme === 'dark' ? 'bg-[#0B0F2A]' : 'bg-white text-black'}
          ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="pt-24 px-6 flex flex-col gap-6">
          <button
            onClick={toggleTheme}
            className="p-3  rounded bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 text-white w-full text-center shadow-md"
          >
            Toggle Theme
          </button>

          <Link to="/" onClick={() => setMenuOpen(false)}>
            Home
          </Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>
            About
          </Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>
            Contact
          </Link>

          {isAuth && (
            <Link
              to={role === 'patient' ? '/PatientProfile' : '/LabEngProfile'}
              onClick={() => setMenuOpen(false)}
            >
              Profile
            </Link>
          )}

          {!isAuth ? (
            <>
              <Link to="/Login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link to="/SignUp" onClick={() => setMenuOpen(false)}>
                Sign Up
              </Link>
            </>
          ) : (
            <button
              onClick={() => {
                handleLogout()
                setMenuOpen(false)
              }}
              className="px-5 py-2 rounded text-white font-semibold bg-gradient-to-r from-red-500 to-pink-500 w-full text-center shadow-md"
            >
              Logout
            </button>
          )}
        </div>
      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-all duration-300"
        />
      )}
    </>
  )
}

export default Navbar
