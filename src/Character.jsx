import { useEffect, useRef, useState } from 'react'

const FRAMES = [
  '/images/littlebegum1.png',
  '/images/littlebegum2.png',
  '/images/littlebegum3.png',
  '/images/littlebegum4.png',
]
const SPEED = 300
const FRAME_INTERVAL = 150

export default function Character({ initialPos, autoTarget }) {
  const [pos, setPos] = useState(initialPos ?? { x: 100, y: 300 })
  const [frame, setFrame] = useState(0)
  const [moving, setMoving] = useState(false)
  const [autoWalking, setAutoWalking] = useState(!!autoTarget)
  const keys = useRef({})
  const animRef = useRef(null)
  const frameTimerRef = useRef(null)
  const lastTimeRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (e) => {
      keys.current[e.key] = true
      setAutoWalking(false)
    }
    const onKeyUp = (e) => { keys.current[e.key] = false }
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

      let dx = 0
      let dy = 0

      if (autoWalking && autoTarget) {
        setPos((p) => {
          const diffX = autoTarget.x - p.x
          const diffY = autoTarget.y - p.y
          const dist = Math.sqrt(diffX * diffX + diffY * diffY)
          if (dist < step) {
            setAutoWalking(false)
            return { x: autoTarget.x, y: autoTarget.y }
          }
          return {
            x: p.x + (diffX / dist) * step,
            y: p.y + (diffY / dist) * step,
          }
        })
        setMoving(true)
      } else {
        const k = keys.current
        dx = (k['ArrowRight'] || k['d'] ? 1 : 0) - (k['ArrowLeft'] || k['a'] ? 1 : 0)
        dy = (k['ArrowDown']  || k['s'] ? 1 : 0) - (k['ArrowUp']   || k['w'] ? 1 : 0)

        const isMoving = dx !== 0 || dy !== 0
        setMoving(isMoving)

        if (isMoving) {
          setPos((p) => ({
            x: Math.max(0, Math.min(window.innerWidth  - 80, p.x + dx * step)),
            y: Math.max(0, Math.min(window.innerHeight - 80, p.y + dy * step)),
          }))
        }
      }

      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [autoWalking, autoTarget])

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

  return (
    <img
      src={FRAMES[frame]}
      alt="character"
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: 80,
        imageRendering: 'pixelated',
        userSelect: 'none',
      }}
    />
  )
}
