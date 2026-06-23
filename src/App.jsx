import Character from './Character'
import Bubbles from './Bubbles'
import DropTransition from './DropTransition'
import { useState, useRef, useCallback } from 'react'
import './App.css'

export default function App() {
  const [popping, setPopping] = useState(false)
  const [popped, setPopped] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [transStartPos, setTransStartPos] = useState(null)
  const [transTargetPos, setTransTargetPos] = useState(null)
  const [charStartPos, setCharStartPos] = useState(null)
  const bubbleRef = useRef(null)

  const handlePop = () => {
    if (bubbleRef.current) {
      const rect = bubbleRef.current.getBoundingClientRect()
      const heroRect = document.querySelector('.hero')?.getBoundingClientRect()
      const heroBottom = heroRect?.bottom ?? 480

      const startX = rect.left + rect.width / 2 - 40
      const startY = rect.top + rect.height / 2 - 40

      setTransStartPos({ x: startX, y: startY })
      setTransTargetPos({ x: startX, y: heroBottom + 50 })
    }
    setTransitioning(true)
    requestAnimationFrame(() => setPopping(true))
    setTimeout(() => setPopped(true), 400)
  }

  const handleTransitionDone = useCallback((finalViewportPos) => {
    const navHeight = document.querySelector('nav')?.offsetHeight ?? 0
    const heroHeight = document.querySelector('.hero')?.offsetHeight ?? 0
    setCharStartPos({
      x: finalViewportPos.x,
      y: finalViewportPos.y - navHeight - heroHeight,
    })
    setTransitioning(false)
  }, [])

  return (
  <>
    <nav>
      <span className="nav-logo">Begüm Bakan</span>
      <ul>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>

    <section className="hero">
      <h1>Hi, I'm Begüm.</h1>
      <p>I do things I enjoy — like coding :]</p>
      {!popped && (
        <div
          ref={bubbleRef}
          className="character-bubble"
          onClick={handlePop}
        >
          <div className={`bubble-ring ${popping ? 'popping' : ''}`} />
          <img src="/images/littlebegum1.png" alt="character" style={{ opacity: popping ? 0 : 1 }} />
        </div>
      )}
      <Bubbles />
    </section>

    {transitioning && transStartPos && transTargetPos && (
      <DropTransition
        startPos={transStartPos}
        targetPos={transTargetPos}
        onDone={handleTransitionDone}
      />
    )}

    {!transitioning && charStartPos && (
      <div className="world">
        <Character initialPos={charStartPos} />
      </div>
    )}
  </>
  )
}
