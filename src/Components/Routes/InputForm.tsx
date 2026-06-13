/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'

type FormParams = {
  recruitment_rate: number | ''
  natural_death_rate: number | ''
  transition_rate: number | ''
  recovery_proportion: number | ''
  cancer_progression_rate: number | ''
  stepSize: number | ''
}

type Props = {
  setInputUser: React.Dispatch<React.SetStateAction<boolean>>
  params: FormParams
  handlePredictionSubmit: () => void
  setParams: React.Dispatch<React.SetStateAction<FormParams>>
  InfectionRate: any
}

const InputForm = ({
  setInputUser,
  params,
  InfectionRate,
  handlePredictionSubmit,
  setParams,
}: Props) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setParams((prev) => ({ ...prev, [name]: value === '' ? '' : Number(value) }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.values(params).some((v) => v === '' || v === null)) {
      alert('Please enter all parameter values')
      return
    }
    setInputUser(true)
    handlePredictionSubmit()
  }

  const fields = [
    { label: 'Growth Rate (α)', name: 'recruitment_rate', min: 0.001, max: 50, step: 0.1 },
    {
      label: 'Natural Death Rate (μ)',
      name: 'natural_death_rate',
      min: 0.001,
      max: 1,
      step: 0.1,
    },
    { label: 'Transition Rate (δ)', name: 'transition_rate', min: 0.001, max: 2, step: 0.1 },
    {
      label: 'Recovery Proportion (m)',
      name: 'recovery_proportion',
      min: 0.001,
      max: 1,
      step: 0.1,
    },
    {
      label: 'Cancer Progression Rate (ρ)',
      name: 'cancer_progression_rate',
      min: 0.001,
      max: 2,
      step: 0.1,
    },
    { label: 'Step Size (h)', name: 'stepSize', min: 1, max: 500, step: 1 },
  ]

  return (
    <div className="w-full max-w-xl">
      <div className="bg-slate-900/80 backdrop-blur-lg border border-slate-700 rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-center text-cyan-400 mb-6 tracking-wide">
          Simulation Parameters
        </h2>
        <h1 className="text-center text-xl md:text-2xl font-bold text-blue-600 mb-4">
          Infection Rate (β):
          <span className="ml-2 text-blue-800 bg-blue-100 px-3 py-1 rounded-lg shadow-sm">
            {InfectionRate.toFixed(4)}
          </span>
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:gap-6">
          {fields.map((field) => (
            <div key={field.name}>
              <div className="flex justify-between mb-1 text-slate-200">
                <label>{field.label}</label>
                <span>
                  {(params[field.name as keyof FormParams] as number)?.toFixed(3) || '0.000'}
                </span>
              </div>
              <input
                type="range"
                name={field.name}
                min={field.min}
                max={field.max}
                step={field.step}
                value={params[field.name as keyof FormParams] || 0}
                onChange={handleChange}
                className="w-full h-3 rounded-lg appearance-none bg-cyan-600/30 hover:bg-cyan-600/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-400 slider-thumb"
              />
            </div>
          ))}
          <button
            type="submit"
            className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold tracking-wide hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 transition"
          >
            Predict Graph
          </button>
        </form>
      </div>
    </div>
  )
}

export default InputForm
