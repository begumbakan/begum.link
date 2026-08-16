function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 6-10 7L2 6" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.49-1.11-1.49-.91-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.74-.1-.26-.45-1.31.1-2.73 0 0 .84-.27 2.75 1.05a9.3 9.3 0 0 1 5 0c1.91-1.32 2.75-1.05 2.75-1.05.55 1.42.2 2.47.1 2.73.64.71 1.03 1.62 1.03 2.74 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.2C22 6.58 17.52 2 12 2Z" />
    </svg>
  )
}

export default function Contact() {
  return (
    <section id="contact">
      <h2>Contact</h2>
      <p className="contact-intro">Want to build something together, or just say hi? I'd love to hear from you.</p>
      <div className="contact-grid">
        <a className="contact-card" href="mailto:begumbakan2005@gmail.com">
          <span className="contact-card-icon contact-card-icon-coral"><MailIcon /></span>
          <span className="contact-card-text">
            <span className="contact-card-label">Email</span>
            <span className="contact-card-value">begumbakan2005@gmail.com</span>
          </span>
        </a>
        <a
          className="contact-card"
          href="https://www.linkedin.com/in/begumbakan/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="contact-card-icon contact-card-icon-violet"><LinkedInIcon /></span>
          <span className="contact-card-text">
            <span className="contact-card-label">LinkedIn</span>
            <span className="contact-card-value">/in/begumbakan</span>
          </span>
        </a>
        <a
          className="contact-card"
          href="https://github.com/begumbakan"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="contact-card-icon contact-card-icon-dark"><GitHubIcon /></span>
          <span className="contact-card-text">
            <span className="contact-card-label">GitHub</span>
            <span className="contact-card-value">@begumbakan</span>
          </span>
        </a>
      </div>
    </section>
  )
}
