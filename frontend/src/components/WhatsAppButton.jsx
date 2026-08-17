import React, { useState, useEffect } from 'react'
import { FaWhatsapp } from 'react-icons/fa'
import { API_URL } from '../config'

const WhatsAppButton = () => {
  const [phoneNumber, setPhoneNumber] = useState('8439919640')
  const [showTooltip, setShowTooltip] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data && (data.ownerPhone || data.receptionPhone || data.contactPhone)) {
          setPhoneNumber(data.ownerPhone || data.receptionPhone || data.contactPhone)
        }
      })
      .catch(err => {
        console.log('Using default WhatsApp number:', err.message)
      })
  }, [])

  // Format phone number for WhatsApp deep link
  const cleanPhone = (phone) => {
    let digits = phone.replace(/\D/g, '')
    if (digits.length === 10) {
      digits = '91' + digits
    }
    return digits || '918439919640'
  }

  const defaultMessage = encodeURIComponent(
    'Hi Muscle Craft Fitness Club! 🏋️‍♂️\nI am interested in gym membership, training programs, and diet plans. Please share more details!'
  )

  const whatsappUrl = `https://wa.me/${cleanPhone(phoneNumber)}?text=${defaultMessage}`

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center group select-none">
      {/* Tooltip on hover (desktop) */}
      <div 
        className="hidden md:flex items-center mr-3 px-3.5 py-1.5 rounded-full bg-[#111113]/90 text-white text-xs font-semibold tracking-wide border border-white/10 shadow-xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0 pointer-events-none"
      >
        <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse mr-2" />
        Chat on WhatsApp
      </div>

      {/* Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white flex items-center justify-center shadow-[0_10px_25px_rgba(37,211,102,0.45)] hover:shadow-[0_15px_35px_rgba(37,211,102,0.6)] transition-all duration-300 transform hover:scale-110 cursor-pointer"
      >
        {/* Subtle Pulse Animation Wave */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />

        {/* WhatsApp Icon */}
        <FaWhatsapp className="relative z-10 text-3xl sm:text-4xl text-white drop-shadow-md" />
      </a>
    </div>
  )
}

export default WhatsAppButton
