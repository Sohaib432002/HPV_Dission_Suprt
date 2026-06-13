/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import  { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { User, Calendar, Download } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'
import { useTheme } from '../ThemeContext'

interface Report {
  id: number
  date: string
  result: string
  document: string
}

interface DecodedToken {
  username: string
  user_id: number
  age: string
  gender: string
}

export default function PatientDashboard() {
  const [Patient, setPatient] = useState<DecodedToken | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const { theme } = useTheme()

  const fetchWithRefresh = async (url: string, options: any = {}) => {
    let token = localStorage.getItem('access')
    let response = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })

    if (response.status === 401) {
      const refreshToken = localStorage.getItem('refresh')
      if (!refreshToken) throw new Error('No refresh token found')

      const refreshResponse = await fetch(
        'https://sohaib432002-hpv-dsion-support.hf.space/api/token/refresh/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        }
      )

      if (!refreshResponse.ok) throw new Error('Failed to refresh token')

      const data = await refreshResponse.json()
      localStorage.setItem('access', data.access)
      token = data.access

      response = await fetch(url, {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })
    }

    return response
  }

  useEffect(() => {
    const token = localStorage.getItem('access')
    if (token) {
      const decoded: DecodedToken = jwtDecode(token)
      setPatient(decoded)
    }

    const getReports = async () => {
      try {
        const res = await fetchWithRefresh(
          'https://sohaib432002-hpv-dsion-support.hf.space/api/reports/'
        )
        const data: Report[] = await res.json()
        setReports(data)
      } catch (e) {
        console.log('Error fetching reports:', e)
      }
    }

    getReports()
  }, [])

  const patient = {
    name: Patient?.username || 'Anonymous',
    id: Patient?.user_id || 'Unknown',
    age: Patient?.age || 'Unknown',
    gender: Patient?.gender || 'Unknown',
  }

  const downloadReport = (url: string) => {
    const link = document.createElement('a')
    link.href = url
    link.download = url.split('/').pop() || 'report.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Day/night theme settings
  const bgGradient =
    theme === 'dark'
      ? 'bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-800'
      : 'bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400'

  const panelBg = theme === 'dark' ? 'bg-white/10' : 'bg-white/20'
  const panelBorder = theme === 'dark' ? 'border-white/20' : 'border-gray-200/40'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-blue-200' : 'text-gray-700'
  const buttonBg =
    theme === 'dark' ? 'bg-cyan-500 hover:bg-cyan-600' : 'bg-cyan-600 hover:bg-cyan-700'

  return (
    <div className={`min-h-screen p-6 transition-all duration-700 ${bgGradient}`}>
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 text-center`}
        >
          <h1 className={`text-4xl md:text-5xl font-bold ${textColor}`}>Patient Dashboard</h1>
          <p className={`mt-2 text-lg md:text-xl font-medium ${subTextColor}`}>
            View your medical reports and download them instantly
          </p>
        </motion.div>

        {/* Patient Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`backdrop-blur-lg ${panelBg} ${panelBorder} p-6 rounded-2xl shadow-xl`}
        >
          <User className={`w-8 h-8 mb-2 ${textColor}`} />
          <h2 className={`text-2xl font-semibold mb-4 ${textColor}`}>Patient Details</h2>
          <div className={`space-y-2 ${subTextColor}`}>
            <p>
              <strong>Name:</strong> {patient.name}
            </p>
            <p>
              <strong>Patient ID:</strong> {patient.id}
            </p>
            <p>
              <strong>Age:</strong> {patient.age}
            </p>
            <p>
              <strong>Gender:</strong> {patient.gender}
            </p>
          </div>
        </motion.div>

        {/* Report History */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`backdrop-blur-lg ${panelBg} ${panelBorder} p-6 rounded-2xl shadow-xl`}
        >
          <Calendar className={`w-8 h-8 mb-4 ${textColor}`} />
          <h2 className={`text-xl font-semibold mb-4 ${textColor}`}>Previous Reports</h2>

          {reports.length === 0 ? (
            <p className={subTextColor}>No reports found.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report.id}
                  className={`flex justify-between items-center ${panelBg} p-4 rounded-xl hover:opacity-90 transition`}
                >
                  <div className={subTextColor}>
                    <p>
                      <strong>Date:</strong> {new Date(report.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Result:</strong> {report.result}
                    </p>
                  </div>

                  <button
                    onClick={() => downloadReport(report.document)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-white transition ${buttonBg}`}
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
