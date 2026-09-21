import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiPlay, FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { IoCloseOutline } from 'react-icons/io5'

// Client Avatars
import clientAlex from '../assets/client_alexander.webp'
import clientDom from '../assets/client_dominic.webp'
import clientVal from '../assets/client_valerie.webp'
import coachSera from '../assets/coach_seraphina.webp'
import gymVideo from '../assets/video/No matter where you are in your fitness journey_ there_s always another level to reach.__Push harder. Train smarter. Stay consistent._Because real progress (.mp4'

import Magnetic from './Magnetic'

gsap.registerPlugin(ScrollTrigger)

// 100% REAL HUMAN & REAL GYM PHOTOGRAPHY (Unsplash High-Res Fitness Collection)
const realHero1 = 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=1600&auto=format&fit=crop'
const realHero2 = 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1600&auto=format&fit=crop'
const realHero3 = 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1600&auto=format&fit=crop'
const realHero4 = 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?q=80&w=1600&auto=format&fit=crop'

// Real Outdoor Runners Photo (Matching Reference Screenshot)
const realRunnersPhoto = 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=600&auto=format&fit=crop'

const heroSlides = [
  {
    id: 1,
    image: realHero1,
    titleMain: 'Ignite your',
    titleItalic: 'stamina,',
    titleSecond: 'break every',
    titleAccent: 'limit',
    subtitle: 'High intensity interval sprints and biomechanical recovery engineered for rapid fat burn.',
    badgeText: '99.8% MEMBER SATISFACTION RATE',
    pins: [
      { id: 'p1', label: 'HIIT Fat Burn' },
      { id: 'p2', label: 'Biometric Tracking' },
      { id: 'p3', label: 'Cryo Recovery Tech' }
    ]
  },
  {
    id: 2,
    image: realHero2,
    titleMain: 'Transform your',
    titleItalic: 'body,',
    titleSecond: 'empower your',
    titleAccent: 'mind',
    subtitle: 'Take charge of your health with personalized fitness programs, balanced nutrition, and expert guidance.',
    badgeText: '25K+ SATISFIED CLIENTS WITH US',
    pins: [
      { id: 'p1', label: 'Improved Health' },
      { id: 'p2', label: 'Expert Guidance' },
      { id: 'p3', label: 'Community Support' }
    ]
  },
  {
    id: 3,
    image: realHero3,
    titleMain: 'Unleash your',
    titleItalic: 'strength,',
    titleSecond: 'conquer your',
    titleAccent: 'goals',
    subtitle: 'Heavy-duty equipment, master coaching, and relentless discipline built to forge your elite physique.',
    badgeText: '15K+ PEAK ATHLETES TRAINED',
    pins: [
      { id: 'p1', label: 'Peak Power Output' },
      { id: 'p2', label: 'Pro Gear Racks' },
      { id: 'p3', label: '100% Results Rate' }
    ]
  },
  {
    id: 4,
    image: realHero4,
    titleMain: 'Forge your',
    titleItalic: 'legacy,',
    titleSecond: 'master your',
    titleAccent: 'will',
    subtitle: 'Elevate your mental toughness and physical endurance with specialized athletic conditioning.',
    badgeText: '12+ YEARS OF ATHLETIC INNOVATION',
    pins: [
      { id: 'p1', label: 'Iron Mindset' },
      { id: 'p2', label: 'Custom Meal Plans' },
      { id: 'p3', label: '24/7 Facility Access' }
    ]
  }
]

