import { cn } from '@/lib/utils'
import type { FilterChip } from '../feature/page-vault-feature'

interface FilterChipProps {
  label: string
  value: FilterChip
  active: boolean
  onClick: (value: FilterChip) => void
}

export function FilterChipButton({ label, value, active, onClick }: FilterChipProps) {
  return (
    <button
      onClick={() => onClick(value)}
      className={cn(
        'px-3 py-1 rounded text-xs font-medium transition-colors whitespace-nowrap',
        active
          ? 'bg-orange-500 text-white'
          : 'bg-transparent text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
    </button>
  )
}
