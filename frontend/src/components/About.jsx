import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiAward, FiCpu, FiTarget, FiUsers } from 'react-icons/fi'
import aboutGym from '../assets/about_gym.webp'
import { API_URL } from '../config'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const About = () => {
  const sectionRef = useRef(null)
  const imageRef = useRef(null)
  const containerRef = useRef(null)

  const [settings, setSettings] = useState({
    aboutYears: "12",
    aboutMembers: "8500",
    aboutCoaches: "24",
    aboutPhoto: "",
    estYear: "2014",
    estTagline: "12 Years of Athletic Innovation"
  })
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  // Fetch settings from local API
  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings({
            aboutYears: data.aboutYears || "12",
            aboutMembers: data.aboutMembers || "8500",
            aboutCoaches: data.aboutCoaches || "24",
            aboutPhoto: data.aboutPhoto || "",
            estYear: data.estYear || "2014",
            estTagline: data.estTagline || "12 Years of Athletic Innovation"
          })
        }
        setSettingsLoaded(true)
      })
      .catch(err => {
        console.log("Using default fallback about stats:", err.message)
        setSettingsLoaded(true)
      })
  }, [])

  useEffect(() => {
    if (!settingsLoaded) return

    // 1. Image Zoom-in / Parallax on Scroll
    gsap.fromTo(imageRef.current,
      { scale: 1.25 },
      {
        scale: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      }
    )

    // 2. Text Reveal Fade-Up
    const revealElements = containerRef.current.querySelectorAll('.about-reveal')
    gsap.fromTo(revealElements,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // 3. Counter Animation
    const counterElements = containerRef.current.querySelectorAll('.stat-counter')
    counterElements.forEach((el) => {
      const target = parseInt(el.getAttribute('data-target'), 10)
      const obj = { val: 0 }
      
      gsap.to(obj, {
        val: target,
        duration: 2.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        onUpdate: () => {
          el.innerText = Math.floor(obj.val).toLocaleString()
        }
      })
    })
  }, [settingsLoaded])

  const pillars = [
    {
      icon: FiAward,
      title: 'Certified Trainers',
      desc: 'Elite coaches with advanced sports science certifications directing your progression.',
      accent: 'border-neon-lime/20 hover:border-neon-lime/50',
      iconColor: 'text-neon-lime'
    },
    {
      icon: FiCpu,
      title: 'High-Tech Environment',
      desc: 'Smart biometric feedback systems and performance optimization gear at every station.',
      accent: 'border-neon-cyan/20 hover:border-neon-cyan/50',
      iconColor: 'text-neon-cyan'
    },
    {
      icon: FiTarget,
      title: 'Bespoke Blueprinting',
      desc: 'Nutrition, strength, and recovery schedules mapped precisely around your biomarkers.',
      accent: 'border-neon-pink/20 hover:border-neon-pink/50',
      iconColor: 'text-neon-pink'
    },
    {
      icon: FiUsers,
      title: 'The Elite Syndicate',
      desc: 'Connect with a highly motivated network of elite performers driving mutual growth.',
      accent: 'border-neon-lime/20 hover:border-neon-lime/50',
      iconColor: 'text-neon-lime'
    }
  ]

  return (
    <section 
      ref={sectionRef}
      id="about" 
      className="relative w-full py-20 md:py-28 bg-dark-bg overflow-hidden grid-pattern border-t border-white/5"
    >
      {/* Background glow filters */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-neon-lime/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-neon-cyan/3 rounded-full blur-[120px] pointer-events-none" />

      <div ref={containerRef} className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-24">
          
          {/* Left Column: Image with offset design */}
          <div className="lg:col-span-5 relative w-full aspect-[4/5] md:max-w-md lg:max-w-none mx-auto about-reveal">
            
            {/* Background design accents */}
            <div className="absolute -inset-3 border border-neon-lime/20 rounded-[2rem] pointer-events-none translate-x-3 translate-y-3" />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent z-10 rounded-2xl pointer-events-none" />
            
            {/* Image Container with Zoom Animation */}
            <div className="w-full h-full rounded-2xl overflow-hidden shadow-2xl relative border border-white/10">
              <img 
                ref={imageRef}
                src={settings.aboutPhoto || aboutGym} 
                alt="Muscle Craft Gym Interior" 
                className="w-full h-full object-cover object-center scale-125"
              />
            </div>

            {/* Overlapping Glassmorphic Badge */}
            <div className="absolute bottom-6 right-6 z-20 glass-card px-5 py-4 rounded-xl max-w-[180px] shadow-glass shadow-black/45">
              <div className="text-2xl font-extrabold font-display text-neon-lime leading-tight tracking-wider">EST. {settings.estYear}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold mt-1">{settings.estTagline}</div>
            </div>
          </div>

          {/* Right Column: Copy & Value Pillars */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Section Tagline */}
            <div className="about-reveal text-neon-lime text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-lime inline-block animate-pulse"></span>
              The Muscle Craft Sanctuary
            </div>

            {/* Section Title */}
            <h2 className="about-reveal font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none mb-6">
              REDEFINE <span className="text-stroke-neon">LIMITS.</span> <br />
              ELEVATE STANDARDS.
            </h2>

            {/* Description */}
            <p className="about-reveal text-gray-400 font-sans text-base md:text-lg leading-relaxed mb-10 max-w-2xl">
              At Muscle Craft, we believe fitness is not a routine—it is a pursuit of refinement. 
              We have constructed a dark-luxury sanctuary where sport science meets peak aesthetic elegance. 
              Our mission is to guide you on a transformative path through custom programming, state-of-the-art training tech, and a community of high-achievers.
            </p>

            {/* Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {pillars.map((pillar, idx) => {
                const Icon = pillar.icon
                return (
                  <div 
                    key={idx} 
                    className={`about-reveal flex flex-col gap-3 p-5 rounded-2xl border bg-dark-surface/30 backdrop-blur-md transition-all duration-300 ${pillar.accent} group hover:-translate-y-1`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 transition-transform duration-300 group-hover:scale-105`}>
                        <Icon className={`text-xl ${pillar.iconColor}`} />
                      </div>
                      <h3 className="font-semibold text-white tracking-wide text-sm">{pillar.title}</h3>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-sans">{pillar.desc}</p>
                  </div>
                )
              })}
            </div>
            
          </div>
        </div>

        {/* Full-width Stats & Counter Bar */}
        <div className="about-reveal mt-12 w-full glass-card py-8 px-6 md:px-12 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center relative overflow-hidden shadow-glass">
          
          {/* Subtle line glow */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-neon-lime/30 to-transparent" />
          
          {/* Stat 1 */}
          <div className="flex flex-col justify-center py-4 md:py-0 md:px-4">
            <span className="font-display text-5xl md:text-6xl font-black text-white leading-none tracking-tight flex justify-center items-baseline">
              <span className="stat-counter text-glow-lime text-neon-lime" data-target={settings.aboutYears}>0</span>
              <span className="text-neon-lime">+</span>
            </span>
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mt-3">Years of Excellence</span>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col justify-center py-4 md:py-0 md:px-4">
            <span className="font-display text-5xl md:text-6xl font-black text-white leading-none tracking-tight flex justify-center items-baseline">
              <span className="stat-counter text-glow-cyan text-neon-cyan" data-target={settings.aboutMembers}>0</span>
              <span className="text-neon-cyan">+</span>
            </span>
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mt-3">Members Transformed</span>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col justify-center py-4 md:py-0 md:px-4">
            <span className="font-display text-5xl md:text-6xl font-black text-white leading-none tracking-tight flex justify-center items-baseline">
              <span className="stat-counter text-white" data-target={settings.aboutCoaches}>0</span>
              <span className="text-white">+</span>
            </span>
            <span className="text-xs font-bold tracking-widest text-gray-400 uppercase mt-3">Elite Coaches</span>
          </div>

        </div>

      </div>
    </section>
  )
}

export default About
