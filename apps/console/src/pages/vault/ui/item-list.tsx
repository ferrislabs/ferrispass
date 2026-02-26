import { Filter } from 'lucide-react'
import { FilterChipButton } from './filter-chip'
import { ListItem } from './list-item'
import type { FilterChip, VaultItem } from '../feature/page-vault-feature'

interface ItemListProps {
  items: VaultItem[]
  allItems: VaultItem[]
  selectedItem: VaultItem
  activeFilter: FilterChip
  searchQuery: string
  onSelectItem: (item: VaultItem) => void
  onSelectFilter: (filter: FilterChip) => void
  onSearchChange: (query: string) => void
}

const FILTERS: { label: string; value: FilterChip }[] = [
  { label: 'All', value: 'all' },
  { label: 'Weak passwords', value: 'weak-passwords' },
  { label: 'Reused', value: 'reused' },
  { label: 'Old (90d+)', value: 'old-90d' },
]

export function ItemList({
  items,
  selectedItem,
  activeFilter,
  onSelectItem,
  onSelectFilter,
}: ItemListProps) {
  return (
    <div className='flex flex-col w-full lg:w-[260px] lg:shrink-0 bg-background border-r border-border overflow-hidden'>
      {/* Header */}
      <div className='flex items-center justify-between px-4 py-3 border-b border-border shrink-0'>
        <span className='text-base font-bold text-foreground'>Logins</span>
        <div className='flex items-center gap-2'>
          <button className='flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-input text-muted-foreground hover:text-foreground hover:border-ring transition-colors text-xs font-medium'>
            Name A-Z
          </button>
          <button className='p-1.5 rounded-md border border-input text-muted-foreground hover:text-foreground hover:border-ring transition-colors'>
            <Filter className='w-3.5 h-3.5' />
          </button>
        </div>
      </div>

      {/* Filter chips */}
      <div className='flex gap-0.5 px-2 py-2 shrink-0 border-b border-border overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]'>
        {FILTERS.map((f) => (
          <FilterChipButton
            key={f.value}
            label={f.label}
            value={f.value}
            active={activeFilter === f.value}
            onClick={onSelectFilter}
          />
        ))}
      </div>

      {/* Count */}
      <div className='px-4 py-2 text-[11px] text-muted-foreground shrink-0'>
        {items.length} items
      </div>

      {/* List */}
      <div className='flex-1 overflow-y-auto'>
        {items.map((item) => (
          <ListItem
            key={item.id}
            item={item}
            selected={selectedItem.id === item.id}
            onClick={() => onSelectItem(item)}
          />
        ))}
        {items.length === 0 && (
          <div className='px-3 py-4 text-xs text-muted-foreground text-center'>No items found</div>
        )}
      </div>

      {/* No results hint */}
      <div className='px-3 py-2 border-t border-border shrink-0'>
        <div className='flex items-center gap-2 text-[11px] text-muted-foreground'>
          <span className='text-muted-foreground'>🔍</span>
          No results for &apos;xyz&apos;
        </div>
      </div>
    </div>
  )
}
