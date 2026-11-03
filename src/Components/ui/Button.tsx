import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { buttonClass, type ButtonStyleProps } from './buttonStyles'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonStyleProps & { loading?: boolean; icon?: ReactNode }

export function Button({
  variant,
  size,
  full,
  className,
  loading,
  icon,
  children,
  disabled,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={buttonClass({ variant, size, full, className })}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  )
}

export function LinkButton({ variant, size, full, className, ...rest }: LinkProps & ButtonStyleProps) {
  return <Link className={buttonClass({ variant, size, full, className })} {...rest} />
}
