import React from 'react'

export function Callout({
  title,
  children,
  accent = 'pink',
}: {
  title: string
  children: React.ReactNode
  accent?: 'pink' | 'blue' | 'gold'
}) {
  const borderColor = {
    pink: 'border-l-rr-pink',
    blue: 'border-l-rr-blue',
    gold: 'border-l-rr-gold',
  }[accent]

  return (
    <div className={`bg-surface rounded border border-border-subtle border-l-4 ${borderColor} p-5`}>
      <h4 className="font-display text-xl text-text-primary mb-2 tracking-wide">{title}</h4>
      <div className="text-body text-text-secondary leading-relaxed">{children}</div>
    </div>
  )
}
