import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../../lib/api'
import { setTokens } from '../../lib/auth'

type GoogleId = {
  initialize: (cfg: { client_id: string; callback: (r: { credential?: string }) => void }) => void
  renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void
}
declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } }
  }
}

let scriptPromise: Promise<void> | null = null
function loadGoogleScript() {
  scriptPromise ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => {
      scriptPromise = null
      reject(new Error('Google script failed to load'))
    }
    document.head.appendChild(s)
  })
  return scriptPromise
}

type Props = { role?: string; onError: (message: string) => void }

/** "Continue with Google". Stays hidden until the server has a Google client id. */
export function GoogleButton({ role, onError }: Props) {
  const navigate = useNavigate()
  const holder = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const roleRef = useRef(role)
  useEffect(() => {
    roleRef.current = role
  }, [role])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const cfg = await (await apiFetch('/api/auth/google/config/')).json()
        if (!cfg.client_id || cancelled) return
        await loadGoogleScript()
        if (cancelled || !window.google || !holder.current) return
        window.google.accounts.id.initialize({
          client_id: cfg.client_id,
          callback: async ({ credential }) => {
            if (!credential) return
            try {
              const res = await apiFetch('/api/auth/google/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ credential, role: roleRef.current || undefined }),
              })
              const data = await res.json()
              if (!res.ok) return onError(data.detail || 'Google sign-in failed.')
              setTokens(data.access, data.refresh)
              navigate('/')
            } catch {
              onError('Could not reach the server. Please try again.')
            }
          },
        })
        window.google.accounts.id.renderButton(holder.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'continue_with',
          shape: 'pill',
          width: Math.min(holder.current.clientWidth || 320, 400),
        })
        setReady(true)
      } catch {
        /* Google blocked or offline: the normal form still works. */
      }
    })()
    return () => {
      cancelled = true
    }
  }, [navigate, onError])

  return (
    <div className={ready ? 'block' : 'hidden'}>
      <div ref={holder} className="flex justify-center" />
      <div className="my-5 flex items-center gap-3 text-xs text-muted" aria-hidden>
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>
    </div>
  )
}
