import { Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FieldRowProps {
  label: string
  value: React.ReactNode
  onCopy?: () => void
  className?: string
  valueClassName?: string
}

export function FieldRow({ label, value, onCopy, className, valueClassName }: FieldRowProps) {
  return (
    <div className={cn('px-6 py-3 border-b border-border', className)}>
      <div className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1'>
        {label}
      </div>
      <div className='flex items-center justify-between gap-2'>
        <div className={cn('text-sm text-foreground flex-1 min-w-0', valueClassName)}>{value}</div>
        {onCopy && (
          <button
            onClick={onCopy}
            className='p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors shrink-0'
          >
            <Copy className='w-3.5 h-3.5' />
          </button>
        )}
      </div>
    </div>
  )
}
