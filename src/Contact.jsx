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
      </div>
    </section>
  )
}
