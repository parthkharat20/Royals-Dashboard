import React from 'react'
import { cn } from '@/lib/utils'

type Variant = 'pink' | 'blue' | 'gold' | 'success' | 'danger' | 'muted'

const variants: Record<Variant, string> = {
  pink:    'bg-rr-pink/15 text-rr-pink border-rr-pink/30',
  blue:    'bg-rr-blue/15 text-rr-blue border-rr-blue/30',
  gold:    'bg-rr-gold/15 text-rr-gold border-rr-gold/30',
  success: 'bg-success/15 text-success border-success/30',
  danger:  'bg-danger/15 text-danger border-danger/30',
  muted:   'bg-white/5 text-text-secondary border-white/10',
}

export function Badge({
  children,
  variant = 'muted',
  className = '',
}: {
  children: React.ReactNode
  variant?: Variant
  className?: string
}) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 text-xs font-medium border rounded', variants[variant], className)}>
      {children}
    </span>
  )
}
