/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useEffect, useState, useRef } from 'react'

import { generateProfessionalPDF } from './Report'
import { PieChartForPDF, LineChartForPDF } from './PdfCharts'
import { jwtDecode } from 'jwt-decode'
import { useTheme } from '../ThemeContext'

interface DecodedUser {
  username?: string
  user_id?: string
  age?: string
  gender?: string
}

interface SimulationChartProps {
  mainResult: any
  data: any
  startYear?: number
  Limitaions: any
  PatientDetails: any
}

const SimulationChart = ({
  mainResult,
  data,
  Limitaions,
  PatientDetails,
  startYear = 2026,
}: SimulationChartProps) => {
  const [chartData, setChartData] = useState<any[]>([])
  const [mode, setMode] = useState<'ode' | 'ml'>('ode')
  const pieChartCanvasRef = useRef<HTMLCanvasElement | any>(null)
  const lineChartCanvasRef = useRef<HTMLCanvasElement | any>(null)
  const [S1, setS1] = useState(true)
  const [S2, setS2] = useState(true)
  const [Infected, setInfected] = useState(true)
  const [Recoverd, setRecoverd] = useState(true)
  const [Cancer, setCancer] = useState(true)
  const [showR, setshowR] = useState(false)
  const [showLimitaion, setShowLimitaion] = useState(false)
  const [CalR, setCal] = useState(false)
  const [User, setUser] = useState<DecodedUser | null>(null)
  useEffect(() => {
    if (Limitaions === '') {
      setShowLimitaion(false)
    }
  }, [Limitaions])
  const { theme } = useTheme()
  useEffect(() => {
    const token = localStorage.getItem('access')
    if (token) {
      const decoded: any = jwtDecode(token)
      setUser(decoded)
    }
  }, [])

  useEffect(() => {
    if (!data) return
    if (data.data) {
      setMode('ode')
      const { time, S1, S2, Infected, Recovered, Cancer, Rt } = data.data

      const formatted = time.map((t: number, i: number) => {
        const year = startYear + Math.floor(t / 12)
        return {
          year,
          S1: S1[i],
          S2: S2[i],
          Infected: Infected[i],
          Recovered: Recovered[i],
          Cancer: Cancer[i],
          Rt: Rt[i],
        }
      })

      setChartData(formatted)
    } else if (data.future_time) {
      setMode('ml')
      const { future_time, ml_prediction } = data

      const formatted = future_time.map((t: number, i: number) => {
        const year = startYear + Math.floor(t / 12)
        return {
          year,
          prediction: ml_prediction[i],
        }
      })

      setChartData(formatted)
    }
  }, [data, startYear])
  if (chartData.length === 0)
    return (
      <div className="flex justify-center items-center h-64 text-cyan-400 font-bold">
        Loading chart...
      </div>
    )
  const handleSubmit = async () => {
    try {
      const token: any = localStorage.getItem('access')
      const decoded: any = jwtDecode(token)
      const pdfBlob: Blob = await generateProfessionalPDF({
        logo_url: '/logo.png',
        patient_name: User?.username || 'anonyumus',
        patient_id: User?.user_id || 'Unknown',
        age: User?.age ? parseInt(User.age, 10) : 0,
        gender: User?.gender || 'Unknown',
        overall_infection_rate: mainResult.overall_infection_rate,
        total_cells: mainResult.total_cells,
        total_infected_cells: mainResult.total_infected_cells,
        image_results: mainResult.image_results,
        S_1_Cal: data.data.S_1,
        S_2_Cal: data.data.S_2,
        I_Cal: data.data.I_eq,
        R_Cal: data.data.R_eq,
        C_Cal: data.data.C_eq,
        R0_Cal: data.data.R_0,
        PatientDetails: PatientDetails,
      })

      const url = window.URL.createObjectURL(pdfBlob)
      const a = document.createElement('a')
      a.href = url
      if (decoded.role === 'lab_engineer') {
        a.download = `HPV_Report_${PatientDetails?.Name || 'Patient'}.pdf`
      } else {
        a.download = `HPV_Report_${User?.username || 'Patient'}.pdf`
      }
      a.click()
      window.URL.revokeObjectURL(url)

      const formData = new FormData()
      if (decoded.role === 'lab_engineer') {
        formData.append('document', pdfBlob, `HPV_Report_${PatientDetails?.Name || 'Patient'}.pdf`)
      } else {
        formData.append('document', pdfBlob, `HPV_Report_${User?.username || 'Patient'}.pdf`)
      }
      formData.append('result', 'HPV Analysis Completed')

      const response = await fetch(
        'https://sohaib432002-hpv-dsion-support.hf.space/api/reports/upload/',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`, // ✅ now correct
          },
          body: formData,
        }
      )

      const responseData = await response.json()

      if (response.ok) {
        alert('✅ PDF Downloaded & Saved Successfully!')
      } else {
        console.error(responseData)
        alert(' Upload failed!')
      }
    } catch (error) {
      console.error(error)
      alert(' Error occurred!')
    }
  }

  return (
    <>
      <div className="w-full">
        <div className="flex  justify-between my-2">
          <h2 className="text-2xl font-bold text-center align-middle  text-cyan-400">
            {mode === 'ml' ? 'ML Prediction Graph' : 'HPV Mathematical Model'}
          </h2>
          {mainResult !== null && User !== null ? (
            <button
              onClick={handleSubmit}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold rounded shadow-lg hover:scale-105 transition"
            >
              Downloaded & Saved Report
            </button>
          ) : null}
          {mode === 'ml'
            ? null
            : Limitaions && (
                <button
                  onClick={() => setShowLimitaion(true)}
                  className="bg-red-500 p-2 cursor-pointer m-b-3 hover:bg-red-700 rounded"
                >
                  Limitation in this Method
                </button>
              )}
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#88888844" />
            {theme === 'dark' ? (
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: '#e0e0e0' }}
                label={{ value: 'Year', position: 'insideBottom', offset: -5, fill: '#c0c0c0' }}
              />
            ) : (
              <XAxis
                dataKey="year"
                tick={{ fontSize: 12, fill: 'black' }}
                label={{ value: 'Year', position: 'insideBottom', offset: -5, fill: '#c0c0c0' }}
              />
            )}

            <YAxis tick={{ fill: '#e0e0e0', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ backgroundColor: '#1a202c', borderRadius: '8px', color: '#fff' }}
            />
            <Legend wrapperStyle={{ color: '#fff', fontWeight: 'bold' }} />

            {mode === 'ode' && (
              <>
                {S1 && (
                  <Line
                    type="monotone"
                    dataKey="S1"
                    stroke="#3b82f6"
                    name="S1 Population"
                    dot={false}
                    strokeWidth={2}
                  />
                )}
                {S2 && (
                  <Line
                    type="monotone"
                    dataKey="S2"
                    stroke="#10b981"
                    name="S2 Population"
                    dot={false}
                    strokeWidth={2}
                  />
                )}
                {Infected && (
                  <Line
                    type="monotone"
                    dataKey="Infected"
                    stroke="#ef4444"
                    name="Infected"
                    dot={false}
                    strokeWidth={2}
                  />
                )}
                {Recoverd && (
                  <Line
                    type="monotone"
                    dataKey="Recovered"
                    stroke="#929e28"
                    name="Recovered"
                    dot={false}
                    strokeWidth={2}
                  />
                )}
                {Cancer && (
                  <Line
                    type="monotone"
                    dataKey="Cancer"
                    stroke="#646473"
                    name="Cancer Cases"
                    dot={false}
                    strokeWidth={2}
                  />
                )}
                {showR && (
                  <Line
                    type="monotone"
                    dataKey="Rt"
                    stroke="#facc15"
                    name="Rₜ (Effective Reproduction Number)"
                    dot={false}
                    strokeWidth={2}
                  />
                )}
              </>
            )}

            {mode === 'ml' && (
              <Line
                type="monotone"
                dataKey="prediction"
                stroke="#ef4444"
                strokeWidth={3}
                name="ML Predicted Infected"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
        <div className="flex justify-normal p-5 gap-2">
          <button
            onClick={() => {
              setS1(true)
              setS2(false)
              setInfected(false)
              setRecoverd(false)
              setCancer(false)
              setshowR(false)
            }}
            className="flex-1 p-4  hover:bg-[#3b82f6]/20 rounded cursor-pointer bg-[#3b82f6]"
          >
            S1 Population
          </button>

          <button
            onClick={() => {
              setS1(false)
              setS2(true)
              setInfected(false)
              setshowR(false)
              setRecoverd(false)
              setCancer(false)
            }}
            className="flex-1 p-4 rounded hover:bg-[#10b981]/20 cursor-pointer bg-[#10b981]"
          >
            S2 Population
          </button>

          <button
            onClick={() => {
              setS1(false)
              setS2(false)
              setInfected(true)
              setRecoverd(false)
              setshowR(false)
              setCancer(false)
            }}
            className="flex-1 p-4 rounded hover:bg-[#ef4444]/20 cursor-pointer bg-[#ef4444]"
          >
            Infected
          </button>

          <button
            onClick={() => {
              setS1(false)
              setS2(false)
              setInfected(false)
              setRecoverd(true)
              setshowR(false)
              setCancer(false)
            }}
            className="flex-1 p-4 rounded hover:bg-[#929e28]/20 cursor-pointer bg-[#929e28]"
          >
            Recovered
          </button>

          <button
            onClick={() => {
              setS1(false)
              setS2(false)
              setInfected(false)
              setshowR(false)
              setRecoverd(false)
              setCancer(true)
            }}
            className="flex-1 p-4 rounded hover:bg-[#646473]/20 cursor-pointer bg-[#646473]"
          >
            Cancer Cases
          </button>

          <button
            onClick={() => {
              setS1(true)
              setS2(true)
              setInfected(true)
              setRecoverd(true)
              setshowR(false)
              setCancer(true)
            }}
            className="flex-1 p-4 rounded  hover:bg-[#258f10]/20 cursor-pointer bg-[#258f10]"
          >
            All
          </button>
        </div>
        {/* #"Implemented effective reproduction number (Rt) over time in NSFD simulation to analyze dynamic disease transmission instead of constant R0"
        #git commit -m "Enhanced NSFD simulation by introducing time-varying reproduction number Rt. Rt is computed at each time step using Rt = ((1-m)*beta*S2(t))/(mu+1), enabling dynamic analysis of disease spread and control (Rt < 1 condition)." */}

        {mode === 'ml' ? null : (
          <div className="flex justify-normal mx-5">
            <button
              onClick={() => {
                setS1(false)
                setS2(false)
                setInfected(false)
                setRecoverd(false)
                setCancer(false)
                setshowR(true)
              }}
              className="flex-1 p-4  hover:bg-[#3b82f6]/20 rounded cursor-pointer bg-[#3b82f6]"
            >
              Visulize R₀
            </button>
            <button
              onClick={() => setCal(!CalR)}
              className="flex-1 mx-1 p-4  hover:bg-[#3b82f6]/20 rounded cursor-pointer bg-[#3b82f6]"
            >
              Calculate R₀
            </button>
          </div>
        )}
        {CalR && (
          <div className="text-center p-5">
            <h2 className="text-2xl font-bold text-cyan-400">Basic Reproduction Number (R₀)</h2>

            <p className="text-lg mt-2">
              R₀ = <span className="italic">((1 − m) × β × δ × A)</span> /
              <span className="italic">((μ + n + (1 − n)) × (μ² + δm + δμ + μm))</span>
            </p>

            <div className="mt-3 text-xl font-semibold text-green-500">
              Value: {data?.data?.R_0?.toFixed(4)}
            </div>
          </div>
        )}

        {showLimitaion && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-blue-50 p-8 rounded max-w-md w-full shadow-lg border border-blue-200">
              <h2 className="text-2xl font-semibold text-blue-900 mb-4 text-center">
                {Limitaions[0].title}
              </h2>
              <ul className="list-disc list-inside space-y-2 text-blue-800 text-base">
                <li>{Limitaions[1]}</li>
                <li>{Limitaions[2]}</li>
                <li>{Limitaions[3]}</li>
                <li>{Limitaions[4]}</li>
                <li>{Limitaions[5]}</li>
              </ul>
              <div className="flex justify-center mt-6">
                <button
                  className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full hover:bg-blue-700 transition-colors duration-200 shadow"
                  onClick={() => setShowLimitaion(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
        {Limitaions === '' && (
          <div className="flex justify-center mt-4">
            <button
              type="button"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded shadow-md transition duration-200"
            >
              <a href="/future-predict"> Try Again</a>
            </button>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', top: -9999, left: -9999 }}>
        {/* Pie Chart for PDF */}
        <div ref={pieChartCanvasRef}>
          <PieChartForPDF
            total_cells={mainResult?.total_cells}
            total_infected_cells={mainResult?.total_infected_cells}
          />
        </div>

        {/* Line Chart for PDF */}
        <div ref={lineChartCanvasRef}>
          <LineChartForPDF data={chartData} />
        </div>
      </div>
    </>
  )
}

export default SimulationChart
