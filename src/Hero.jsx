// Hero.jsx – Compact, refined welcome section for StartStudy
import { SparklesIcon } from './Icons'

export default function Hero() {
  return (
    <section className="hero-section" aria-label="Welcome">
      <div className="hero-content">
        <div className="hero-eyebrow">
          <SparklesIcon className="eyebrow-icon" size={12} />
          <span>A LITTLE PROGRESS, EVERY DAY</span>
        </div>
        <h1 className="hero-title">Make today count.</h1>
        <p className="hero-subtitle">
          Turn &ldquo;I&rsquo;ll study later&rdquo; into one focused session at a time.
        </p>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="orbit-system">
          <div className="orbit-ring orbit-ring-outer" />
          <div className="orbit-ring orbit-ring-inner">
            <span className="orbit-satellite" />
          </div>
          <div className="orbit-center">
            <span className="orbit-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
