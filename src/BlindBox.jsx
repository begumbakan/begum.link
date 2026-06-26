import { useState, useRef } from 'react'

const CATS = [
  { name: 'zeep-zoop', weight: 3 },
  { name: 'latte',     weight: 16 },
  { name: 'mocha',     weight: 16 },
  { name: 'sherlock',  weight: 16 },
  { name: 'smokin',    weight: 16 },
  { name: 'tabby',     weight: 16 },
  { name: 'tekir',     weight: 17 },
]

function pickCat() {
  const total = CATS.reduce((s, c) => s + c.weight, 0)
  let r = Math.random() * total
  for (const cat of CATS) {
    r -= cat.weight
    if (r <= 0) return cat.name
  }
  return CATS[CATS.length - 1].name
}

const FRAMES = 8

export default function BlindBox({ onCatRevealed, onClose, openCount = 1 }) {
  const [sliderVal, setSliderVal] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [revealedCat, setRevealedCat] = useState(null)
  const catRef = useRef(null)

  const frameIndex = Math.min(FRAMES - 1, Math.floor((sliderVal / 100) * FRAMES))

  const handleSlider = (e) => {
    const val = Number(e.target.value)
    setSliderVal(val)
    if (val === 100 && !revealed) {
      const cat = pickCat()
      catRef.current = cat
      setRevealedCat(cat)
      setRevealed(true)
    }
    if (val < 100 && revealed) {
      setRevealed(false)
      setRevealedCat(null)
    }
  }

  const handleKeep = () => {
    onCatRevealed(catRef.current)
    onClose()
  }

  const handleOpenAgain = () => {
    setSliderVal(0)
    setRevealed(false)
    setRevealedCat(null)
    catRef.current = null
  }

  return (
    <div className="blindbox-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="blindbox-modal">
        <img
          className="blindbox-frame"
          src={`/images/blindbox/${frameIndex + 1}.png`}
          alt="blind box"
        />

        {revealed && revealedCat && (
          <div className="blindbox-reveal">
            <img src={`/images/cats/${revealedCat}.png`} alt={revealedCat} className="blindbox-cat" />
            <p className="blindbox-cat-name">{revealedCat}!</p>
            <div className="blindbox-reveal-actions">
              <button className="blindbox-keep-btn" onClick={handleKeep}>follow me ♡</button>
              <button className="blindbox-again-btn" onClick={handleOpenAgain}>open again</button>
            </div>
            {openCount >= 3 && (
              <div className="blindbox-contact-nudge">
                <p>did you like what I built? let's chat —</p>
                <a href="#contact" onClick={onClose} className="blindbox-contact-link">see what I can do for you →</a>
              </div>
            )}
          </div>
        )}

        {!revealed && (
          <div className="blindbox-slider-area">
            <p className="blindbox-hint">slide to open →</p>
            <div className="blindbox-slider-track">
              <div className="blindbox-slider-fill" style={{ width: `${sliderVal}%` }} />
              <input
                type="range"
                min={0}
                max={100}
                value={sliderVal}
                onChange={handleSlider}
                className="blindbox-slider-input"
              />
            </div>
          </div>
        )}

        <button className="blindbox-close" onClick={onClose}>✕</button>
      </div>
    </div>
  )
}
