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

      {/* Planet group — atmosphere + orbital ring + body all centered here */}
      <div className="planet-group">

        {/* Outer atmosphere halo (sibling of planet-body so it's not clipped) */}
        <div className="planet-atmosphere" />

        {/* Orbital ring */}
        <div className="orbital-ring" />

        {/* Planet body */}
        <div className="planet-body">

          {/* Animated surface / continents */}
          <div className="planet-surface" />

          {/* Ice caps */}
          <div className="ice-north" />
          <div className="ice-south" />

          {/* Day / night terminator */}
          <div className="planet-terminator" />

          {/* City lights in shadow zone */}
          <div className="city-lights" />

          {/* Inner atmosphere rim (lit-side glow) */}
          <div className="atmo-rim" />

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

        /* Anchor for all planet elements */
        .planet-group {
          position: absolute;
          top: 46%;
          left: 60%;
          transform: translate(-50%, -50%);
          width: 54vh;
          height: 54vh;
          z-index: 1;
        }

        /* Atmosphere halo — sits outside planet-body so it's not clipped */
        .planet-atmosphere {
          position: absolute;
          inset: -22px;
          border-radius: 50%;
          background: radial-gradient(
            circle at 36% 32%,
            rgba(96, 211, 255, 0.06) 30%,
            transparent 65%
          );
          box-shadow:
            0 0 0 2px rgba(96, 211, 255, 0.16),
            0 0 0 8px rgba(56, 189, 248, 0.08),
            0 0 0 20px rgba(56, 189, 248, 0.04),
            0 0 0 45px rgba(56, 189, 248, 0.015);
          pointer-events: none;
        }

        /* Orbital ring — tilted ellipse via CSS perspective */
        .orbital-ring {
          position: absolute;
          inset: -44px;
          border-radius: 50%;
          border: 1px solid rgba(56, 189, 248, 0.2);
          box-shadow:
            0 0 10px rgba(56, 189, 248, 0.1),
            inset 0 0 10px rgba(56, 189, 248, 0.05);
          transform: perspective(480px) rotateX(72deg);
          pointer-events: none;
        }

        /* Planet body */
        .planet-body {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          overflow: hidden;
          background: radial-gradient(
            circle at 36% 32%,
            #1d6899 0%,
            #193d62 25%,
            #0f2848 52%,
            #071830 100%
          );
          box-shadow:
            inset -22px -16px 50px rgba(0, 0, 0, 0.65),
            inset 6px 6px 24px rgba(147, 210, 255, 0.06),
            0 0 50px rgba(56, 189, 248, 0.18),
            0 0 100px rgba(56, 189, 248, 0.08);
        }

        /* Surface layer — wider than planet so it can drift */
        @keyframes planet-drift {
          0%   { transform: translateX(0%); }
          100% { transform: translateX(-16%); }
        }

        .planet-surface {
          position: absolute;
          top: -5%;
          left: -5%;
          width: 130%;
          height: 110%;
          animation: planet-drift 100s ease-in-out infinite alternate;
          background:
            radial-gradient(ellipse 30% 18% at 18% 38%, rgba(38, 118, 75, 0.55) 0%, transparent 65%),
            radial-gradient(ellipse 22% 30% at 50% 22%, rgba(44, 132, 84, 0.50) 0%, transparent 65%),
            radial-gradient(ellipse 38% 16% at 80% 50%, rgba(38, 118, 75, 0.50) 0%, transparent 65%),
            radial-gradient(ellipse 16% 22% at 38% 70%, rgba(38, 118, 75, 0.45) 0%, transparent 65%),
            radial-gradient(ellipse 14% 10% at 95% 28%, rgba(44, 132, 84, 0.40) 0%, transparent 65%),
            radial-gradient(ellipse 10% 16% at 10% 72%, rgba(38, 118, 75, 0.35) 0%, transparent 65%);
        }

        /* Polar ice caps — thin bands, not glowing blobs */
        .ice-north {
          position: absolute;
          top: 0%;
          left: 22%;
          width: 56%;
          height: 14%;
          border-radius: 50%;
          background: radial-gradient(ellipse at 50% 80%, rgba(215, 238, 255, 0.40) 0%, transparent 70%);
        }
        .ice-south {
          position: absolute;
          bottom: 0%;
          left: 28%;
          width: 44%;
          height: 10%;
          border-radius: 50%;
          background: radial-gradient(ellipse at 50% 20%, rgba(215, 238, 255, 0.30) 0%, transparent 70%);
        }

        /* Terminator — day/night divide */
        .planet-terminator {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            108deg,
            transparent 36%,
            rgba(0, 0, 0, 0.16) 50%,
            rgba(0, 0, 0, 0.62) 100%
          );
        }

        /* City lights in shadow zone */
        .city-lights {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 72% 42%, rgba(255, 210, 120, 0.75) 0%, transparent 1.2%),
            radial-gradient(circle at 76% 51%, rgba(255, 210, 120, 0.65) 0%, transparent 1.0%),
            radial-gradient(circle at 80% 37%, rgba(255, 190, 80,  0.65) 0%, transparent 0.9%),
            radial-gradient(circle at 68% 59%, rgba(255, 210, 120, 0.55) 0%, transparent 0.9%),
            radial-gradient(circle at 84% 56%, rgba(255, 200, 100, 0.55) 0%, transparent 0.8%),
            radial-gradient(circle at 75% 62%, rgba(255, 190, 80,  0.45) 0%, transparent 0.8%),
            radial-gradient(circle at 70% 47%, rgba(255, 220, 140, 0.45) 0%, transparent 0.7%);
        }

        /* Inner rim — lit-side atmosphere highlight */
        .atmo-rim {
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 36% 32%,
            transparent 74%,
            rgba(96, 195, 255, 0.10) 84%,
            rgba(96, 195, 255, 0.22) 94%,
            rgba(96, 195, 255, 0.05) 100%
          );
        }

        /* Colony base */
        .colony-base {
          position: absolute;
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
          background: rgba(200, 232, 255, 0.88);
          border-radius: 1px 1px 0 0;
          box-shadow: 0 0 4px rgba(150, 210, 255, 0.7);
        }
        .building-left   { width: 4px; height: 7px; }
        .building-center { width: 6px; height: 12px; }
        .building-right  { width: 4px; height: 6px; }

        .landing-pad {
          width: 22px;
          height: 2px;
          background: rgba(180, 220, 255, 0.75);
          border-radius: 1px;
          box-shadow: 0 0 5px rgba(100, 180, 255, 0.6);
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
          color: rgba(148, 210, 255, 0.9);
          white-space: nowrap;
          font-family: var(--font-mono, monospace);
          text-shadow: 0 0 5px rgba(96, 165, 250, 0.9);
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
          top: 50%;
          left: -8px; right: -8px;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(56,189,248,0.2) 30%, rgba(56,189,248,0.2) 70%, transparent);
        }
        .crosshair-v {
          position: absolute;
          left: 50%;
          top: -8px; bottom: -8px;
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
      `}</style>
    </div>
  )
}
