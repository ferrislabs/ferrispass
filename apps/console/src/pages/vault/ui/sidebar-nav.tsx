import {
  CreditCard,
  FileText,
  Folder,
  FolderOpen,
  Hash,
  Heart,
  Key,
  Plus,
  Settings,
  Shield,
  Star,
  Terminal,
  Trash2,
  User,
  Wand2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { SidebarCategory } from '../feature/page-vault-feature'

interface SidebarNavProps {
  selectedCategory: SidebarCategory
  allItemsCount: number
  onSelectCategory: (category: SidebarCategory) => void
}

interface NavItemProps {
  icon?: React.ReactNode
  label: string
  count?: number
  active?: boolean
  onClick?: () => void
  className?: string
}

function NavItem({ icon, label, count, active, onClick, className }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center w-full gap-2 px-3 py-1 rounded-md text-xs transition-colors text-left',
        active
          ? 'bg-accent text-accent-foreground'
          : 'text-muted-foreground hover:text-foreground hover:bg-accent',
        className,
      )}
    >
      {icon && <span className='w-3.5 h-3.5 shrink-0 flex items-center justify-center'>{icon}</span>}
      <span className='flex-1 truncate'>{label}</span>
      {count !== undefined && (
        <span className='text-muted-foreground text-[10px]'>{count}</span>
      )}
    </button>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className='px-3 pt-3 pb-0.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>
      {children}
    </div>
  )
}

export function SidebarNav({ selectedCategory, allItemsCount, onSelectCategory }: SidebarNavProps) {
  return (
    <div className='flex flex-col h-full w-[160px] shrink-0 bg-card border-r border-border py-2'>
      <div className='flex-1 overflow-y-auto space-y-0.5 px-1'>
        {/* ALL ITEMS */}
        <SectionLabel>All Items</SectionLabel>
        <NavItem
          icon={<Hash className='w-3.5 h-3.5' />}
          label='All Items'
          count={allItemsCount}
          active={selectedCategory === 'all-items'}
          onClick={() => onSelectCategory('all-items')}
        />
        <NavItem
          icon={<Star className='w-3.5 h-3.5' />}
          label='Favorites'
          count={12}
          active={selectedCategory === 'favorites'}
          onClick={() => onSelectCategory('favorites')}
        />
        <NavItem
          icon={<Heart className='w-3.5 h-3.5' />}
          label='Recently Used'
          count={8}
          active={selectedCategory === 'recently-used'}
          onClick={() => onSelectCategory('recently-used')}
        />

        {/* TYPES */}
        <SectionLabel>Types</SectionLabel>
        <NavItem
          icon={<Key className='w-3.5 h-3.5' />}
          label='Logins'
          count={312}
          active={selectedCategory === 'logins'}
          onClick={() => onSelectCategory('logins')}
        />
        <NavItem
          icon={<CreditCard className='w-3.5 h-3.5' />}
          label='Cards'
          count={6}
          active={selectedCategory === 'cards'}
          onClick={() => onSelectCategory('cards')}
        />
        <NavItem
          icon={<User className='w-3.5 h-3.5' />}
          label='Identities'
          count={4}
          active={selectedCategory === 'identities'}
          onClick={() => onSelectCategory('identities')}
        />
        <NavItem
          icon={<FileText className='w-3.5 h-3.5' />}
          label='Secure Notes'
          count={18}
          active={selectedCategory === 'secure-notes'}
          onClick={() => onSelectCategory('secure-notes')}
        />
        <NavItem
          icon={<Terminal className='w-3.5 h-3.5' />}
          label='SSH Keys'
          count={8}
          active={selectedCategory === 'ssh-keys'}
          onClick={() => onSelectCategory('ssh-keys')}
        />

        {/* FOLDERS */}
        <SectionLabel>
          <div className='flex items-center justify-between'>
            <span>Folders</span>
            <button className='hover:text-foreground transition-colors'>
              <Plus className='w-3 h-3' />
            </button>
          </div>
        </SectionLabel>
        <NavItem
          icon={<FolderOpen className='w-3.5 h-3.5' />}
          label='Work'
          count={124}
          active={selectedCategory === 'folder-work'}
          onClick={() => onSelectCategory('folder-work')}
        />
        <NavItem
          icon={<Folder className='w-3.5 h-3.5' />}
          label='Personal'
          count={88}
          active={selectedCategory === 'folder-personal'}
          onClick={() => onSelectCategory('folder-personal')}
        />
        <NavItem
          icon={<Folder className='w-3.5 h-3.5' />}
          label='Dev Tools'
          count={44}
          active={selectedCategory === 'folder-dev-tools'}
          onClick={() => onSelectCategory('folder-dev-tools')}
        />
        <NavItem
          icon={<Folder className='w-3.5 h-3.5' />}
          label='Finance'
          count={22}
          active={selectedCategory === 'folder-finance'}
          onClick={() => onSelectCategory('folder-finance')}
        />

        {/* COLLECTIONS */}
        <SectionLabel>Collections</SectionLabel>
        <NavItem
          icon={<Shield className='w-3.5 h-3.5' />}
          label='Team Alpha'
          count={56}
          active={selectedCategory === 'collection-team-alpha'}
          onClick={() => onSelectCategory('collection-team-alpha')}
        />
        <NavItem
          icon={<Shield className='w-3.5 h-3.5' />}
          label='Shared Infra'
          count={33}
          active={selectedCategory === 'collection-shared-infra'}
          onClick={() => onSelectCategory('collection-shared-infra')}
        />
      </div>

      {/* Bottom actions */}
      <div className='border-t border-border pt-1 px-1 space-y-0.5'>
        <NavItem
          icon={<Wand2 className='w-3.5 h-3.5' />}
          label='Password Generator'
          active={selectedCategory === 'password-generator'}
          onClick={() => onSelectCategory('password-generator')}
        />
        <NavItem
          icon={<Settings className='w-3.5 h-3.5' />}
          label='Settings'
          active={selectedCategory === 'settings'}
          onClick={() => onSelectCategory('settings')}
        />
        <NavItem
          icon={<Trash2 className='w-3.5 h-3.5' />}
          label='Trash'
          count={3}
          active={selectedCategory === 'trash'}
          onClick={() => onSelectCategory('trash')}
          className='text-red-400 hover:text-red-300'
        />
      </div>
    </div>
  )
}
