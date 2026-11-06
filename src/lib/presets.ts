/** Parameter sets from the project report (Tables 4.1 and 4.2) plus one realistic variation. */
export type ModelValues = {
  recruitment_rate: number
  transmission_rate: number
  natural_death_rate: number
  transition_rate: number
  recovery_proportion: number
  recovery_share: number
}

const base: ModelValues = {
  recruitment_rate: 50,
  transmission_rate: 0.42,
  natural_death_rate: 0.014,
  transition_rate: 0.1,
  recovery_proportion: 0.98,
  recovery_share: 0.003,
}

export const PRESETS: { id: string; label: string; note: string; values: ModelValues }[] = [
  {
    id: 'report-e0',
    label: 'Report: disease-free',
    note: 'Report table 4.1. R₀ is below 1, so HPV dies out.',
    values: { ...base },
  },
  {
    id: 'report-e1',
    label: 'Report: endemic',
    note: 'Report table 4.2. R₀ is above 1, so HPV stays.',
    values: { ...base, transmission_rate: 1.42 },
  },
  {
    id: 'most-clear',
    label: 'Most infections clear',
    note: 'Same as the endemic case, but 95% of infections clear on their own, as in real life.',
    values: { ...base, transmission_rate: 1.42, recovery_share: 0.95 },
  },
]
