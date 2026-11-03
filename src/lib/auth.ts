import { useSyncExternalStore } from 'react'
import { jwtDecode } from 'jwt-decode'

export type TokenUser = {
  username?: string
  user_id?: number | string
  role?: string
  age?: string | number | null
  gender?: string | null
}

const AUTH_EVENT = 'auth-change'

const read = (key: string) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

export const getAccessToken = () => read('access')
export const getRefreshToken = () => read('refresh')

const notify = () => window.dispatchEvent(new Event(AUTH_EVENT))

export function setTokens(access: string, refresh?: string | null) {
  localStorage.setItem('access', access)
  if (refresh) localStorage.setItem('refresh', refresh)
  notify()
}

export function clearTokens() {
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
  notify()
}

export function decodeToken(token: string | null): TokenUser | null {
  if (!token) return null
  try {
    return jwtDecode<TokenUser>(token)
  } catch {
    return null
  }
}

// useSyncExternalStore needs a referentially stable snapshot between changes.
let cache: { token: string | null; user: TokenUser | null } = { token: null, user: null }
function snapshot() {
  const token = getAccessToken()
  if (token !== cache.token) cache = { token, user: decodeToken(token) }
  return cache
}

function subscribe(callback: () => void) {
  window.addEventListener(AUTH_EVENT, callback)
  window.addEventListener('storage', callback)
  return () => {
    window.removeEventListener(AUTH_EVENT, callback)
    window.removeEventListener('storage', callback)
  }
}

/** Reactive auth state derived from the JWT in localStorage. */
export function useAuth() {
  const { token, user } = useSyncExternalStore(subscribe, snapshot, snapshot)
  return { token, user, isAuth: !!token, role: user?.role ?? null }
}
