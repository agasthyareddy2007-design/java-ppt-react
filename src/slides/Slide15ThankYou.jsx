import React from 'react'

export default function Slide15ThankYou({ isActive }) {
  return (
    <section className={`slide ${isActive ? 'active' : ''}`}>
      <div
        className="slide-content-wrapper"
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        <div
          className="reveal"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <h1
            style={{
              fontSize: 'clamp(64px, 8vw, 110px)',
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
              textShadow: '0 8px 40px rgba(0, 0, 0, 0.75)'
            }}
          >
            Thank You
          </h1>
        </div>
      </div>
    </section>
  )
}
