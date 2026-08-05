import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiUsers, FiAward, FiTrendingUp, FiActivity, FiZap, FiTarget, FiShield } from 'react-icons/fi'
import { FaDumbbell, FaFire } from 'react-icons/fa'
import heroSlide1 from '../assets/hero_slide_1.png'
import heroSlide2 from '../assets/hero_slide_2.png'
import heroSlide3 from '../assets/hero_slide_3.png'
import Magnetic from './Magnetic'

gsap.registerPlugin(ScrollTrigger)

const initialSlides = [
  {
    id: 1,
    image: heroSlide1,
    gymBadge: 'Muscle Craft Fitness Club',
    title: 'TRANSFORM YOUR BODY. TRANSFORM YOUR LIFE.',
    highlightWord: 'TRANSFORM YOUR LIFE.',
    stats: [
      { id: 'members', icon: FiUsers, label: 'Active Members', value: '15k+', posClass: 'top-[0%] sm:top-[6%] left-[1%] sm:left-[6%] lg:left-[14%]' },
      { id: 'coaches', icon: FiAward, label: 'Elite Coaches', value: '25+', posClass: 'top-[0%] sm:top-[6%] right-[1%] sm:right-[6%] lg:right-[14%]' },
      { id: 'success', icon: FiTrendingUp, label: 'Success Rate', value: '99.8%', posClass: 'bottom-[2%] sm:bottom-[8%] left-[1%] sm:left-[6%] lg:left-[14%]' },
      { id: 'equipment', icon: FaDumbbell, label: 'Pro Equipment', value: '100+', posClass: 'bottom-[2%] sm:bottom-[8%] right-[1%] sm:right-[6%] lg:right-[14%]' }
    ]
  },
  {
    id: 2,
    image: heroSlide2,
    gymBadge: 'High Performance Athletic Center',
    title: 'UNLEASH YOUR PEAK ATHLETIC POTENTIAL.',
    highlightWord: 'PEAK ATHLETIC POTENTIAL.',
    stats: [
      { id: 'trainers', icon: FiZap, label: 'Personal Trainers', value: '15+', posClass: 'top-[0%] sm:top-[6%] left-[1%] sm:left-[6%] lg:left-[14%]' },
      { id: 'intensity', icon: FaFire, label: 'Fat Loss Rate', value: '98%', posClass: 'top-[0%] sm:top-[6%] right-[1%] sm:right-[6%] lg:right-[14%]' },
      { id: 'plans', icon: FiActivity, label: 'Workout Plans', value: '50+', posClass: 'bottom-[2%] sm:bottom-[8%] left-[1%] sm:left-[6%] lg:left-[14%]' },
      { id: 'community', icon: FiUsers, label: 'Community', value: '12k+', posClass: 'bottom-[2%] sm:bottom-[8%] right-[1%] sm:right-[6%] lg:right-[14%]' }
    ]
  },
  {
    id: 3,
    image: heroSlide3,
    gymBadge: 'Elite Bodybuilding & Heavy Strength Zone',
    title: 'FORGE YOUR LEGACY. MASTER YOUR WILL.',
    highlightWord: 'MASTER YOUR WILL.',
    stats: [
      { id: 'focus', icon: FiTarget, label: 'Mindset Training', value: '100%', posClass: 'top-[0%] sm:top-[6%] left-[1%] sm:left-[6%] lg:left-[14%]' },
      { id: 'lift', icon: FaDumbbell, label: 'Heavy Racks', value: '20+', posClass: 'top-[0%] sm:top-[6%] right-[1%] sm:right-[6%] lg:right-[14%]' },
      { id: 'guarantee', icon: FiShield, label: 'Guaranteed Results', value: '100%', posClass: 'bottom-[2%] sm:bottom-[8%] left-[1%] sm:left-[6%] lg:left-[14%]' },
      { id: 'hours', icon: FiAward, label: 'Gym Facility', value: '24/7 Access', posClass: 'bottom-[2%] sm:bottom-[8%] right-[1%] sm:right-[6%] lg:right-[14%]' }
    ]
  }
]

