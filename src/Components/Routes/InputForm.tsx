/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import { LineChart } from 'lucide-react'
import { Button, ParamSlider, useToast } from '../ui'

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

const fields = [
  { label: 'Growth rate (α)', name: 'recruitment_rate', min: 0.001, max: 50, step: 0.1 },
  { label: 'Natural death rate (μ)', name: 'natural_death_rate', min: 0.001, max: 1, step: 0.1 },
  { label: 'Transition rate (δ)', name: 'transition_rate', min: 0.001, max: 2, step: 0.1 },
  { label: 'Recovery proportion (m)', name: 'recovery_proportion', min: 0.001, max: 1, step: 0.1 },
  { label: 'Cancer progression rate (ρ)', name: 'cancer_progression_rate', min: 0.001, max: 2, step: 0.1 },
  { label: 'Step size (h)', name: 'stepSize', min: 1, max: 500, step: 1, decimals: 0 },
] as const

const InputForm = ({
  setInputUser,
  params,
  InfectionRate,
  handlePredictionSubmit,
  setParams,
}: Props) => {
  const toast = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.values(params).some((v) => v === '' || v === null)) {
      toast.error('Please enter all parameter values')
      return
    }
    setInputUser(true)
    handlePredictionSubmit()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="flex items-center justify-between rounded-xl bg-brand-soft px-4 py-3">
        <span className="text-sm font-medium text-ink-2">Infection rate (β) from images</span>
        <span className="font-mono text-base font-bold text-brand">{InfectionRate.toFixed(4)}</span>
      </div>

      {fields.map(({ name, ...rest }) => (
        <ParamSlider
          key={name}
          {...rest}
          value={params[name]}
          onChange={(v) => setParams((prev) => ({ ...prev, [name]: v }))}
        />
      ))}

      <Button type="submit" full icon={<LineChart className="h-4 w-4" />}>
        Predict graph
      </Button>
    </form>
  )
}

export default InputForm
