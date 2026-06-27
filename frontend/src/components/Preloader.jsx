import React, { useEffect, useState, useRef } from 'react'
import { gsap } from 'gsap'
import { RiFlashlightLine } from 'react-icons/ri'

const Preloader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0)
  const preloaderRef = useRef(null)
  const barRef = useRef(null)
  const counterRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    // Disable body scroll during preload
    document.body.style.overflow = 'hidden'

    // Counter counting up simulation
    const obj = { val: 0 }
    const tl = gsap.timeline({
      onComplete: () => {
        // Slide out animation
        const exitTl = gsap.timeline({
          onComplete: () => {
            // Restore body scroll and trigger callback
            document.body.style.overflow = 'auto'
            if (onComplete) onComplete()
          }
        })

        exitTl.to(contentRef.current, {
          opacity: 0,
          y: -30,
          duration: 0.6,
          ease: 'power3.in'
        })
        .to(preloaderRef.current, {
          yPercent: -100,
          duration: 0.85,
          ease: 'power4.inOut'
        }, '-=0.2')
      }
    })

    tl.to(obj, {
      val: 100,
      duration: 2.2,
      ease: 'power1.inOut',
      onUpdate: () => {
        const currentVal = Math.floor(obj.val)
        setProgress(currentVal)
        if (counterRef.current) {
          counterRef.current.innerText = currentVal.toString().padStart(3, '0')
        }
      }
    })

    // Animate progress bar width matching progress
    gsap.to(barRef.current, {
      width: '100%',
      duration: 2.2,
      ease: 'power1.inOut'
    })
  }, [onComplete])

  return (
    <div 
      ref={preloaderRef}
      className="fixed inset-0 w-full h-full bg-[#08080a] z-[9999] flex flex-col justify-center items-center select-none"
    >
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-pattern opacity-10 pointer-events-none" />

      {/* Center content container */}
      <div ref={contentRef} className="flex flex-col items-center max-w-sm w-full px-8 relative z-10">
        
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 mb-10">
          <div className="w-11 h-11 rounded-xl bg-neon-lime flex items-center justify-center shadow-lg shadow-neon-lime/20 animate-pulse">
            <RiFlashlightLine className="text-black text-2xl font-bold" />
          </div>
          <span className="font-display text-3xl font-extrabold tracking-wider text-white">
            Muscle Craft<span className="text-neon-lime">.</span>
          </span>
        </div>

        {/* Dynamic Percentage Counter */}
        <div className="font-display text-7xl md:text-8xl font-black text-white leading-none tracking-tighter mb-6 font-mono flex items-baseline">
          <span ref={counterRef}>000</span>
          <span className="text-neon-lime text-3xl md:text-4xl font-bold ml-1">%</span>
        </div>

        {/* Progress Bar Track */}
        <div className="w-full h-[2px] bg-white/5 rounded-full overflow-hidden mb-3 relative">
          {/* Active Progress Bar */}
          <div 
            ref={barRef} 
            className="absolute top-0 bottom-0 left-0 w-0 bg-neon-lime shadow-[0_0_10px_#ccff00]"
          />
        </div>

        {/* Operational badge */}
        <div className="text-[9px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-lime inline-block animate-ping"></span>
          Calibrating Biometrics System
        </div>

      </div>

      {/* Decorative vertical coordinates details */}
      <div className="absolute bottom-8 left-12 text-[8px] text-gray-600 font-mono tracking-widest hidden md:block">
        SYS.LOC: //BH_CA_90210
      </div>
      <div className="absolute bottom-8 right-12 text-[8px] text-gray-600 font-mono tracking-widest hidden md:block">
        SECURE: MUSCLE_CRAFT_MAIN_FRAME // 2026
      </div>
    </div>
  )
}

export default Preloader
