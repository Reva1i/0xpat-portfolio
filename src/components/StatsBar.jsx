import { useRef, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { STATS } from '../utils/data'
import CountUp from './CountUp'
import GradientText from './GradientText'

const DELTAS = [
  '↑ Peak Oct 2025',
  '↑ +$3M growth',
  '↑ $1.2M generated',
  '↑ –214K → +26K CAKE',
]

// ─── 1. Bar Chart (Volume) — grows up, shrinks down, loops ───────────────────
function BarChartViz({ inView }) {
  const canvasRef = useRef(null)
  const startedRef = useRef(false)
  const rafRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true
    const cv = canvasRef.current
    if (!cv) return

    // Crisp on retina displays
    const dpr = window.devicePixelRatio || 1
    cv.width = 52 * dpr
    cv.height = 28 * dpr
    cv.style.width = '52px'
    cv.style.height = '28px'
    const ctx = cv.getContext('2d')
    ctx.scale(dpr, dpr)

    const heights = [7, 11, 15, 12, 22, 17, 26]
    const w = 5, gap = 2, base = 27
    const total = heights.length
    const current = new Array(total).fill(0)

    function redrawAll() {
      ctx.clearRect(0, 0, 52, 28)
      for (let j = 0; j < total; j++) {
        const h = current[j]
        if (h <= 0) continue
        const x = j * (w + gap)
        const isPeak = j === total - 1
        const ratio = heights[j] / heights[total - 1]
        if (isPeak) { ctx.shadowColor = '#40D6E1'; ctx.shadowBlur = 8 }
        ctx.fillStyle = isPeak ? '#40D6E1' : `rgba(64,214,225,${(0.25 + ratio * 0.4).toFixed(2)})`
        ctx.beginPath()
        if (ctx.roundRect) ctx.roundRect(x, base - h, w, h, 1)
        else ctx.rect(x, base - h, w, h)
        ctx.fill()
        ctx.shadowBlur = 0
      }
    }

    function growPhase() {
      let i = 0
      function nextBar() {
        if (i >= total) { timerRef.current = setTimeout(shrinkPhase, 1800); return }
        const idx = i
        const target = heights[idx]
        function growStep() {
          current[idx] = Math.min(current[idx] + 1, target)
          redrawAll()
          if (current[idx] < target) rafRef.current = requestAnimationFrame(growStep)
          else { i++; timerRef.current = setTimeout(nextBar, 85) }
        }
        rafRef.current = requestAnimationFrame(growStep)
      }
      nextBar()
    }

    function shrinkPhase() {
      function shrinkStep() {
        let anyAlive = false
        for (let j = 0; j < total; j++) {
          if (current[j] > 0) { current[j] = Math.max(current[j] - 2, 0); if (current[j] > 0) anyAlive = true }
        }
        redrawAll()
        if (anyAlive) rafRef.current = requestAnimationFrame(shrinkStep)
        else timerRef.current = setTimeout(growPhase, 400)
      }
      rafRef.current = requestAnimationFrame(shrinkStep)
    }

    growPhase()
    return () => { cancelAnimationFrame(rafRef.current); clearTimeout(timerRef.current) }
  }, [inView])

  return <canvas ref={canvasRef} width={52} height={28} style={{ flexShrink: 0, paddingBottom: '2px' }} />
}

