/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-unused-vars */
import  { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Activity, Database, Users, BarChart3 } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'
import { useTheme } from '../ThemeContext'

interface Report {
  id: number
  date: string
  result: string
  document: string
  patient_name?: string
}

interface DecodedToken {
  username: string
  user_id: number
  age: string
  gender: string
}

interface Patient {
  id: number
  name: string
  status: string
}

export default function LabEngineerDashboard() {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [, setPatient] = useState<DecodedToken | null>(null)
  const [reports, setReports] = useState<Report[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
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

        const patientMap: { [name: string]: Patient } = {}
        data.forEach((r) => {
          const nameFromDoc = r.document.split('/').pop()?.split('_')[2] || 'Unknown'
          if (!patientMap[nameFromDoc]) {
            patientMap[nameFromDoc] = { id: r.id, name: nameFromDoc, status: 'Analyzed' }
          }
        })
        setPatients(Object.values(patientMap))
      } catch (e) {
        console.error('Error fetching reports:', e)
      }
    }

    getReports()
  }, [])

  const selectedReports = selectedPatient
    ? reports.filter((r) => r.document.includes(selectedPatient.name.replace(' ', '_')))
    : []

  // Day/night theme settings
  const bgGradient =
    theme === 'dark'
      ? 'bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-800'
      : 'bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-400'

  const panelBg = theme === 'dark' ? 'bg-white/10' : 'bg-white/20'
  const panelBorder = theme === 'dark' ? 'border-white/20' : 'border-gray-200/40'
  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const subTextColor = theme === 'dark' ? 'text-blue-200' : 'text-gray-700'
  const hoverBg = theme === 'dark' ? 'hover:bg-white/20' : 'hover:bg-white/30'

  return (
    <div className={`min-h-screen p-6 transition-all duration-700 ${bgGradient}`}>
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1
            className={`text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg ${textColor}`}
          >
            Lab Engineer Dashboard
          </h1>
          <p className={`mt-3 text-lg md:text-xl font-medium ${subTextColor}`}>
            Manage patients, analyze reports, and track system performance seamlessly
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Users, title: 'Total Patients', value: patients.length },
            { icon: Activity, title: 'Processed Cases', value: reports.length },
            { icon: BarChart3, title: 'Accuracy', value: '84%' },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              className={`backdrop-blur-lg ${panelBg} ${panelBorder} rounded-xl p-6 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <stat.icon className="w-10 h-10 mb-3 text-cyan-400" />
              <h3 className="text-lg font-semibold">{stat.title}</h3>
              <p className="text-3xl font-bold mt-1">{stat.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Patient List */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`backdrop-blur-lg ${panelBg} ${panelBorder} rounded-2xl p-6 shadow-inner hover:shadow-lg transition-shadow duration-300`}
          >
            <Database className="text-cyan-400 w-10 h-10 mb-4" />
            <h2 className={`text-2xl font-semibold mb-5 ${textColor}`}>Patient Queue</h2>
            <div className="space-y-3 max-h-[450px] overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-400 scrollbar-track-white/10">
              {patients.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  className={`cursor-pointer p-3 rounded-lg transition-colors duration-300 ${
                    selectedPatient?.id === p.id
                      ? 'bg-cyan-400/30 text-white'
                      : `${panelBg} ${hoverBg} ${textColor}`
                  }`}
                >
                  <p className="font-semibold">{p.name}</p>
                  <p className={`text-sm ${subTextColor}`}>Status: {p.status}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Patient Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className={`backdrop-blur-lg ${panelBg} ${panelBorder} rounded-2xl p-6 shadow-inner hover:shadow-lg transition-shadow duration-300`}
          >
            <h2 className={`text-2xl font-semibold mb-5 ${textColor}`}>Patient Details</h2>
            {selectedPatient ? (
              <div className="space-y-3">
                <p>
                  <span className="font-bold">Name:</span> {selectedPatient.name}
                </p>
                <p>
                  <span className="font-bold">Status:</span> {selectedPatient.status}
                </p>

                {selectedReports.length > 0 ? (
                  <div className="mt-5">
                    <h3 className={`font-semibold mb-3 text-lg ${textColor}`}>Reports:</h3>
                    <ul className="list-disc pl-5 space-y-2 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-purple-400 scrollbar-track-white/10">
                      {selectedReports.map((r) => (
                        <li key={r.id}>
                          <a
                            href={r.document}
                            target="_blank"
                            className="block w-full py-2 px-3 rounded-lg bg-purple-800 text-purple-200 hover:bg-purple-900 hover:underline transition-all duration-300"
                          >
                            {r.result} ({new Date(r.date).toLocaleDateString()}) -- Generate Report
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="mt-3 text-blue-200">No reports available</p>
                )}
              </div>
            ) : (
              <p className="text-blue-200">Select a patient to view details</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
