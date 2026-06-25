import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiChevronLeft, FiChevronRight, FiCheckCircle } from 'react-icons/fi'
import afterMarcus from '../assets/after_marcus.webp'
import afterElena from '../assets/after_elena.webp'
import afterJulian from '../assets/after_julian.webp'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const BeforeAfterSlider = ({ beforeImg, afterImg, accentColor }) => {
  const [sliderPos, setSliderPos] = useState(50)
  const containerRef = useRef(null)

  const handleMove = (clientX) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = clientX - rect.left
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setSliderPos(percentage)
  }

  const handleMouseMove = (e) => {
    handleMove(e.clientX)
  }

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      handleMove(e.touches[0].clientX)
    }
  }

  return (
    <div 
      ref={containerRef}
      className="relative w-full aspect-[4/5] sm:aspect-[4/3] md:aspect-[4/5] rounded-3xl overflow-hidden select-none border border-white/10 group cursor-ew-resize shadow-2xl touch-none"
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {/* Before Image: Grayscale and darker */}
      <div className="absolute inset-0 grayscale contrast-125 brightness-50">
        <img 
          src={beforeImg} 
          alt="Before Transformation" 
          className="w-full h-full object-cover pointer-events-none" 
        />
        <div className="absolute top-6 left-6 bg-black/75 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest text-gray-400 border border-white/5">
          BEFORE
        </div>
      </div>

      {/* After Image: Clipped overlay */}
      <div 
        className="absolute inset-0 overflow-hidden" 
        style={{ clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)` }}
      >
        <img 
          src={afterImg} 
          alt="After Transformation" 
          className="w-full h-full object-cover pointer-events-none" 
        />
        <div 
          className="absolute top-6 right-6 bg-black/75 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-extrabold tracking-widest border"
          style={{ borderColor: `${accentColor}30`, color: accentColor }}
        >
          AFTER
        </div>
      </div>

      {/* Drag Bar & Handle */}
      <div 
        className="absolute top-0 bottom-0 w-[2px] cursor-ew-resize pointer-events-none"
        style={{ 
          left: `${sliderPos}%`,
          backgroundColor: accentColor || '#ccff00',
          boxShadow: `0 0 15px ${accentColor || '#ccff00'}`
        }}
      >
        {/* Circular Drag Pin */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-dark-bg border flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110"
          style={{ borderColor: accentColor }}
        >
          <span className="text-white text-xs tracking-tight font-extrabold select-none flex gap-0.5 pointer-events-none">
            <span>&lsaquo;</span>
            <span>&rsaquo;</span>
          </span>
        </div>
      </div>

      {/* Visual Instruction Badge */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-dark-bg/80 backdrop-blur-lg border border-white/5 px-4 py-2 rounded-xl text-[10px] text-gray-400 tracking-wider font-semibold pointer-events-none opacity-100 group-hover:opacity-0 transition-opacity duration-300">
        Hover or drag to compare results
      </div>
    </div>
  )
}

const Transformations = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const sectionRef = useRef(null)
  const cardRef = useRef(null)

  useEffect(() => {
    // ScrollReveal for Section Headers
    gsap.fromTo('.trans-reveal',
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

  const stories = [
    {
      name: 'Marcus Vance',
      program: 'HyperPhysique hypertrophy',
      duration: '16 Weeks Program',
      tagline: 'Rebuilt with Lean Muscle mass',
      quote: "The scientific training paradigms at Aura completely transformed my athletic build. My coach calibrated every single block to bypass genetic plateaus safely.",
      accentColor: '#ccff00', // Neon Lime
      image: afterMarcus,
      stats: [
        { label: 'Lean Mass Gained', value: '+6.2 kg' },
        { label: 'Body Fat Reduced', value: '-12.5%' },
        { label: 'Bench Press Max', value: '+45 kg' }
      ]
    },
    {
      name: 'Elena Rostova',
      program: 'Metcon Redline engine',
      duration: '12 Weeks Program',
      tagline: 'Metabolic Redesign and VO2 Max',
      quote: "I signed up at Aura to sharpen my cardiovascular output, but I walked away with a brand-new engine. The conditioning framework reshaped my lifestyle.",
      accentColor: '#00f0ff', // Neon Cyan
      image: afterElena,
      stats: [
        { label: 'Weight Optimisation', value: '-14.8 kg' },
        { label: 'VO2 Max Improvement', value: '+38%' },
        { label: 'Resting Heart Rate', value: '-15 bpm' }
      ]
    },
    {
      name: 'Julian Hayes',
      program: 'Athletic Apex resilience',
      duration: '24 Weeks Program',
      tagline: 'Joint Performance & Rehab',
      quote: "After a severe knee injury, I assumed my competitive days were over. Aura's biomechanics-focused recovery programming got me moving stronger than ever.",
      accentColor: '#ff007f', // Neon Pink
      image: afterJulian,
      stats: [
        { label: 'Deadlift Capacity', value: '+75 kg' },
        { label: 'Vertical Jump Gain', value: '+12 cm' },
        { label: 'Pain Index Decline', value: '-90%' }
      ]
    }
  ]

  const current = stories[activeSlide]

  const handleNext = () => {
    gsap.to(cardRef.current, {
      opacity: 0,
      y: -15,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setActiveSlide((prev) => (prev === stories.length - 1 ? 0 : prev + 1))
        gsap.fromTo(cardRef.current,
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
        )
      }
    })
  }

  const handlePrev = () => {
    gsap.to(cardRef.current, {
      opacity: 0,
      y: 15,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setActiveSlide((prev) => (prev === 0 ? stories.length - 1 : prev - 1))
        gsap.fromTo(cardRef.current,
          { opacity: 0, y: -15 },
          { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }
        )
      }
    })
  }

  return (
    <section 
      ref={sectionRef}
      id="transformations" 
      className="relative w-full py-20 md:py-28 bg-[#08080a] overflow-hidden border-t border-white/5"
    >
      {/* Background graphic designs */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-neon-cyan/3 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-neon-lime/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="trans-reveal text-center max-w-2xl mx-auto mb-20">
          <div className="text-neon-lime text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-lime inline-block animate-pulse"></span>
            Aura Success Stories
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
            REAL RESULTS. <br className="sm:hidden" />
            <span className="text-stroke-neon">REAL TRANSFORMATIONS.</span>
          </h2>
          <p className="text-gray-400 font-sans text-sm md:text-base leading-relaxed">
            Witness the ultimate manifestation of biometric design and physical discipline. These are actual club members who redesigned their performance thresholds.
          </p>
        </div>

        {/* Transitioning Card Container */}
        <div ref={cardRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          
          {/* Left Side: BeforeAfterSlider widget */}
          <div className="lg:col-span-5 w-full md:max-w-md lg:max-w-none mx-auto">
            <BeforeAfterSlider 
              beforeImg={current.image}
              afterImg={current.image}
              accentColor={current.accentColor}
            />
          </div>

          {/* Right Side: Copy details */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Tagline details */}
            <div 
              className="text-xs font-bold uppercase tracking-widest mb-3"
              style={{ color: current.accentColor }}
            >
              {current.duration} &bull; {current.program}
            </div>

            {/* Profile Name & Heading */}
            <h3 className="font-display text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight mb-2">
              {current.name}
            </h3>
            <h4 className="text-lg md:text-xl text-gray-300 font-medium tracking-wide mb-6">
              &ldquo;{current.tagline}&rdquo;
            </h4>

            {/* Testimonial Quote */}
            <div className="relative mb-8 pl-6 border-l border-white/10 italic text-gray-400 text-sm md:text-base leading-relaxed">
              <span className="absolute left-0 top-0 text-3xl font-serif text-white/10 leading-none">&ldquo;</span>
              {current.quote}
            </div>

            {/* Stats Metrics Display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 p-5 sm:p-6 rounded-2xl bg-dark-surface/50 border border-white/5 backdrop-blur-md mb-8">
              {current.stats.map((stat, idx) => (
                <div key={idx} className="flex flex-col text-left">
                  <span 
                    className="font-display text-xl md:text-2xl font-black"
                    style={{ color: current.accentColor }}
                  >
                    {stat.value}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Slider Navigation Row */}
            <div className="flex items-center justify-between">
              
              {/* Dot Indicators */}
              <div className="flex gap-2.5">
                {stories.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => {
                      gsap.to(cardRef.current, {
                        opacity: 0,
                        duration: 0.25,
                        onComplete: () => {
                          setActiveSlide(idx)
                          gsap.to(cardRef.current, { opacity: 1, duration: 0.35 })
                        }
                      })
                    }}
                    className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                    style={{ 
                      backgroundColor: idx === activeSlide ? current.accentColor : 'rgba(255,255,255,0.15)',
                      transform: idx === activeSlide ? 'scale(1.25)' : 'scale(1)'
                    }}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex gap-4">
                <button 
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300 active:scale-95"
                  aria-label="Previous story"
                >
                  <FiChevronLeft className="text-xl" />
                </button>
                <button 
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:border-white/30 hover:bg-white/5 transition-all duration-300 active:scale-95"
                  aria-label="Next story"
                >
                  <FiChevronRight className="text-xl" />
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  )
}

export default Transformations
