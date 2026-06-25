import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const Magnetic = ({ children }) => {
  const magneticRef = useRef(null)

  useEffect(() => {
    const el = magneticRef.current
    if (!el) return

    // Disable magnetic effect on touch screens (phones/tablets) to prevent misclicks and jumping buttons
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouch) return

    const handleMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      // Pull the button towards cursor coordinates (35% of displacement)
      gsap.to(el, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: 'power2.out'
      })
    }

    const handleMouseLeave = () => {
      // Elastic spring back snap
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)'
      })
    }

    el.addEventListener('mousemove', handleMouseMove)
    el.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      el.removeEventListener('mousemove', handleMouseMove)
      el.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div ref={magneticRef} className="inline-block select-none">
      {children}
    </div>
  )
}

export default Magnetic
