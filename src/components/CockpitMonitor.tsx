'use client'

import { useState, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

interface CockpitMonitorProps {
  label: string
  icon: string
  statusText: string
  statusColor?: 'green' | 'amber' | 'red' | 'blue' | 'cyan' | 'purple'
  alertBlink?: boolean
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
}

export default function CockpitMonitor({
  label,
  icon,
  statusText,
  statusColor = 'blue',
  alertBlink = false,
  children,
  orientation = 'horizontal',
}: CockpitMonitorProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, close])

  const colorMap: Record<string, string> = {
    green:  'text-green-400',
    amber:  'text-amber-400',
    red:    'text-red-400',
    blue:   'text-blue-400',
    cyan:   'text-cyan-400',
    purple: 'text-purple-400',
  }
  const borderGlowMap: Record<string, string> = {
    green:  'hover:border-green-500/60 hover:shadow-[0_0_12px_rgba(34,197,94,0.3)]',
    amber:  'hover:border-amber-500/60 hover:shadow-[0_0_12px_rgba(245,158,11,0.3)]',
    red:    'hover:border-red-500/60 hover:shadow-[0_0_12px_rgba(239,68,68,0.3)]',
    blue:   'hover:border-blue-500/60 hover:shadow-[0_0_12px_rgba(59,130,246,0.3)]',
    cyan:   'hover:border-cyan-500/60 hover:shadow-[0_0_12px_rgba(6,182,212,0.3)]',
    purple: 'hover:border-purple-500/60 hover:shadow-[0_0_12px_rgba(168,85,247,0.3)]',
  }
  const activeBorderMap: Record<string, string> = {
    green:  'border-green-500/40 shadow-[0_0_8px_rgba(34,197,94,0.2)]',
    amber:  'border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.2)]',
    red:    'border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.4)]',
    blue:   'border-blue-500/40 shadow-[0_0_8px_rgba(59,130,246,0.2)]',
    cyan:   'border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]',
    purple: 'border-purple-500/40 shadow-[0_0_8px_rgba(168,85,247,0.2)]',
  }

  const isVertical = orientation === 'vertical'

  return (
    <>
      {/* Monitor idle state */}
      <button
        onClick={() => setOpen(true)}
        className={`
          group relative cursor-pointer select-none
          bg-[#060810] border transition-all duration-200
          border-[#1e2a3a] rounded
          ${alertBlink ? activeBorderMap[statusColor] : ''}
          ${borderGlowMap[statusColor]}
          ${isVertical
            ? 'w-full flex flex-col items-center gap-1.5 py-3 px-2'
            : 'flex flex-col items-center justify-center gap-1.5 p-2'
          }
        `}
        style={isVertical ? {} : { minWidth: 100, minHeight: 72 }}
      >
        {/* CRT scanline overlay */}
        <div className="absolute inset-0 pointer-events-none rounded overflow-hidden">
          <div className="crt-scanlines" />
        </div>

        {/* Icon */}
        <div className={`text-xl leading-none z-10 ${alertBlink ? `${colorMap[statusColor]} pulse-red` : ''}`}>
          {icon}
        </div>

        {/* Label */}
        <div className="z-10 text-[9px] font-bold tracking-[0.15em] text-[#64748b] uppercase">
          {label}
        </div>

        {/* Status metric */}
        <div className={`z-10 text-[10px] font-bold ${colorMap[statusColor]} ${alertBlink ? 'pulse-red' : ''}`}>
          {statusText}
        </div>

        {/* Hover hint */}
        <div className="z-10 absolute inset-0 flex items-end justify-center pb-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <span className="text-[8px] tracking-widest text-white/50 uppercase">CLICK TO OPEN</span>
        </div>

        {/* Corner accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#1e2a3a] group-hover:border-blue-500/40 transition-colors rounded-tl" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#1e2a3a] group-hover:border-blue-500/40 transition-colors rounded-tr" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#1e2a3a] group-hover:border-blue-500/40 transition-colors rounded-bl" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#1e2a3a] group-hover:border-blue-500/40 transition-colors rounded-br" />
      </button>

      {/* Full-screen overlay — rendered via portal */}
      {mounted && open && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(6, 8, 16, 0.88)', backdropFilter: 'blur(6px)' }}
          onClick={e => { if (e.target === e.currentTarget) close() }}
        >
          <div
            className="relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded border border-[#1e2a3a]"
            style={{
              background: '#0d1117',
              boxShadow: '0 0 40px rgba(37, 99, 235, 0.15), 0 0 80px rgba(37, 99, 235, 0.05)',
            }}
          >
            {/* Panel header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1e2a3a] flex-shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-lg">{icon}</span>
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-blue-400">
                  {label}
                </span>
                <span className="text-[10px] text-[#64748b] tracking-widest">— {statusText}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[9px] text-[#64748b] tracking-widest hidden sm:block">ESC TO CLOSE</span>
                <button
                  onClick={close}
                  className="text-[#64748b] hover:text-white transition-colors text-sm font-bold border border-[#1e2a3a] hover:border-red-500/40 px-2 py-0.5 rounded"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Panel content */}
            <div className="flex-1 overflow-y-auto p-4">
              {children}
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        .crt-scanlines {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0, 0, 0, 0.15) 2px,
            rgba(0, 0, 0, 0.15) 4px
          );
          pointer-events: none;
        }
      `}</style>
    </>
  )
}
