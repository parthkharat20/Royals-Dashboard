import React from 'react'
import { Sidebar } from './Sidebar'

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-canvas text-text-primary">
      <Sidebar />
      <main className="flex-1 overflow-y-auto min-w-0">
        <div className="max-w-[1440px] mx-auto px-6 py-8 lg:px-10">
          {children}
        </div>
      </main>
    </div>
  )
}