const Hero = () => {
  const heroRef = useRef(null)
  const imageContainerRef = useRef(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [slides] = useState(initialSlides)

  // Auto carousel slide timer
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 6000)
    return () => clearInterval(timer)
  }, [currentSlideIndex, isAnimating])

  // Continuous bobbing animation on floating cards & mouse parallax
  useEffect(() => {
    const floatCards = document.querySelectorAll('.float-card')
    gsap.to(floatCards, {
      y: -6,
      duration: 2.2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      stagger: 0.2
    })

    const handleMouseMove = (e) => {
      if (!heroRef.current) return
      const { clientX, clientY } = e
      const width = window.innerWidth
      const height = window.innerHeight

      const xVal = (clientX - width / 2) / (width / 2)
      const yVal = (clientY - height / 2) / (height / 2)

      gsap.to(imageContainerRef.current, {
        x: xVal * 12,
        y: yVal * 12,
        duration: 0.8,
        ease: 'power2.out'
      })

      gsap.to('.float-card', {
        x: (i) => (i % 2 === 0 ? -xVal * 16 : xVal * 16),
        y: (i) => (i < 2 ? -yVal * 12 : yVal * 12),
        duration: 0.9,
        ease: 'power2.out'
      })
    }

    const heroEl = heroRef.current
    if (heroEl) {
      heroEl.addEventListener('mousemove', handleMouseMove)
    }
    return () => {
      if (heroEl) {
        heroEl.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [currentSlideIndex])

  const changeSlide = (newIndex) => {
    if (isAnimating || newIndex === currentSlideIndex) return
    setIsAnimating(true)

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentSlideIndex(newIndex)
        gsap.fromTo(
          '.slide-title',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
        )
        gsap.fromTo(
          '.hero-athlete-img',
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }
        )
        gsap.fromTo(
          '.float-card',
          { opacity: 0, scale: 0.75, y: 15 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'back.out(1.4)' }
        )
        setIsAnimating(false)
      }
    })

    tl.to(['.slide-title', '.hero-athlete-img', '.float-card'], {
      opacity: 0,
      y: -10,
      duration: 0.35,
      stagger: 0.03,
      ease: 'power2.in'
    })
  }

  const handlePrev = () => {
    const nextIdx = (currentSlideIndex - 1 + slides.length) % slides.length
    changeSlide(nextIdx)
  }

  const handleNext = () => {
    const nextIdx = (currentSlideIndex + 1) % slides.length
    changeSlide(nextIdx)
  }

  const currentSlide = slides[currentSlideIndex]

  return (
    <section 
      ref={heroRef}
      className="relative w-full min-h-fit sm:min-h-screen flex flex-col justify-between items-center overflow-hidden bg-[#08080a] pt-14 sm:pt-20 pb-4 sm:pb-6 select-none"
      id="home"
    >
      {/* Background Radial Glow & Grid Pattern */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-lime/10 rounded-full blur-[130px]" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#08080a]/60 to-[#08080a] z-10" />
        <div className="absolute inset-0 grid-pattern opacity-30 z-10" />
      </div>

      {/* Vertical Side Control Buttons (PREV / NEXT) */}
      <button 
        onClick={handlePrev}
        className="absolute left-1 sm:left-6 md:left-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 text-gray-400 hover:text-neon-lime transition-colors duration-300 py-4 sm:py-6 px-1.5 sm:px-2 cursor-pointer group"
        aria-label="Previous Slide"
      >
        <div className="text-[10px] sm:text-xs font-black tracking-[0.35em] sm:tracking-[0.4em] uppercase flex flex-col items-center gap-1.5 sm:gap-2 text-gray-400 group-hover:text-neon-lime group-hover:drop-shadow-[0_0_10px_rgba(204,255,0,0.8)] transition-all">
          <span>P</span>
          <span>R</span>
          <span>E</span>
          <span>V</span>
        </div>
      </button>

      <button 
        onClick={handleNext}
        className="absolute right-1 sm:right-6 md:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 text-gray-400 hover:text-neon-lime transition-colors duration-300 py-4 sm:py-6 px-1.5 sm:px-2 cursor-pointer group"
        aria-label="Next Slide"
      >
        <div className="text-[10px] sm:text-xs font-black tracking-[0.35em] sm:tracking-[0.4em] uppercase flex flex-col items-center gap-1.5 sm:gap-2 text-gray-400 group-hover:text-neon-lime group-hover:drop-shadow-[0_0_10px_rgba(204,255,0,0.8)] transition-all">
          <span>N</span>
          <span>E</span>
          <span>X</span>
          <span>T</span>
        </div>
      </button>

      {/* Top Section: Gym Badge & Compact Single-Line / 2-Line Headline */}
      <div className="relative z-20 text-center max-w-4xl mx-auto px-4 mt-1 sm:mt-4 select-none">
        {/* Gym Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-0.5 sm:py-1 rounded-full glass-card border-white/10 text-neon-lime text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1.5 sm:mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse"></span>
          {currentSlide.gymBadge}
        </div>

        {/* Compact Title */}
        <h1 className="slide-title font-display text-xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-tight">
          {currentSlide.title.includes(currentSlide.highlightWord) ? (
            <>
              {currentSlide.title.replace(currentSlide.highlightWord, '')}
              <span className="text-neon-lime text-glow-lime">{currentSlide.highlightWord}</span>
            </>
          ) : (
            currentSlide.title
          )}
        </h1>
      </div>

      {/* Center Athlete Photo - Compact height on mobile to remove empty gap */}
      <div 
        className="relative w-full max-w-4xl h-[280px] sm:h-[440px] md:h-[500px] flex items-center justify-center mx-auto my-1 sm:my-2 z-20"
      >
        {/* Center Athlete Photo Frame */}
        <div 
          ref={imageContainerRef}
          className="relative z-10 w-[220px] sm:w-[350px] md:w-[420px] h-full flex items-center justify-center overflow-hidden rounded-2xl"
        >
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#08080a]/20 to-[#08080a] z-10 pointer-events-none" />
          <img 
            src={currentSlide.image} 
            alt="Gym Hero Athlete" 
            className="hero-athlete-img w-full h-full object-contain object-top filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
          />
        </div>

        {/* 4 Floating Glass Cards (Real Gym Metrics) */}
        {currentSlide.stats.map((stat) => {
          const IconComp = stat.icon
          return (
            <div 
              key={stat.id}
              className={`float-card absolute ${stat.posClass} z-20 glass-card p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border border-white/10 flex flex-col items-center justify-center min-w-[85px] sm:min-w-[125px] shadow-2xl backdrop-blur-xl transition-transform duration-300 hover:scale-105 hover:border-neon-lime/40`}
            >
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-neon-lime/20 text-neon-lime flex items-center justify-center mb-0.5 sm:mb-1 shadow-[0_0_15px_rgba(204,255,0,0.3)]">
                <IconComp className="text-xs sm:text-lg text-neon-lime" />
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">{stat.label}</span>
              <span className="text-xs sm:text-lg font-black text-white">{stat.value}</span>
            </div>
          )
        })}
      </div>

      {/* Slide Navigation Dots */}
      <div className="relative z-30 flex items-center gap-2 my-1">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => changeSlide(idx)}
            className={`transition-all duration-300 rounded-full cursor-pointer ${
              idx === currentSlideIndex 
                ? 'w-7 h-2 bg-neon-lime shadow-[0_0_12px_rgba(204,255,0,0.8)]' 
                : 'w-2 h-2 bg-white/20 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Bottom Bar: Right-aligned on Desktop, Centered & Pulled UP on Mobile */}
      <div className="relative z-30 w-full max-w-6xl mx-auto px-4 sm:px-12 flex flex-row items-center justify-center sm:justify-end gap-4 mt-1 sm:mt-auto pb-1 sm:pb-4">
        {/* Neon Green Capsule Button */}
        <Magnetic>
          <a
            href="#join"
            className="inline-flex items-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full bg-neon-lime hover:bg-[#b8e600] text-black font-black uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_25px_rgba(204,255,0,0.4)] hover:shadow-[0_0_40px_rgba(204,255,0,0.6)] transition-all duration-300 hover:scale-105"
          >
            <span>Let's Start</span>
            <span className="font-mono text-xs sm:text-sm font-bold tracking-tighter"> &gt;&gt;&gt;</span>
          </a>
        </Magnetic>
      </div>
    </section>
  )
}

export default Hero
