import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { BrandMark } from './ui/BrandMark'
import { useOnboarding } from './onboarding/OnboardingContext'

const Footer = () => {
  const { isAuth, role } = useAuth()
  const { openTour } = useOnboarding()

  const columns = [
    {
      title: 'Platform',
      links: [
        { to: '/', label: 'Home' },
        { to: '/about', label: 'About HPV' },
        { to: '/sample-images', label: 'Sample images' },
        { to: '/contact', label: 'Contact' },
      ],
      tour: true,
    },
    {
      title: 'Research tools',
      links: [
        ...(role !== 'patient' ? [{ to: '/simulation', label: 'Simulation lab' }] : []),
        { to: '/future-predict', label: 'Image prediction' },
      ],
    },
    {
      title: 'Account',
      links: isAuth
        ? [{ to: role === 'patient' ? '/PatientProfile' : '/LabEngProfile', label: 'Dashboard' }]
        : [
            { to: '/Login', label: 'Log in' },
            { to: '/SignUp', label: 'Create account' },
          ],
    },
  ]

  return (
    <footer className="mt-auto bg-brand-deep text-white/80">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.4fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <BrandMark />
            <span className="font-display text-lg font-extrabold text-white">HPV Research Lab</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/65">
            AI-assisted cervical cell analysis and mathematical simulation of HPV transmission and
            cervical cancer progression.
          </p>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h3 className="text-sm font-bold text-white">{col.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-white/65 transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              {'tour' in col && (
                <li>
                  <button
                    type="button"
                    onClick={openTour}
                    className="text-white/65 transition-colors hover:text-white"
                  >
                    How this website works
                  </button>
                </li>
              )}
            </ul>
          </nav>
        ))}

        <div>
          <h3 className="text-sm font-bold text-white">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/65">
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-white/50" aria-hidden /> research@hpv-lab.org
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-white/50" aria-hidden /> +92 300 1234567
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/50" aria-hidden />
              Department of Biomedical Research, Health Science Institute, Pakistan
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-white/50 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} HPV Research Lab. All rights reserved.</p>
          <p>For research use. Not a substitute for professional medical diagnosis.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
