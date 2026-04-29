import { Link } from 'react-router-dom'
import styles from './Team.module.css'

const team = [
  {
    name: 'Aileen Aryeetey',
    role: 'Web Developer',
    image: '/aileen-team.jpeg',
    imageAlt: 'Aileen Aryeetey, Web Developer at AC Web Studio',
    imagePosition: 'center 22%',
    blurb: 'Turns strategy and ideas into polished websites that feel solid, custom, and easy to trust.'
  },
  {
    name: 'Cynthia Owusu-Forkuo',
    role: 'UI/UX Designer',
    image: '/cynthia-team.jpeg',
    imageAlt: 'Cynthia Owusu-Forkuo, UI UX Designer at AC Web Studio',
    imagePosition: 'center 20%',
    blurb: 'Shapes the visual personality of each project so the finished website feels thoughtful from the first glance.'
  },
]

export default function AboutUs() {
  return (
    <>
      <div style={{ padding: '140px 5% 80px', background: 'linear-gradient(180deg, var(--cream), var(--white))', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-8%', right: '-6%', width: 540, height: 540, borderRadius: '50%', background: 'radial-gradient(circle, var(--hero-glow) 0%, transparent 72%)', pointerEvents: 'none' }} />
        <div className={styles.shell}>
          <div className="section-label fade-in delay-1">About Us</div>
          <h1 className="fade-in delay-2" style={{ fontSize: 'clamp(42px,5.8vw,78px)', maxWidth: 820, lineHeight: 1.04, marginBottom: 28 }}>
            Meet the Team<br />
            <em style={{ fontStyle: 'italic', color: 'var(--brown)' }}>Who We Are</em>
          </h1>
          <p className="fade-in delay-3" style={{ fontSize: 18, color: 'var(--gray)', maxWidth: 640, fontWeight: 300, lineHeight: 1.85 }}>
            We are a small creative team passionate about building websites that are beautiful, functional, and fun. Every project combines thoughtful design, clear communication, and custom development so your website feels polished, personal, and made for your business.
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
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
