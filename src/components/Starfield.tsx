'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  z: number
  px: number
  py: number
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const NUM_STARS = 180
    const SPEED = 0.15
    let width = window.innerWidth
    let height = window.innerHeight
    let animationId: number

    canvas.width = width
    canvas.height = height

    const stars: Star[] = Array.from({ length: NUM_STARS }, () => ({
      x: Math.random() * width - width / 2,
      y: Math.random() * height - height / 2,
      z: Math.random() * width,
      px: 0,
      py: 0,
    }))

    function drawFrame() {
      if (!ctx) return
      ctx.fillStyle = 'rgba(10, 11, 20, 0.25)'
      ctx.fillRect(0, 0, width, height)

      const cx = width / 2
      const cy = height / 2

      for (const star of stars) {
        star.z -= SPEED

        if (star.z <= 0) {
          star.x = Math.random() * width - cx
          star.y = Math.random() * height - cy
          star.z = width
          star.px = 0
          star.py = 0
        }

        const sx = (star.x / star.z) * width + cx
        const sy = (star.y / star.z) * height + cy

        if (sx < 0 || sx > width || sy < 0 || sy > height) {
          star.x = Math.random() * width - cx
          star.y = Math.random() * height - cy
          star.z = width
          star.px = 0
          star.py = 0
          continue
        }

        const size = Math.max(0.3, (1 - star.z / width) * 1.8)
        const opacity = Math.min(0.9, (1 - star.z / width) * 1.2)

        if (star.px !== 0) {
          ctx.beginPath()
          ctx.moveTo(star.px, star.py)
          ctx.lineTo(sx, sy)
          ctx.strokeStyle = `rgba(148, 185, 255, ${opacity * 0.4})`
          ctx.lineWidth = size * 0.5
          ctx.stroke()
        }

        ctx.beginPath()
        ctx.arc(sx, sy, size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 220, 255, ${opacity})`
        ctx.fill()

        star.px = sx
        star.py = sy
      }

      animationId = requestAnimationFrame(drawFrame)
    }

    // Initial clear
    ctx.fillStyle = '#0a0b14'
    ctx.fillRect(0, 0, width, height)

    drawFrame()

    function handleResize() {
      width = window.innerWidth
      height = window.innerHeight
      canvas!.width = width
      canvas!.height = height
      if (ctx) {
        ctx.fillStyle = '#0a0b14'
        ctx.fillRect(0, 0, width, height)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}
