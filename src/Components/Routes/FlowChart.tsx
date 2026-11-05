/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import { Check, ClipboardList, Pencil } from 'lucide-react'
import Processing from './Processing'
import CompletedAnimation from './Completed'
import InputForm from './InputForm'
import { Button } from '../ui'

type FlowChartProps = {
  showResult: boolean
  mainResult: any
  setshowResult: React.Dispatch<React.SetStateAction<boolean>>
  Result: any
  params: any
  setParams: any
  handlePredictionSubmit: any
}

type StepState = 'done' | 'active' | 'pending'

function Step({
  index,
  title,
  state,
  last,
  children,
}: {
  index: number
  title: string
  state: StepState
  last?: boolean
  children?: React.ReactNode
}) {
  return (
    <li className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <span
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-bold transition-colors ${
            state === 'done'
              ? 'bg-brand text-brand-fg'
              : state === 'active'
                ? 'border-2 border-brand bg-brand-soft text-brand'
                : 'border border-line bg-surface-2 text-muted'
          }`}
          aria-hidden
        >
          {state === 'done' ? <Check className="h-4 w-4" /> : index}
        </span>
        {!last && <span className={`mt-1 w-px flex-1 ${state === 'done' ? 'bg-brand' : 'bg-line'}`} aria-hidden />}
      </div>
      <div className={`min-w-0 flex-1 ${last ? '' : 'pb-8'}`}>
        <h3 className={`pt-1.5 text-base font-bold ${state === 'pending' ? 'text-muted' : 'text-ink'}`}>
          {title}
          <span className="sr-only"> ({state})</span>
        </h3>
        {children && <div className="mt-3">{children}</div>}
      </div>
    </li>
  )
}

/** Vertical pipeline: analyse images → review results → configure and run the simulation. */
const FlowChart = ({
  mainResult,
  setshowResult,
  params,
  setParams,
  handlePredictionSubmit,
}: FlowChartProps) => {
  const [InputUser, setInputUser] = useState<boolean>(false)

  const analysed = mainResult != null

  return (
    <ol>
      <Step index={1} title="Checking your pictures" state={analysed ? 'done' : 'active'}>
        {analysed ? (
          <div className="space-y-3">
            <CompletedAnimation label="Analysis complete" />
            <Button full variant="secondary" onClick={() => setshowResult(true)} icon={<ClipboardList className="h-4 w-4" />}>
              See the results
            </Button>
          </div>
        ) : (
          <Processing label="Looking up counts and comparing with reference slides…" />
        )}
      </Step>

      <Step
        index={2}
        title="Try a what-if forecast (optional)"
        state={!analysed ? 'pending' : InputUser ? 'done' : 'active'}
        last
      >
        {analysed &&
          (!InputUser ? (
            <InputForm
              handlePredictionSubmit={handlePredictionSubmit}
              setParams={setParams}
              params={params}
              setInputUser={setInputUser}
            />
          ) : (
            <div className="space-y-3">
              <CompletedAnimation label="Simulation submitted" />
              <Button full variant="ghost" onClick={() => setInputUser(false)} icon={<Pencil className="h-4 w-4" />}>
                Edit parameters
              </Button>
            </div>
          ))}
      </Step>
    </ol>
  )
}

export default FlowChart
