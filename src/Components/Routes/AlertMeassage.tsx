import { useEffect, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'

type AlertProps = {
  message: string
  duration?: number
  onClose?: () => void
}

/** Self-dismissing inline alert. Prefer `useToast()` for app-wide notifications. */
const Alert = ({ message, duration = 3000, onClose }: AlertProps) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      onClose?.()
    }, duration)
    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!visible) return null

  return (
    <div
      role="status"
      className="animate-rise fixed right-6 top-20 z-[80] flex items-center gap-2.5 rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink shadow-pop"
    >
      <CheckCircle2 className="h-4 w-4 text-brand" aria-hidden />
      {message}
    </div>
  )
}

export default Alert
