import Character from './Character'
import './App.css'

export default function App() {
  return (
  <>
    <nav>
      <span className="nav-logo">Begüm Bakan</span>
      <ul>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>

    <div className="world">
      <Character />
    </div>
  </>
)

}
