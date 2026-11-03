/** Backend origin. Override with VITE_API_URL for local development. */
export const API_BASE: string = (
  import.meta.env.VITE_API_URL ?? 'https://sohaib432002-hpv-dsion-support.hf.space'
).replace(/\/$/, '')

/** Resolve a path in /public so it works under any Vite `base`. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