const Hero = () => {
  const heroRef = useRef(null)
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)

  // Auto carousel slider (5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 5000)
    return () => clearInterval(timer)
  }, [currentSlideIndex, isAnimating])

  // GSAP slide transition
  const changeSlide = (newIndex) => {
    if (isAnimating || newIndex === currentSlideIndex) return
    setIsAnimating(true)

    const tl = gsap.timeline({
      onComplete: () => {
        setCurrentSlideIndex(newIndex)
        gsap.fromTo(
          '.hero-text-content',
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }
        )
        gsap.fromTo(
          '.hero-bg-img',
          { opacity: 0, scale: 1.03 },
          { opacity: 1, scale: 1, duration: 0.7, ease: 'power3.out' }
        )
        gsap.fromTo(
          '.image2-hotspot-container',
          { opacity: 0, x: 20 },
          { opacity: 1, x: 0, duration: 0.6, ease: 'back.out(1.4)' }
        )
        setIsAnimating(false)
      }
    })

    tl.to(['.hero-text-content', '.image2-hotspot-container'], {
      opacity: 0,
      y: -10,
      duration: 0.25,
      ease: 'power2.in'
    })
  }

  const handlePrev = () => {
    const nextIdx = (currentSlideIndex - 1 + heroSlides.length) % heroSlides.length
    changeSlide(nextIdx)
  }

  const handleNext = () => {
    const nextIdx = (currentSlideIndex + 1) % heroSlides.length
    changeSlide(nextIdx)
  }

  const currentSlide = heroSlides[currentSlideIndex]

  return (
    <section 
      ref={heroRef}
      id="home"
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#08080a] pt-24 pb-10 select-none"
    >
      {/* Background 4-Image Carousel with 100% Real Human Photography */}
      <div className="absolute inset-0 z-0">
        {heroSlides.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlideIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <img
              src={slide.image}
              alt="Real Gym Athlete"
              className="hero-bg-img w-full h-full object-cover object-center filter brightness-[0.85] contrast-[1.05] transform scale-100 transition-transform duration-1000"
            />
            {/* Lighter, natural gradient overlay for high photo clarity */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-[#08080a]/60" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#08080a]/85 via-[#08080a]/30 to-transparent" />
          </div>
        ))}
      </div>

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-20 my-auto flex flex-col justify-between min-h-[72vh]">
        
        {/* Middle Layout: Headline on Left + Image 2 Hotspot Badges on Right */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 my-auto pt-6 sm:pt-10">
          
          {/* Left Text Block: Compact Typography */}
          <div className="hero-text-content max-w-xl text-left">
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-[3.3rem] font-black text-white leading-[1.1] uppercase tracking-tight mb-5">
              {currentSlide.titleMain} <br className="hidden sm:block" />
              <span className="font-serif italic font-normal text-neon-lime text-glow-lime lowercase">
                {currentSlide.titleItalic}
              </span>{' '}
              {currentSlide.titleSecond} <br className="hidden sm:block" />
              <span className="font-serif italic font-normal text-white lowercase border-b-2 border-neon-lime pb-0.5">
                {currentSlide.titleAccent}
              </span>
            </h1>

            <p className="text-gray-300 font-sans text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mb-7">
              {currentSlide.subtitle}
            </p>

            {/* Primary Action CTA Button */}
            <div className="flex flex-wrap items-center gap-4">
              <Magnetic>
                <a
                  href="#join"
                  className="inline-flex items-center justify-center px-7 py-3.5 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-neon-lime hover:from-orange-600 hover:to-neon-lime text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-2xl shadow-orange-500/30 hover:shadow-neon-lime/40 transition-all duration-300 transform hover:scale-105"
                >
                  Start Your Journey
                </a>
              </Magnetic>
            </div>
          </div>

          {/* Right Side: Stack of 3 White Outline Pill Badges */}
          <div className="image2-hotspot-container hidden lg:flex flex-col gap-3.5 items-end relative z-30 ml-auto mr-4">
            {currentSlide.pins.map((pin) => (
              <div
                key={pin.id}
                className="group flex items-center gap-2.5 px-4 py-2 rounded-full border border-white/40 bg-black/40 backdrop-blur-md text-white text-xs font-bold tracking-wide shadow-2xl transition-all duration-300 hover:border-neon-lime hover:bg-black/70 hover:scale-105"
              >
                <span className="w-3.5 h-3.5 rounded-full bg-white border-2 border-slate-700 shadow-md group-hover:bg-neon-lime shrink-0" />
                <span className="whitespace-nowrap">{pin.label}</span>
              </div>
            ))}
          </div>

        </div>

        {/* Bottom Navigation & Controls Bar */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 mt-auto border-t border-white/10 relative z-30">
          
          {/* Slide Indicator Dots & Counter */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {heroSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => changeSlide(idx)}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === currentSlideIndex
                      ? 'w-8 h-2.5 bg-neon-lime shadow-[0_0_12px_rgba(204,255,0,0.8)]'
                      : 'w-2.5 h-2.5 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <span className="text-xs font-mono font-bold text-gray-400">
              0{currentSlideIndex + 1} / 0{heroSlides.length}
            </span>
          </div>

          {/* Prev / Next Slide Arrows */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-white/15 glass-card text-white hover:text-neon-lime hover:border-neon-lime/40 transition-all duration-300 cursor-pointer"
              aria-label="Previous Slide"
            >
              <FiChevronLeft className="text-lg" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-white/15 glass-card text-white hover:text-neon-lime hover:border-neon-lime/40 transition-all duration-300 cursor-pointer"
              aria-label="Next Slide"
            >
              <FiChevronRight className="text-lg" />
            </button>
          </div>

          {/* Watch Video Pill Button (Bottom Right) */}
          <Magnetic>
            <button
              onClick={() => setIsVideoModalOpen(true)}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-2xl hover:bg-neon-lime transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <span>Watch Video</span>
              <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center">
                <FiPlay className="text-xs ml-0.5" />
              </div>
            </button>
          </Magnetic>

        </div>

      </div>

      {/* Video Lightbox Modal */}
      {isVideoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-xl animate-fade-in"
          onClick={() => setIsVideoModalOpen(false)}
        >
          <button
            onClick={() => setIsVideoModalOpen(false)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white transition-all p-2.5 sm:p-3 rounded-full bg-white/10 hover:bg-white/20 text-2xl sm:text-3xl focus:outline-none z-[60] cursor-pointer"
            aria-label="Close Video Modal"
          >
            <IoCloseOutline />
          </button>

          <div
            className="relative max-h-[85vh] max-w-[92vw] sm:max-w-md md:max-w-lg rounded-2xl sm:rounded-3xl overflow-hidden border border-white/20 shadow-2xl bg-black flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              className="max-h-[85vh] w-auto max-w-full object-contain rounded-2xl sm:rounded-3xl"
              src={gymVideo}
              controls
              autoPlay
              playsInline
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
    </section>
  )
}

export default Hero
