import { motion } from 'motion/react'
import { useEffect, useRef } from 'react'

const GAP = 36 // distance between dots (px)
const DOT_R = 1.1 // dot radius
const DOT_A = 0.16 // dot opacity
const RADIUS = 150 // how far the cursor's influence reaches
const PUSH = 18 // how far a dot right next to the cursor is pushed (px)
const STIFFNESS = 0.08 // spring pull towards the target position
const DAMPING = 0.8 // lower = more wobble on the way back
const TAU = Math.PI * 2

/**
 * A faint dot grid whose dots drift away from the cursor and spring back.
 * Every dot keeps the same size and colour; only its position animates.
 * It only redraws while something is moving, and stays static for reduced-motion users.
 */
export function DotGrid({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const host = canvas?.closest('section') ?? canvas?.parentElement
    if (!canvas || !ctx || !host) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const readColor = () => getComputedStyle(canvas).getPropertyValue('--t-fg').trim() || '#000'
    let color = readColor()

    let w = 0
    let h = 0
    let dpr = 1
    let count = 0
    // Per-dot state: resting position, current offset, velocity.
    let bx = new Float32Array(0)
    let by = new Float32Array(0)
    let ox = new Float32Array(0)
    let oy = new Float32Array(0)
    let vx = new Float32Array(0)
    let vy = new Float32Array(0)

    let px = 0 // pointer position
    let py = 0
    let target = 0 // 1 while the pointer is over the hero
    let strength = 0
    let raf = 0

    const build = () => {
      const startX = (w % GAP) / 2 + GAP / 2
      const startY = (h % GAP) / 2 + GAP / 2
      const cols = Math.max(0, Math.ceil((w - startX) / GAP))
      const rows = Math.max(0, Math.ceil((h - startY) / GAP))
      count = cols * rows
      bx = new Float32Array(count)
      by = new Float32Array(count)
      ox = new Float32Array(count)
      oy = new Float32Array(count)
      vx = new Float32Array(count)
      vy = new Float32Array(count)
      let i = 0
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++, i++) {
          bx[i] = startX + c * GAP
          by[i] = startY + r * GAP
        }
      }
    }

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = color
      ctx.globalAlpha = DOT_A
      ctx.beginPath()
      for (let i = 0; i < count; i++) {
        const x = bx[i] + ox[i]
        const y = by[i] + oy[i]
        ctx.moveTo(x + DOT_R, y)
        ctx.arc(x, y, DOT_R, 0, TAU)
      }
      ctx.fill()
    }

    const tick = () => {
      raf = 0
      strength += (target - strength) * 0.1
      if (Math.abs(target - strength) < 0.003) strength = target

      const r2 = RADIUS * RADIUS
      let moving = strength !== target

      for (let i = 0; i < count; i++) {
        // Where this dot wants to be: pushed straight away from the cursor.
        let gx = 0
        let gy = 0
        if (strength > 0) {
          const dx = bx[i] - px
          const dy = by[i] - py
          const d2 = dx * dx + dy * dy
          if (d2 < r2 && d2 > 0.01) {
            const d = Math.sqrt(d2)
            let t = 1 - d / RADIUS
            t = t * t * (3 - 2 * t) // smoothstep falloff
            const push = PUSH * t * strength
            gx = (dx / d) * push
            gy = (dy / d) * push
          }
        }

        vx[i] = (vx[i] + (gx - ox[i]) * STIFFNESS) * DAMPING
        vy[i] = (vy[i] + (gy - oy[i]) * STIFFNESS) * DAMPING
        ox[i] += vx[i]
        oy[i] += vy[i]

        if (
          Math.abs(vx[i]) > 0.01 ||
          Math.abs(vy[i]) > 0.01 ||
          Math.abs(gx - ox[i]) > 0.05 ||
          Math.abs(gy - oy[i]) > 0.05
        ) {
          moving = true
        }
      }

      draw()
      if (moving) raf = requestAnimationFrame(tick)
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    const onMove = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect()
      px = e.clientX - r.left
      py = e.clientY - r.top
      target = 1
      kick()
    }

    const onLeave = () => {
      target = 0
      kick()
    }

    // Touch and pen have no hover, so let the dots settle when the finger lifts.
    const onUp = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') onLeave()
    }

    const resize = () => {
      const r = canvas.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = r.width
      h = r.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      build()
      draw()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()

    // Recolour the dots when the visitor switches theme.
    const mo = new MutationObserver(() => {
      color = readColor()
      draw()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    if (!reduce) {
      host.addEventListener('pointermove', onMove)
      host.addEventListener('pointerleave', onLeave)
      host.addEventListener('pointerup', onUp)
      host.addEventListener('pointercancel', onLeave)
    }

    return () => {
      ro.disconnect()
      mo.disconnect()
      cancelAnimationFrame(raf)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
      host.removeEventListener('pointerup', onUp)
      host.removeEventListener('pointercancel', onLeave)
    }
  }, [])

  return (
    <motion.canvas
      ref={canvasRef}
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.4, delay: 0.2 }}
      className={`pointer-events-none absolute inset-0 size-full ${className}`}
    />
  )
}
