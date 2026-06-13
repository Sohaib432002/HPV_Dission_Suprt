/* eslint-disable @typescript-eslint/no-unused-vars */
import  { useState } from 'react'
import SimulationChart from './Graph'
import Alert from './AlertMeassage'
import { useTheme } from '../ThemeContext'

const AppSimulation = () => {
  const [recruitmentRate, setRecruitmentRate] = useState(50)
  const [transmissionRate, setTransmissionRate] = useState(0.42)
  const [naturalDeathRate, setNaturalDeathRate] = useState(0.014)
  const [transitionRate, setTransitionRate] = useState(0.1)
  const [recoveryProportion, setRecoveryProportion] = useState(0.98)
  const [cancerProgressionRate, setCancerProgressionRate] = useState(0.003)
  const [stepSize, setstepSize] = useState(1)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [, setmessage] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  const methodLimitations = {
    rungeKutta: [
      {
        title: 'Runge-Kutta Method Limitations',
      },
      'Requires multiple function evaluations per step, which increases computational cost.',
      'Becomes inefficient for large systems of differential equations with many variables.',
      'Accuracy and stability depend strongly on the chosen step size.',
      'Not well suited for stiff differential equations without adaptive step-size techniques.',
      'Consumes more processing time and memory compared to simpler methods like Euler’s method.',
    ],

    eulerMethod: [
      {
        title: "Euler's Method Limitations",
      },
      'Has low accuracy because it is a first-order numerical method.',
      'Numerical errors accumulate quickly over time, especially in long simulations.',
      'Requires very small step sizes to achieve reasonable accuracy.',
      'Can become unstable or diverge for nonlinear or stiff differential equations.',
      'Poorly represents complex dynamics in systems such as biological or epidemiological models.',
    ],

    nsfdMethod: [
      {
        title: 'NSFD Method Limitations',
      },
      'Designing suitable denominator functions and discretization schemes can be complex.',
      'The formulation often depends on the specific mathematical model being studied.',
      'More difficult to implement compared to classical methods like Euler or Runge–Kutta.',
      'Less standardized and not widely supported in common numerical libraries.',
      'Requires deeper mathematical understanding to construct stable and accurate schemes.',
    ],
  }
  const [Limitaions, setLimitations] = useState(methodLimitations.rungeKutta)

  const validateParams = () => {
    if (
      recruitmentRate === 0 ||
      transmissionRate === 0 ||
      naturalDeathRate === 0 ||
      transitionRate === 0 ||
      recoveryProportion === 0 ||
      cancerProgressionRate === 0
    ) {
      alert('Please fill all parameters')
      return false
    }
    return true
  }

  const Submit = async () => {
    if (!validateParams()) return
    setLoading(true)
    setData(null)
    setLimitations(methodLimitations.rungeKutta)
    try {
      const response = await fetch('https://sohaib432002-hpv-dsion-support.hf.space/simulation/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recruitment_rate: recruitmentRate,
          transmission_rate: transmissionRate,
          natural_death_rate: naturalDeathRate,
          transition_rate: transitionRate,
          recovery_proportion: recoveryProportion,
          cancer_progression_rate: cancerProgressionRate,
          stepSize: stepSize,
        }),
      })
      const result = await response.json()
      setData(result)
    } catch (error) {
      alert('Simulation Failed')
    }
    setLoading(false)
  }
  const SubmitEuler = async () => {
    if (!validateParams()) return
    setLoading(true)
    setData(null)
    setLimitations(methodLimitations.eulerMethod)
    try {
      const response = await fetch(
        'https://sohaib432002-hpv-dsion-support.hf.space/simulation/hpv-EulersMethod',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recruitment_rate: recruitmentRate,
            transmission_rate: transmissionRate,
            natural_death_rate: naturalDeathRate,
            transition_rate: transitionRate,
            recovery_proportion: recoveryProportion,
            cancer_progression_rate: cancerProgressionRate,
            stepSize: stepSize,
          }),
        }
      )
      const result = await response.json()
      setData(result)
    } catch (error) {
      setmessage('The graph shows a divergent behavior or a complex calculations')
    }
    setLoading(false)
  }
  const SubmitNSFD = async () => {
    if (!validateParams()) return
    setLoading(true)
    setData(null)
    setLimitations(methodLimitations.nsfdMethod)
    try {
      const response = await fetch(
        'https://sohaib432002-hpv-dsion-support.hf.space/simulation/hpv-NSFDmethod',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recruitment_rate: recruitmentRate,
            transmission_rate: transmissionRate,
            natural_death_rate: naturalDeathRate,
            transition_rate: transitionRate,
            recovery_proportion: recoveryProportion,
            cancer_progression_rate: cancerProgressionRate,
            stepSize: stepSize,
          }),
        }
      )
      const result = await response.json()
      setData(result)
      console.log('result', result)
    } catch (error) {
      alert('Simulation Failed')
    }
    setLoading(false)
  }
  const SubmitMlModel = async () => {
    if (!validateParams()) return
    setLoading(true)
    setData(null)
    try {
      const response = await fetch(
        'https://sohaib432002-hpv-dsion-support.hf.space/simulation/hpv-ml-model',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            recruitment_rate: recruitmentRate,
            transmission_rate: transmissionRate,
            natural_death_rate: naturalDeathRate,
            transition_rate: transitionRate,
            recovery_proportion: recoveryProportion,
            cancer_progression_rate: cancerProgressionRate,
          }),
        }
      )
      const result = await response.json()
      setData(result)
    } catch (error) {
      alert('Simulation Failed')
    }
    setLoading(false)
  }

  const ResetParams = () => {
    setRecruitmentRate(50)
    setTransmissionRate(0.42)
    setNaturalDeathRate(0.014)
    setTransitionRate(0.1)
    setRecoveryProportion(0.98)
    setCancerProgressionRate(0.003)
    setstepSize(1)
    setData(null)
  }
  const { theme } = useTheme()
  return (
    <div
      className={`min-h-screen relative pt-28 px-6 transition-all duration-500 ${
        theme === 'dark'
          ? "bg-[url('/path-to-your-lab-bg.png')] bg-cover bg-center"
          : 'bg-gradient-to-br from-blue-300 via-purple-600 to-white'
      }`}
    >
      {/* HERO SECTION */}
      <div className="max-w-6xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-bold text-cyan-400 mb-6">HPV Infection Simulation Lab</h1>
        <p className="text-gray-100 text-lg max-w-3xl mx-auto">
          This research-based simulation platform helps explore the transmission dynamics of Human
          Papillomavirus (HPV) and its potential progression to cervical cancer. By adjusting
          epidemiological parameters, users can analyze how infection spreads and evaluate
          prevention strategies such as vaccination, screening, and treatment.
        </p>
      </div>

      {/* INFO CARDS */}
      <div className="flex justify-center items-center">
        <svg
          viewBox="0 0 900 400"
          className="w-full max-w-[800px]"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Arrow Marker */}
          <defs>
            <marker id="arrow" markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto">
              <path d="M0,0 L10,3 L0,6 Z" fill="#FFDD57" />
            </marker>
          </defs>

          {/* S1 */}
          <rect
            x="100"
            y="120"
            width="80"
            height="50"
            rx="10"
            fill="#1E3A8A"
            stroke="#FFDD57"
            strokeWidth="2"
          />
          <text x="140" y="150" textAnchor="middle" fill="#FFDD57" fontWeight="bold">
            S1
          </text>

          {/* S2 */}
          <rect
            x="260"
            y="120"
            width="80"
            height="50"
            rx="10"
            fill="#047857"
            stroke="#10B981"
            strokeWidth="2"
          />
          <text x="300" y="150" textAnchor="middle" fill="#10B981" fontWeight="bold">
            S2
          </text>

          {/* I */}
          <rect
            x="420"
            y="120"
            width="80"
            height="50"
            rx="10"
            fill="#B91C1C"
            stroke="#F87171"
            strokeWidth="2"
          />
          <text x="460" y="150" textAnchor="middle" fill="#F87171" fontWeight="bold">
            I
          </text>

          {/* R */}
          <rect
            x="580"
            y="120"
            width="80"
            height="50"
            rx="10"
            fill="#7C3AED"
            stroke="#C4B5FD"
            strokeWidth="2"
          />
          <text x="620" y="150" textAnchor="middle" fill="#C4B5FD" fontWeight="bold">
            R
          </text>

          {/* C */}
          <rect
            x="420"
            y="240"
            width="80"
            height="50"
            rx="10"
            fill="#F59E0B"
            stroke="#FFD966"
            strokeWidth="2"
          />
          <text x="460" y="270" textAnchor="middle" fill="#FFD966" fontWeight="bold">
            C
          </text>

          {/* A → S1 */}
          <line
            x1="40"
            y1="145"
            x2="100"
            y2="145"
            stroke="#FFDD57"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text x="60" y="125" fill="#FFDD57">
            A
          </text>

          {/* S1 → S2 */}
          <line
            x1="180"
            y1="145"
            x2="260"
            y2="145"
            stroke="#10B981"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text x="210" y="125" fill="#10B981">
            δS₁
          </text>

          {/* S2 → I */}
          <line
            x1="340"
            y1="145"
            x2="420"
            y2="145"
            stroke="#F87171"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text x="350" y="125" fill="#F87171">
            (1-m)βS₂I
          </text>

          {/* I → R */}
          <line
            x1="500"
            y1="145"
            x2="580"
            y2="145"
            stroke="#C4B5FD"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text x="520" y="125" fill="#C4B5FD">
            ηI
          </text>

          {/* I → C */}
          <line
            x1="460"
            y1="170"
            x2="460"
            y2="240"
            stroke="#FFD966"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text x="470" y="210" fill="#FFD966">
            (1-η)I
          </text>

          {/* S2 → R */}
          <path
            d="M300 120 Q460 40 620 120"
            stroke="#10B981"
            fill="none"
            strokeWidth="2"
            markerEnd="url(#arrow)"
          />
          <text x="450" y="40" fill="#10B981">
            mS₂
          </text>
        </svg>
      </div>

      {/* MAIN GRID */}
      <div className="grid lg:grid-cols-1 py-10 gap-5 max-w-7xl mx-auto">
        {/* PARAMETERS */}
        <div
          className={` ${theme === 'dark' ? 'bg-white/10' : 'bg-white/20'} flex-1 backdrop-blur-lg shadow-2xl rounded p-8  flex flex-col`}
        >
          <h2 className="text-2xl font-bold text-cyan-600 mb-6">Epidemiological Parameters</h2>
          <p className={`${theme === 'dark' ? 'text-gray-100' : 'text-gray-700 '}  text-sm mb-6`}>
            Adjust model parameters to simulate different HPV transmission scenarios.
          </p>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            {[
              {
                label: 'Growth Rate (α) ',
                value: recruitmentRate,
                setter: setRecruitmentRate,
                hint: 'Rate at which new individuals enter the population',
                min: 0.001,
                max: 50,
                step: 0.001,
              },
              {
                label: 'Transmission rate β',
                value: transmissionRate,
                setter: setTransmissionRate,
                hint: 'Probability of infection per contact',
                min: 0.001,
                max: 3,
                step: 0.001,
              },
              {
                label: 'Natural death rate μ',
                value: naturalDeathRate,
                setter: setNaturalDeathRate,
                hint: 'Rate at which individuals naturally die',
                min: 0.001,
                max: 3,
                step: 0.001,
              },
              {
                label: 'Transition rate δ',
                value: transitionRate,
                setter: setTransitionRate,
                hint: 'Rate of progression between susceptible stages',
                min: 0.001,
                max: 3,
                step: 0.001,
              },
              {
                label: 'Recovery proportion m',
                value: recoveryProportion,
                setter: setRecoveryProportion,
                hint: 'Fraction of infected who recover',
                min: 0.001,
                max: 3,
                step: 0.001,
              },
              {
                label: 'Cancer progression rate n',
                value: cancerProgressionRate,
                setter: setCancerProgressionRate,
                hint: 'Rate at which infected progress to cancer',
                min: 0.001,
                max: 3,
                step: 0.001,
              },
              {
                label: 'Step Size (h)',
                value: stepSize,
                setter: setstepSize,
                hint: 'Rate at which new individuals enter the population (Step size defines the increment of the slider)',
                min: 1,
                max: 500,
                step: 1,
              },
            ].map((param, idx) => (
              <div key={idx} className="relative">
                <div className="flex justify-between  ">
                  <label
                    className={` ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700 '} font-medium`}
                  >
                    {param.label}
                  </label>
                  <span
                    className={` ${theme === 'dark' ? 'text-gray-100' : 'text-gray-700 '}  font-semibold`}
                  >
                    {param.value.toFixed(3)}
                  </span>
                </div>
                <input
                  type="range"
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  value={param.value}
                  onChange={(e) => param.setter(parseFloat(e.target.value))}
                  className="w-full h-3 rounded appearance-none bg-cyan-200 hover:bg-cyan-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 slider-thumb"
                />
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="mt-6 space-y-3">
            <button
              onClick={Submit}
              className={`w-full text-white p-3 rounded font-semibold shadow-lg transition ${
                theme === 'dark' ? 'bg-cyan-700 hover:bg-cyan-600' : 'bg-cyan-500 hover:bg-cyan-600'
              }`}
            >
              Run Runge-Kutta (RK)
            </button>
            <button
              onClick={SubmitEuler}
              className={`w-full text-white p-3 rounded font-semibold shadow-lg transition ${
                theme === 'dark' ? 'bg-cyan-700 hover:bg-cyan-600' : 'bg-cyan-500 hover:bg-cyan-600'
              }`}
            >
              Run Euler's
            </button>
            <button
              onClick={SubmitNSFD}
              className={`w-full text-white p-3 rounded font-semibold shadow-lg transition ${
                theme === 'dark' ? 'bg-cyan-700 hover:bg-cyan-600' : 'bg-cyan-500 hover:bg-cyan-600'
              }`}
            >
              Run NSFD
            </button>

            {/* <button */}
            {/* onClick={SubmitMlModel} */}
            {/* className={`w-full text-white p-3 rounded font-semibold shadow-lg transition ${ */}
            {/* theme === 'dark' ? 'bg-cyan-700 hover:bg-cyan-600' : 'bg-cyan-500 hover:bg-cyan-600' */}
            {/* }`} */}
            {/* > */}
            {/* Run ML Prediction Model */}
            {/* </button> */}

            <button
              onClick={ResetParams}
              className="w-full bg-gray-500 hover:bg-gray-600 text-white p-3 rounded font-semibold shadow-lg transition mt-2"
            >
              Reset Parameters
            </button>
          </div>
        </div>

        {/* GRAPH */}
        <div className="lg:col-span-2 bg-gradient-to-r from-cyan-900/30 to-teal-900/30 backdrop-blur-md shadow-2xl rounded p-8 border border-cyan-300">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Simulation Results</h2>
          <p className="text-gray-200 mb-6">
            The graph below visualizes infection trends, recovered individuals, and possible cancer
            progression over time.
          </p>
          {showAlert && (
            <Alert
              message="The Graph is Diverged"
              duration={3000}
              onClose={() => setShowAlert(false)}
            />
          )}

          <div className="min-h-[450px] flex items-center justify-center rounded">
            {loading ? (
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded animate-spin mb-3"></div>
                <div className="text-xl text-cyan-400 font-bold">Running Simulation...</div>
              </div>
            ) : data ? (
              <SimulationChart
                mainResult={null}
                Limitaions={Limitaions}
                data={data}
                startYear={2026}
                PatientDetails={undefined}
              />
            ) : (
              <p className="text-gray-400">Run the simulation to visualize infection dynamics</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppSimulation
