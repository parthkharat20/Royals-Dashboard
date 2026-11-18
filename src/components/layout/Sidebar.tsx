import { NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { path: '/', label: 'Decision Brief', icon: '◆', desc: 'Top 10 Rankings' },
  { path: '/primer', label: 'Plain English Guide', icon: '★', desc: 'For Coaches & Leaders' },
  { path: '/pressure', label: 'Pressure Intelligence', icon: '⬡', desc: 'P_sit ≥ 0.60 Engine' },
  { path: '/methodology', label: 'Model Trust', icon: '◎', desc: 'Validation & Provenance' },
  { path: '/squad', label: 'Squad Impact', icon: '⬢', desc: 'RR 2027 Scenarios' },
]

export function Sidebar() {
  const location = useLocation()

  return (
    <aside className="w-64 bg-surface border-r border-border-subtle flex flex-col shrink-0 select-none">
      {/* Brand header */}
      <div className="p-6 border-b border-border-subtle bg-surface-elevated/20">
        <div className="flex items-center gap-2 mb-1">
          <span className="w-2.5 h-2.5 rounded-full bg-rr-pink animate-pulse" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-rr-pink">
            Official Competition Suite
          </span>
        </div>
        <div className="font-display text-3xl tracking-wider text-text-primary leading-none">
          RAJASTHAN <span className="text-rr-pink">ROYALS</span>
        </div>
        <div className="font-display text-xl tracking-wider text-text-secondary mt-0.5">
          PRESSURE INTELLIGENCE
        </div>
        <div className="mt-2 text-caption text-text-muted flex items-center justify-between">
          <span>Decision Evidence Room</span>
          <span className="font-mono text-[10px] bg-white/5 px-1.5 py-0.5 rounded text-rr-gold border border-white/5">
            Round 1
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-5 px-3 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname === item.path
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                relative flex items-center gap-3.5 px-3.5 py-3 rounded text-body transition-all duration-150
                ${
                  isActive
                    ? 'text-text-primary bg-rr-pink/10 border border-rr-pink/30 shadow-[0_0_12px_rgba(232,62,140,0.1)]'
                    : 'text-text-secondary hover:text-text-primary hover:bg-white/5 border border-transparent'
                }
              `}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-rr-pink rounded-r"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}
              <span className={`text-base ${isActive ? 'text-rr-pink' : 'text-text-muted'}`}>
                {item.icon}
              </span>
              <div className="flex flex-col">
                <span className="font-medium text-sm leading-snug">{item.label}</span>
                <span className="text-[11px] text-text-muted leading-tight">{item.desc}</span>
              </div>
            </NavLink>
          )
        })}
      </nav>

      {/* Quick Links / Active player indicator */}
      {location.pathname.startsWith('/player/') && (
        <div className="mx-3 mb-4 p-3 bg-surface-elevated rounded border border-border-subtle">
          <div className="text-[10px] uppercase font-bold text-rr-gold tracking-wider mb-1">
            Active Dossier
          </div>
          <NavLink
            to="/"
            className="text-xs text-rr-pink hover:underline flex items-center gap-1 font-medium"
          >
            ← Return to Top 10 Brief
          </NavLink>
        </div>
      )}

      {/* Footer - dataset stamp */}
      <div className="p-4 border-t border-border-subtle bg-canvas/40">
        <div className="text-caption text-text-muted space-y-1">
          <div className="flex items-center justify-between font-mono tabular text-text-secondary">
            <span>Verified Dataset:</span>
            <span className="font-semibold text-text-primary">200,961 del</span>
          </div>
          <div className="flex items-center justify-between font-mono tabular text-[11px]">
            <span>867 matches</span>
            <span>134 comps</span>
          </div>
          <div className="pt-1 text-[10px] text-text-muted border-t border-border-subtle/50 flex justify-between">
            <span>2022–2026 Universe</span>
            <span className="text-success font-semibold">Audited 100%</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
