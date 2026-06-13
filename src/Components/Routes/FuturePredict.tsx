/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import ResultDashboard from './ResultDashboard'
import FlowChart from './FlowChart'
import SimulationChart from './Graph'
import { jwtDecode } from 'jwt-decode'
import { useTheme } from '../ThemeContext'

type FormParams = {
  recruitment_rate: number | ''
  natural_death_rate: number | ''
  transition_rate: number | ''
  recovery_proportion: number | ''
  cancer_progression_rate: number | ''
  stepSize: number | ''
  transmission_rate: number | ''
}

const FuturePredict = () => {
  const [images, setImages] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [results, setResults] = useState<any>(null)
  const [mainResult, setMainResult] = useState<any>(null)
  const [form, setForm] = useState<FormData | null>(null)
  const [showResult, setShowResult] = useState<boolean>(false)
  const [infectionRate, setInfectionRate] = useState<number | null>(null)
  const [PredictionParameters, setPredictionParameters] = useState<any>(null)
  const [showGraph, setshowGraph] = useState<boolean>(false)
  const [loading, setloading] = useState<boolean>(false)
  // eslint-disable-next-line @typescript-eslint/no-wrapper-object-types
  const [Model, setModel] = useState<Boolean>(false)
  const [User, setUser] = useState<any>(null)
  const [pendingAction, setPendingAction] = useState<string | null>(null)
  const [PatientDetails, setPatientDetails] = useState<any>({
    Name: '',
    Age: 0,
    Gender: '',
  })
  const [params, setParams] = useState<FormParams>({
    recruitment_rate: 50,
    natural_death_rate: 0.014,
    transition_rate: 0.1,
    transmission_rate: 0.1,
    recovery_proportion: 0.98,
    cancer_progression_rate: 0.003,
    stepSize: 1,
  })
  useEffect(() => {
    const token = localStorage.getItem('access')
    if (token) {
      const decoded: any = jwtDecode(token)
      setUser(decoded)
      console.log('object', decoded)
    }
  }, [])
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const filesArray = Array.from(e.target.files)
    setImages(filesArray)
    const urls = filesArray.map((file) => URL.createObjectURL(file))
    setPreviewUrls(urls)
  }
  const runUpload = async () => {
    const formData = new FormData()
    images.forEach((img) => formData.append('images', img))
    setForm(formData)

    try {
      const response = await fetch(
        'https://sohaib432002-hpv-dsion-support.hf.space/simulation/real_prediction',
        {
          method: 'POST',
          body: formData,
        }
      )
      const data = await response.json()
      setResults(data)
    } catch {
      alert('Image upload failed')
    }
  }
  const handleSubmit = async () => {
    if (images.length === 0) return alert('Please upload at least one image')
    if (User?.role === 'lab_engineer') {
      setPendingAction('upload') // mark action
      setModel(true)
      return
    }
    runUpload()
    const formData = new FormData()
    images.forEach((img) => formData.append('images', img))
    setForm(formData)
  }
  useEffect(() => {
    return () => previewUrls.forEach((url) => URL.revokeObjectURL(url))
  }, [previewUrls])
  useEffect(() => {
    if (!results || !form) return

    const handleResults = async () => {
      try {
        const response = await fetch(
          'https://sohaib432002-hpv-dsion-support.hf.space/simulation/ApplyModel',
          {
            method: 'POST',
            body: form,
          }
        )
        const data = await response.json()
        setMainResult(data)
        setInfectionRate(data.total_infected_cells / data.total_cells)
      } catch {
        alert('Prediction failed')
      }
    }

    handleResults()
  }, [results, form])
  const handlePatiendDetails = (e: any) => {
    e.preventDefault()
    setModel(false)

    if (pendingAction === 'upload') {
      runUpload()
    }
  }
  const handlePredictionSubmit = async () => {
    const payload = { ...params, transmission_rate: infectionRate }
    setloading(true)
    setshowGraph(true)

    try {
      const response = await fetch('https://sohaib432002-hpv-dsion-support.hf.space/simulation/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      setPredictionParameters(data)
    } catch {
      alert('Prediction failed')
    } finally {
      setloading(false)
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  
  if (pendingAction === 'simulation') {
    handlePredictionSubmit()
  }
  const { theme } = useTheme()
  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle,#2846d8,transparent)] flex flex-col items-center justify-start py-8 px-4 md:px-8 lg:px-16 overflow-x-hidden">
      {Model && (
        <div className="absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40 transition-all duration-500">
          <div
            className={`w-full max-w-lg p-6 md:p-8 rounded-2xl shadow-2xl border transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-white/90 border-gray-200 text-gray-900'
            }`}
          >
            <form onSubmit={handlePatiendDetails}>
              <h2
                className={`text-2xl md:text-3xl font-extrabold mb-6 text-center ${
                  theme === 'dark' ? 'text-cyan-300' : 'text-blue-600'
                }`}
              >
                Patient Information
              </h2>

              {/* Name */}
              <div className="mb-4">
                <label
                  className={`block mb-1 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Patient Name
                </label>
                <input
                  type="text"
                  onChange={(e) => setPatientDetails({ ...PatientDetails, Name: e.target.value })}
                  placeholder="Enter name"
                  className={`w-full px-3 py-2 rounded-lg outline-none transition ${
                    theme === 'dark'
                      ? 'bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-cyan-400'
                      : 'bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400'
                  }`}
                />
              </div>

              {/* Age */}
              <div className="mb-4">
                <label
                  className={`block mb-1 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Age
                </label>
                <input
                  type="number"
                  onChange={(e) => setPatientDetails({ ...PatientDetails, Age: e.target.value })}
                  placeholder="Enter age"
                  className={`w-full px-3 py-2 rounded-lg outline-none transition ${
                    theme === 'dark'
                      ? 'bg-white/10 border border-white/20 text-white focus:ring-2 focus:ring-cyan-400'
                      : 'bg-white border border-gray-300 focus:ring-2 focus:ring-blue-400'
                  }`}
                />
              </div>

              {/* Gender */}
              <div className="mb-6">
                <label
                  className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Gender
                </label>

                <div className="flex gap-6">
                  {['male', 'female'].map((g) => (
                    <label
                      key={g}
                      className={`flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg transition ${
                        theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-100'
                      }`}
                    >
                      <input
                        type="radio"
                        name="gender"
                        value={g}
                        onChange={(e) =>
                          setPatientDetails({ ...PatientDetails, Gender: e.target.value })
                        }
                        className="accent-cyan-500"
                      />
                      <span className="capitalize">{g}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Button */}
              <button
                type="submit"
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 shadow-lg'
                    : 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:scale-105 shadow-md'
                }`}
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
      {!results && (
        <div
          className={`backdrop-blur-xl shadow-2xl rounded p-6 md:p-8 w-full max-w-3xl border transition-all duration-500 ${
            theme === 'dark'
              ? 'bg-white/10 border-white/20 text-white'
              : 'bg-white/80 border-gray-200 text-gray-900'
          }`}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <h1
              className={`text-2xl md:text-3xl font-extrabold tracking-tight ${
                theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600'
              }`}
            >
              Future Prediction Using Infected Images
            </h1>
            <p
              className={`mt-2 text-sm md:text-base ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              Upload infected cell images and our machine learning model will analyze them to
              generate future infection predictions.
            </p>
          </div>

          {/* Upload Area */}
          <label
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded p-6 md:p-8 cursor-pointer transition-all duration-300 ${
              theme === 'dark'
                ? 'border-cyan-400 hover:bg-white/10'
                : 'border-cyan-500 hover:bg-cyan-50'
            }`}
          >
            <span className="text-cyan-500 font-semibold text-center">
              Click or Drag Images Here
            </span>
            <span
              className={`text-xs md:text-sm mt-1 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
            >
              Multiple images supported
            </span>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>

          {/* Preview */}
          {previewUrls.length > 0 && (
            <div className="mt-6">
              <h3
                className={`text-lg font-semibold mb-3 ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                Image Preview
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {previewUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative group overflow-hidden rounded shadow-md h-28 sm:h-32 md:h-36"
                  >
                    <img
                      src={url}
                      alt={`preview-${idx}`}
                      className="w-full h-full object-cover transition duration-300 group-hover:scale-110"
                    />

                    {/* Overlay Effect */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <span className="text-white text-xs">Preview</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Button */}
          <button
            type="button"
            onClick={handleSubmit}
            className={`mt-6 md:mt-8 w-full py-3 rounded font-semibold text-white shadow-lg transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105'
                : 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:scale-105'
            }`}
          >
            Upload Images & Run Prediction
          </button>
        </div>
      )}

      {/* Results Section */}
      {results && (
        <div className="w-full flex flex-col lg:flex-row mt-8 gap-6">
          {/* FlowChart & Dashboard */}
          <div
            className={`flex-1 backdrop-blur-xl shadow-2xl rounded p-4 md:p-6 border transition-all duration-500 ${
              theme === 'dark'
                ? 'bg-[radial-gradient(circle,#1e3a8a,transparent)] border-white/20 text-white'
                : 'bg-white/80 border-gray-200 text-gray-900'
            }`}
          >
            <FlowChart
              showResult={showResult}
              Result={results}
              mainResult={mainResult}
              setshowResult={setShowResult}
              InfectionRate={infectionRate}
              params={params}
              setParams={setParams}
              handlePredictionSubmit={handlePredictionSubmit}
            />

            {showResult && mainResult && (
              <div className="mt-6">
                <ResultDashboard setshowResult={setShowResult} data={mainResult} />
              </div>
            )}
          </div>

          {/* Simulation Graph */}
          {showGraph && (
            <div
              className={`flex-1 backdrop-blur-xl shadow-2xl rounded p-4 md:p-6 flex flex-col w-full border min-h-[450px] transition-all duration-500 ${
                theme === 'dark'
                  ? 'bg-white/10 border-white/20 text-white'
                  : 'bg-white/80 border-gray-200 text-gray-900'
              }`}
            >
              <h2
                className={`text-xl md:text-2xl font-bold mb-4 ${
                  theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600'
                }`}
              >
                Simulation Graph
              </h2>

              <div className="flex-1 flex items-center justify-center rounded">
                {loading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-cyan-400 border-t-transparent rounded animate-spin mb-3"></div>
                    <div
                      className={`text-sm md:text-lg font-bold ${
                        theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600'
                      }`}
                    >
                      Running Simulation...
                    </div>
                  </div>
                ) : PredictionParameters?.data || PredictionParameters?.future_time ? (
                  <SimulationChart
                    mainResult={mainResult}
                    Limitaions={''}
                    data={PredictionParameters}
                    startYear={2026}
                    PatientDetails={PatientDetails}
                  />
                ) : (
                  <p
                    className={`text-center text-sm md:text-base ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    Run the simulation to visualize infection dynamics
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FuturePredict
