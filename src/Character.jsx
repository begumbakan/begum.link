import { useEffect, useRef, useState } from 'react'

const FRAMES = [
  '/images/littlebegum1.png',
  '/images/littlebegum2.png',
  '/images/littlebegum3.png',
  '/images/littlebegum4.png',
]
const SPEED = 300
const FRAME_INTERVAL = 150

export default function Character({ initialPos, autoTarget, zones, onZoneChange }) {
  const [pos, setPos] = useState(initialPos ?? { x: 100, y: 300 })
  const [frame, setFrame] = useState(0)
  const [moving, setMoving] = useState(false)
  const [autoWalking, setAutoWalking] = useState(!!autoTarget)
  const [activeFact, setActiveFact] = useState(null)
  const keys = useRef({})
  const animRef = useRef(null)
  const frameTimerRef = useRef(null)
  const lastTimeRef = useRef(null)
  const posRef = useRef(initialPos ?? { x: 100, y: 300 })
  const activeZoneId = useRef(null)

  useEffect(() => {
    const onKeyDown = (e) => {
      const key = e.key.toLowerCase()
      if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(key)) {
        e.preventDefault()
      }
      keys.current[key] = true
      setAutoWalking(false)
    }
    const onKeyUp = (e) => { keys.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    const loop = (timestamp) => {
      const delta = lastTimeRef.current ? (timestamp - lastTimeRef.current) / 1000 : 0
      lastTimeRef.current = timestamp
      const step = SPEED * delta

      if (autoWalking && autoTarget) {
        const p = posRef.current
        const diffX = autoTarget.x - p.x
        const diffY = autoTarget.y - p.y
        const dist = Math.sqrt(diffX * diffX + diffY * diffY)
        let newPos
        if (dist < step) {
          newPos = { x: autoTarget.x, y: autoTarget.y }
          setAutoWalking(false)
        } else {
          newPos = {
            x: p.x + (diffX / dist) * step,
            y: p.y + (diffY / dist) * step,
          }
        }
        posRef.current = newPos
        setPos(newPos)
        setMoving(true)
      } else {
        const k = keys.current
        const dx = (k['arrowright'] || k['d'] ? 1 : 0) - (k['arrowleft'] || k['a'] ? 1 : 0)
        const dy = (k['arrowdown']  || k['s'] ? 1 : 0) - (k['arrowup']   || k['w'] ? 1 : 0)
        const isMoving = dx !== 0 || dy !== 0
        setMoving(isMoving)

        if (isMoving) {
          const heroEl = document.querySelector('.hero')
          const heroPageBottom = heroEl
            ? heroEl.getBoundingClientRect().bottom + window.scrollY
            : 480
          const cur = posRef.current
          const newPos = {
            x: Math.max(0, Math.min(window.innerWidth - 80, cur.x + dx * step)),
            y: Math.max(heroPageBottom, Math.min(document.body.scrollHeight - 80, cur.y + dy * step)),
          }
          posRef.current = newPos
          setPos(newPos)
        }
      }

      if (zones?.length) {
        const cx = posRef.current.x + 40
        const cy = posRef.current.y + 40
        let found = null
        for (const zone of zones) {
          const inCard = cx >= zone.cardLeft && cx <= zone.cardRight &&
                         cy >= zone.cardTop && cy <= zone.cardBottom
          if (!inCard) continue
          const dist = Math.sqrt(
            Math.pow(cx - (zone.platformX + 40), 2) +
            Math.pow(cy - (zone.platformY + 40), 2)
          )
          if (dist < zone.radius) {
            found = zone
            break
          }
        }
        const newId = found?.id ?? null
        if (newId !== activeZoneId.current) {
          onZoneChange?.(activeZoneId.current, newId)
          activeZoneId.current = newId
          setActiveFact(found?.fact ?? null)
        }
      }

      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [autoWalking, autoTarget, zones])

  useEffect(() => {
    if (moving) {
      frameTimerRef.current = setInterval(() => {
        setFrame((f) => (f + 1) % FRAMES.length)
      }, FRAME_INTERVAL)
    } else {
      clearInterval(frameTimerRef.current)
      setFrame(0)
    }
    return () => clearInterval(frameTimerRef.current)
  }, [moving])

  const charCenterX = pos.x + 40
  const clampedLeft = Math.max(110, Math.min(charCenterX, window.innerWidth - 110))
  const tailOffset = Math.max(-70, Math.min(70, charCenterX - clampedLeft))

  return (
    <div style={{ position: 'absolute', left: pos.x, top: pos.y, width: 80, zIndex: 90 }}>
      {activeFact && (
        <div
          className="speech-bubble"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 8px)',
            left: clampedLeft - pos.x,
            transform: 'translateX(-50%)',
            zIndex: 91,
            '--tail-x': `calc(50% + ${tailOffset}px)`,
          }}
        >
          {activeFact}
        </div>
      )}
      <img
        src={FRAMES[frame]}
        alt="character"
        style={{
          width: 80,
          imageRendering: 'pixelated',
          userSelect: 'none',
          pointerEvents: 'none',
          display: 'block',
        }}
      />
    </div>
  )
}
