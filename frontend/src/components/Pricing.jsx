import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiCheck, FiArrowRight } from 'react-icons/fi'
import { API_URL } from '../config'

gsap.registerPlugin(ScrollTrigger)

const Pricing = () => {
  const sectionRef = useRef(null)
  const cardsContainerRef = useRef(null)

  const [settings, setSettings] = useState({
    basicPrice: "200",
    basicPeriod: "1-Day Trial Pass",
    monthlyPrice: "3,000",
    monthlyPeriod: "for 1 month",
    standardPrice: "8,000",
    standardPeriod: "for 6 months",
    elitePrice: "12,000",
    elitePeriod: "for 1 year"
  })

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings(prev => ({
            ...prev,
            basicPrice: data.basicPrice || prev.basicPrice,
            basicPeriod: data.basicPeriod || prev.basicPeriod,
            monthlyPrice: data.monthlyPrice || prev.monthlyPrice,
            monthlyPeriod: data.monthlyPeriod || prev.monthlyPeriod,
            standardPrice: data.standardPrice || prev.standardPrice,
            standardPeriod: data.standardPeriod || prev.standardPeriod,
            elitePrice: data.elitePrice || prev.elitePrice,
            elitePeriod: data.elitePeriod || prev.elitePeriod
          }))
        }
      })
      .catch(err => console.log("Using default fallback pricing settings:", err.message))
  }, [])

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
      name: '1-Day Trial Pass',
      price: settings.basicPrice,
      period: settings.basicPeriod,
      desc: 'Try our club for 1 full day. ₹200 fee is fully adjusted on membership.',
      features: [
        { title: 'Gym Access', desc: 'Single Day Full Access (5:00 AM - 10:00 PM)' },
        { title: 'Trainer Support', desc: '1x Group Orientation session' },
        { title: 'Diet Guidance', desc: 'Trial workout & diet guide e-book' },
        { title: 'Fee Adjustment', desc: '100% fee credited toward membership' }
      ],
      recommended: false,
      btnText: 'Get Trial Pass',
      glow: 'hover:border-white/20',
      accentColor: 'text-gray-400',
      btnStyles: 'border border-white/10 hover:border-white/30 text-white hover:bg-white/5',
      joinHash: '#join-trial'
    },
    {
      name: '1 Month Membership',
      price: settings.monthlyPrice,
      period: settings.monthlyPeriod,
      desc: 'Flexible 1-month fitness membership with full equipment & trainer guidance.',
      features: [
        { title: 'Gym Access', desc: 'Full Club Access (5:00 AM - 10:00 PM)' },
        { title: 'Trainer Support', desc: 'General floor trainer guidance & onboarding' },
        { title: 'Diet Guidance', desc: 'Standard nutrition & workout plan' },
        { title: 'Fitness Tracking', desc: 'Muscle Craft app workout log' }
      ],
      recommended: false,
      btnText: 'Select 1 Month',
      glow: 'hover:border-neon-lime/30',
      accentColor: 'text-neon-lime',
      btnStyles: 'border border-neon-lime/30 hover:border-neon-lime text-white hover:bg-neon-lime/10',
      joinHash: '#join-monthly'
    },
    {
      name: 'Standard (6 Months)',
      price: settings.standardPrice,
      period: settings.standardPeriod,
      desc: 'Our most popular signature program designed for complete body transformation.',
      features: [
        { title: 'Gym Access', desc: '24/7 Unlimited Club Access' },
        { title: 'Trainer Support', desc: '2x 1-on-1 private coach reviews/mo' },
        { title: 'Diet Guidance', desc: 'Bio-individual customized macros' },
        { title: 'Fitness Tracking', desc: 'Real-time syncing & body metrics app' }
      ],
      recommended: true,
      btnText: 'Join Standard (6 Mo)',
      glow: 'shadow-neon-lime/10 border-neon-lime/30 hover:border-neon-lime/60 shadow-lg',
      accentColor: 'text-neon-lime',
      btnStyles: 'bg-neon-lime hover:bg-[#b0dc00] text-black shadow-lg shadow-neon-lime/10 hover:shadow-neon-lime/35 font-extrabold',
      joinHash: '#join-standard'
    },
    {
      name: 'Elite (1 Year)',
      price: settings.elitePrice,
      period: settings.elitePeriod,
      desc: 'Bespoke fitness engineering, maximum savings and VIP biometric monitoring.',
      features: [
        { title: 'Gym Access', desc: '24/7 Access + Private Locker & Lounge' },
        { title: 'Trainer Support', desc: 'Weekly 1-on-1 private coach sessions' },
        { title: 'Diet Guidance', desc: 'Bespoke board-certified diet designs' },
        { title: 'Fitness Tracking', desc: 'DNA mapping & body composition panels' }
      ],
      recommended: false,
      btnText: 'Join Elite (1 Year)',
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

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="pricing-reveal text-center max-w-2xl mx-auto mb-16">
          <div className="text-neon-lime text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-lime inline-block animate-pulse"></span>
            Muscle Craft Memberships
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
            INVEST IN YOUR <br className="sm:hidden" />
            <span className="text-stroke-neon">PERFORMANCE TIER</span>
          </h2>
          <p className="text-gray-400 font-sans text-xs md:text-sm leading-relaxed">
            Select the membership tier that aligns with your timeline, lifestyle, and physiological goals. Transparency and elite access guaranteed.
          </p>
        </div>

        {/* Pricing Cards Grid (4 Columns) */}
        <div 
          ref={cardsContainerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch w-full mx-auto"
        >
          {plans.map((plan, idx) => (
            <div 
              key={idx}
              className={`relative group flex flex-col p-6 md:p-8 rounded-[2rem] border bg-dark-surface/45 backdrop-blur-lg transition-all duration-500 hover:-translate-y-2 flex-grow w-full ${
                plan.recommended 
                  ? 'border-neon-lime/30 bg-dark-surface/65 shadow-2xl scale-100 lg:scale-[1.02] z-20' 
                  : 'border-white/5 shadow-lg'
              } ${plan.glow}`}
            >
              {/* Highlight gradient borders for recommended */}
              {plan.recommended && (
                <>
                  <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-neon-lime/40 to-transparent" />
                  <div className="absolute top-5 right-6 text-[8px] sm:text-[9px] font-extrabold text-neon-lime tracking-widest uppercase border border-neon-lime/20 px-3 py-1 rounded-full bg-neon-lime/10">
                    Recommended Plan
                  </div>
                </>
              )}

              {/* Plan Name */}
              <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                {plan.name}
              </div>

              {/* Price Tag */}
              <div className="flex flex-col mb-2">
                <div className="flex items-baseline">
                  <span className="text-lg font-bold text-white mr-1">₹</span>
                  <span className="font-display text-4xl md:text-5xl font-black text-white tracking-tight leading-none">
                    {plan.price}
                  </span>
                </div>
                <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider mt-1">
                  {plan.period}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-gray-400 leading-relaxed font-sans mb-6 border-b border-white/5 pb-4">
                {plan.desc}
              </p>

              {/* Features List */}
              <ul className="flex flex-col gap-4 flex-grow mb-8">
                {plan.features.map((feature, featIdx) => (
                  <li key={featIdx} className="flex gap-3 items-start text-left">
                    <div className="w-4 h-4 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mt-0.5 flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                      <FiCheck className={`text-[10px] ${plan.recommended ? 'text-neon-lime' : plan.accentColor}`} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-bold text-white tracking-wide uppercase">{feature.title}</span>
                      <span className="text-[11px] text-gray-400 leading-normal">{feature.desc}</span>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Call To Action Button */}
              <a
                href={plan.joinHash}
                className={`w-full py-3.5 rounded-xl text-center text-xs font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3 ${plan.btnStyles}`}
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
