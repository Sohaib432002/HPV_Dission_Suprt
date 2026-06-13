import { Outlet } from 'react-router-dom'
import Navbar from '../Navbar'
import { useTheme } from '../ThemeContext'

export default function Layout() {
  const { theme } = useTheme()
  return (
    <div
      className={`min-h-screen transition-all duration-700 ${
        theme === 'dark'
          ? 'bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-800'
          : 'bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400'
      }`}
    >
      <Navbar />

      <main className="pt-13">
        <Outlet />
      </main>
    </div>
  )
}
