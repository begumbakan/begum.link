import { useEffect, useRef, useState, useCallback } from 'react'
import SpeechBubble from './SpeechBubble'

const FRAMES = [
  '/images/littlebegum/1.png',
  '/images/littlebegum/2.png',
  '/images/littlebegum/1.png',
  '/images/littlebegum/3.png',
]
const SPEED = 300
const FRAME_INTERVAL = 150
const HISTORY_LEN = 300
const JOYSTICK_RADIUS = 44

export default function Character({ initialPos, autoTarget, zones, onZoneChange, showBlindBoxTeaser, onBlindBoxOpen, followers = [] }) {
  const [pos, setPos] = useState(initialPos ?? { x: 100, y: 300 })
  const [frame, setFrame] = useState(0)
  const [moving, setMoving] = useState(false)
  const [autoWalking, setAutoWalking] = useState(!!autoTarget)
  const [activeFact, setActiveFact] = useState(null)
  const [joystickHandle, setJoystickHandle] = useState({ x: 0, y: 0 })
  const keys = useRef({})
  const animRef = useRef(null)
  const frameTimerRef = useRef(null)
  const lastTimeRef = useRef(null)
  const posRef = useRef(initialPos ?? { x: 100, y: 300 })
  const activeZoneId = useRef(null)
  const posHistoryRef = useRef([])
  const joystickRef = useRef({ x: 0, y: 0 })
  const joystickBaseRef = useRef(null)
  const joystickTouchId = useRef(null)

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

  const updateJoystick = useCallback((touch) => {
    const el = joystickBaseRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const rawDx = touch.clientX - cx
    const rawDy = touch.clientY - cy
    const dist = Math.sqrt(rawDx * rawDx + rawDy * rawDy)
    if (dist === 0) {
      joystickRef.current = { x: 0, y: 0 }
      setJoystickHandle({ x: 0, y: 0 })
      return
    }
    const scale = Math.min(dist, JOYSTICK_RADIUS) / dist
    const clampedX = rawDx * scale
    const clampedY = rawDy * scale
    joystickRef.current = { x: clampedX / JOYSTICK_RADIUS, y: clampedY / JOYSTICK_RADIUS }
    setJoystickHandle({ x: clampedX, y: clampedY })
  }, [])

  const handleJoystickStart = useCallback((e) => {
    e.preventDefault()
    const touch = e.changedTouches[0]
    joystickTouchId.current = touch.identifier
    setAutoWalking(false)
    updateJoystick(touch)
  }, [updateJoystick])

  const handleJoystickMove = useCallback((e) => {
    e.preventDefault()
    for (const touch of e.changedTouches) {
      if (touch.identifier === joystickTouchId.current) {
        updateJoystick(touch)
        break
      }
    }
  }, [updateJoystick])

  const handleJoystickEnd = useCallback((e) => {
    for (const touch of e.changedTouches) {
      if (touch.identifier === joystickTouchId.current) {
        joystickRef.current = { x: 0, y: 0 }
        joystickTouchId.current = null
        setJoystickHandle({ x: 0, y: 0 })
        break
      }
    }
  }, [])

  useEffect(() => {
    const el = joystickBaseRef.current
    if (!el) return
    el.addEventListener('touchstart', handleJoystickStart, { passive: false })
    el.addEventListener('touchmove', handleJoystickMove, { passive: false })
    el.addEventListener('touchend', handleJoystickEnd)
    el.addEventListener('touchcancel', handleJoystickEnd)
    return () => {
      el.removeEventListener('touchstart', handleJoystickStart)
      el.removeEventListener('touchmove', handleJoystickMove)
      el.removeEventListener('touchend', handleJoystickEnd)
      el.removeEventListener('touchcancel', handleJoystickEnd)
    }
  }, [handleJoystickStart, handleJoystickMove, handleJoystickEnd])

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
        const jx = joystickRef.current.x
        const jy = joystickRef.current.y
        const kx = (k['arrowright'] || k['d'] ? 1 : 0) - (k['arrowleft'] || k['a'] ? 1 : 0)
        const ky = (k['arrowdown']  || k['s'] ? 1 : 0) - (k['arrowup']   || k['w'] ? 1 : 0)
        const combinedX = kx + jx
        const combinedY = ky + jy
        const len = Math.sqrt(combinedX * combinedX + combinedY * combinedY)
        const dx = len > 1 ? combinedX / len : combinedX
        const dy = len > 1 ? combinedY / len : combinedY
        const isMoving = len > 0.05
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

      const lastH = posHistoryRef.current[posHistoryRef.current.length - 1]
      if (!lastH || lastH.x !== posRef.current.x || lastH.y !== posRef.current.y) {
        posHistoryRef.current.push({ ...posRef.current })
        if (posHistoryRef.current.length > HISTORY_LEN) posHistoryRef.current.shift()
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

      const jx = joystickRef.current.x
      const jy = joystickRef.current.y
      const isCurrentlyMoving =
        (autoWalking && autoTarget) ||
        keys.current['arrowright'] || keys.current['d'] ||
        keys.current['arrowleft']  || keys.current['a'] ||
        keys.current['arrowdown']  || keys.current['s'] ||
        keys.current['arrowup']    || keys.current['w'] ||
        Math.abs(jx) > 0.05 || Math.abs(jy) > 0.05

      if (isCurrentlyMoving) {
        const targetScroll = posRef.current.y - window.innerHeight * 0.5
        const newScroll = Math.max(0, window.scrollY + (targetScroll - window.scrollY) * 0.08)
        window.scrollTo(0, newScroll)
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
    <>
      {followers.map((cat, i) => {
        const delay = (i + 1) * 12
        const h = posHistoryRef.current
        const histPos = h[Math.max(0, h.length - 1 - delay)] ?? pos
        return (
          <img
            key={cat}
            className="cat-follower"
            src={`/images/cats/${cat}.png`}
            alt={cat}
            style={{ left: histPos.x + 20, top: histPos.y + 40 }}
          />
        )
      })}

      <div style={{ position: 'absolute', left: pos.x, top: pos.y, width: 80, zIndex: 90 }}>
        {activeFact && (
          <SpeechBubble
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
          </SpeechBubble>
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

      <div
        className="joystick-base"
        ref={joystickBaseRef}
      >
        <div
          className="joystick-handle"
          style={{ transform: `translate(${joystickHandle.x}px, ${joystickHandle.y}px)` }}
        />
      </div>
    </>
  )
}
