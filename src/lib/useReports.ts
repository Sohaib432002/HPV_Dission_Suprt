import { useCallback, useEffect, useState } from 'react'
import { authFetch } from './api'

export interface Report {
  id: number
  date: string
  result: string
  document: string
}

/** Loads the signed-in user's reports from /api/reports/ (token refresh handled by authFetch). */
export function useReports(enabled: boolean) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const res = await authFetch('/api/reports/')
      if (!res.ok) throw new Error(`Request failed (${res.status})`)
      const data: Report[] = await res.json()
      setReports(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error('Error fetching reports:', e)
      setError('We could not load your reports. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return
    load()
  }, [enabled, load])

  return { reports, loading, error, reload: load }
}
