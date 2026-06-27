import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiChevronLeft, FiChevronRight, FiStar } from 'react-icons/fi'
import { ImQuotesLeft } from 'react-icons/im'
import clientDominic from '../assets/client_dominic.webp'
import clientValerie from '../assets/client_valerie.webp'
import clientAlexander from '../assets/client_alexander.webp'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const sectionRef = useRef(null)
  const cardRef = useRef(null)
  const autoPlayRef = useRef(null)

  const testimonials = [
    {
      name: 'Dominic Vance',
      role: 'CEO, Vance Media',
      quote: "Muscle Craft is in a league of its own. The personal coaches are actual sports scientists who design programs backed by biometrics. My strength profiles and daily productivity indicators have never been higher.",
      program: 'HyperPhysique Member',
      accentColor: '#ccff00', // Neon Lime
      image: clientDominic,
      stars: 5
    },
    {
      name: 'Valerie Thorne',
      role: 'Founder, Thorne Bio-Tech',
      quote: "The group training sessions are high energy and exceptionally programmed, but the nutrition design was the real catalyst. Custom macros aligned with my physical exertion cycles completely redesigned my physique.",
      program: 'Metcon Redline Member',
      accentColor: '#00f0ff', // Neon Cyan
      image: clientValerie,
      stars: 5
    },
    {
      name: 'Dr. Alexander Cross',
      role: 'Orthopedic Surgeon',
      quote: "As a surgeon, I am highly critical of biomechanics and joint stress. Muscle Craft's strength platforms, safety monitoring, and physical rehabilitation specialists got me benching pain-free after shoulder surgery.",
      program: 'Athletic Apex Member',
      accentColor: '#ff007f', // Neon Pink
      image: clientAlexander,
      stars: 5
    }
  ]

  const current = testimonials[activeIndex]

  // Slide transition functions
  const triggerTransition = (nextIndex, slideOutX, slideInX) => {
    gsap.to(cardRef.current, {
      opacity: 0,
      x: slideOutX,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        setActiveIndex(nextIndex)
        gsap.fromTo(cardRef.current,
          { opacity: 0, x: slideInX },
          { opacity: 1, x: 0, duration: 0.45, ease: 'power2.out' }
        )
      }
    })
  }

  const handleNext = () => {
    const nextVal = activeIndex === testimonials.length - 1 ? 0 : activeIndex + 1
    triggerTransition(nextVal, -30, 30)
  }

  const handlePrev = () => {
    const prevVal = activeIndex === 0 ? testimonials.length - 1 : activeIndex - 1
    triggerTransition(prevVal, 30, -30)
  }

  // Auto-slide effect
  useEffect(() => {
    autoPlayRef.current = handleNext
  })

  useEffect(() => {
    const play = () => {
      autoPlayRef.current()
    }
    const timer = setInterval(play, 6000)
    return () => clearInterval(timer)
  }, [activeIndex])

  useEffect(() => {
    // Reveal headers
    gsap.fromTo('.testi-reveal',
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }, [])

  return (
    <section 
      ref={sectionRef}
      id="testimonials" 
      className="relative w-full py-20 md:py-28 bg-[#0a0a0d] overflow-hidden border-t border-white/5"
    >
      {/* Background neon orbs */}
      <div className="absolute top-1/4 left-0 w-80 h-80 bg-neon-pink/3 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-0 w-[450px] h-[450px] bg-neon-lime/3 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="testi-reveal text-center max-w-2xl mx-auto mb-20">
          <div className="text-neon-pink text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-pink inline-block animate-pulse"></span>
            Testimonials
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
            HEAR FROM OUR <br className="sm:hidden" />
            <span className="text-stroke-neon">ELITE MEMBERS</span>
          </h2>
          <p className="text-gray-400 font-sans text-sm md:text-base leading-relaxed">
            Discover how Muscle Craft's biometric methodologies, elite facilities, and scientific coaching transform real-world health and performance parameters.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-4xl mx-auto relative">
          
          {/* Main Card with Glassmorphic styles */}
          <div 
            ref={cardRef}
            className="w-full relative glass-card p-8 md:p-14 rounded-[2.5rem] bg-dark-surface/35 backdrop-blur-xl border border-white/5 shadow-glass overflow-hidden flex flex-col md:flex-row gap-8 md:gap-12 items-center"
          >
            {/* Massive decorative Quote background indicator */}
            <ImQuotesLeft className="absolute -top-6 -right-6 text-[11rem] text-white/3 pointer-events-none z-0" />
            
            {/* Top accent line */}
            <div 
              className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r via-transparent to-transparent transition-colors duration-500" 
              style={{ backgroundImage: `linear-gradient(to right, ${current.accentColor}40, transparent)` }}
            />

            {/* Profile Image & Program Badge */}
            <div className="relative flex-shrink-0 z-10 w-28 h-28 md:w-40 md:h-40">
              <div className="absolute -inset-1.5 rounded-full border border-dashed pointer-events-none opacity-40 animate-[spin_40s_linear_infinite]" style={{ borderColor: current.accentColor }} />
              <div className="w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-2xl">
                <img 
                  src={current.image} 
                  alt={current.name} 
                  className="w-full h-full object-cover object-center pointer-events-none" 
                />
              </div>
            </div>

            {/* Content detail panel */}
            <div className="flex-grow flex flex-col text-left z-10">
              
              {/* Star Ratings Row */}
              <div className="flex gap-1 mb-4">
                {[...Array(current.stars)].map((_, starIdx) => (
                  <FiStar 
                    key={starIdx} 
                    className="text-base fill-current" 
                    style={{ color: current.accentColor }} 
                  />
                ))}
              </div>

              {/* Client Testimonial Quote */}
              <p className="text-gray-300 font-sans text-base md:text-lg leading-relaxed italic mb-8 relative pr-6">
                &ldquo;{current.quote}&rdquo;
              </p>

              {/* Client Info Grid Footer */}
              <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-auto">
                <div className="flex flex-col">
                  <span className="font-display text-xl font-bold text-white uppercase tracking-wider">{current.name}</span>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: current.accentColor }} />
                    {current.role}
                  </span>
                </div>
                <span 
                  className="hidden sm:inline-block text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border"
                  style={{ borderColor: `${current.accentColor}30`, color: current.accentColor, backgroundColor: `${current.accentColor}10` }}
                >
                  {current.program}
                </span>
              </div>

            </div>

          </div>

          {/* Navigation Controls */}
          <div className="flex justify-between items-center mt-8 px-4">
            
            {/* Carousel Dots */}
            <div className="flex gap-2.5">
              {testimonials.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => {
                    const nextVal = idx
                    const slideOut = activeIndex < idx ? -30 : 30
                    const slideIn = activeIndex < idx ? 30 : -30
                    triggerTransition(nextVal, slideOut, slideIn)
                  }}
                  className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                  style={{ 
                    backgroundColor: idx === activeIndex ? current.accentColor : 'rgba(255,255,255,0.15)',
                    transform: idx === activeIndex ? 'scale(1.25)' : 'scale(1)'
                  }}
                  aria-label={`Go to review ${idx + 1}`}
                />
              ))}
            </div>

            {/* Arrows */}
            <div className="flex gap-4">
              <button 
                onClick={handlePrev}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300 active:scale-95 shadow-lg"
                aria-label="Previous review"
              >
                <FiChevronLeft className="text-xl" />
              </button>
              <button 
                onClick={handleNext}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300 active:scale-95 shadow-lg"
                aria-label="Next review"
              >
                <FiChevronRight className="text-xl" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  )
}

export default Testimonials
