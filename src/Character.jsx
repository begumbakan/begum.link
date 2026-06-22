import { useEffect, useRef, useState } from 'react'

const FRAMES = [
  '/images/littlebegum1.png',
  '/images/littlebegum2.png',
  '/images/littlebegum3.png',
  '/images/littlebegum4.png',
]
const SPEED = 2
const FRAME_INTERVAL = 150

export default function Character() {
  const [pos, setPos] = useState({ x: 100, y: 300 })
  const [frame, setFrame] = useState(0)
  const [moving, setMoving] = useState(false)
  const keys = useRef({})
  const animRef = useRef(null)
  const frameTimerRef = useRef(null)

  useEffect(() => {
    const onKeyDown = (e) => { keys.current[e.key] = true }
    const onKeyUp = (e) => { keys.current[e.key] = false }
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [])

  useEffect(() => {
    const loop = () => {
      const k = keys.current
      const dx =
        (k['ArrowRight'] || k['d'] ? 1 : 0) -
        (k['ArrowLeft']  || k['a'] ? 1 : 0)
      const dy =
        (k['ArrowDown']  || k['s'] ? 1 : 0) -
        (k['ArrowUp']    || k['w'] ? 1 : 0)

      const isMoving = dx !== 0 || dy !== 0
      setMoving(isMoving)

      if (isMoving) {
        setPos((p) => ({
          x: Math.max(0, Math.min(window.innerWidth  - 64, p.x + dx * SPEED)),
          y: Math.max(0, Math.min(window.innerHeight - 64, p.y + dy * SPEED)),
        }))
      }

      animRef.current = requestAnimationFrame(loop)
    }
    animRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animRef.current)
  }, [])

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
        width: 64,
        imageRendering: 'pixelated',
        userSelect: 'none',
      }}
    />
  )
}
