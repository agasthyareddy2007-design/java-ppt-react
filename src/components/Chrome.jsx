import React from 'react'

export default function Chrome({ currentSlide, totalSlides }) {
  const currentPadded = String(currentSlide + 1).padStart(2, '0')
  const totalPadded = String(totalSlides).padStart(2, '0')

  return (
    <div className="chrome">
      <div className="chrome-brand">JAVA &amp; JVM KEYNOTE</div>
      <div className="chrome-page" id="pageIndicator">
        {currentPadded} / {totalPadded}
      </div>
    </div>
  )
}
