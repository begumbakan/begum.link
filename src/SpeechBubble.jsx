import './SpeechBubble.css'

export default function SpeechBubble({ children, className = '', style }) {
  return (
    <div className={`speech-bubble ${className}`} style={style}>
      {children}
    </div>
  )
}
