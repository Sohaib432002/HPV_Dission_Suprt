export const GUIDE_PREFIX = 'hpv_guide_'
export const GUIDES_RESET_EVENT = 'guides-reset'

/** Bring back every page tip the visitor has dismissed. */
export function resetGuides() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(GUIDE_PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(GUIDES_RESET_EVENT))
}
