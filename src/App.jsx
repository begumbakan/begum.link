import Character from './Character'
import Bubbles from './Bubbles'
import Projects from './Projects'
import DropTransition from './DropTransition'
import { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'

export default function App() {
  const [popping, setPopping] = useState(false)
  const [popped, setPopped] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [transStartPos, setTransStartPos] = useState(null)
  const [transTargetPos, setTransTargetPos] = useState(null)
  const [charStartPos, setCharStartPos] = useState(null)
  const [projectZones, setProjectZones] = useState([])
  const bubbleRef = useRef(null)
  const charLandingPos = useRef(null)

  useEffect(() => {
    document.body.style.overflow = transitioning ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [transitioning])

  const handlePop = () => {
    if (bubbleRef.current) {
      const rect = bubbleRef.current.getBoundingClientRect()
      const heroRect = document.querySelector('.hero')?.getBoundingClientRect()
      const heroBottom = heroRect?.bottom ?? 480

      const startX = rect.left + rect.width / 2 - 40
      const startY = rect.top + rect.height / 2 - 40

      charLandingPos.current = {
        x: startX,
        y: heroBottom + window.scrollY + 50,
      }

      setTransStartPos({ x: startX, y: startY })
      setTransTargetPos({ x: startX, y: heroBottom + 50 })
    }
    setTransitioning(true)
    requestAnimationFrame(() => setPopping(true))
    setTimeout(() => setPopped(true), 400)
  }

  const handleZoneChange = useCallback((prevId, nextId) => {
    const cards = document.querySelectorAll('.project-card')
    if (prevId !== null && cards[prevId]) {
      cards[prevId].classList.remove('zone-active')
      cards[prevId].classList.add('zone-returning')
      setTimeout(() => cards[prevId].classList.remove('zone-returning'), 700)
    }
    if (nextId !== null && cards[nextId]) {
      cards[nextId].classList.remove('zone-returning')
      cards[nextId].classList.add('zone-active')
    }
  }, [])

  const handleTransitionDone = useCallback(() => {
    setCharStartPos(charLandingPos.current)
    const cards = document.querySelectorAll('.project-card')
    const zones = Array.from(cards).map((card, i) => {
      const rect = card.getBoundingClientRect()
      return {
        id: i,
        fact: card.dataset.fact ?? '',
        platformX: rect.right - 79,
        platformY: rect.top + window.scrollY - 5,
        radius: 42,
        cardLeft: rect.left,
        cardRight: rect.right,
        cardTop: rect.top + window.scrollY,
        cardBottom: rect.bottom + window.scrollY,
      }
    })
    setProjectZones(zones)
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
      <Character initialPos={charStartPos} zones={projectZones} onZoneChange={handleZoneChange} />
    )}

    <Projects />
  </>
  )
}
