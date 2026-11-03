import { createContext, useContext } from 'react'

type OnboardingApi = {
  /** Open the welcome tour (also used by the Help button). */
  openTour: () => void
}

export const OnboardingContext = createContext<OnboardingApi>({ openTour: () => {} })

export const useOnboarding = () => useContext(OnboardingContext)

export const WELCOME_KEY = 'hpv_welcome_seen'
