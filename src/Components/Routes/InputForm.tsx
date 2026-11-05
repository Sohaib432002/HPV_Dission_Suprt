import React from 'react'
import { Info, LineChart } from 'lucide-react'
import { Button, ParamSlider, useToast } from '../ui'

type FormParams = {
  recruitment_rate: number | ''
  transmission_rate: number | ''
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
}

const fields = [
  { label: 'New people entering (A)', name: 'recruitment_rate', hint: 'How many new people join the group each month.', min: 0.001, max: 50, step: 0.1 },
  { label: 'How easily HPV spreads (β)', name: 'transmission_rate', hint: 'Higher means each contact is more likely to pass the virus on.', min: 0.001, max: 3, step: 0.01 },
  { label: 'Natural death rate (μ)', name: 'natural_death_rate', hint: 'How many people leave the group for natural reasons.', min: 0.001, max: 1, step: 0.001 },
  { label: 'Vaccination rate (δ)', name: 'transition_rate', hint: 'How quickly unvaccinated people get vaccinated.', min: 0.001, max: 2, step: 0.001 },
  { label: 'Vaccine protection (m)', name: 'recovery_proportion', hint: 'Share of vaccinated people who are protected. 1 means fully protected.', min: 0.001, max: 1, step: 0.001 },
  { label: 'Infections that turn into cancer (c)', name: 'cancer_progression_rate', hint: 'Share of infections that become cancer. All the others clear on their own. In real life this is very small.', min: 0.001, max: 1, step: 0.001 },
  { label: 'Step size (h)', name: 'stepSize', hint: 'Size of each calculation step. If unsure, leave it at 0.1.', min: 0.05, max: 500, step: 0.05, decimals: 2 },
] as const

const InputForm = ({
  setInputUser,
  params,
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
      <div className="flex items-start gap-2.5 rounded-xl bg-brand-soft px-4 py-3 text-sm text-ink-2">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
        These settings are assumptions you can change. They are not measured from your pictures.
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
        Show me the forecast graph
      </Button>
    </form>
  )
}

export default InputForm
