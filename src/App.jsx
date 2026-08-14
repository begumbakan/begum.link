import Character from './Character'
import Bubbles from './Bubbles'
import About from './About'
import Projects from './Projects'
import DropTransition from './DropTransition'
import BlindBox from './BlindBox'
import SpeechBubble from './SpeechBubble'
import { useState, useRef, useCallback, useEffect } from 'react'
import './App.css'

const BLINDBOX_ZONE_INDEX = 2
const PHOTO_ZONE_ID = 100

export default function App() {
  const [popping, setPopping] = useState(false)
  const [popped, setPopped] = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const [transStartPos, setTransStartPos] = useState(null)
  const [transTargetPos, setTransTargetPos] = useState(null)
  const [charStartPos, setCharStartPos] = useState(null)
  const [projectZones, setProjectZones] = useState([])
  const [showBlindBoxTeaser, setShowBlindBoxTeaser] = useState(false)
  const [showBlindBoxModal, setShowBlindBoxModal] = useState(false)
  const [collectedCats, setCollectedCats] = useState([])
  const [showMovementHint, setShowMovementHint] = useState(false)
  const [showHeroHint, setShowHeroHint] = useState(true)
  const bubbleRef = useRef(null)
  const charLandingPos = useRef(null)
  const blindBoxOpenCount = useRef(0)

  useEffect(() => {
    document.body.style.overflow = transitioning ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [transitioning])

  useEffect(() => {
    const t = setTimeout(() => setShowHeroHint(false), 3500)
    return () => clearTimeout(t)
  }, [])

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
    if (prevId !== null && prevId !== PHOTO_ZONE_ID && cards[prevId]) {
      cards[prevId].classList.remove('zone-active')
      cards[prevId].classList.add('zone-returning')
      setTimeout(() => cards[prevId].classList.remove('zone-returning'), 700)
    }
    if (nextId !== null && nextId !== PHOTO_ZONE_ID && cards[nextId]) {
      cards[nextId].classList.remove('zone-returning')
      cards[nextId].classList.add('zone-active')
    }
    setShowBlindBoxTeaser(nextId === BLINDBOX_ZONE_INDEX)

    const photoWrapper = document.querySelector('.about-photo-wrapper')
    if (nextId === PHOTO_ZONE_ID) {
      photoWrapper?.classList.add('wobbling')
    } else {
      photoWrapper?.classList.remove('wobbling')
    }
  }, [])

  const handleBlindBoxOpen = useCallback(() => {
    blindBoxOpenCount.current += 1
    setShowBlindBoxModal(true)
  }, [])

  const handleBlindBoxClose = useCallback(() => {
    setShowBlindBoxModal(false)
  }, [])

  const handleCatRevealed = useCallback((catName) => {
    setCollectedCats((prev) =>
      prev.includes(catName) ? prev : [...prev, catName]
    )
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

    const photoEl = document.querySelector('.about-photo-wrapper')
    if (photoEl) {
      const r = photoEl.getBoundingClientRect()
      zones.push({
        id: PHOTO_ZONE_ID,
        fact: "That's me!",
        platformX: r.left + r.width / 2 - 40,
        platformY: r.top + window.scrollY + r.height / 2 - 40,
        radius: 120,
        cardLeft: 0,
        cardRight: window.innerWidth,
        cardTop: r.top + window.scrollY - 60,
        cardBottom: r.bottom + window.scrollY + 60,
      })
    }

    setProjectZones(zones)
    setTransitioning(false)
    setShowMovementHint(true)
    setTimeout(() => setShowMovementHint(false), 4000)
  }, [])

  return (
  <>
    <nav>
      <span className="nav-logo">Begüm Bakan</span>
      <ul>
        <li><a href="#about">About</a></li>
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
          <img src="/images/littlebegum/1.png" alt="character" style={{ opacity: popping ? 0 : 1 }} />
          {!popping && showHeroHint && (
            <SpeechBubble className="hero-speech-bubble">
              Click on the bubble!
            </SpeechBubble>
          )}
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
      <Character
        initialPos={charStartPos}
        zones={projectZones}
        onZoneChange={handleZoneChange}
        showBlindBoxTeaser={showBlindBoxTeaser}
        onBlindBoxOpen={handleBlindBoxOpen}
        followers={collectedCats}
      />
    )}

    {showBlindBoxTeaser && projectZones[BLINDBOX_ZONE_INDEX] && (
      <>
        <img
          className="blindbox-teaser"
          src="/images/blindbox/1.png"
          alt="blind box"
          onClick={handleBlindBoxOpen}
          style={{
            position: 'absolute',
            left: projectZones[BLINDBOX_ZONE_INDEX].cardRight - 64,
            top: projectZones[BLINDBOX_ZONE_INDEX].cardBottom - 64,
          }}
        />
        {!showBlindBoxModal && blindBoxOpenCount.current === 0 && (
          <div className="movement-hint">Click on the blind box to open it!</div>
        )}
      </>
    )}

    {showBlindBoxModal && (
      <BlindBox
        onCatRevealed={handleCatRevealed}
        onClose={handleBlindBoxClose}
        openCount={blindBoxOpenCount.current}
      />
    )}

    {showMovementHint && (
      <div className="movement-hint">
        {window.matchMedia('(pointer: coarse)').matches
          ? 'Use the joystick to walk!'
          : 'Use arrow keys or WASD to walk around!'}
      </div>
    )}

    <About />
    <Projects hint={!!charStartPos} />
  </>
  )
}
