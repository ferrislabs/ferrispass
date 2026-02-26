import { useState } from 'react'
import { Copy, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { VaultItem } from '../feature/page-vault-feature'

interface ListItemProps {
  item: VaultItem
  selected: boolean
  onClick: () => void
}

const dotColor = {
  green: 'bg-green-500',
  orange: 'bg-orange-400',
  red: 'bg-red-500',
} as const

export function ListItem({ item, selected, onClick }: ListItemProps) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        'relative flex items-center w-full px-4 py-3.5 text-left transition-colors border-b border-border',
        selected ? 'bg-accent/80' : 'bg-transparent hover:bg-accent/40',
      )}
    >
      {/* Selected: left + top + bottom orange borders */}
      {selected && (
        <>
          <div className='absolute left-0 top-0 bottom-0 w-[3px] bg-orange-500' />
          <div className='absolute left-0 right-0 bottom-0 h-[1px] bg-orange-500' />
        </>
      )}

      <div className='w-7 h-7 rounded-md bg-muted flex items-center justify-center text-xs font-bold text-foreground shrink-0 mr-3'>
        {item.favicon}
      </div>

      <div className='flex-1 min-w-0'>
        <div className='text-sm font-bold text-foreground truncate'>{item.name}</div>
        <div className='text-xs text-muted-foreground truncate mt-0.5'>{item.username}</div>
      </div>

      <div className='flex items-center gap-2 shrink-0'>
        {hovered && !selected && (
          <div className='flex items-center gap-1'>
            <span className='p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'>
              <Copy className='w-3.5 h-3.5' />
            </span>
            <span className='p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'>
              <MoreHorizontal className='w-3.5 h-3.5' />
            </span>
          </div>
        )}
        <div className={cn('w-2 h-2 rounded-sm shrink-0', dotColor[item.healthDot])} />
      </div>
    </button>
  )
}