// ─── 2. Traveling Dot Line Chart (TVL) — loops ───────────────────────────────
function LineChartViz({ inView }) {
  const svgRef = useRef(null)
  const startedRef = useRef(false)
  const timerRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true

    const ns = 'http://www.w3.org/2000/svg'
    const pts = [
      { x: 0, y: 24 }, { x: 10, y: 20 }, { x: 22, y: 15 },
      { x: 34, y: 10 }, { x: 44, y: 6 }, { x: 56, y: 2 },
    ]

    let totalLen = 0
    for (let i = 1; i < pts.length; i++) {
      const dx = pts[i].x - pts[i - 1].x, dy = pts[i].y - pts[i - 1].y
      totalLen += Math.sqrt(dx * dx + dy * dy)
    }

    function ptAt(t) {
      const tgt = t * totalLen; let acc = 0
      for (let i = 1; i < pts.length; i++) {
        const dx = pts[i].x - pts[i - 1].x, dy = pts[i].y - pts[i - 1].y
        const s = Math.sqrt(dx * dx + dy * dy)
        if (acc + s >= tgt) { const f = (tgt - acc) / s; return { x: pts[i - 1].x + dx * f, y: pts[i - 1].y + dy * f } }
        acc += s
      }
      return pts[pts.length - 1]
    }

    function runCycle() {
      const svg = svgRef.current
      if (!svg) return
      svg.innerHTML = ''
      svg.style.opacity = '1'

      const defs = document.createElementNS(ns, 'defs')
      defs.innerHTML = `<filter id="glow_tvl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>`
      svg.appendChild(defs)

      const area = document.createElementNS(ns, 'polygon')
      area.setAttribute('points', [...pts, { x: 56, y: 28 }, { x: 0, y: 28 }].map(p => `${p.x},${p.y}`).join(' '))
      area.setAttribute('fill', 'rgba(64,214,225,0.10)')
      area.style.opacity = '0'
      svg.appendChild(area)

      const line = document.createElementNS(ns, 'polyline')
      line.setAttribute('points', pts.map(p => `${p.x},${p.y}`).join(' '))
      line.setAttribute('stroke', '#40D6E1')
      line.setAttribute('stroke-width', '1.5')
      line.setAttribute('stroke-linecap', 'round')
      line.setAttribute('fill', 'none')
      line.style.strokeDasharray = totalLen
      line.style.strokeDashoffset = totalLen
      svg.appendChild(line)

      const dot = document.createElementNS(ns, 'circle')
      dot.setAttribute('r', '3'); dot.setAttribute('fill', '#40D6E1')
      dot.setAttribute('filter', 'url(#glow_tvl)')
      dot.setAttribute('cx', pts[0].x); dot.setAttribute('cy', pts[0].y)
      svg.appendChild(dot)

      const endDot = document.createElementNS(ns, 'circle')
      const lp = pts[pts.length - 1]
      endDot.setAttribute('r', '2.5'); endDot.setAttribute('fill', '#40D6E1')
      endDot.setAttribute('cx', lp.x); endDot.setAttribute('cy', lp.y)
      endDot.style.opacity = '0'
      svg.appendChild(endDot)

      const DUR = 1100; let st = null
      rafRef.current = requestAnimationFrame(function fr(ts) {
        if (!st) st = ts
        const t = Math.min((ts - st) / DUR, 1)
        const e = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
        line.style.strokeDashoffset = totalLen * (1 - e)
        const p = ptAt(e); dot.setAttribute('cx', p.x); dot.setAttribute('cy', p.y)
        if (t < 1) {
          rafRef.current = requestAnimationFrame(fr)
        } else {
          dot.style.opacity = '0'; endDot.style.opacity = '1'
          area.style.transition = 'opacity 0.4s ease'; area.style.opacity = '1'
          let pc = 0
          function pulse() {
            if (pc >= 2) {
              // Fade out and restart
              timerRef.current = setTimeout(() => {
                svg.style.transition = 'opacity 0.5s ease'
                svg.style.opacity = '0'
                timerRef.current = setTimeout(runCycle, 600)
              }, 1600)
              return
            }
            timerRef.current = setTimeout(() => {
              endDot.setAttribute('r', '4.5')
              timerRef.current = setTimeout(() => { endDot.setAttribute('r', '2.5'); pc++; pulse() }, 250)
            }, 50)
          }
          pulse()
        }
      })
    }

    runCycle()
    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(timerRef.current)
    }
  }, [inView])

  return <svg ref={svgRef} width={56} height={28} viewBox="0 0 56 28" fill="none" style={{ flexShrink: 0, paddingBottom: '3px' }} />
}

