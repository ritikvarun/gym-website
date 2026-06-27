import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiZap, FiActivity, FiTarget, FiShield, FiArrowRight } from 'react-icons/fi'
import { API_URL } from '../config'

gsap.registerPlugin(ScrollTrigger)

const Programs = () => {
  const sectionRef = useRef(null)
  const cardsRef = useRef(null)
  const [programList, setProgramList] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)

  const fallbackPrograms = [
    {
      num: '01',
      title: 'HyperPhysique',
      desc: 'High-intensity muscle hypertrophy training utilizing advanced progressive overload principles and premium strength equipment.',
      iconName: 'FiZap',
      accent: 'group-hover:border-neon-lime',
      textAccent: 'text-neon-lime',
      glow: 'shadow-neon-lime/5 group-hover:shadow-neon-lime/15',
      features: ['Strength coaching', 'Body composition scans', 'Hypertrophy program']
    },
    {
      num: '02',
      title: 'Metcon Redline',
      desc: 'Uncompromising cardiovascular conditioning and high-speed engine development. Test your physical and mental thresholds.',
      iconName: 'FiActivity',
      accent: 'group-hover:border-neon-cyan',
      textAccent: 'text-neon-cyan',
      glow: 'shadow-neon-cyan/5 group-hover:shadow-neon-cyan/15',
      features: ['HIIT circuit modules', 'VO2 max conditioning', 'Metabolic custom tracking']
    },
    {
      num: '03',
      title: 'Athletic Apex',
      desc: 'Power, speed, multi-directional agility, and joint resilience program built specifically to enhance real-world sport performance.',
      iconName: 'FiTarget',
      accent: 'group-hover:border-neon-pink',
      textAccent: 'text-neon-pink',
      glow: 'shadow-neon-pink/5 group-hover:shadow-neon-pink/15',
      features: ['Agility matrix training', 'Explosive plyometrics', 'Injury prevention protocol']
    }
  ]

  const getIconComponent = (name) => {
    switch (name) {
      case 'FiZap': return FiZap;
      case 'FiActivity': return FiActivity;
      case 'FiTarget': return FiTarget;
      case 'FiShield': return FiShield;
      default: return FiZap;
    }
  }

  useEffect(() => {
    fetch(`${API_URL}/api/programs`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setProgramList(data)
        } else {
          setProgramList(fallbackPrograms)
        }
        setDataLoaded(true)
      })
      .catch(err => {
        console.log("Using default fallback programs:", err.message)
        setProgramList(fallbackPrograms)
        setDataLoaded(true)
      })
  }, [])

  useEffect(() => {
    if (!dataLoaded) return

    const cards = cardsRef.current.children

    // Section title trigger
    gsap.fromTo('.programs-reveal', 
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

    // Staggered cards entry trigger
    gsap.fromTo(cards,
      { opacity: 0, y: 70, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        stagger: 0.18,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }, [dataLoaded])

  return (
    <section 
      ref={sectionRef}
      id="programs" 
      className="relative w-full py-20 md:py-28 bg-[#0a0a0d] border-t border-white/5 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-neon-lime/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-neon-cyan/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="programs-reveal text-center max-w-2xl mx-auto mb-20">
          <div className="text-neon-lime text-xs font-bold uppercase tracking-widest mb-3">
            Elite Training Paths
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
            Choose Your <span className="text-stroke-neon font-bold">Weapon</span>
          </h2>
          <p className="text-gray-400 text-sm md:text-base font-medium">
            Unlock your ultimate physical potential with training protocols specifically engineered for those who demand the absolute best from their bodies.
          </p>
        </div>

        {/* Programs Grid */}
        <div 
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8"
        >
          {programList.map((prog, index) => {
            const Icon = getIconComponent(prog.iconName)
            return (
              <div 
                key={index}
                className={`group relative glass-card p-8 rounded-3xl flex flex-col justify-between overflow-hidden transition-all duration-500 hover:-translate-y-2 border border-white/5 max-w-md mx-auto w-full md:max-w-none ${prog.accent} ${prog.glow} cursor-pointer`}
              >
                {/* Background Large Number */}
                <div className="absolute top-4 right-6 text-stroke text-7xl font-black font-display opacity-10 select-none group-hover:opacity-20 group-hover:scale-105 transition-all duration-500">
                  {prog.num}
                </div>

                <div>
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-white/10 transition-colors duration-300 ${prog.textAccent}`}>
                    <Icon className="text-2xl" />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-2xl font-bold text-white mb-4 uppercase tracking-tight group-hover:text-neon-lime transition-colors duration-300">
                    {prog.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">
                    {prog.desc}
                  </p>

                  {/* Feature Bullets */}
                  <ul className="space-y-3 mb-8">
                    {prog.features?.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2 text-xs font-semibold text-gray-300">
                        <span className={`w-1.5 h-1.5 rounded-full ${prog.textAccent} bg-current`} />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Arrow Link */}
                <div className="flex items-center gap-2 mt-auto font-bold uppercase tracking-wider text-xs text-white group-hover:text-neon-lime transition-colors duration-300">
                  <span>Explore Class</span>
                  <FiArrowRight className="text-sm group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

export default Programs
