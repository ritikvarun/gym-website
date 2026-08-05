import React, { useState, useEffect } from 'react'
import { FiMenu, FiX, FiPhone } from 'react-icons/fi'
import Magnetic from './Magnetic'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Lock body scroll when mobile menu is active
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
      scrolled 
        ? 'py-3.5 bg-dark-bg/85 backdrop-blur-lg border-b border-white/5' 
        : 'py-5 bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo & Phone number under Gym name */}
        <Magnetic>
          <div className="flex items-center gap-2.5 group">
            <a href="#" className="flex-shrink-0">
              <img 
                src="/favicon.png" 
                alt="Muscle Craft Logo" 
                className="w-10 h-10 object-contain group-hover:scale-105 transition-transform duration-300"
              />
            </a>
            <div className="flex flex-col justify-center leading-none">
              <a href="#" className="font-display text-xl sm:text-2xl font-extrabold tracking-wider text-white hover:text-gray-100 transition-colors">
                Muscle Craft<span className="text-neon-lime">.</span>
              </a>
              <a 
                href="tel:8439919640" 
                className="md:hidden mt-1 text-[11px] font-bold text-neon-lime hover:text-white transition-colors duration-300 flex items-center gap-1 tracking-wide"
              >
                <FiPhone className="w-3 h-3 text-neon-lime shrink-0" />
                <span>8439919640</span>
              </a>
            </div>
          </div>
        </Magnetic>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-7">
          {['Home', 'Gallery', 'About', 'Equipments', 'Trainers', 'Pricing'].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors duration-300 relative group py-2"
            >
              {link}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-neon-lime transition-all duration-300 group-hover:w-full"></span>
            </a>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="tel:8439919640"
            className="flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-neon-lime px-3.5 py-2 rounded-full border border-white/10 hover:border-neon-lime/40 transition-all duration-300 bg-white/5"
          >
            <FiPhone className="text-neon-lime w-3.5 h-3.5" />
            <span>8439919640</span>
          </a>

          <Magnetic>
            <a
              href="#join"
              className="px-6 py-2.5 rounded-full bg-neon-lime hover:bg-[#b0dc00] text-black text-sm font-bold shadow-lg shadow-neon-lime/10 hover:shadow-neon-lime/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              Join Club
            </a>
          </Magnetic>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-white focus:outline-none hover:text-neon-lime transition-colors duration-300 z-50 p-1"
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed top-[74px] left-0 w-full h-[calc(100vh-74px)] bg-dark-bg/95 backdrop-blur-xl border-t border-white/5 transition-all duration-500 flex flex-col justify-between py-10 px-6 overflow-y-auto ${
          isOpen 
            ? 'translate-x-0 opacity-100 pointer-events-auto' 
            : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-6">
          {['Home', 'Gallery', 'About', 'Equipments', 'Trainers', 'Pricing'].map((link, idx) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="text-2xl font-bold font-display text-gray-300 hover:text-neon-lime transition-colors duration-300"
              style={{ transitionDelay: `${idx * 50}ms` }}
            >
              {link}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          <a
            href="tel:8439919640"
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-3 rounded-xl border border-neon-lime/40 bg-neon-lime/10 text-neon-lime font-bold text-sm hover:bg-neon-lime hover:text-black transition-all duration-300 flex items-center justify-center gap-2"
          >
            <FiPhone size={16} />
            <span>Call: 8439919640</span>
          </a>
          <a
            href="#join"
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-3.5 rounded-xl bg-neon-lime font-extrabold text-black hover:bg-[#b0dc00] shadow-lg shadow-neon-lime/10 transition-all duration-300"
          >
            Join Club
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
