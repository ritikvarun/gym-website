import React, { useEffect, useRef, useState } from 'react'

const CustomCursor = () => {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [isPointer, setIsPointer] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isHidden, setIsHidden] = useState(false)

  const mouse = useRef({ x: -100, y: -100 })
  const dot = useRef({ x: -100, y: -100 })
  const ring = useRef({ x: -100, y: -100 })
  const rafId = useRef(null)

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY

      // Check if hovering over interactive element
      const target = document.elementFromPoint(e.clientX, e.clientY)
      if (target) {
        const isInteractive =
          target.closest('a') ||
          target.closest('button') ||
          target.closest('[role="button"]') ||
          target.closest('input') ||
          target.closest('textarea') ||
          target.closest('select') ||
          target.closest('.cursor-pointer') ||
          window.getComputedStyle(target).cursor === 'pointer'
        setIsPointer(!!isInteractive)
      }
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeave = () => setIsHidden(true)
    const handleMouseEnter = () => setIsHidden(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)

    // RAF animation loop for smooth trailing ring
    const animate = () => {
      // Dot snaps instantly to mouse
      dot.current.x = mouse.current.x
      dot.current.y = mouse.current.y

      // Ring follows with smooth lerp
      ring.current.x += (mouse.current.x - ring.current.x) * 0.12
      ring.current.y += (mouse.current.y - ring.current.y) * 0.12

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${dot.current.x}px, ${dot.current.y}px)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ring.current.x}px, ${ring.current.y}px)`
      }

      rafId.current = requestAnimationFrame(animate)
    }

    rafId.current = requestAnimationFrame(animate)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      if (rafId.current) cancelAnimationFrame(rafId.current)
    }
  }, [])

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Inner dot — snaps fast */}
      <div
        ref={dotRef}
        className="pointer-events-none fixed top-0 left-0 z-[99999] -translate-x-1/2 -translate-y-1/2"
        style={{
          willChange: 'transform',
        }}
      >
        <div
          style={{
            width: isPointer ? '10px' : '8px',
            height: isPointer ? '10px' : '8px',
            borderRadius: '50%',
            backgroundColor: isPointer ? '#ccff00' : '#ccff00',
            boxShadow: isClicking
              ? '0 0 20px 8px rgba(204,255,0,0.8)'
              : isPointer
              ? '0 0 12px 4px rgba(204,255,0,0.7)'
              : '0 0 8px 2px rgba(204,255,0,0.5)',
            opacity: isHidden ? 0 : 1,
            transform: isClicking ? 'scale(1.6)' : isPointer ? 'scale(1.25)' : 'scale(1)',
            transition: 'width 0.2s ease, height 0.2s ease, box-shadow 0.2s ease, opacity 0.3s ease, transform 0.15s ease',
          }}
        />
      </div>

      {/* Outer ring — trails with lerp */}
      <div
        ref={ringRef}
        className="pointer-events-none fixed top-0 left-0 z-[99998] -translate-x-1/2 -translate-y-1/2"
        style={{
          willChange: 'transform',
        }}
      >
        <div
          style={{
            width: isPointer ? '48px' : isClicking ? '36px' : '40px',
            height: isPointer ? '48px' : isClicking ? '36px' : '40px',
            borderRadius: '50%',
            border: isPointer
              ? '1.5px solid rgba(204, 255, 0, 0.85)'
              : '1.5px solid rgba(204, 255, 0, 0.35)',
            boxShadow: isPointer
              ? '0 0 18px 3px rgba(204,255,0,0.3), inset 0 0 10px rgba(204,255,0,0.08)'
              : isClicking
              ? '0 0 28px 6px rgba(204,255,0,0.5)'
              : 'none',
            backgroundColor: isPointer ? 'rgba(204,255,0,0.04)' : 'transparent',
            opacity: isHidden ? 0 : isPointer ? 0.95 : 0.55,
            transition: 'width 0.25s ease, height 0.25s ease, border-color 0.2s ease, box-shadow 0.2s ease, opacity 0.3s ease, background-color 0.2s ease',
          }}
        />
      </div>
    </>
  )
}

export default CustomCursor
