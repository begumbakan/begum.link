import projects from "./projectsData";

export default function Projects({ hint }) {
    return (
        <section id="projects">
            <h2>Projects</h2>
            {hint && <p className="projects-hint">Walk onto a card's bubble to pop it ✦</p>}
            <div className="projects-grid">
                {projects.map((p) => (
                    <a 
                    key={p.name}
                    href={p.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-card"
                    data-fact={p.funFact}
                    >
                        <h3>{p.name}</h3>
                        <p>{p.description}</p>
                        <div className="project-tags">
                            {p.tech.map((t) => (
                                <span key={t} className="tag">{t}</span>
                            ))}
                        </div>
                    </a>
                ))}
            </div>
        </section>
    )
}