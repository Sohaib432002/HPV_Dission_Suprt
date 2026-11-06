import React from 'react'
import { Info, LineChart } from 'lucide-react'
import { Button, ParamSlider, useToast } from '../ui'
import { PRESETS } from '../../lib/presets'

type FormParams = {
  recruitment_rate: number | ''
  transmission_rate: number | ''
  natural_death_rate: number | ''
  transition_rate: number | ''
  recovery_proportion: number | ''
  recovery_share: number | ''
  stepSize: number | ''
}

type Props = {
  setInputUser: React.Dispatch<React.SetStateAction<boolean>>
  params: FormParams
  handlePredictionSubmit: () => void
  setParams: React.Dispatch<React.SetStateAction<FormParams>>
}

const fields = [
  { label: 'Recruitment rate (A)', name: 'recruitment_rate', hint: 'New children entering the youngest group in each unit of time.', min: 0.001, max: 50, step: 0.1 },
  { label: 'How easily HPV spreads (β)', name: 'transmission_rate', hint: 'Higher means each contact is more likely to pass the virus on.', min: 0.001, max: 3, step: 0.01 },
  { label: 'Natural death rate (μ)', name: 'natural_death_rate', hint: 'How many people leave the group for natural reasons.', min: 0.001, max: 1, step: 0.001 },
  { label: 'Ageing rate (δ)', name: 'transition_rate', hint: 'How quickly children grow into the adult group.', min: 0.001, max: 2, step: 0.001 },
  { label: 'Vaccination proportion (m)', name: 'recovery_proportion', hint: 'Share of adults who are vaccinated and protected. 1 means everyone.', min: 0.001, max: 1, step: 0.001 },
  { label: 'Recovery proportion (n)', name: 'recovery_share', hint: 'Share of infections that clear on their own. The rest (1 − n) turn into cancer. The report uses 0.003; real HPV infections mostly clear.', min: 0.001, max: 1, step: 0.001 },
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

      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted">Start from an example</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRESETS.map((pr) => (
            <button
              key={pr.id}
              type="button"
              title={pr.note}
              onClick={() => setParams((prev) => ({ ...prev, ...pr.values }))}
              className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold text-ink-2 transition-colors hover:border-brand hover:text-brand"
            >
              {pr.label}
            </button>
          ))}
        </div>
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
