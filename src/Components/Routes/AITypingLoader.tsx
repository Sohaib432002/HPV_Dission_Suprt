import React, { useEffect, useState } from 'react'

interface AITypingLoaderProps {
  text?: string
  speed?: number // ms per character
}

const AITypingLoader: React.FC<AITypingLoaderProps> = ({
  text = 'Analyzing your images...',
  speed = 50,
}) => {
  const [displayedText, setDisplayedText] = useState('')

  useEffect(() => {
    let index = 0
    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index])
        index++
      } else {
        clearInterval(interval)
      }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center space-y-6">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
        {/* Typing Text */}
        <p className="text-gray-700 text-lg font-medium monospace">{displayedText}</p>
      </div>
    </div>
  )
}

export default AITypingLoader
