'use client'

import { useEffect, useRef } from 'react'

export default function PlanetScene() {
  const blinkRef = useRef<HTMLDivElement[]>([])

  useEffect(() => {
    let frame = 0
    let animId: number

    function tick() {
      frame++
      blinkRef.current.forEach((el, i) => {
        if (!el) return
        const period = 60 + i * 40
        const on = Math.floor(frame / period) % 2 === 0
        el.style.opacity = on ? '1' : '0.1'
      })
      animId = requestAnimationFrame(tick)
    }
    animId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animId)
  }, [])

  return (
    <div className="planet-scene-root">
      {/* Cockpit window vignette frame */}
      <div className="cockpit-window" />

      {/* The planet */}
      <div className="planet-body">
        {/* Atmosphere glow ring */}
        <div className="planet-atmosphere" />
        {/* Cloud patches */}
        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />
        {/* Terminator line (day/night) */}
        <div className="planet-terminator" />

        {/* Colony base at ~7 o'clock (bottom-left) */}
        <div className="colony-base">
          {/* Landing pad */}
          <div className="landing-pad" />

          {/* 3 buildings */}
          <div className="colony-buildings">
            <div className="building building-left" />
            <div className="building building-center" />
            <div className="building building-right" />
          </div>

          {/* Blinking lights */}
          <div
            className="blink-light blink-a"
            ref={el => { if (el) blinkRef.current[0] = el }}
          />
          <div
            className="blink-light blink-b"
            ref={el => { if (el) blinkRef.current[1] = el }}
          />
          <div
            className="blink-light blink-c"
            ref={el => { if (el) blinkRef.current[2] = el }}
          />

          {/* Label */}
          <div className="colony-label">
            ADASIGHT OUTPOST ALPHA — SECTOR 7
          </div>
        </div>
      </div>

      {/* HUD crosshair overlay */}
      <div className="hud-crosshair">
        <div className="crosshair-h" />
        <div className="crosshair-v" />
        <div className="crosshair-ring" />
      </div>

      {/* Scan readout */}
      <div className="scan-readout">
        <div className="scan-line-item">SCANNING: ADASIGHT PRIME</div>
        <div className="scan-line-item">ORBIT: STABLE · ALT: 842 KM</div>
        <div className="scan-line-item scan-blink">COLONY STATUS: OPERATIONAL</div>
      </div>

      <style>{`
        .planet-scene-root {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 1;
        }

        /* Vignette frame — darkens the corners to simulate cockpit window */
        .cockpit-window {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            ellipse 70% 65% at 60% 50%,
            transparent 55%,
            rgba(4, 6, 14, 0.6) 75%,
            rgba(4, 6, 14, 0.95) 100%
          );
          z-index: 10;
          pointer-events: none;
        }

        /* Planet */
        .planet-body {
          position: absolute;
          width: 62vh;
          height: 62vh;
          border-radius: 50%;
          /* Base planet: deep blue-teal */
          background: radial-gradient(
            circle at 38% 35%,
            #1a5c8a 0%,
            #1a3a5c 30%,
            #0f2340 55%,
            #091830 100%
          );
          /* Landmass patches */
          box-shadow:
            inset -18px -12px 40px rgba(0,0,0,0.5),
            inset 10px 8px 30px rgba(26, 74, 58, 0.35),
            0 0 60px rgba(56, 189, 248, 0.18),
            0 0 120px rgba(56, 189, 248, 0.08);
          /* Position: center-right */
          top: 50%;
          left: 60%;
          transform: translate(-50%, -50%);
          overflow: hidden;
        }

        /* Atmosphere glow ring (outside the planet) */
        .planet-atmosphere {
          position: absolute;
          inset: -8px;
          border-radius: 50%;
          background: transparent;
          box-shadow:
            0 0 0 8px rgba(96, 211, 255, 0.06),
            0 0 0 18px rgba(56, 189, 248, 0.04),
            0 0 0 35px rgba(56, 189, 248, 0.02);
          pointer-events: none;
        }

        /* Cloud / landmass patches */
        .cloud {
          position: absolute;
          border-radius: 50%;
          opacity: 0.18;
        }
        .cloud-1 {
          width: 55%;
          height: 30%;
          top: 20%;
          left: 15%;
          background: radial-gradient(ellipse, rgba(26,74,58,0.9) 0%, transparent 70%);
          transform: rotate(-15deg);
        }
        .cloud-2 {
          width: 40%;
          height: 25%;
          top: 55%;
          left: 45%;
          background: radial-gradient(ellipse, rgba(26,74,58,0.9) 0%, transparent 70%);
          transform: rotate(10deg);
        }
        .cloud-3 {
          width: 30%;
          height: 20%;
          top: 35%;
          left: 58%;
          background: radial-gradient(ellipse, rgba(180,220,255,0.4) 0%, transparent 70%);
        }

        /* Terminator — day/night divide */
        .planet-terminator {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(0,0,0,0.25) 55%,
            rgba(0,0,0,0.65) 100%
          );
        }

        /* Colony base — positioned at 7 o'clock (~215 deg on the planet circle) */
        .colony-base {
          position: absolute;
          /* 7 o'clock = bottom-left quadrant */
          bottom: 14%;
          left: 16%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }

        .colony-buildings {
          display: flex;
          align-items: flex-end;
          gap: 2px;
        }

        .building {
          background: rgba(180, 220, 255, 0.75);
          border-radius: 1px 1px 0 0;
        }
        .building-left  { width: 4px; height: 7px; }
        .building-center { width: 6px; height: 11px; }
        .building-right { width: 4px; height: 6px; }

        .landing-pad {
          width: 20px;
          height: 2px;
          background: rgba(180, 220, 255, 0.6);
          border-radius: 1px;
        }

        /* Blinking lights */
        .blink-light {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: #ff6b6b;
          transition: opacity 0.15s;
        }
        .blink-a { top: 4px; left: 4px; }
        .blink-b { top: 2px; left: 50%; background: #60a5fa; }
        .blink-c { top: 5px; right: 2px; background: #4ade80; }

        /* Colony label */
        .colony-label {
          margin-top: 3px;
          font-size: 5px;
          letter-spacing: 0.05em;
          color: rgba(148, 210, 255, 0.8);
          white-space: nowrap;
          font-family: var(--font-mono, monospace);
          text-shadow: 0 0 4px rgba(96, 165, 250, 0.8);
        }

        /* HUD crosshair */
        .hud-crosshair {
          position: absolute;
          top: 50%;
          left: 60%;
          transform: translate(-50%, -50%);
          width: 62vh;
          height: 62vh;
          pointer-events: none;
          z-index: 11;
        }
        .crosshair-h {
          position: absolute;
          top: 50%;
          left: -8px;
          right: -8px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.2) 30%, rgba(56,189,248,0.2) 70%, transparent);
        }
        .crosshair-v {
          position: absolute;
          left: 50%;
          top: -8px;
          bottom: -8px;
          width: 1px;
          background: linear-gradient(180deg, transparent, rgba(56,189,248,0.2) 30%, rgba(56,189,248,0.2) 70%, transparent);
        }
        .crosshair-ring {
          position: absolute;
          inset: 20%;
          border: 1px solid rgba(56,189,248,0.1);
          border-radius: 50%;
        }

        /* Scan readout */
        .scan-readout {
          position: absolute;
          bottom: 22%;
          left: calc(60% - 31vh - 10px);
          transform: translateX(-100%);
          display: flex;
          flex-direction: column;
          gap: 2px;
          z-index: 12;
        }
        .scan-line-item {
          font-size: 9px;
          letter-spacing: 0.12em;
          color: rgba(96, 165, 250, 0.6);
          font-family: var(--font-mono, monospace);
          text-transform: uppercase;
        }
        @keyframes scan-blink-anim {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.2; }
        }
        .scan-blink {
          animation: scan-blink-anim 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
