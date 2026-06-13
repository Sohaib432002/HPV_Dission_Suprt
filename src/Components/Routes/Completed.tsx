import React, { useEffect, useState } from 'react'

const CompletedAnimation: React.FC = () => {
  const [show, setShow] = useState(false)

  useEffect(() => {
    // Animate after component mounts
    const timer = setTimeout(() => setShow(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col w-[100%] items-center justify-center p-6 bg-white rounded-xl shadow-lg w-64 h-64">
      <div className="relative w-24 h-24 mb-4">
        {/* Animated circle */}
        <div
          className={`absolute inset-0 rounded border-4 border-cyan-500 transition-transform duration-700 ${
            show ? 'scale-100' : 'scale-0'
          }`}
        />
        {/* Checkmark */}
        <svg
          className={`absolute inset-0 w-24 h-24 text-cyan-500 stroke-2 transition-opacity duration-700 ${
            show ? 'opacity-100' : 'opacity-0'
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
        >
          <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h2
        className={`text-lg font-bold text-cyan-600 transition-opacity duration-700 ${
          show ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Completed!
      </h2>
    </div>
  )
}

export default CompletedAnimation
