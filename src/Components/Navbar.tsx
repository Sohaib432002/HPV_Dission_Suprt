import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { LogOut, Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from './ThemeContext'
import { useAuth, clearTokens } from '../lib/auth'
import { buttonClass } from './ui/buttonStyles'
import { BrandMark } from './ui/BrandMark'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive ? 'bg-brand-soft text-brand' : 'text-ink-2 hover:bg-surface-2 hover:text-ink'
  }`

const Navbar = () => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()
  const { isAuth, role } = useAuth()
  // The drawer is tied to the page it was opened on, so navigating closes it.
  const [openAt, setOpenAt] = useState<string | null>(null)
  const menuOpen = openAt === pathname
  const setMenuOpen = (open: boolean) => setOpenAt(open ? pathname : null)

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpenAt(null)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const handleLogout = () => {
    clearTokens()
    setMenuOpen(false)
    navigate('/Login')
  }

  const links = [
    { to: '/', label: 'Home', end: true },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
    ...(isAuth
      ? [
          { to: role === 'patient' ? '/PatientProfile' : '/LabEngProfile', label: 'Dashboard' },
          ...(role !== 'patient' ? [{ to: '/simulation', label: 'Simulation' }] : []),
          { to: '/future-predict', label: 'Prediction' },
        ]
      : []),
  ]

  const themeButton = (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
      className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink-2 transition-colors hover:border-brand hover:text-brand"
    >
      {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  )

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5" aria-label="HPV Research Lab home">
          <BrandMark />
          <span className="font-display text-lg font-extrabold tracking-tight text-ink">
            HPV<span className="text-brand"> Research Lab</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {themeButton}
          {isAuth ? (
            <button type="button" onClick={handleLogout} className={buttonClass({ variant: 'secondary', size: 'sm' })}>
              <LogOut className="h-4 w-4" aria-hidden /> Log out
            </button>
          ) : (
            <>
              <Link to="/Login" className={buttonClass({ variant: 'ghost', size: 'sm' })}>
                Log in
              </Link>
              <Link to="/SignUp" className={buttonClass({ size: 'sm' })}>
                Get started
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {themeButton}
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="grid h-10 w-10 place-items-center rounded-xl border border-line text-ink"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-x-0 bottom-0 top-16 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <nav
            id="mobile-menu"
            aria-label="Mobile"
            className="animate-rise absolute inset-x-0 top-16 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto border-b border-line bg-surface p-4 shadow-pop lg:hidden"
          >
            <div className="flex flex-col gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  className={({ isActive }) => `${linkClass({ isActive })} !py-3 !text-base`}
                >
                  {l.label}
                </NavLink>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-2 border-t border-line pt-4">
              {isAuth ? (
                <button type="button" onClick={handleLogout} className={buttonClass({ variant: 'secondary', full: true })}>
                  <LogOut className="h-4 w-4" aria-hidden /> Log out
                </button>
              ) : (
                <>
                  <Link to="/SignUp" className={buttonClass({ full: true })}>
                    Get started
                  </Link>
                  <Link to="/Login" className={buttonClass({ variant: 'secondary', full: true })}>
                    Log in
                  </Link>
                </>
              )}
            </div>
          </nav>
        </>
      )}
    </header>
  )
}

export default Navbar
