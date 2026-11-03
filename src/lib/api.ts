import { API_BASE } from './config'
import { getAccessToken, getRefreshToken, setTokens } from './auth'

export const apiUrl = (path: string) => (/^https?:/.test(path) ? path : `${API_BASE}${path}`)

/** POST/GET JSON to the Django backend without authentication. */
export function apiFetch(path: string, init: RequestInit = {}) {
  return fetch(apiUrl(path), init)
}

function withAuth(init: RequestInit, token: string | null): RequestInit {
  const headers = new Headers(init.headers)
  if (token) headers.set('Authorization', `Bearer ${token}`)
  if (!headers.has('Content-Type') && !(init.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json')
  }
  return { ...init, headers }
}

/**
 * Authenticated request. On a 401 it exchanges the refresh token for a new
 * access token (same flow the profile pages used before) and retries once.
 */
export async function authFetch(path: string, init: RequestInit = {}) {
  const url = apiUrl(path)
  let response = await fetch(url, withAuth(init, getAccessToken()))

  if (response.status === 401) {
    const refresh = getRefreshToken()
    if (!refresh) throw new Error('No refresh token found')

    const refreshed = await fetch(apiUrl('/api/token/refresh/'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    })
    if (!refreshed.ok) throw new Error('Failed to refresh token')

    const { access } = await refreshed.json()
    setTokens(access)
    response = await fetch(url, withAuth(init, access))
  }

  return response
}
