import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiUsers, FiAward, FiTrendingUp, FiArrowDown } from 'react-icons/fi'
import StatsCard from './StatsCard'
import gymFallback from '../assets/gym_hero_fallback.webp'
import Magnetic from './Magnetic'
import { API_URL } from '../config'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const heroRef = useRef(null)
  const videoContainerRef = useRef(null)
  const videoRef = useRef(null)
  const headlineRef = useRef(null)
  const subheadlineRef = useRef(null)
  const btnContainerRef = useRef(null)
  const statsContainerRef = useRef(null)
  const indicatorRef = useRef(null)

  const [settings, setSettings] = useState({
    gymName: "Muscle Craft Fitness Club",
    logoText: "Muscle Craft",
    heroTitle1: "Transform Your Body.",
    heroTitle2: "Transform Your Life.",
    heroSubheadline: "Expert trainers, cutting-edge equipment, personalized workout plans, and a motivating community designed to help you achieve your fitness goals faster.",
    membersActive: "15k+",
    eliteCoaches: "25+",
    successRate: "99.8%"
  })
  const [dataLoaded, setDataLoaded] = useState(false)

  // Fetch settings from local API
  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && data.heroTitle1) {
          setSettings(data)
        }
        setDataLoaded(true)
      })
      .catch(err => {
        console.log("Using default fallback settings:", err.message)
        setDataLoaded(true)
      })
  }, [])

  useEffect(() => {
    if (!dataLoaded) return

    const titleWords = headlineRef.current.querySelectorAll('.title-word')
    const subheadline = subheadlineRef.current
    const buttons = btnContainerRef.current.children
    const stats = statsContainerRef.current.children
    const indicator = indicatorRef.current

    // Set initial states
    gsap.set(subheadline, { opacity: 0, y: 30 })
    gsap.set(buttons, { opacity: 0, y: 20 })
    gsap.set(stats, { opacity: 0, scale: 0.8, y: 40 })
    gsap.set(indicator, { opacity: 0, y: -20 })

    const tl = gsap.timeline({ 
      defaults: { ease: 'power4.out' },
      onComplete: () => {
        // Trigger subtle continuous bobbing animation on the stats cards after entry is finished
        gsap.to('.float-card-1', { y: -10, duration: 2.5, ease: 'sine.inOut', repeat: -1, yoyo: true })
        gsap.to('.float-card-2', { y: 10, duration: 2.8, ease: 'sine.inOut', repeat: -1, yoyo: true })
        gsap.to('.float-card-3', { y: -8, duration: 2.3, ease: 'sine.inOut', repeat: -1, yoyo: true })
        
        // Continuous scroll indicator bob
        gsap.to(indicator, { y: 10, duration: 1.5, ease: 'power1.inOut', repeat: -1, yoyo: true })
      }
    })

    // Intro Animations
    tl.to(titleWords, {
      y: '0%',
      duration: 1.4,
      stagger: 0.08,
      ease: 'power4.out'
    })
    .to(subheadline, {
      opacity: 1,
      y: 0,
      duration: 1.2,
    }, '-=1.0')
    .to(buttons, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.15,
    }, '-=0.8')
    .to(stats, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1,
      stagger: 0.12,
    }, '-=0.6')
    .to(indicator, {
      opacity: 1,
      y: 0,
      duration: 0.8
    }, '-=0.5')

    // Scroll Trigger: Slow down video scroll & fade out hero content
    gsap.to(videoRef.current, {
      yPercent: 20,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef.current,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    })

    gsap.to('.hero-fade-out', {
      opacity: 0,
      y: -50,
      scrollTrigger: {
        trigger: heroRef.current,
        start: '20% top',
        end: 'bottom 40%',
        scrub: true
      }
    })

    // Mouse Move Parallax Logic
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e
      const width = window.innerWidth
      const height = window.innerHeight

      // Range from -1 to 1
      const xVal = (clientX - width / 2) / (width / 2)
      const yVal = (clientY - height / 2) / (height / 2)

      // Move video container in opposite direction for depth
      gsap.to(videoContainerRef.current, {
        x: -xVal * 20,
        y: -yVal * 20,
        duration: 0.8,
        ease: 'power2.out'
      })

      // Move content container slightly in same direction
      gsap.to('.parallax-text', {
        x: xVal * 12,
        y: yVal * 12,
        duration: 0.8,
        ease: 'power2.out'
      })

      // Move individual floating cards in opposite directions to amplify 3D parallax
      gsap.to('.float-card-1', {
        x: -xVal * 25,
        y: -yVal * 25,
        duration: 0.9,
        ease: 'power2.out'
      })
      gsap.to('.float-card-2', {
        x: xVal * 25,
        y: -yVal * 20,
        duration: 0.9,
        ease: 'power2.out'
      })
      gsap.to('.float-card-3', {
        x: -xVal * 20,
        y: yVal * 25,
        duration: 0.9,
        ease: 'power2.out'
      })
    }

    const heroEl = heroRef.current
    heroEl.addEventListener('mousemove', handleMouseMove)

    return () => {
      heroEl.removeEventListener('mousemove', handleMouseMove)
    }
  }, [dataLoaded])

  // Split titles into words
  const title1Words = settings.heroTitle1.split(" ")
  const title2Words = settings.heroTitle2.split(" ")

  return (
    <section 
      ref={heroRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-center overflow-hidden bg-dark-bg py-24 select-none"
      id="home"
    >
      {/* Background Video and Image Poster Fallback */}
      <div 
        ref={videoContainerRef} 
        className="absolute inset-0 w-full h-full scale-105 pointer-events-none"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-dark-bg/70 z-10" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-dark-bg/90 z-10" />
        <div className="absolute inset-0 grid-pattern opacity-40 z-10" />
        
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster={gymFallback}
        >
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-man-training-in-the-gym-with-dumbbells-41865-large.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
      </div>

      {/* Main Content Area */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center z-20 pointer-events-none mt-12 w-full">
        <div className="hero-fade-out parallax-text flex flex-col items-center max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border-white/5 text-neon-lime text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse"></span>
            {settings.gymName} Premium Athletic Experience
          </div>

          {/* Headline */}
          <h1 
            ref={headlineRef} 
            className="font-display text-3xl sm:text-5xl md:text-7xl lg:text-[88px] font-black tracking-tight text-white uppercase leading-[1.0] sm:leading-[0.95] mb-6 select-none flex flex-col items-center gap-1 sm:gap-0"
          >
            <span className="block py-1">
              {title1Words.map((word, wIdx) => {
                const isLast = wIdx === title1Words.length - 1
                return (
                  <span key={wIdx} className="inline-block overflow-hidden py-0.5 sm:py-1 mr-2 sm:mr-3">
                    <span className={`inline-block translate-y-full title-word ${isLast ? 'text-neon-lime text-glow-lime font-bold' : ''}`}>
                      {word}
                    </span>
                  </span>
                )
              })}
            </span>
            <span className="block py-1">
              {title2Words.map((word, wIdx) => {
                const isLast = wIdx === title2Words.length - 1
                return (
                  <span key={wIdx} className="inline-block overflow-hidden py-0.5 sm:py-1 mr-2 sm:mr-3">
                    <span className={`inline-block translate-y-full title-word ${isLast ? 'bg-clip-text text-transparent bg-gradient-to-r from-neon-lime to-neon-cyan font-bold' : ''}`}>
                      {word}
                    </span>
                  </span>
                )
              })}
            </span>
          </h1>

          {/* Subheadline */}
          <p 
            ref={subheadlineRef} 
            className="text-base md:text-lg lg:text-xl text-gray-300 font-medium leading-relaxed max-w-2xl mb-10 text-pretty"
          >
            {settings.heroSubheadline}
          </p>

          {/* CTA Buttons */}
          <div 
            ref={btnContainerRef} 
            className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pointer-events-auto mb-16"
          >
            <Magnetic>
              <a
                href="#join"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-neon-lime hover:bg-[#b5e000] text-black font-extrabold uppercase tracking-wider text-sm shadow-xl shadow-neon-lime/10 hover:shadow-neon-lime/30 transition-all duration-300 hover:-translate-y-1 hover:scale-105"
              >
                Start Your Journey
              </a>
            </Magnetic>
            <Magnetic>
              <a
                href="#trial"
                className="w-full sm:w-auto px-8 py-4 rounded-full glass-card hover:bg-white/5 text-white font-bold uppercase tracking-wider text-sm border-white/10 hover:border-neon-cyan/40 transition-all duration-300 hover:-translate-y-1 flex flex-col items-center gap-0.5"
              >
                <span>1-Day Trial Pass</span>
                <span className="text-neon-lime text-xs font-black tracking-widest">₹200 — Adjustable</span>
              </a>
            </Magnetic>
          </div>
          {/* Trial note */}
          <p className="text-xs text-gray-500 -mt-12 mb-4 text-center">
            ₹200 trial fee gets <span className="text-neon-lime font-semibold">fully adjusted</span> toward your membership if you join.
          </p>
        </div>

        {/* Floating Metrics / Stats Cards */}
        <div 
          ref={statsContainerRef} 
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 w-full max-w-4xl mt-4"
        >
          <div className="float-card-1 transition-transform duration-100 ease-out">
            <StatsCard 
              icon={FiUsers} 
              number={settings.membersActive} 
              label="Members Transformed" 
              highlightClass="text-neon-lime" 
            />
          </div>
          <div className="float-card-2 transition-transform duration-100 ease-out">
            <StatsCard 
              icon={FiAward} 
              number={settings.eliteCoaches} 
              label="Elite Coaches" 
              highlightClass="text-neon-cyan" 
            />
          </div>
          <div className="float-card-3 transition-transform duration-100 ease-out">
            <StatsCard 
              icon={FiTrendingUp} 
              number={settings.successRate} 
              label="Success Rate" 
              highlightClass="text-neon-pink" 
            />
          </div>
        </div>
      </div>

      {/* Floating Scroll Indicator */}
      <a 
        ref={indicatorRef}
        href="#programs"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hover:text-white transition-colors duration-300 z-20 pointer-events-auto"
      >
        <span className="text-[10px] font-bold uppercase tracking-widest">Explore Programs</span>
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center bg-dark-surface/50 backdrop-blur-sm">
          <FiArrowDown className="text-sm animate-bounce" />
        </div>
      </a>
    </section>
  )
}

export default Hero
