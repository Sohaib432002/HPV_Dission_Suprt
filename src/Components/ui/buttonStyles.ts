export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl font-semibold whitespace-nowrap transition-all duration-150 select-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-brand-fg shadow-sm hover:bg-brand-hover',
  secondary: 'border border-line bg-surface text-ink hover:border-brand hover:text-brand',
  ghost: 'text-ink-2 hover:bg-surface-2 hover:text-ink',
  danger: 'bg-danger-soft text-danger hover:bg-danger hover:text-white',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-9 px-3.5 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
}

export type ButtonStyleProps = {
  variant?: ButtonVariant
  size?: ButtonSize
  full?: boolean
  className?: string
}

export const buttonClass = ({ variant = 'primary', size = 'md', full, className = '' }: ButtonStyleProps) =>
  `${base} ${variants[variant]} ${sizes[size]} ${full ? 'w-full' : ''} ${className}`
