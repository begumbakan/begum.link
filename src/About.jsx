export default function About() {
  return (
    <section id="about">
      <h2>About Me</h2>
      <div className="about-content">
        <div className="about-photo-wrapper">
          <img src="/images/about-me.jpg" alt="Begüm Bakan" className="about-photo" />
        </div>
        <div className="about-text">
          <p>I'm Begüm Bakan, a Software and Industrial Engineering student. When I was 11, becoming a software engineer was my biggest dream. It felt like magic watching people talk to a computer. Now I'm nearly done with uni and it still feels like magic.</p>
          <p>I like building things that make me think. There's something I love about sitting down with a project and figuring it out from scratch like this site!</p>
          <p>Outside of code I play ukulele and sing.</p>
          <p><span className="about-highlight">I'm looking for opportunities where I can build things that matter, whether that's something new or something already growing. Feel free to reach out, I'd love to chat.</span></p>
        </div>
      </div>
    </section>
  )
}