// ─── 3. Coin Stack (Revenue) — loops ─────────────────────────────────────────
function CoinStackViz({ inView }) {
  const svgRef = useRef(null)
  const startedRef = useRef(false)
  const timerRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true

    const ns = 'http://www.w3.org/2000/svg'
    const coinDefs = [
      { cy: 30, color: '#b8860b', dark: '#6B4F0A' },
      { cy: 22, color: '#DAA520', dark: '#b8860b' },
      { cy: 14, color: '#FFD700', dark: '#DAA520' },
    ]

    function runCycle() {
      const svg = svgRef.current
      if (!svg) return
      svg.innerHTML = ''
      svg.style.opacity = '1'

      const groups = []
      coinDefs.forEach(c => {
        const g = document.createElementNS(ns, 'g')
        g.style.opacity = '0'
        const edge = document.createElementNS(ns, 'ellipse')
        edge.setAttribute('cx', '24'); edge.setAttribute('cy', String(c.cy + 2.5))
        edge.setAttribute('rx', '13'); edge.setAttribute('ry', '4.5')
        edge.setAttribute('fill', c.dark)
        g.appendChild(edge)
        const top = document.createElementNS(ns, 'ellipse')
        top.setAttribute('cx', '24'); top.setAttribute('cy', String(c.cy))
        top.setAttribute('rx', '13'); top.setAttribute('ry', '4.5')
        top.setAttribute('fill', c.color)
        g.appendChild(top)
        svg.appendChild(g)
        groups.push(g)
      })

      const shimmer = document.createElementNS(ns, 'rect')
      shimmer.setAttribute('x', '11'); shimmer.setAttribute('y', '10')
      shimmer.setAttribute('width', '7'); shimmer.setAttribute('height', '6')
      shimmer.setAttribute('fill', 'rgba(255,255,255,0.55)')
      shimmer.setAttribute('rx', '1')
      shimmer.style.opacity = '0'
      svg.appendChild(shimmer)

      let i = 0
      function dropCoin() {
        if (i >= groups.length) {
          timerRef.current = setTimeout(() => {
            shimmer.style.opacity = '1'
            shimmer.style.transition = 'transform 0.5s ease-out, opacity 0.15s'
            shimmer.style.transform = 'translateX(20px)'
            timerRef.current = setTimeout(() => {
              shimmer.style.opacity = '0'
              // Fade out all, then restart
              timerRef.current = setTimeout(() => {
                svg.style.transition = 'opacity 0.5s ease'
                svg.style.opacity = '0'
                timerRef.current = setTimeout(runCycle, 600)
              }, 1200)
            }, 380)
          }, 120)
          return
        }
        const g = groups[i]
        g.style.opacity = '1'
        const DROP = 14; let start = null; const DUR = 260
        rafRef.current = requestAnimationFrame(function fr(ts) {
          if (!start) start = ts
          const t = Math.min((ts - start) / DUR, 1)
          const e = t < 0.75 ? (t / 0.75) : 1 - Math.sin(((t - 0.75) / 0.25) * Math.PI) * 0.1
          g.setAttribute('transform', `translate(0, ${DROP * (1 - e) * -1})`)
          if (t < 1) rafRef.current = requestAnimationFrame(fr)
          else g.setAttribute('transform', 'translate(0,0)')
        })
        i++
        timerRef.current = setTimeout(dropCoin, 210)
      }
      dropCoin()
    }

    runCycle()
    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(timerRef.current)
    }
  }, [inView])

  return <svg ref={svgRef} width={48} height={38} viewBox="0 0 48 38" fill="none" style={{ flexShrink: 0 }} />
}

