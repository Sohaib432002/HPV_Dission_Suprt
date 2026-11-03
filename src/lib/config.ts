/** Backend origin. Override with VITE_API_URL for local development. */
export const API_BASE: string = (
  import.meta.env.VITE_API_URL ?? 'https://sohaib432002-hpv-dsion-support.hf.space'
).replace(/\/$/, '')

/** Resolve a path in /public so it works under any Vite `base`. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const REPO = 'https://github.com/Sohaib432002/HPV_Dission_Suprt'

/** One-click ZIP of the sample images (the `sample-images` branch). Override with VITE_SAMPLE_IMAGES_URL, e.g. a Google Drive link. */
export const SAMPLE_IMAGES_ZIP_URL: string =
  import.meta.env.VITE_SAMPLE_IMAGES_URL ?? `${REPO}/archive/refs/heads/sample-images.zip`

/** Browse the full folder of sample images on GitHub. */
export const SAMPLE_IMAGES_BROWSE_URL = `${REPO}/tree/sample-images/A`

export const SAMPLE_IMAGES_COUNT = 1311
export const SAMPLE_IMAGES_SIZE = 'about 470 MB'
