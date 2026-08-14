const bubbleData = [
  { size: 80,  top: '10%', left: '5%',  color: 'var(--coral)',  duration: '4s', delay: '0s' },
  { size: 50,  top: '60%', left: '10%', color: 'var(--violet)', duration: '6s', delay: '1s' },
  { size: 120, top: '20%', left: '85%', color: 'var(--mint)',   duration: '5s', delay: '2s' },
  { size: 40,  top: '15%', left: '60%', color: 'var(--yellow)', duration: '3s', delay: '0.5s' },
  { size: 70,  top: '40%', left: '40%', color: 'var(--coral)',  duration: '7s', delay: '1.5s' },
  { size: 90,  top: '70%', left: '45%', color: 'var(--violet)', duration: '5s', delay: '3s' },
]


export default function Bubbles() {
  return (
    <div className="bubbles">
      {bubbleData.map((b, i) => (
        <div
          key={i}
          className="bubble"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            borderColor: b.color,
            animationDuration: b.duration,
            animationDelay: b.delay,
          }}
        />
      ))}
    </div>
  )
}
