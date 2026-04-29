import { useState } from 'react'
import styles from './ProjectCarousel.module.css'

export default function ProjectCarousel({ images = [] }) {
  const [current, setCurrent] = useState(0)
  if (!images.length) return null

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1))

  return (
    <div className={styles.carousel}>
      <button className={styles.arrow} onClick={prev} aria-label="Previous image">&#8592;</button>
      <div className={styles.imageFrame}>
        <img src={images[current]} alt={`Project screenshot ${current + 1}`} className={styles.image} />
      </div>
      <button className={styles.arrow} onClick={next} aria-label="Next image">&#8594;</button>
      <div className={styles.dots}>
        {images.map((_, i) => (
          <span
            key={i}
            className={i === current ? styles.dotActive : styles.dot}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </div>
  )
}
