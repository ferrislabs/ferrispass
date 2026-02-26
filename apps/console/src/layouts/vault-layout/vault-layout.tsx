import { Outlet } from '@tanstack/react-router'
import { useAppTheme } from '@/lib/theme'
import { TopBar } from './top-bar'

// Placeholder count — in a real app this would come from context/store
const VAULT_ITEM_COUNT = 438

export default function VaultLayout() {
  const { theme, toggleTheme } = useAppTheme()

  return (
    <div className='flex flex-col h-screen bg-background text-foreground overflow-hidden'>
      <TopBar allItemsCount={VAULT_ITEM_COUNT} theme={theme} onToggleTheme={toggleTheme} />
      <div className='flex flex-1 overflow-hidden'>
        <Outlet />
      </div>
    </div>
  )
}
