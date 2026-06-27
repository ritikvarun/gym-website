import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiUser, FiActivity, FiZap, FiShield, FiTrendingUp, FiUsers, FiSliders } from 'react-icons/fi'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const Services = () => {
  const sectionRef = useRef(null)
  const cardsContainerRef = useRef(null)

  useEffect(() => {
    // Reveal section headers
    gsap.fromTo('.services-reveal',
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

    // Stagger reveal of all service cards
    if (cardsContainerRef.current) {
      const cards = cardsContainerRef.current.children
      gsap.fromTo(cards,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
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

  const standardServices = [
    {
      num: '01',
      title: 'Personal Training',
      desc: '1-on-1 private coaching designed around your biomechanics. Achieve perfect execution and accountability with direct supervision.',
      icon: FiUser,
      glowColor: 'group-hover:shadow-neon-lime/10 group-hover:border-neon-lime/30',
      accentColor: 'text-neon-lime',
      badgeBg: 'bg-neon-lime/10',
      lineGlow: 'from-neon-lime/30'
    },
    {
      num: '02',
      title: 'Weight Loss Programs',
      desc: 'Metabolic conditioning and body composition plans engineered for steady, high-performance fat loss and lean muscle retention.',
      icon: FiActivity,
      glowColor: 'group-hover:shadow-neon-cyan/10 group-hover:border-neon-cyan/30',
      accentColor: 'text-neon-cyan',
      badgeBg: 'bg-neon-cyan/10',
      lineGlow: 'from-neon-cyan/30'
    },
    {
      num: '03',
      title: 'Muscle Building',
      desc: 'Scientific hypertrophy programming using progressive overload, optimal lifting volumes, and target strength loading.',
      icon: FiZap,
      glowColor: 'group-hover:shadow-neon-pink/10 group-hover:border-neon-pink/30',
      accentColor: 'text-neon-pink',
      badgeBg: 'bg-neon-pink/10',
      lineGlow: 'from-neon-pink/30'
    },
    {
      num: '04',
      title: 'Strength Training',
      desc: 'High-level training modules covering Olympic weightlifting, raw powerlifting, and athletic physical foundation building.',
      icon: FiShield,
      glowColor: 'group-hover:shadow-neon-lime/10 group-hover:border-neon-lime/30',
      accentColor: 'text-neon-lime',
      badgeBg: 'bg-neon-lime/10',
      lineGlow: 'from-neon-lime/30'
    },
    {
      num: '05',
      title: 'Cardio Training',
      desc: 'Zoned energy system training designed to amplify cardiovascular endurance, metabolic recovery, and VO2 max thresholds.',
      icon: FiTrendingUp,
      glowColor: 'group-hover:shadow-neon-cyan/10 group-hover:border-neon-cyan/30',
      accentColor: 'text-neon-cyan',
      badgeBg: 'bg-neon-cyan/10',
      lineGlow: 'from-neon-cyan/30'
    },
    {
      num: '06',
      title: 'Group Fitness Classes',
      desc: 'High-energy, coach-led studio classes offering structural motivation in an electric, group-dynamic luxury environment.',
      icon: FiUsers,
      glowColor: 'group-hover:shadow-neon-pink/10 group-hover:border-neon-pink/30',
      accentColor: 'text-neon-pink',
      badgeBg: 'bg-neon-pink/10',
      lineGlow: 'from-neon-pink/30'
    }
  ]

  return (
    <section 
      ref={sectionRef}
      id="services" 
      className="relative w-full py-20 md:py-28 bg-[#0a0a0d] overflow-hidden border-t border-white/5"
    >
      {/* Background glow graphics */}
      <div className="absolute top-1/3 left-0 w-80 h-80 bg-neon-pink/3 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/3 right-0 w-[450px] h-[450px] bg-neon-lime/3 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="services-reveal text-center max-w-2xl mx-auto mb-20">
          <div className="text-neon-cyan text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan inline-block animate-pulse"></span>
            Muscle Craft Capabilities
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
            EXCLUSIVE <span className="text-stroke-neon">SERVICES</span> <br className="hidden sm:inline" />
            FOR ELITE PERFORMANCE
          </h2>
          <p className="text-gray-400 font-sans text-sm md:text-base leading-relaxed">
            We deliver highly optimized training modalities, athletic planning, and bespoke recovery models designed to elevate every single aspect of your physiology.
          </p>
        </div>

        {/* Grid Container */}
        <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Render 6 standard services */}
          {standardServices.map((service, idx) => {
            const Icon = service.icon
            return (
              <div 
                key={idx}
                className={`relative group p-8 rounded-3xl border border-white/5 bg-dark-surface/45 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-lg shadow-black/30 hover:shadow-2xl max-w-md mx-auto w-full md:max-w-none ${service.glowColor}`}
              >
                {/* Horizontal glowing line on top of card hover */}
                <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${service.lineGlow} via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500`} />
                
                {/* Card Number */}
                <div className="absolute top-6 right-8 font-display text-4xl font-extrabold text-white/5 group-hover:text-white/10 transition-colors duration-500 tracking-wider">
                  {service.num}
                </div>

                {/* Icon Container */}
                <div className={`w-14 h-14 rounded-2xl ${service.badgeBg} flex items-center justify-center border border-white/5 mb-8 transition-transform duration-500 group-hover:scale-105`}>
                  <Icon className={`text-2xl ${service.accentColor}`} />
                </div>

                {/* Content */}
                <h3 className="font-display text-xl font-bold text-white uppercase tracking-wider mb-4 group-hover:text-glow-cyan transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-sans group-hover:text-gray-400 transition-colors duration-300">
                  {service.desc}
                </p>

                {/* Bottom design elements */}
                <div className="w-8 h-1 bg-white/10 rounded-full mt-6 group-hover:w-16 group-hover:bg-white/20 transition-all duration-500" />
              </div>
            )
          })}

          {/* Render 7th Featured Services: Nutrition Guidance */}
          <div 
            className="lg:col-span-3 md:col-span-2 col-span-1 relative group p-8 md:p-12 rounded-3xl border border-white/5 bg-dark-surface/45 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 overflow-hidden shadow-lg shadow-black/30 hover:shadow-2xl hover:shadow-neon-lime/5 hover:border-neon-lime/20 max-w-md mx-auto w-full md:max-w-none"
          >
            {/* Top edge glowing gradient line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-neon-lime/30 via-neon-cyan/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
            
            {/* Featured Badge */}
            <div className="absolute top-6 right-8 text-[10px] font-extrabold text-neon-lime tracking-widest uppercase border border-neon-lime/20 px-3 py-1 rounded-full bg-neon-lime/5">
              Featured Showcase
            </div>

            {/* Flex Layout for wide screen, Stack on mobile */}
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start lg:items-center h-full">
              
              {/* Left Column in featured: Title and icon */}
              <div className="w-full lg:w-[40%] flex flex-col">
                <div className="w-14 h-14 rounded-2xl bg-neon-lime/10 flex items-center justify-center border border-white/5 mb-8">
                  <FiSliders className="text-2xl text-neon-lime" />
                </div>
                <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wider mb-4 group-hover:text-glow-lime transition-colors duration-300">
                  Nutrition & Bio-Planning
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-sans group-hover:text-gray-400 transition-colors duration-300">
                  Custom metabolic profiling, macro mapping, and recovery nutrition planning built to fuel elite physical output and facilitate deep biological recovery.
                </p>
              </div>

              {/* Right Column in featured: Dynamic details */}
              <div className="w-full lg:w-[60%] grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/5 lg:pl-12">
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-lime inline-block"></span>
                    Macro Profiling
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Custom intake ratios mapped around training loads, calorie spends, and adaptive metabolic stages.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan inline-block"></span>
                    Meal Sequencing
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Nutritional scheduling timed precisely to optimization phases, ensuring peak muscle protein synthesis.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-pink inline-block"></span>
                    Supplement Logic
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Data-backed micronutrient schedules mapped out to improve recovery indices and mental alertness.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-white inline-block"></span>
                    Hydration Tracking
                  </h4>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Hydration strategies built to optimize cardiovascular efficiency, cellular transport, and joint cushioning.
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default Services
