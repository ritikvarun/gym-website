import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiArrowRight } from 'react-icons/fi'
import gymFallback from '../assets/gym_hero_fallback.webp'
import Magnetic from './Magnetic'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const CTA = () => {
  const sectionRef = useRef(null)
  const bgContainerRef = useRef(null)
  const bgImageRef = useRef(null)

  useEffect(() => {
    // ScrollReveal for text elements
    gsap.fromTo('.cta-reveal',
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Mouse Move Parallax for background image
    const handleMouseMove = (e) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const { clientX, clientY } = e
      
      // Calculate relative X, Y from -1 to 1
      const xVal = (clientX - rect.left - rect.width / 2) / (rect.width / 2)
      const yVal = (clientY - rect.top - rect.height / 2) / (rect.height / 2)

      // Move background image in opposite direction
      gsap.to(bgImageRef.current, {
        x: -xVal * 25,
        y: -yVal * 25,
        duration: 1,
        ease: 'power2.out'
      })
    }

    const sectionEl = sectionRef.current
    if (sectionEl) {
      sectionEl.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      if (sectionEl) {
        sectionEl.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="join" 
      className="relative w-full py-24 md:py-36 bg-dark-bg overflow-hidden border-t border-white/5 cursor-pointer"
    >
      {/* Background Parallax Image Container */}
      <div 
        ref={bgContainerRef} 
        className="absolute inset-0 w-full h-full overflow-hidden select-none"
      >
        <img 
          ref={bgImageRef}
          src={gymFallback} 
          alt="Muscle Craft Elite Workspace" 
          className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)] object-cover object-center filter scale-105 opacity-25 brightness-50"
        />
        {/* Dark vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/85 to-dark-bg z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/60 via-transparent to-dark-bg/60 z-10" />
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-30 z-10 pointer-events-none" />

      {/* Content wrapper */}
      <div className="max-w-4xl mx-auto px-6 relative z-20 text-center flex flex-col items-center">
        
        {/* Subtitle Badge */}
        <div className="cta-reveal text-neon-lime text-xs font-bold uppercase tracking-widest mb-6 border border-neon-lime/20 px-4 py-1.5 rounded-full bg-neon-lime/5">
          1-Day Trial Pass — ₹200
        </div>

        {/* High-Impact Heading */}
        <h2 className="cta-reveal font-display text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none mb-6 max-w-3xl">
          READY TO BECOME THE <br />
          <span className="text-stroke-neon">BEST VERSION</span> OF YOURSELF?
        </h2>

        {/* Subheadline description */}
        <p className="cta-reveal text-gray-400 font-sans text-base md:text-xl leading-relaxed mb-4 max-w-xl">
          Experience our gym for one full day — equipment, trainers, everything included.
        </p>
        <p className="cta-reveal text-sm text-gray-500 mb-10 max-w-md">
          Your <span className="text-neon-lime font-semibold">₹200 trial fee</span> gets fully adjusted toward your membership cost if you join any plan after the trial.
        </p>

        {/* Pulse Button Wrapper */}
        <div className="cta-reveal relative">
          
          {/* Breathing outer glow ring */}
          <div className="absolute -inset-1 rounded-2xl bg-neon-lime opacity-20 blur-lg animate-pulse" />
          
          {/* Main CTA button */}
          <Magnetic>
            <a 
              href="#trial"
              className="relative px-8 py-5 rounded-2xl bg-neon-lime hover:bg-[#b0dc00] text-black text-sm font-extrabold uppercase tracking-widest transition-all duration-300 hover:scale-105 flex items-center gap-3 shadow-2xl hover:shadow-neon-lime/30 active:scale-95 group"
            >
              <span className="flex flex-col items-center">
                <span>Book 1-Day Trial Pass</span>
                <span className="text-[11px] font-bold opacity-80 tracking-widest">₹200 · Adjustable in Membership</span>
              </span>
              <FiArrowRight className="text-base transition-transform duration-300 group-hover:translate-x-1.5" />
            </a>
          </Magnetic>

        </div>

      </div>
    </section>
  )
}

export default CTA
