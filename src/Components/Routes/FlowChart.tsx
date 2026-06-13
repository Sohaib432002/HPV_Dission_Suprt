/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react'
import Processing from './Processing'
import CompletedAnimation from './Completed'
import InputForm from './InputForm'
import { useTheme } from '../ThemeContext'

type FlowChartProps = {
  showResult: boolean
  mainResult: any
  setshowResult: React.Dispatch<React.SetStateAction<boolean>>
  Result: any
  InfectionRate: any
  params: any
  setParams: any
  handlePredictionSubmit: any
}

const FlowChart = ({
  
  mainResult,
  InfectionRate,
  setshowResult,
  params,
  setParams,
  handlePredictionSubmit,
}: FlowChartProps) => {
  const [InputUser, setInputUser] = useState<boolean>(false)
  const { theme } = useTheme()

  const textColor = theme === 'dark' ? 'text-white' : 'text-gray-900'
  const arrowColor = theme === 'dark' ? 'text-cyan-300' : 'text-cyan-600'

  return (
    <div
      className={`flex flex-col items-center justify-center space-y-6 p-4 transition-all duration-500 ${textColor}`}
    >
      {/* Top Box */}
      <div className="rounded overflow-hidden w-[250px] h-[250px] relative shadow-xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://justbuildthings.com/_next/image?url=%2Fimages%2Fpdf-analysis-icons%2Fdocument-analyzer.png&w=3840&q=70')",
          }}
        />
        <div
          className={`absolute inset-0 flex items-center justify-center backdrop-blur ${
            theme === 'dark' ? 'bg-black/40' : 'bg-white/40'
          }`}
        >
          {mainResult == null ? <Processing /> : <CompletedAnimation />}
        </div>
      </div>

      {/* Result Section */}
      {mainResult != null && (
        <>
          {/* Arrows */}
          <div className={`flex flex-col items-center text-2xl ${arrowColor}`}>
            <span className="animate-bounce">↓</span>
            <span className="animate-bounce delay-150">↓</span>
            <span className="animate-bounce delay-300">↓</span>
          </div>

          {/* Button */}
          <button
            onClick={() => setshowResult(true)}
            className={`px-6 py-3 rounded font-bold tracking-wide uppercase text-sm transition-all duration-300 ${
              theme === 'dark'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:scale-105 shadow-lg'
                : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white hover:scale-105 shadow-md'
            }`}
          >
            Check Results
          </button>
        </>
      )}

      {/* Infection Flow */}
      {InfectionRate != null && (
        <>
          {/* Arrows */}
          <div className={`flex flex-col items-center text-2xl ${arrowColor}`}>
            <span className="animate-bounce">↓</span>
            <span className="animate-bounce delay-150">↓</span>
            <span className="animate-bounce delay-300">↓</span>
          </div>

          {/* Input Form */}
          {!InputUser && (
            <div
              className={`w-full max-w-md backdrop-blur-lg rounded p-4 border ${
                theme === 'dark' ? 'bg-white/10 border-white/20' : 'bg-white/80 border-gray-200'
              }`}
            >
              <InputForm
                handlePredictionSubmit={handlePredictionSubmit}
                setParams={setParams}
                params={params}
                InfectionRate={InfectionRate}
                setInputUser={setInputUser}
              />
            </div>
          )}

          {/* Completed Box */}
          {InputUser && (
            <div className="rounded overflow-hidden w-[250px] h-[250px] relative shadow-xl">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRXert6ekqTL1J7LVWNAhs65_GeostayFqh6A&s')",
                }}
              />
              <div
                className={`absolute inset-0 flex items-center justify-center backdrop-blur-md ${
                  theme === 'dark' ? 'bg-black/40' : 'bg-white/40'
                }`}
              >
                {InfectionRate == null ? <Processing /> : <CompletedAnimation />}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default FlowChart
