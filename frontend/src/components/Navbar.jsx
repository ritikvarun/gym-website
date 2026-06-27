import React, { useState, useEffect } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { RiFlashlightLine } from 'react-icons/ri'
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
        ? 'py-4 bg-dark-bg/85 backdrop-blur-lg border-b border-white/5' 
        : 'py-6 bg-transparent border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Magnetic>
          <a href="#" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-lg bg-neon-lime flex items-center justify-center shadow-lg shadow-neon-lime/20 group-hover:scale-105 transition-transform duration-300">
              <RiFlashlightLine className="text-black text-xl font-bold" />
            </div>
            <span className="font-display text-2xl font-extrabold tracking-wider text-white">
              Muscle Craft<span className="text-neon-lime">.</span>
            </span>
          </a>
        </Magnetic>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {['Home', 'Programs', 'Services', 'Trainers', 'Pricing', 'Gallery', 'About'].map((link) => (
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
        <div className="hidden md:flex items-center gap-4">
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
          className="md:hidden text-white focus:outline-none hover:text-neon-lime transition-colors duration-300 z-50"
          aria-label="Toggle menu"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed top-[73px] left-0 w-full h-[calc(100vh-73px)] bg-dark-bg/95 backdrop-blur-xl border-t border-white/5 transition-all duration-500 flex flex-col justify-between py-12 px-6 overflow-y-auto ${
          isOpen 
            ? 'translate-x-0 opacity-100 pointer-events-auto' 
            : 'translate-x-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col gap-6">
          {['Home', 'Programs', 'Services', 'Trainers', 'Pricing', 'Gallery', 'About'].map((link, idx) => (
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

        <div className="flex flex-col gap-4">
          <a
            href="#join"
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-4 rounded-xl bg-neon-lime font-extrabold text-black hover:bg-[#b0dc00] shadow-lg shadow-neon-lime/10 transition-all duration-300"
          >
            Join Club
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
