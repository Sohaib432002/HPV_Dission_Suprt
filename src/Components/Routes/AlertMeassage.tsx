import  { useEffect, useState } from 'react'

const Alert = ({ message, duration = 3000, onClose }:any) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      if (onClose) onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  return (
    <div className="fixed top-6 right-6 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg">
      {message}
    </div>
  )
}

export default Alert
