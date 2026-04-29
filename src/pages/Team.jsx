import { Link } from 'react-router-dom'
import styles from './Team.module.css'

const team = [
  {
    name: 'Aileen Aryeetey',
    role: 'Web Developer',
    image: '/aileen-team.jpeg',
    imageAlt: 'Aileen Aryeetey, Web Developer at AC Web Studio',
    imagePosition: 'center 22%',
    bio: [
      'Aileen is the developer behind every website we build, turning ideas into custom-coded websites that are clean, responsive, and built from scratch.',
      'She works across HTML, CSS, JavaScript, React, Tailwind, and Bootstrap to create sites that not only look good but work smoothly on every screen.',
      'Beyond development, she also leads the business, manages client communication, and makes sure each project stays organized from start to finish.',
      'Her approach is hands-on, detail-focused, and grounded in making the process feel easy for every client.',
    ],
    responsibilities: [
      'Builds and codes every website from scratch',
      'Leads client communication and project delivery',
      'Keeps each build responsive, polished, and functional',
    ],
    blurb: 'Turns strategy and ideas into polished websites that feel solid, custom, and easy to trust.',
  },
  {
    name: 'Cynthia Owusu-Forkuo',
    role: 'UI/UX Designer',
    image: '/cynthia-team.jpeg',
    imageAlt: 'Cynthia Owusu-Forkuo, UI UX Designer at AC Web Studio',
    imagePosition: 'center 20%',
    bio: [
      'Cynthia is the designer who shapes the look and feel of each project before development begins.',
      'She creates the Figma mockups and visual direction for every website, helping clients see the vision clearly from the start.',
      'From layout choices to imagery and overall style, she focuses on making each site feel thoughtful, polished, and true to the brand behind it.',
      'Her design approach is warm, intentional, and centered on creating an experience that feels both beautiful and easy to use.',
    ],
    responsibilities: [
      'Creates Figma mockups and design concepts',
      'Leads layout, imagery, and visual direction',
      'Shapes the overall look and feel before development starts',
    ],
    blurb: 'Shapes the visual personality of each project so the finished website feels thoughtful from the first glance.',
  },
]

export default function Team() {
  return (
    <>
      <div style={{ padding: '140px 5% 80px', background: 'linear-gradient(180deg, var(--cream), var(--white))', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-8%', right: '-6%', width: 540, height: 540, borderRadius: '50%', background: 'radial-gradient(circle, var(--hero-glow) 0%, transparent 72%)', pointerEvents: 'none' }} />
        <div className={styles.shell}>
          <div className="section-label fade-in delay-1">Meet the Team</div>
          <h1 className="fade-in delay-2" style={{ fontSize: 'clamp(42px,5.8vw,78px)', maxWidth: 820, lineHeight: 1.04, marginBottom: 28 }}>
            The people behind the
            <br />
            <em style={{ fontStyle: 'italic', color: 'var(--brown)' }}>design and development</em>
          </h1>
          <p className="fade-in delay-3" style={{ fontSize: 18, color: 'var(--gray)', maxWidth: 640, fontWeight: 300, lineHeight: 1.85 }}>
            We are a small creative team that cares deeply about building websites our clients feel proud to share. Every project combines thoughtful design, clear communication, and custom development so your website feels polished, personal, and made for your business.
          </p>
        </div>
      </div>

      <section style={{ padding: '96px 5%', background: 'var(--white)' }}>
        <div className={`${styles.shell} ${styles.stack}`}>
          {team.map(member => (
            <div key={member.name} className={styles.teamCard}>
              <div className={styles.teamMedia}>
                <img
                  src={member.image}
                  alt={member.imageAlt}
                  className={styles.teamImage}
                  style={{ objectPosition: member.imagePosition }}
                />
                <div className={styles.teamOverlay} />
                <div className={styles.teamLabel}>
                  <div className={styles.teamRole}>{member.role}</div>
                  <h2 className={styles.teamName}>{member.name}</h2>
                  <p className={styles.teamBlurb}>{member.blurb}</p>
                </div>
              </div>

              <div className={styles.teamBody}>
                <div className={styles.teamBodyIntro}>
                  <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brown)' }}>
                    About {member.name.split(' ')[0]}
                  </div>
                  {member.bio.map(paragraph => (
                    <p key={paragraph} style={{ fontSize: 16, color: 'var(--gray)', fontWeight: 300, lineHeight: 1.88 }}>
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className={styles.focusBlock}>
                  <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--brown)' }}>
                    Focus Areas
                  </div>
                  <ul className={styles.focusList}>
                    {member.responsibilities.map(item => (
                      <li key={item}>
                        <span>•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '100px 5%', background: 'linear-gradient(180deg, var(--white), var(--cream))' }}>
        <div className={`${styles.shell} ${styles.valueGrid}`}>
          {[
            ['Thoughtful design first', 'Every project starts with a clear visual direction so the final website feels intentional, not stitched together later.'],
            ['Custom development always', 'Once the design is right, we build it from scratch so the final site feels tailored to your business and works beautifully across devices.'],
          ].map(([title, copy]) => (
            <div key={title} className={styles.valueCard}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: 'var(--black)', marginBottom: 12 }}>
                {title}
              </h3>
              <p style={{ fontSize: 15, color: 'var(--gray)', fontWeight: 300, lineHeight: 1.82 }}>
                {copy}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div style={{ background: 'var(--black)', padding: '80px 5%', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(30px,4vw,54px)', color: '#fff', marginBottom: 20, maxWidth: 660, marginLeft: 'auto', marginRight: 'auto', lineHeight: 1.14 }}>
          Ready to work with a team that keeps it personal?
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.64)', fontSize: 17, marginBottom: 40, fontWeight: 300, maxWidth: 620, marginLeft: 'auto', marginRight: 'auto' }}>
          If you want a custom website that feels thoughtful from the first concept to the final build, we would love to hear about your project.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/contact" className="btn-primary">Start Your Project</Link>
          <Link to="/portfolio" className="btn-outline" style={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>
            View Our Work
          </Link>
        </div>
      </div>
    </>
  )
}
