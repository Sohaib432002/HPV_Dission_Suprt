import { Dna } from 'lucide-react'

export function BrandMark({ className = 'h-9 w-9' }: { className?: string }) {
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-xl bg-brand text-brand-fg shadow-sm ${className}`}
      aria-hidden
    >
      <Dna className="h-[55%] w-[55%]" strokeWidth={2.2} />
    </span>
  )
}
