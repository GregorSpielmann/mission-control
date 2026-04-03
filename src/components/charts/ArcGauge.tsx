'use client'

import { useMemo } from 'react'

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arc(cx: number, cy: number, r: number, a1: number, a2: number) {
  if (Math.abs(a2 - a1) < 0.01) return ''
  const s = polar(cx, cy, r, a1)
  const e = polar(cx, cy, r, a2)
  const large = a2 - a1 > 180 ? 1 : 0
  return `M ${s.x.toFixed(2)} ${s.y.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}`
}

interface ArcGaugeProps {
  value: number          // current value
  max?: number           // default 100
  size?: number          // diameter px, default 100
  strokeWidth?: number   // default 7
  startAngle?: number    // default 135 (bottom-left)
  sweepAngle?: number    // default 270
  color?: string         // overrides auto colour
  label?: string         // big center text (e.g. "44")
  sublabel?: string      // small text below (e.g. "MISSION SCORE")
  unit?: string          // appended to label (e.g. "%")
  scoreColor?: boolean   // auto green/amber/red based on pct, default true
}

export default function ArcGauge({
  value,
  max = 100,
  size = 100,
  strokeWidth = 7,
  startAngle = 135,
  sweepAngle = 270,
  color,
  label,
  sublabel,
  unit = '',
  scoreColor = true,
}: ArcGaugeProps) {
  const cx = size / 2
  const cy = size / 2
  const r = cx - strokeWidth - 2

  const pct = Math.min(Math.max(value / max, 0), 1)
  const endAngle = startAngle + pct * sweepAngle
  const trackEnd = startAngle + sweepAngle

  const trackPath = arc(cx, cy, r, startAngle, trackEnd)
  const valuePath = pct > 0.001 ? arc(cx, cy, r, startAngle, endAngle) : ''

  const resolvedColor = useMemo(() => {
    if (color) return color
    if (!scoreColor) return '#60a5fa'
    if (pct >= 0.65) return '#4ade80'
    if (pct >= 0.35) return '#f59e0b'
    return '#ef4444'
  }, [color, scoreColor, pct])

  const displayLabel = label ?? `${Math.round(value)}${unit}`
  const id = `arc-${size}-${strokeWidth}`

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ display: 'block' }}>
        <defs>
          <filter id={`${id}-glow`} x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Track */}
        <path
          d={trackPath}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Tick marks at 25% intervals */}
        {[0.25, 0.5, 0.75].map(t => {
          const a = startAngle + t * sweepAngle
          const inner = polar(cx, cy, r - strokeWidth / 2 - 1, a)
          const outer = polar(cx, cy, r + strokeWidth / 2 + 1, a)
          return (
            <line
              key={t}
              x1={inner.x.toFixed(2)} y1={inner.y.toFixed(2)}
              x2={outer.x.toFixed(2)} y2={outer.y.toFixed(2)}
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={0.5}
            />
          )
        })}

        {/* Value arc */}
        {valuePath && (
          <path
            d={valuePath}
            fill="none"
            stroke={resolvedColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            filter={`url(#${id}-glow)`}
          />
        )}

        {/* End cap dot */}
        {pct > 0.01 && (() => {
          const tip = polar(cx, cy, r, endAngle)
          return (
            <circle
              cx={tip.x.toFixed(2)} cy={tip.y.toFixed(2)} r={strokeWidth / 2 + 0.5}
              fill={resolvedColor}
              filter={`url(#${id}-glow)`}
            />
          )
        })()}
      </svg>

      {/* Center label */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        paddingTop: size * 0.08,
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: 'var(--font-mono, monospace)',
          fontSize: size * 0.22,
          fontWeight: 700,
          color: resolvedColor,
          lineHeight: 1,
          textShadow: `0 0 12px ${resolvedColor}88`,
          letterSpacing: '-0.02em',
        }}>
          {displayLabel}
        </div>
        {sublabel && (
          <div style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: size * 0.075,
            color: 'rgba(148,163,184,0.6)',
            letterSpacing: '0.1em',
            marginTop: 2,
            textAlign: 'center',
          }}>
            {sublabel}
          </div>
        )}
      </div>
    </div>
  )
}