// ─── 4. Red Shrink → Green Grow (Profitability) — loops ──────────────────────
function FlipBarViz({ inView }) {
  const canvasRef = useRef(null)
  const startedRef = useRef(false)
  const timerRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true
    const cv = canvasRef.current
    if (!cv) return
    const ctx = cv.getContext('2d')

    const base = 26, maxH = 22, w = 16, gap = 6
    const xR = 4, xG = xR + w + gap

    function runCycle() {
      let phase = 0, prog = 0, last = null

      function draw() {
        ctx.clearRect(0, 0, 52, 30)
        ctx.font = '7px Courier New'
        ctx.textAlign = 'center'

        if (phase === 0) {
          const rh = maxH * (1 - prog)
          if (rh > 0.5) {
            ctx.fillStyle = 'rgba(239,68,68,0.75)'
            ctx.beginPath()
            if (ctx.roundRect) ctx.roundRect(xR, base - rh, w, rh, 1)
            else ctx.rect(xR, base - rh, w, rh)
            ctx.fill()
            ctx.fillStyle = '#ef4444'
            ctx.fillText('–', xR + w / 2, base - rh - 2)
          }
        }

        if (phase === 1) {
          const gh = maxH * prog
          if (gh > 0.5) {
            ctx.shadowColor = '#22c55e'
            ctx.shadowBlur = prog > 0.35 ? 10 : 0
            ctx.fillStyle = prog > 0.35 ? '#22c55e' : 'rgba(34,197,94,0.7)'
            ctx.beginPath()
            if (ctx.roundRect) ctx.roundRect(xG, base - gh, w, gh, 1)
            else ctx.rect(xG, base - gh, w, gh)
            ctx.fill()
            ctx.shadowBlur = 0
            if (prog > 0.2) {
              ctx.fillStyle = '#22c55e'
              ctx.fillText('+', xG + w / 2, base - gh - 2)
            }
          }
        }
      }

      function step(ts) {
        if (!last) last = ts
        const dt = (ts - last) / 480
        last = ts
        prog = Math.min(prog + dt, 1)

        if (phase === 0 && prog >= 1) {
          phase = 1; prog = 0; last = null
          draw()
          timerRef.current = setTimeout(() => rafRef.current = requestAnimationFrame(step), 100)
          return
        }
        draw()
        if (phase === 1 && prog >= 1) {
          // Hold then restart
          timerRef.current = setTimeout(runCycle, 2000)
        } else {
          rafRef.current = requestAnimationFrame(step)
        }
      }
      rafRef.current = requestAnimationFrame(step)
    }

    runCycle()
    return () => {
      cancelAnimationFrame(rafRef.current)
      clearTimeout(timerRef.current)
    }
  }, [inView])

  return <canvas ref={canvasRef} width={52} height={28} style={{ flexShrink: 0, paddingBottom: '2px' }} />
}

// ─── Viz map ──────────────────────────────────────────────────────────────────
const VIZ = [BarChartViz, LineChartViz, CoinStackViz, FlipBarViz]

// ─── StatItem ─────────────────────────────────────────────────────────────────
function StatItem({ stat, index }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const VizComponent = VIZ[index]

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, delay: index * 0.08, ease: 'easeOut' }}
      data-testid={`stat-item-${index}`}
      style={{
        background: '#0e0e0e',
        padding: '18px 20px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}
    >
      <div style={{
        fontSize: '10px',
        fontFamily: 'JetBrains Mono, monospace',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        color: '#555555',
        marginBottom: '10px',
      }}>
        {stat.label}
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '10px' }}>
        <GradientText
          colors={['#ffffff', '#7c3aed', '#40D6E1', '#ffffff']}
          animationSpeed={6}
          pauseOnHover={true}
          className="font-mono text-5xl font-semibold leading-none"
        >
          {stat.prefix}
          <CountUp from={0} to={stat.value} duration={2} startWhen={inView} />
          {stat.unit}
        </GradientText>
        <div style={{ paddingBottom: '4px' }}>
          <VizComponent inView={inView} />
        </div>
      </div>

      <div style={{
        fontSize: '13px',
        fontFamily: 'JetBrains Mono, monospace',
        color: '#22c55e',
      }}>
        {DELTAS[index]}
      </div>
    </motion.div>
  )
}

// ─── StatsBar ─────────────────────────────────────────────────────────────────
export default function StatsBar() {
  return (
    <section
      className="w-full overflow-x-auto"
      style={{
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.06)',
      }}
    >
      <div
        className="min-w-max sm:min-w-0 sm:grid sm:grid-cols-4"
        style={{ gap: '1px' }}
      >
        {STATS.map((stat, i) => (
          <StatItem key={stat.label} stat={stat} index={i} />
        ))}
      </div>
    </section>
  )
}
