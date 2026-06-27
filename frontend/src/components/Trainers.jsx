import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiInstagram, FiTwitter, FiAward } from 'react-icons/fi'
import coachViktor from '../assets/coach_viktor.webp'
import coachSeraphina from '../assets/coach_seraphina.webp'
import coachMarcus from '../assets/coach_marcus.webp'
import { API_URL } from '../config'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const Trainers = () => {
  const sectionRef = useRef(null)
  const cardsContainerRef = useRef(null)
  const [coaches, setCoaches] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)

  const fallbackCoaches = [
    {
      name: 'Viktor Vance',
      role: 'Strength & Hypertrophy Director',
      exp: '9 Yrs Exp',
      image: coachViktor,
      accentColor: 'text-neon-lime border-neon-lime/20',
      badgeBg: 'bg-neon-lime/10',
      glow: 'shadow-neon-lime/5 hover:shadow-neon-lime/20',
      borderColor: 'group-hover:border-neon-lime/30',
      socials: { instagram: '#', twitter: '#' },
      certs: [
        'CSCS (Certified Strength & Conditioning Specialist)',
        'NASM-PES (Performance Enhancement)',
        'FMS Level 2 Functional Movement Screen'
      ]
    },
    {
      name: 'Seraphina Sterling',
      role: 'Metabolic & Biokinetics Coach',
      exp: '7 Yrs Exp',
      image: coachSeraphina,
      accentColor: 'text-neon-cyan border-neon-cyan/20',
      badgeBg: 'bg-neon-cyan/10',
      glow: 'shadow-neon-cyan/5 hover:shadow-neon-cyan/20',
      borderColor: 'group-hover:border-neon-cyan/30',
      socials: { instagram: '#', twitter: '#' },
      certs: [
        'B.Sc. Exercise & Sports Science',
        'NASM-CES (Corrective Exercise)',
        'EXOS Phase 1 Performance Coaching'
      ]
    },
    {
      name: 'Marcus Drake',
      role: 'Olympic Weightlifting Coordinator',
      exp: '11 Yrs Exp',
      image: coachMarcus,
      accentColor: 'text-neon-pink border-neon-pink/20',
      badgeBg: 'bg-neon-pink/10',
      glow: 'shadow-neon-pink/5 hover:shadow-neon-pink/20',
      borderColor: 'group-hover:border-neon-pink/30',
      socials: { instagram: '#', twitter: '#' },
      certs: [
        'USAW Level 2 Weightlifting Coach',
        'CSCS (Strength & Conditioning Specialist)',
        'Precision Nutrition Level 2 Certified'
      ]
    }
  ]

  useEffect(() => {
    fetch(`${API_URL}/api/trainers`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setCoaches(data)
        } else {
          setCoaches(fallbackCoaches)
        }
        setDataLoaded(true)
      })
      .catch(err => {
        console.log("Using default fallback coaches:", err.message)
        setCoaches(fallbackCoaches)
        setDataLoaded(true)
      })
  }, [])

  useEffect(() => {
    if (!dataLoaded) return

    // Reveal section headers
    gsap.fromTo('.trainers-reveal',
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

    // Stagger reveal of coach cards
    if (cardsContainerRef.current) {
      const cards = cardsContainerRef.current.children
      gsap.fromTo(cards,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          stagger: 0.15,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }
  }, [dataLoaded])

  return (
    <section 
      ref={sectionRef}
      id="trainers" 
      className="relative w-full py-20 md:py-28 bg-[#0a0a0d] overflow-hidden border-t border-white/5"
    >
      {/* Background radial effects */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-neon-lime/3 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-neon-cyan/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="trainers-reveal text-center max-w-2xl mx-auto mb-20">
          <div className="text-neon-lime text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-lime inline-block animate-pulse"></span>
            Muscle Craft Coaching Council
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
            ELITE <span className="text-stroke-neon">COACHES.</span> <br />
            UNMATCHED SCIENTIFIC RIGOR.
          </h2>
          <p className="text-gray-400 font-sans text-sm md:text-base leading-relaxed">
            Our directors hold advanced degrees and industry credentials in sports science, biomechanics, and human kinetics. We plan with precision to execute with authority.
          </p>
        </div>

        {/* Profiles Grid */}
        <div 
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
        >
          {coaches.map((coach, idx) => (
            <div 
              key={idx}
              className={`relative group aspect-[3/4] rounded-[2.5rem] overflow-hidden border border-white/5 bg-dark-surface shadow-2xl transition-all duration-500 hover:-translate-y-2 select-none max-w-sm mx-auto w-full md:max-w-none ${coach.glow} ${coach.borderColor}`}
            >
              {/* Profile Photo */}
              <img 
                src={coach.image} 
                alt={coach.name} 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 pointer-events-none"
              />

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-transparent to-transparent opacity-85 z-10 transition-opacity duration-500 group-hover:opacity-0" />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/60 to-dark-bg/15 opacity-0 group-hover:opacity-95 z-10 transition-opacity duration-500" />

              {/* Card Details Overlay Container */}
              <div className="absolute inset-x-0 bottom-0 p-8 z-20 flex flex-col justify-end h-full">
                
                {/* Header info (Always visible) */}
                <div className="translate-y-8 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                  
                  {/* Experience Badge */}
                  <span className={`inline-block text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full mb-3 border ${coach.accentColor} ${coach.badgeBg}`}>
                    {coach.exp}
                  </span>

                  {/* Coach Name */}
                  <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight leading-tight">
                    {coach.name}
                  </h3>

                  {/* Coach Role Specialization */}
                  <p className="text-xs text-gray-400 font-sans tracking-wide mt-1.5 mb-4">
                    {coach.role}
                  </p>
                </div>

                {/* Expanded items (Reveal on Hover) */}
                <div className="opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75 border-t border-white/10 pt-4 mt-1 flex flex-col">
                  
                  {/* Credentials title */}
                  <h4 className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-3 flex items-center gap-1.5">
                    <FiAward className="text-white text-xs" />
                    Specialist Credentials
                  </h4>

                  {/* Certifications list */}
                  <ul className="flex flex-col gap-2 mb-6">
                    {coach.certs?.map((cert, certIdx) => (
                      <li key={certIdx} className="text-[10px] text-gray-400 font-sans leading-snug flex items-start gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 mt-1 flex-shrink-0"></span>
                        {cert}
                      </li>
                    ))}
                  </ul>

                  {/* Social Handles */}
                  <div className="flex gap-4">
                    {coach.socials?.instagram && coach.socials.instagram !== '#' && (
                      <a 
                        href={coach.socials.instagram} 
                        className="text-gray-500 hover:text-white transition-colors duration-300"
                        aria-label={`${coach.name} Instagram`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FiInstagram className="text-base" />
                      </a>
                    )}
                    {coach.socials?.twitter && coach.socials.twitter !== '#' && (
                      <a 
                        href={coach.socials.twitter} 
                        className="text-gray-500 hover:text-white transition-colors duration-300"
                        aria-label={`${coach.name} Twitter`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <FiTwitter className="text-base" />
                      </a>
                    )}
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Trainers
