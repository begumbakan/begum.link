import { useEffect, useRef } from 'react'

export default function DropTransition({ startPos, targetPos, onDone }) {
  const doneRef = useRef(false)

  useEffect(() => {
    const duration = 800
    const timer = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true
        onDone(targetPos)
      }
    }, duration)
    return () => clearTimeout(timer)
  }, [targetPos, onDone])

  const dropDistance = targetPos.y - startPos.y

  return (
    <img
      src="/images/littlebegum1.png"
      alt="character"
      style={{
        position: 'fixed',
        left: startPos.x,
        top: startPos.y,
        width: 80,
        imageRendering: 'pixelated',
        userSelect: 'none',
        zIndex: 999,
        animation: `drop 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards`,
        '--drop-distance': `${dropDistance}px`,
      }}
    />
  )
}
