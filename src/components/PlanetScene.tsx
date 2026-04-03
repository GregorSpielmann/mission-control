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
      {/* Cockpit window vignette */}
      <div className="cockpit-window" />

      {/* Planet group */}
      <div className="planet-group">

        {/* Atmosphere halo — CSS layer outside the image */}
        <div className="planet-atmosphere" />

        {/* Orbital ring */}
        <div className="orbital-ring" />

        {/* Planet image — replaces all CSS gradient layers */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/planet3.png"
          alt="Adasight Prime"
          className="planet-img"
          draggable={false}
        />

        {/* Colony base at ~7 o'clock */}
        <div className="colony-base">
          <div className="landing-pad" />
          <div className="colony-buildings">
            <div className="building building-left" />
            <div className="building building-center" />
            <div className="building building-right" />
          </div>
          <div className="blink-light blink-a" ref={el => { if (el) blinkRef.current[0] = el }} />
          <div className="blink-light blink-b" ref={el => { if (el) blinkRef.current[1] = el }} />
          <div className="blink-light blink-c" ref={el => { if (el) blinkRef.current[2] = el }} />
          <div className="colony-label">ADASIGHT OUTPOST ALPHA — SECTOR 7</div>
        </div>
      </div>

      {/* Porthole window frame */}
      <div className="porthole-ring">
        <div className="porthole-glass" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
          <div key={i} className="porthole-bolt-arm" style={{ transform: `rotate(${deg}deg)` }}>
            <div className="porthole-bolt-dot" />
          </div>
        ))}
        <div className="porthole-label-tl">VIEWPORT-α</div>
        <div className="porthole-label-tr">SYS·OK</div>
      </div>

      {/* HUD crosshair */}
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

        /* Cockpit vignette */
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
        }

        /* Planet group anchor */
        .planet-group {
          position: absolute;
          top: 46%;
          left: 60%;
          transform: translate(-50%, -50%);
          width: 54vh;
          height: 54vh;
          z-index: 1;
        }

        /* Planet image — clip to circle, screen blend for shadow blending */
        .planet-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: contain;
          clip-path: circle(42% at 50% 50%);
          mix-blend-mode: screen;
          user-select: none;
          pointer-events: none;
        }

        /* Atmosphere halo */
        .planet-atmosphere {
          position: absolute;
          inset: -18px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 36% 32%,
            rgba(56, 160, 255, 0.04) 30%,
            transparent 65%
          );
          box-shadow:
            0 0 0 2px rgba(96, 200, 255, 0.18),
            0 0 0 8px rgba(56, 189, 248, 0.09),
            0 0 0 22px rgba(56, 189, 248, 0.04),
            0 0 0 48px rgba(56, 189, 248, 0.015);
          pointer-events: none;
        }

        /* Orbital ring */
        .orbital-ring {
          position: absolute;
          inset: -44px;
          border-radius: 50%;
          border: 1px solid rgba(56, 189, 248, 0.22);
          box-shadow:
            0 0 10px rgba(56, 189, 248, 0.12),
            inset 0 0 10px rgba(56, 189, 248, 0.05);
          transform: perspective(480px) rotateX(72deg);
          pointer-events: none;
        }

        /* Colony base */
        .colony-base {
          position: absolute;
          bottom: 18%;
          left: 18%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
          z-index: 2;
        }

        .colony-buildings {
          display: flex;
          align-items: flex-end;
          gap: 2px;
        }

        .building {
          background: rgba(200, 232, 255, 0.90);
          border-radius: 1px 1px 0 0;
          box-shadow: 0 0 5px rgba(150, 210, 255, 0.8);
        }
        .building-left   { width: 4px; height: 7px; }
        .building-center { width: 6px; height: 12px; }
        .building-right  { width: 4px; height: 6px; }

        .landing-pad {
          width: 22px;
          height: 2px;
          background: rgba(180, 220, 255, 0.80);
          border-radius: 1px;
          box-shadow: 0 0 5px rgba(100, 180, 255, 0.7);
        }

        .blink-light {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          transition: opacity 0.15s;
        }
        .blink-a { top: 4px; left: 4px;  background: #ff6b6b; }
        .blink-b { top: 2px; left: 50%;  background: #60a5fa; }
        .blink-c { top: 5px; right: 2px; background: #4ade80; }

        .colony-label {
          margin-top: 3px;
          font-size: 5px;
          letter-spacing: 0.05em;
          color: rgba(148, 210, 255, 0.95);
          white-space: nowrap;
          font-family: var(--font-mono, monospace);
          text-shadow: 0 0 5px rgba(96, 165, 250, 1);
        }

        /* HUD crosshair */
        .hud-crosshair {
          position: absolute;
          top: 46%;
          left: 60%;
          transform: translate(-50%, -50%);
          width: 54vh;
          height: 54vh;
          pointer-events: none;
          z-index: 11;
        }
        .crosshair-h {
          position: absolute;
          top: 50%; left: -8px; right: -8px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.2) 30%, rgba(56,189,248,0.2) 70%, transparent);
        }
        .crosshair-v {
          position: absolute;
          left: 50%; top: -8px; bottom: -8px;
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
          bottom: 24%;
          left: calc(60% - 27vh - 10px);
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
          50%       { opacity: 0.2; }
        }
        .scan-blink {
          animation: scan-blink-anim 2s ease-in-out infinite;
        }

        /* ─── Porthole frame ─── */
        .porthole-ring {
          position: absolute;
          top: 46%;
          left: 60%;
          transform: translate(-50%, -50%);
          width: calc(54vh + 64px);
          height: calc(54vh + 64px);
          border-radius: 50%;
          border: 28px solid transparent;
          background:
            /* interior: transparent so planet shows through */
            transparent padding-box,
            /* border face: dark gunmetal with blue-steel sheen */
            linear-gradient(135deg,
              rgba(22,38,62,0.98) 0%,
              rgba(8,14,26,0.98) 30%,
              rgba(18,32,52,0.98) 55%,
              rgba(8,14,26,0.98) 75%,
              rgba(22,38,62,0.98) 100%
            ) border-box;
          box-shadow:
            /* outer glow */
            0 0 0 1px rgba(56,189,248,0.12),
            0 0 18px rgba(56,189,248,0.08),
            /* inner shadow depth */
            inset 0 0 0 2px rgba(0,0,0,0.7),
            inset 0 0 12px rgba(0,0,0,0.8),
            /* rim bevel highlight */
            inset 0 2px 4px rgba(120,180,255,0.15),
            /* subtle drop shadow */
            0 8px 40px rgba(0,0,0,0.5);
          z-index: 3;
          pointer-events: none;
        }

        /* subtle glass shimmer inside the ring */
        .porthole-glass {
          position: absolute;
          inset: -28px;
          border-radius: 50%;
          background: radial-gradient(
            ellipse 60% 40% at 30% 25%,
            rgba(120,180,255,0.04) 0%,
            transparent 60%
          );
          pointer-events: none;
        }

        /* bolt / rivet details — arm rotates from center, dot sits at ring edge */
        .porthole-bolt-arm {
          position: absolute;
          inset: 0;
          border-radius: 50%;
        }
        .porthole-bolt-dot {
          position: absolute;
          top: 10px;          /* center of 28px border */
          left: 50%;
          transform: translateX(-50%);
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: radial-gradient(circle at 35% 35%, #3a5070, #0d1825);
          box-shadow:
            0 0 0 1px rgba(56,189,248,0.22),
            inset 0 1px 2px rgba(120,180,255,0.3),
            inset 0 -1px 2px rgba(0,0,0,0.6);
        }

        /* corner text labels on the ring */
        .porthole-label-tl,
        .porthole-label-tr {
          position: absolute;
          font-size: 6px;
          letter-spacing: 0.15em;
          font-family: var(--font-mono, monospace);
          color: rgba(96,165,250,0.5);
          pointer-events: none;
        }
        .porthole-label-tl { top: 12px; left: 22px; }
        .porthole-label-tr { top: 12px; right: 22px; }
      `}</style>
    </div>
  )
}
