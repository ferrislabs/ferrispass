import {
  ChevronDown,
  KeyRound,
  Lock,
  LogOut,
  Moon,
  RefreshCw,
  Search,
  Settings,
  Sun,
  User,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { AppTheme } from '@/lib/theme'

interface TopBarProps {
  allItemsCount: number
  theme: AppTheme
  onToggleTheme: () => void
}

export function TopBar({ allItemsCount, theme, onToggleTheme }: TopBarProps) {
  return (
    <div className='flex items-stretch h-12 border-b border-border shrink-0'>
      {/* Left zone — logo aligned with sidebar, desktop only */}
      <div className='hidden lg:flex w-[160px] shrink-0 items-center px-3 border-r border-border bg-card'>
        <span className='text-red-500 font-bold text-sm'>Ferris</span>
        <span className='text-foreground font-bold text-sm'>Pass</span>
      </div>

      {/* Right zone — search + actions */}
      <div className='flex flex-1 items-center px-4 gap-3 bg-background'>
        {/* Mobile: logo (space for burger handled in page-vault) */}
        <div className='lg:hidden flex items-center pl-7'>
          <span className='text-red-500 font-bold text-sm'>Ferris</span>
          <span className='text-foreground font-bold text-sm'>Pass</span>
        </div>

        {/* Vault selector — desktop only */}
        <button className='hidden lg:flex items-center gap-2 px-2 py-1 rounded-md hover:bg-accent transition-colors shrink-0'>
          <div className='w-5 h-5 rounded bg-red-600 flex items-center justify-center shrink-0'>
            <KeyRound className='w-3 h-3 text-white' />
          </div>
          <span className='text-xs text-foreground font-medium'>Personal Vault</span>
          <span className='text-[11px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded'>{allItemsCount}</span>
          <ChevronDown className='w-3 h-3 text-muted-foreground' />
        </button>

        <div className='hidden lg:block w-px h-5 bg-border' />

        {/* Search */}
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground' />
          <input
            type='text'
            placeholder='Search vault...'
            className='w-full bg-muted text-foreground text-sm pl-8 pr-10 py-1.5 rounded-md border border-input focus:outline-none focus:border-ring placeholder:text-muted-foreground'
          />
          <kbd className='hidden sm:block absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground bg-background/70 border border-border px-1.5 py-0.5 rounded font-mono'>
            ⌘K
          </kbd>
        </div>

        {/* Actions */}
        <div className='flex items-center gap-2 shrink-0'>
          <div className='hidden md:flex items-center gap-1.5 text-xs text-muted-foreground'>
            <RefreshCw className='w-3 h-3' />
            <span>Synced 2m ago</span>
          </div>

          <button className='flex items-center gap-1.5 text-red-500 hover:text-red-400 text-xs font-medium px-2 py-1.5 transition-colors'>
            <Lock className='w-3 h-3' />
            <span className='hidden sm:inline'>Lock</span>
          </button>

          {/* Avatar dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className='w-7 h-7 rounded bg-red-600 flex items-center justify-center text-white text-xs font-bold hover:bg-red-700 transition-colors outline-none'>
                NB
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-52 bg-popover border-border text-popover-foreground'>
              <DropdownMenuLabel className='font-normal'>
                <div className='text-sm font-medium text-popover-foreground'>Nathael Bonnal</div>
                <div className='text-xs text-muted-foreground mt-0.5'>nathael@ferriskey.rs</div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className='bg-border' />
              <DropdownMenuGroup>
                <DropdownMenuItem className='text-xs gap-2 cursor-pointer text-muted-foreground focus:bg-accent focus:text-accent-foreground'>
                  <User className='w-3.5 h-3.5' />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem className='text-xs gap-2 cursor-pointer text-muted-foreground focus:bg-accent focus:text-accent-foreground'>
                  <Settings className='w-3.5 h-3.5' />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onToggleTheme}
                  className='text-xs gap-2 cursor-pointer text-muted-foreground focus:bg-accent focus:text-accent-foreground'
                >
                  {theme === 'dark' ? <Sun className='w-3.5 h-3.5' /> : <Moon className='w-3.5 h-3.5' />}
                  {theme === 'dark' ? 'Light theme' : 'Dark theme'}
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className='bg-border' />
              <DropdownMenuItem className='text-xs gap-2 cursor-pointer text-red-400 focus:bg-accent focus:text-red-400'>
                <LogOut className='w-3.5 h-3.5' />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}
