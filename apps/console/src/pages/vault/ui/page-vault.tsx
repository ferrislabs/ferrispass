import { useState } from 'react'
import { ArrowLeft, Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { SidebarNav } from './sidebar-nav'
import { ItemList } from './item-list'
import { ItemDetail } from './item-detail'
import type { FilterChip, MobileView, SidebarCategory, VaultItem } from '../feature/page-vault-feature'

interface PageVaultProps {
  items: VaultItem[]
  allItems: VaultItem[]
  selectedItem: VaultItem
  selectedCategory: SidebarCategory
  activeFilter: FilterChip
  searchQuery: string
  mobileView: MobileView
  onSelectItem: (item: VaultItem) => void
  onSelectCategory: (category: SidebarCategory) => void
  onSelectFilter: (filter: FilterChip) => void
  onSearchChange: (query: string) => void
  onMobileBack: () => void
}

export default function PageVault({
  items,
  allItems,
  selectedItem,
  selectedCategory,
  activeFilter,
  searchQuery,
  mobileView,
  onSelectItem,
  onSelectCategory,
  onSelectFilter,
  onSearchChange,
  onMobileBack,
}: PageVaultProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSelectCategory = (category: SidebarCategory) => {
    onSelectCategory(category)
    setSidebarOpen(false)
  }

  return (
    <div className='flex flex-1 overflow-hidden'>
      {/* Sidebar — hidden on mobile, visible on lg+ */}
      <div className='hidden lg:flex'>
        <SidebarNav
          selectedCategory={selectedCategory}
          allItemsCount={allItems.length}
          onSelectCategory={onSelectCategory}
        />
      </div>

      {/* Mobile: Sheet for sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <button className='lg:hidden absolute top-3 left-3 z-20 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors'>
            <Menu className='w-4 h-4' />
          </button>
        </SheetTrigger>
        <SheetContent side='left' className='p-0 w-[200px] bg-card border-r border-border [&>button]:hidden'>
          <SidebarNav
            selectedCategory={selectedCategory}
            allItemsCount={allItems.length}
            onSelectCategory={handleSelectCategory}
          />
        </SheetContent>
      </Sheet>

      {/* Mobile list view */}
      <div className={`
        flex-1 flex flex-col lg:hidden
        ${mobileView === 'list' ? 'flex' : 'hidden'}
      `}>
        <ItemList
          items={items}
          allItems={allItems}
          selectedItem={selectedItem}
          activeFilter={activeFilter}
          searchQuery={searchQuery}
          onSelectItem={onSelectItem}
          onSelectFilter={onSelectFilter}
          onSearchChange={onSearchChange}
        />
      </div>

      {/* Mobile detail view */}
      <div className={`
        flex-1 flex flex-col lg:hidden
        ${mobileView === 'detail' ? 'flex' : 'hidden'}
      `}>
        {/* Back button */}
        <div className='flex items-center gap-2 px-4 py-2 border-b border-border shrink-0 bg-background'>
          <button
            onClick={onMobileBack}
            className='flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors'
          >
            <ArrowLeft className='w-3.5 h-3.5' />
            Back
          </button>
        </div>
        <div className='flex-1 overflow-hidden flex flex-col'>
          <ItemDetail item={selectedItem} />
        </div>
      </div>

      {/* Desktop: list + detail side by side */}
      <div className='hidden lg:flex flex-1 overflow-hidden'>
        <ItemList
          items={items}
          allItems={allItems}
          selectedItem={selectedItem}
          activeFilter={activeFilter}
          searchQuery={searchQuery}
          onSelectItem={onSelectItem}
          onSelectFilter={onSelectFilter}
          onSearchChange={onSearchChange}
        />
        <ItemDetail item={selectedItem} />
      </div>
    </div>
  )
}
