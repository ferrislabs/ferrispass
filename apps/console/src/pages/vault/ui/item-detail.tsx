import {
  CheckSquare,
  Copy,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  Plus,
  Share,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { FieldRow } from './field-row'
import type { VaultItem } from '../feature/page-vault-feature'

interface ItemDetailProps {
  item: VaultItem
}

function HealthCheck({ label, ok }: { label: string; ok: boolean }) {
  return (
    <div className='flex items-center justify-between py-1.5'>
      <div className='flex items-center gap-2'>
        <div className='w-4 h-4 rounded-sm flex items-center justify-center bg-muted'>
          <div className={cn('w-1.5 h-1.5 rounded-full', ok ? 'bg-green-500' : 'bg-muted-foreground')} />
        </div>
        <span className='text-xs text-muted-foreground'>{label}</span>
      </div>
      <CheckSquare className={cn('w-4 h-4', ok ? 'text-green-500' : 'text-muted-foreground')} />
    </div>
  )
}

export function ItemDetail({ item }: ItemDetailProps) {
  const [showPassword, setShowPassword] = useState(false)

  const copyToClipboard = (text: string) => {
    void navigator.clipboard.writeText(text)
  }

  return (
    <div className='flex flex-col flex-1 bg-background overflow-hidden'>
      {/* Item header */}
      <div className='flex items-center justify-between px-6 py-3 border-b border-border shrink-0'>
        <div className='flex items-center gap-3'>
          <div className='w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-sm font-bold text-foreground shrink-0'>
            {item.favicon}
          </div>
          <div>
            <div className='text-sm font-semibold text-foreground'>{item.name}</div>
            <div className='text-xs text-muted-foreground'>{item.website}</div>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          <a
            href={item.website}
            target='_blank'
            rel='noreferrer'
            className='flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors'
          >
            Open URL
            <ExternalLink className='w-3 h-3' />
          </a>
          <div className='w-px h-4 bg-border mx-2' />
          <button className='p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'>
            <Edit className='w-3.5 h-3.5' />
          </button>
          <button className='p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'>
            <Share className='w-3.5 h-3.5' />
          </button>
          <button className='p-1.5 rounded text-muted-foreground hover:text-red-400 hover:bg-muted transition-colors'>
            <Trash2 className='w-3.5 h-3.5' />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className='flex-1 overflow-y-auto'>
        {/* Username */}
        <FieldRow
          label='Username'
          value={item.username}
          onCopy={() => copyToClipboard(item.username)}
        />

        {/* Password */}
        <div className='px-6 py-3 border-b border-border'>
          <div className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1'>
            Password
          </div>
          <div className='flex items-center justify-between gap-2'>
            <div className='text-sm text-foreground flex-1 font-mono tracking-widest'>
              {showPassword ? 'p4$$w0rd_s3cur3!' : '••••••••••••'}
            </div>
            <div className='flex items-center gap-1'>
              <button
                onClick={() => setShowPassword((v) => !v)}
                className='p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
              >
                {showPassword ? <EyeOff className='w-3.5 h-3.5' /> : <Eye className='w-3.5 h-3.5' />}
              </button>
              <button
                onClick={() => copyToClipboard('p4$$w0rd_s3cur3!')}
                className='p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
              >
                <Copy className='w-3.5 h-3.5' />
              </button>
              <span className='text-[10px] text-green-400 bg-green-400/10 px-2 py-0.5 rounded font-medium border border-green-400/20'>
                Strong · 128-bit entropy
              </span>
            </div>
          </div>
        </div>

        {/* Website */}
        {item.website && (
          <FieldRow
            label='Website'
            value={
              <a
                href={item.website}
                target='_blank'
                rel='noreferrer'
                className='text-red-400 hover:text-red-300 transition-colors'
              >
                {item.website}
              </a>
            }
            onCopy={() => copyToClipboard(item.website ?? '')}
          />
        )}

        {/* TOTP */}
        {item.totp && (
          <div className='px-6 py-3 border-b border-border'>
            <div className='flex items-center justify-between mb-2'>
              <div className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>
                TOTP / 2FA
              </div>
              <button
                onClick={() => copyToClipboard(item.totp ?? '')}
                className='p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
              >
                <Copy className='w-3.5 h-3.5' />
              </button>
            </div>
            <div className='relative'>
              <div className='text-3xl font-bold text-foreground tracking-[0.3em] font-mono'>
                {item.totp}
              </div>
              <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-red-500' />
            </div>
          </div>
        )}

        {/* Notes */}
        {item.notes && (
          <div className='px-6 py-3 border-b border-border'>
            <div className='flex items-center justify-between mb-1'>
              <div className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>
                Notes
              </div>
              <button
                onClick={() => copyToClipboard(item.notes ?? '')}
                className='p-1 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors'
              >
                <Copy className='w-3.5 h-3.5' />
              </button>
            </div>
            <p className='text-sm text-muted-foreground leading-relaxed'>{item.notes}</p>
          </div>
        )}

        {/* Custom Fields */}
        <div className='px-6 py-3 border-b border-border'>
          <div className='flex items-center justify-between mb-2'>
            <div className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>
              Custom Fields
            </div>
            <button className='flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors'>
              <Plus className='w-3 h-3' />
              Add field
            </button>
          </div>
          <div className='text-xs text-muted-foreground'>
            <div className='mb-1 font-medium text-foreground'>Component Breakdown</div>
            <ul className='space-y-0.5 text-muted-foreground'>
              <li>• Top Bar</li>
              <li>• Sidebar Item</li>
              <li>• Filter Chip</li>
              <li>• List Item</li>
              <li>• Field Row</li>
            </ul>
          </div>
        </div>

        {/* Password Health */}
        <div className='px-6 py-3 border-b border-border'>
          <div className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2'>
            Password Health
          </div>
          <div className='space-y-0.5'>
            <HealthCheck label='Strong password' ok={item.health.strong} />
            <HealthCheck label='Not reused' ok={!item.health.reused} />
            <HealthCheck label='2FA enabled' ok={item.health.twoFa} />
            <HealthCheck
              label={`Last changed: ${item.health.lastChanged}`}
              ok={parseInt(item.health.lastChanged) <= 90}
            />
          </div>
        </div>

        {/* Password History */}
        <div className='px-6 py-3'>
          <button className='flex items-center justify-between w-full'>
            <div className='text-[10px] font-semibold text-muted-foreground uppercase tracking-wider'>
              Password History (3)
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
