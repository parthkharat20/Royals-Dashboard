import React from 'react'

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  actions,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  actions?: React.ReactNode
}) {
  return (
    <header className="mb-8 pb-5 border-b border-border-subtle flex flex-col md:flex-row md:items-end md:justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="text-caption font-semibold uppercase text-rr-pink mb-1.5 tracking-widest flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-rr-pink" />
            {eyebrow}
          </div>
        )}
        <h1 className="font-display text-hero text-text-primary tracking-wide leading-none">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-body-lg text-text-secondary max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </header>
  )
}
