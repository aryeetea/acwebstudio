import { useState } from 'react'

export default function PortraitCard() {
  const [hasImageError, setHasImageError] = useState(false)

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: 460,
        marginLeft: 'auto',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 'auto auto -24px -24px',
          width: '68%',
          height: '72%',
          borderRadius: 36,
          background: 'linear-gradient(135deg, var(--accent-soft), transparent)',
          filter: 'blur(4px)',
          opacity: 0.95,
        }}
      />
      <div
        style={{
          position: 'relative',
          aspectRatio: '4 / 5',
          borderRadius: 36,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.55)',
          boxShadow: '0 28px 60px rgba(31, 23, 38, 0.16)',
          background: 'linear-gradient(180deg, var(--surface-dark-soft), var(--surface-dark))',
        }}
      >
        {!hasImageError ? (
          <img
            src="/leen-portrait.jpeg"
            alt="Portrait of the AC Web Studio team lead"
            onError={() => setHasImageError(true)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'center 28%',
              display: 'block',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'radial-gradient(circle at top, var(--accent-soft), transparent 44%), linear-gradient(180deg, var(--surface-dark-soft), var(--surface-dark))',
            }}
          >
            <div style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 120, lineHeight: 0.9, color: 'rgba(255,255,255,0.18)' }}>
                L
              </div>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: 18 }}>
                Portrait space ready
              </p>
            </div>
          </div>
        )}
        <div
          style={{
            position: 'absolute',
            inset: 'auto 18px 18px 18px',
            padding: '16px 18px',
            borderRadius: 24,
            background: 'linear-gradient(180deg, rgba(17,17,16,0.08), rgba(17,17,16,0.62))',
            color: '#fff',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div style={{ fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.72)', marginBottom: 8 }}>
            Meet the Team
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, lineHeight: 1.05, marginBottom: 8 }}>
            Creative direction with personality
          </div>
          <p style={{ fontSize: 13, lineHeight: 1.65, color: 'rgba(255,255,255,0.78)' }}>
            AC Web Studio should feel warm, memorable, and unmistakably yours from the very first scroll.
          </p>
        </div>
      </div>
    </div>
  )
}
