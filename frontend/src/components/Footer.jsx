import React, { useState, useEffect } from 'react'
import { FiInstagram, FiMapPin, FiPhone, FiMail, FiClock, FiSend } from 'react-icons/fi'
import { RiFlashlightLine } from 'react-icons/ri'
import { API_URL } from '../config'

const Footer = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [settings, setSettings] = useState({
    gymName: "Muscle Craft Fitness Club",
    contactEmail: "info@musclecraft.com",
    contactPhone: "+1 (555) 900-MCFC",
    contactAddress: "128 Peak Avenue, Suite 400, Beverly Hills, CA 90210",
    instagramId: "musclecraftfitness",
    ownerPhone: "8439919640",
    receptionPhone: ""
  })

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && data.gymName) {
          setSettings(data)
        }
      })
      .catch(err => {
        console.log("Using default footer fallback settings:", err.message)
      })
  }, [])

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    }
  }

  return (
    <footer className="relative w-full bg-[#08080a] border-t border-white/5 pt-16 pb-10 md:pt-20 md:pb-12 overflow-hidden z-20">
      
      {/* Background radial highlight */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-neon-lime/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Main Grid: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-16 mb-16">
          
          {/* Column 1: Brand & Brief */}
          <div className="lg:col-span-4 flex flex-col gap-6 text-left">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2 group self-start">
              <div className="w-9 h-9 rounded-lg bg-neon-lime flex items-center justify-center shadow-lg shadow-neon-lime/20 group-hover:scale-105 transition-transform duration-300">
                <RiFlashlightLine className="text-black text-xl font-bold" />
              </div>
              <span className="font-display text-2xl font-extrabold tracking-wider text-white uppercase">
                {settings.gymName}<span className="text-neon-lime">.</span>
              </span>
            </a>

            {/* Description */}
            <p className="text-sm text-gray-500 leading-relaxed font-sans max-w-sm">
              An elite athletic sanctuary where scientific training methodologies meet dark-luxury aesthetics. We customize your progression to elevate your standards.
            </p>

            {/* Social Links Row */}
            <div className="flex gap-4 mt-2">
              <a 
                href={settings.instagramId ? (settings.instagramId.startsWith('http') ? settings.instagramId : `https://instagram.com/${settings.instagramId}`) : '#'} 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-white/5 bg-dark-surface/40 flex items-center justify-center text-gray-400 hover:text-neon-lime hover:border-neon-lime/30 transition-all duration-300 shadow-lg"
                aria-label="Instagram Link"
              >
                <FiInstagram className="text-base" />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div className="lg:col-span-2 flex flex-col gap-6 text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-l-2 border-neon-lime pl-3">
              Explore
            </h4>
            <ul className="flex flex-col gap-3">
              {[
                { label: 'Home', link: '#home' },
                { label: 'Programs', link: '#programs' },
                { label: 'Services', link: '#services' },
                { label: 'Trainers', link: '#trainers' },
                { label: 'Pricing', link: '#pricing' },
                { label: 'Testimonials', link: '#testimonials' },
                { label: 'Gallery', link: '#gallery' }
              ].map((nav, idx) => (
                <li key={idx}>
                  <a 
                    href={nav.link}
                    className="text-sm font-medium text-gray-500 hover:text-white hover:pl-1 transition-all duration-300 block"
                  >
                    {nav.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Contact & Hours */}
          <div className="lg:col-span-3 flex flex-col gap-6 text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-l-2 border-neon-cyan pl-3">
              Information
            </h4>
            
            {/* Contact details */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <FiMapPin className="text-neon-cyan text-base mt-0.5 flex-shrink-0" />
                <span className="text-xs text-gray-500 leading-relaxed font-sans">
                  {settings.contactAddress}
                </span>
              </div>
              {settings.ownerPhone ? (
                <div className="flex items-center gap-3">
                  <FiPhone className="text-neon-cyan text-base flex-shrink-0" />
                  <a href={`tel:${settings.ownerPhone}`} className="text-xs text-gray-500 hover:text-white transition-colors duration-300 font-sans">
                    <span className="text-white/60 mr-1 font-bold">Owner:</span>{settings.ownerPhone}
                  </a>
                </div>
              ) : (
                !settings.receptionPhone && settings.contactPhone && (
                  <div className="flex items-center gap-3">
                    <FiPhone className="text-neon-cyan text-base flex-shrink-0" />
                    <a href={`tel:${settings.contactPhone}`} className="text-xs text-gray-500 hover:text-white transition-colors duration-300 font-sans">
                      {settings.contactPhone}
                    </a>
                  </div>
                )
              )}

              {settings.receptionPhone && (
                <div className="flex items-center gap-3">
                  <FiPhone className="text-neon-cyan text-base flex-shrink-0" />
                  <a href={`tel:${settings.receptionPhone}`} className="text-xs text-gray-500 hover:text-white transition-colors duration-300 font-sans">
                    <span className="text-white/60 mr-1 font-bold">Reception:</span>{settings.receptionPhone}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3">
                <FiMail className="text-neon-cyan text-base flex-shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="text-xs text-gray-500 hover:text-white transition-colors duration-300 font-sans">
                  {settings.contactEmail}
                </a>
              </div>
            </div>

            {/* Club Hours */}
            <div className="flex flex-col gap-2 pt-2 border-t border-white/5">
              <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                <FiClock className="text-neon-cyan" />
                Working Hours
              </div>
              <div className="flex justify-between items-start text-xs text-gray-500 font-sans">
                <span>Monday - Saturday</span>
                <div className="text-right flex flex-col gap-0.5">
                  <span className="text-white">5:00 AM - 10:00 AM</span>
                  <span className="text-white">5:00 PM - 10:00 PM</span>
                </div>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-500 font-sans">
                <span>Sunday</span>
                <span className="text-neon-pink font-semibold">Closed</span>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter Box */}
          <div className="lg:col-span-3 flex flex-col gap-6 text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white border-l-2 border-neon-pink pl-3">
              Newsletter
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed font-sans">
              Subscribe to the Muscle Craft newsletter to receive custom fitness science research, recovery guides, and club insights.
            </p>

            {/* Subscription Form */}
            <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
              <div className="relative w-full group">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email" 
                  required
                  className="w-full px-5 py-4 rounded-2xl bg-dark-surface/40 border border-white/5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-neon-lime/40 focus:ring-1 focus:ring-neon-lime/10 transition-all duration-300 backdrop-blur-md"
                />
                <button 
                  type="submit" 
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-neon-lime transition-colors duration-300"
                  aria-label="Submit Email"
                >
                  <FiSend className="text-sm" />
                </button>
              </div>

              {subscribed && (
                <span className="text-[10px] text-neon-lime font-bold tracking-wider animate-fade-in uppercase">
                  Thank you for subscribing!
                </span>
              )}
            </form>
          </div>

        </div>

        {/* Footer Strip */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} {settings.gymName} ATHLETIC CLUB. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6 text-[10px] font-bold uppercase tracking-widest">
            <a href="#privacy" className="text-gray-600 hover:text-white transition-colors duration-300">Privacy Policy</a>
            <a href="#terms" className="text-gray-600 hover:text-white transition-colors duration-300">Terms of Service</a>
            <a href="#rules" className="text-gray-600 hover:text-white transition-colors duration-300">Club Rules</a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
