'use client'

import { useMemo } from 'react'

interface SparklineProps {
  data: number[]
  width?: number
  height?: number
  color?: string
  showArea?: boolean
  threshold?: number   // draws a dashed target line
  strokeWidth?: number
  labels?: string[]    // optional x-axis labels (shown as dots only)
}

export default function Sparkline({
  data,
  width = 120,
  height = 32,
  color = '#60a5fa',
  showArea = true,
  threshold,
  strokeWidth = 1.5,
}: SparklineProps) {
  const { points, areaPath, thresholdY, dotX, dotY } = useMemo(() => {
    if (data.length < 2) return { points: '', areaPath: '', thresholdY: null, dotX: 0, dotY: 0 }

    const min = Math.min(...data)
    const max = Math.max(...data)
    const range = max - min || 1
    const pad = 2

    const coords = data.map((v, i) => ({
      x: pad + (i / (data.length - 1)) * (width - pad * 2),
      y: pad + (1 - (v - min) / range) * (height - pad * 2),
    }))

    const points = coords.map(c => `${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ')

    const areaPath =
      `M ${coords[0].x.toFixed(1)},${height} ` +
      coords.map(c => `L ${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ') +
      ` L ${coords[coords.length - 1].x.toFixed(1)},${height} Z`

    const thresholdY =
      threshold !== undefined
        ? pad + (1 - (threshold - min) / range) * (height - pad * 2)
        : null

    const last = coords[coords.length - 1]
    return { points, areaPath, thresholdY, dotX: last.x, dotY: last.y }
  }, [data, width, height, threshold])

  const id = `spark-${color.replace(/[^a-z0-9]/gi, '')}-${width}`

  return (
    <svg width={width} height={height} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      {showArea && (
        <path d={areaPath} fill={`url(#${id}-area)`} />
      )}

      {/* Threshold dashed line */}
      {thresholdY !== null && (
        <line
          x1={2} y1={thresholdY} x2={width - 2} y2={thresholdY}
          stroke={color} strokeWidth={0.8} strokeDasharray="3,3" opacity={0.45}
        />
      )}

      {/* Main line */}
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter={`url(#${id})`}
      />

      {/* Latest value dot */}
      <circle cx={dotX} cy={dotY} r={2} fill={color} opacity={0.9} />
      <circle cx={dotX} cy={dotY} r={4} fill={color} opacity={0.15} />
    </svg>
  )
}
