import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiCheck, FiArrowRight } from 'react-icons/fi'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const Pricing = () => {
  const sectionRef = useRef(null)
  const cardsContainerRef = useRef(null)

  useEffect(() => {
    // Reveal section headers
    gsap.fromTo('.pricing-reveal',
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

    // Slide cards upward in a stagger
    if (cardsContainerRef.current) {
      const cards = cardsContainerRef.current.children
      gsap.fromTo(cards,
        { opacity: 0, y: 80, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
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

  const plans = [
    {
      name: 'Basic Access',
      price: '200',
      period: '1-Day Trial Pass',
      trial: '₹200',
      trialNote: 'Adjusted in membership if you join',
      desc: 'Essential conditioning tools for the self-guided athlete.',
      features: [
        { title: 'Gym Access', desc: 'Standard hours (5:00 AM - 10:00 PM)' },
        { title: 'Trainer Support', desc: '1x Group Orientation session' },
        { title: 'Diet Guidance', desc: 'Standard macro template e-book' },
        { title: 'Fitness Tracking', desc: 'Muscle Craft logbook mobile app manual entry' }
      ],
      recommended: false,
      btnText: 'Select Basic',
      glow: 'hover:border-white/20',
      accentColor: 'text-gray-400',
      btnStyles: 'border border-white/10 hover:border-white/30 text-white hover:bg-white/5',
      joinHash: '#join-basic'
    },
    {
      name: 'Standard Tier',
      price: '8,000',
      period: 'for 6 months',
      trial: null,
      trialNote: null,
      desc: 'Our signature program designed for active transformation.',
      features: [
        { title: 'Gym Access', desc: '24/7 Unlimited Club Access' },
        { title: 'Trainer Support', desc: '2x 1-on-1 private coach reviews/mo' },
        { title: 'Diet Guidance', desc: 'Bio-individual customized macros' },
        { title: 'Fitness Tracking', desc: 'Real-time syncing & body metrics app' }
      ],
      recommended: true,
      btnText: 'Join Standard Now',
      glow: 'shadow-neon-lime/10 border-neon-lime/25 hover:border-neon-lime/50 shadow-lg',
      accentColor: 'text-neon-lime',
      btnStyles: 'bg-neon-lime hover:bg-[#b0dc00] text-black shadow-lg shadow-neon-lime/10 hover:shadow-neon-lime/35',
      joinHash: '#join-standard'
    },
    {
      name: 'Elite Premium',
      price: '12,000',
      period: 'for 1 year',
      trial: null,
      trialNote: null,
      desc: 'Bespoke fitness engineering and biometric monitoring.',
      features: [
        { title: 'Gym Access', desc: '24/7 Access + Private Locker & Lounge' },
        { title: 'Trainer Support', desc: 'Weekly 1-on-1 private coach sessions' },
        { title: 'Diet Guidance', desc: 'Bespoke board-certified diet designs' },
        { title: 'Fitness Tracking', desc: 'DNA mapping & blood chemistry panels' }
      ],
      recommended: false,
      btnText: 'Join Elite Premium',
      glow: 'hover:border-neon-cyan/40',
      accentColor: 'text-neon-cyan',
      btnStyles: 'border border-neon-cyan/20 hover:border-neon-cyan/55 text-white hover:bg-neon-cyan/5',
      joinHash: '#join-elite'
    }
  ]

  return (
    <section 
      ref={sectionRef}
      id="pricing" 
      className="relative w-full py-20 md:py-28 bg-[#08080a] overflow-hidden grid-pattern border-t border-white/5"
    >
      {/* Background glow structures */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[550px] h-[550px] bg-neon-cyan/2 rounded-full blur-[170px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-neon-lime/2 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="pricing-reveal text-center max-w-2xl mx-auto mb-20">
          <div className="text-neon-lime text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-lime inline-block animate-pulse"></span>
            Muscle Craft Memberships
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
            INVEST IN YOUR <br className="sm:hidden" />
            <span className="text-stroke-neon">PERFORMANCE TIER</span>
          </h2>
          <p className="text-gray-400 font-sans text-sm md:text-base leading-relaxed">
            Select the membership tier that aligns with your timeline, lifestyle, and physiological goals. Transparency and elite access guaranteed.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div 
          ref={cardsContainerRef}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto"
        >
          {plans.map((plan, idx) => (
            <div 
              key={idx}
              className={`relative group flex flex-col p-8 md:p-10 rounded-[2.5rem] border bg-dark-surface/45 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 flex-grow max-w-md mx-auto w-full lg:max-w-none ${
                plan.recommended 
                  ? 'border-neon-lime/20 bg-dark-surface/65 shadow-2xl scale-100 lg:scale-[1.03] z-20' 
                  : 'border-white/5 shadow-lg'
              } ${plan.glow}`}
            >
              {/* Highlight gradient borders for recommended */}
              {plan.recommended && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-neon-lime/40 to-transparent" />
                  <div className="absolute top-6 right-8 text-[9px] font-extrabold text-neon-lime tracking-widest uppercase border border-neon-lime/20 px-3.5 py-1.5 rounded-full bg-neon-lime/5">
                    Recommended Plan
                  </div>
                </>
              )}

              {/* Plan Name */}
              <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                {plan.name}
              </div>

              {/* Price Tag */}
              <div className="flex flex-col mb-2">
                <div className="flex items-baseline">
                  <span className="text-xl font-bold text-white mr-1">₹</span>
                  <span className="font-display text-5xl md:text-6xl font-black text-white tracking-tight leading-none">
                    {plan.price}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider mt-1">
                  {plan.period}
                </span>
              </div>

              {/* Trial Note — only for Basic */}
              {plan.trial && (
                <div className="flex flex-col gap-1 mb-3">
                  <span className="inline-flex items-center w-fit whitespace-nowrap text-[10px] font-black text-black bg-neon-lime px-3 py-1 rounded-full uppercase tracking-widest">
                    {plan.trial} — 1-Day Trial Pass
                  </span>
                  <span className="text-[10px] text-gray-500 italic">{plan.trialNote}</span>
                </div>
              )}

              {/* Description */}
              <p className="text-xs text-gray-500 leading-relaxed font-sans mb-8 border-b border-white/5 pb-6">
                {plan.desc}
              </p>

              {/* Features List */}
              <ul className="flex flex-col gap-5 flex-grow mb-10">
                {plan.features.map((feature, featIdx) => (
                  <li key={featIdx} className="flex gap-3.5 items-start text-left">
                    <div className={`w-5 h-5 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mt-0.5 flex-shrink-0 group-hover:scale-105 transition-transform duration-300`}>
                      <FiCheck className={`text-xs ${plan.recommended ? 'text-neon-lime' : plan.accentColor}`} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-xs font-bold text-white tracking-wide uppercase">{feature.title}</span>
                      <span className="text-xs text-gray-500 leading-normal">{feature.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Call To Action Button */}
              <a
                href={plan.joinHash}
                className={`w-full py-4 rounded-2xl text-center text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3 ${plan.btnStyles}`}
              >
                {plan.btnText}
                <FiArrowRight className="text-sm" />
              </a>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default Pricing
