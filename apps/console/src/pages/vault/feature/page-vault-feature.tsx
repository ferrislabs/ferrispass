import { useState } from 'react'
import PageVault from '../ui/page-vault'

export type MobileView = 'list' | 'detail'

export type VaultItemType = 'login' | 'card' | 'identity' | 'secure-note' | 'ssh-key'

export type PasswordHealth = {
  strong: boolean
  reused: boolean
  twoFa: boolean
  lastChanged: string
}

export type VaultItem = {
  id: string
  type: VaultItemType
  name: string
  username: string
  password: string
  website?: string
  totp?: string
  notes?: string
  folder?: string
  collection?: string
  health: PasswordHealth
  favicon: string
  healthDot: 'green' | 'orange' | 'red'
}

const MOCK_ITEMS: VaultItem[] = [
  {
    id: '1',
    type: 'login',
    name: 'github.com',
    username: 'nathael@ferriskey.rs',
    password: '••••••••••••',
    website: 'https://github.com',
    totp: '391 644',
    notes: 'Primary engineering account. SSO enabled, backup codes stored in secure note.',
    folder: 'Work',
    health: { strong: true, reused: false, twoFa: true, lastChanged: '47 days' },
    favicon: 'G',
    healthDot: 'green',
  },
  {
    id: '2',
    type: 'login',
    name: 'gitlab.ferriskey.rs',
    username: 'nathael',
    password: '••••••••••••',
    website: 'https://gitlab.ferriskey.rs',
    folder: 'Work',
    health: { strong: true, reused: false, twoFa: false, lastChanged: '12 days' },
    favicon: 'G',
    healthDot: 'orange',
  },
  {
    id: '3',
    type: 'login',
    name: 'hub.docker.com',
    username: 'nathael@ferriskey.rs',
    password: '••••••••••••',
    website: 'https://hub.docker.com',
    folder: 'Work',
    health: { strong: true, reused: false, twoFa: false, lastChanged: '90 days' },
    favicon: 'H',
    healthDot: 'green',
  },
  {
    id: '4',
    type: 'login',
    name: 'aws.amazon.com',
    username: 'nathael@gmail.com',
    password: '••••••••••••',
    website: 'https://aws.amazon.com',
    folder: 'Work',
    health: { strong: false, reused: false, twoFa: false, lastChanged: '120 days' },
    favicon: 'A',
    healthDot: 'red',
  },
  {
    id: '5',
    type: 'login',
    name: 'npmjs.com',
    username: 'nathael',
    password: '••••••••••••',
    website: 'https://npmjs.com',
    folder: 'Dev Tools',
    health: { strong: true, reused: false, twoFa: false, lastChanged: '30 days' },
    favicon: 'N',
    healthDot: 'green',
  },
  {
    id: '6',
    type: 'login',
    name: 'cloudflare.com',
    username: 'nathael@ferriskey.rs',
    password: '••••••••••••',
    website: 'https://cloudflare.com',
    folder: 'Work',
    health: { strong: true, reused: false, twoFa: false, lastChanged: '60 days' },
    favicon: 'C',
    healthDot: 'orange',
  },
]

export type SidebarCategory =
  | 'all-items'
  | 'favorites'
  | 'recently-used'
  | 'logins'
  | 'cards'
  | 'identities'
  | 'secure-notes'
  | 'ssh-keys'
  | 'folder-work'
  | 'folder-personal'
  | 'folder-dev-tools'
  | 'folder-finance'
  | 'collection-team-alpha'
  | 'collection-shared-infra'
  | 'password-generator'
  | 'settings'
  | 'trash'

export type FilterChip = 'all' | 'weak-passwords' | 'reused' | 'old-90d'

export default function PageVaultFeature() {
  const [selectedCategory, setSelectedCategory] = useState<SidebarCategory>('all-items')
  const [selectedItem, setSelectedItem] = useState<VaultItem>(MOCK_ITEMS[0])
  const [activeFilter, setActiveFilter] = useState<FilterChip>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [mobileView, setMobileView] = useState<MobileView>('list')

  const filteredItems = MOCK_ITEMS.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      if (!item.name.toLowerCase().includes(q) && !item.username.toLowerCase().includes(q)) {
        return false
      }
    }
    if (activeFilter === 'weak-passwords') return !item.health.strong
    if (activeFilter === 'reused') return item.health.reused
    if (activeFilter === 'old-90d') return parseInt(item.health.lastChanged) > 90
    return true
  })

  const handleSelectItem = (item: VaultItem) => {
    setSelectedItem(item)
    setMobileView('detail')
  }

  return (
    <PageVault
      items={filteredItems}
      allItems={MOCK_ITEMS}
      selectedItem={selectedItem}
      selectedCategory={selectedCategory}
      activeFilter={activeFilter}
      searchQuery={searchQuery}
      mobileView={mobileView}
      onSelectItem={handleSelectItem}
      onSelectCategory={setSelectedCategory}
      onSelectFilter={setActiveFilter}
      onSearchChange={setSearchQuery}
      onMobileBack={() => setMobileView('list')}
    />
  )
}
