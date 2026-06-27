import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiAward, FiActivity, FiCreditCard, FiTarget, FiUsers, FiTrendingUp } from 'react-icons/fi'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const WhyChooseUs = () => {
  const sectionRef = useRef(null)
  const cardsContainerRef = useRef(null)

  useEffect(() => {
    // Stagger section header elements
    gsap.fromTo('.why-reveal',
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

    // Stagger reveal why choose us cards one by one
    if (cardsContainerRef.current) {
      const cards = cardsContainerRef.current.children
      gsap.fromTo(cards,
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.12,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }
  }, [])

  const choices = [
    {
      title: 'Certified Trainers',
      desc: 'Work 1-on-1 with elite coaches credentialed in sports biomechanics, physical therapy, and exercise science.',
      icon: FiAward,
      accent: 'text-neon-lime border-neon-lime/20 hover:border-neon-lime/40',
      badgeBg: 'bg-neon-lime/10',
      glow: 'shadow-neon-lime/5 group-hover:shadow-neon-lime/15'
    },
    {
      title: 'Modern Equipment',
      desc: 'Train on world-class, premium strength platforms and high-precision cardiovascular conditioning tech.',
      icon: FiActivity,
      accent: 'text-neon-cyan border-neon-cyan/20 hover:border-neon-cyan/40',
      badgeBg: 'bg-neon-cyan/10',
      glow: 'shadow-neon-cyan/5 group-hover:shadow-neon-cyan/15'
    },
    {
      title: 'Flexible Memberships',
      desc: 'Contract-free tiers designed around your luxury lifestyle. Seamlessly freeze or upgrade anytime.',
      icon: FiCreditCard,
      accent: 'text-neon-pink border-neon-pink/20 hover:border-neon-pink/40',
      badgeBg: 'bg-neon-pink/10',
      glow: 'shadow-neon-pink/5 group-hover:shadow-neon-pink/15'
    },
    {
      title: 'Personalized Plans',
      desc: 'Bespoke fitness and macro blueprints adjusted weekly to align with your biometric updates.',
      icon: FiTarget,
      accent: 'text-neon-lime border-neon-lime/20 hover:border-neon-lime/40',
      badgeBg: 'bg-neon-lime/10',
      glow: 'shadow-neon-lime/5 group-hover:shadow-neon-lime/15'
    },
    {
      title: 'Community Support',
      desc: 'Network, collaborate, and train alongside a curated, motivating network of highly driven individuals.',
      icon: FiUsers,
      accent: 'text-neon-cyan border-neon-cyan/20 hover:border-neon-cyan/40',
      badgeBg: 'bg-neon-cyan/10',
      glow: 'shadow-neon-cyan/5 group-hover:shadow-neon-cyan/15'
    },
    {
      title: 'Progress Tracking',
      desc: 'Track metrics, sleep scores, strength progress, and lean mass fluctuations on our members-only app.',
      icon: FiTrendingUp,
      accent: 'text-neon-pink border-neon-pink/20 hover:border-neon-pink/40',
      badgeBg: 'bg-neon-pink/10',
      glow: 'shadow-neon-pink/5 group-hover:shadow-neon-pink/15'
    }
  ]

  return (
    <section 
      ref={sectionRef}
      id="why-choose-us" 
      className="relative w-full py-20 md:py-28 bg-dark-bg overflow-hidden grid-pattern border-t border-white/5"
    >
      {/* Background glow backdrops */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-lime/2 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="why-reveal text-center max-w-2xl mx-auto mb-20">
          <div className="text-neon-pink text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-pink inline-block animate-pulse"></span>
            Why Choose Muscle Craft
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
            THE STANDARD OF <span className="text-stroke-neon">EXCELLENCE</span> <br />
            IN LUXURY FITNESS
          </h2>
          <p className="text-gray-400 font-sans text-sm md:text-base leading-relaxed">
            We provide the infrastructure, expertise, and environment required to facilitate a flawless body and lifestyle transformation.
          </p>
        </div>

        {/* Cards Grid */}
        <div 
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {choices.map((choice, idx) => {
            const Icon = choice.icon
            return (
              <div 
                key={idx}
                className={`relative group p-8 rounded-3xl border bg-dark-surface/40 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:bg-dark-surface/65 overflow-hidden shadow-lg shadow-black/25 hover:shadow-2xl max-w-md mx-auto w-full md:max-w-none ${choice.accent} ${choice.glow}`}
              >
                {/* Radial hover glow reflection */}
                <div className="absolute -inset-px bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" />

                {/* Icon Container */}
                <div className={`w-12 h-12 rounded-xl ${choice.badgeBg} flex items-center justify-center border border-white/5 mb-6 transition-transform duration-500 group-hover:scale-105`}>
                  <Icon className="text-xl" />
                </div>

                {/* Card Title */}
                <h3 className="font-display text-lg font-bold text-white uppercase tracking-wider mb-3">
                  {choice.title}
                </h3>

                {/* Card Description */}
                <p className="text-sm text-gray-500 leading-relaxed font-sans group-hover:text-gray-400 transition-colors duration-300">
                  {choice.desc}
                </p>

                {/* Micro animation bottom line indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default WhyChooseUs
