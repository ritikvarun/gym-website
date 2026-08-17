import React from 'react'
import { 
  FiDownload, 
  FiCheckCircle, 
  FiZap, 
  FiSmartphone, 
  FiAward
} from 'react-icons/fi'
import { FaFire, FaDumbbell } from 'react-icons/fa'
import { GiMuscleUp, GiWheat } from 'react-icons/gi'
import { MdFitnessCenter, MdRestaurant, MdQrCodeScanner } from 'react-icons/md'

const PromotionalPoster = () => {
  const pdfFileName = 'MuscleCraft_Free_Diet_Plan.pdf'
  const targetPdfUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}/${pdfFileName}`
    : `/${pdfFileName}`

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(targetPdfUrl)}&size=300x300&margin=2`

  const handleDownloadPdf = () => {
    const link = document.createElement('a')
    link.href = `/${pdfFileName}`
    link.download = pdfFileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <section id="promo-poster" className="py-16 bg-[#0B0B0B] text-white relative overflow-hidden border-t border-[#1A1A1A]">
      {/* Background Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#FF7A00]/20 via-[#F5B041]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#FF7A00]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Poster Container (1080x1080 Square Design) */}
      <div className="max-w-4xl mx-auto px-4">
        <div className="relative p-1 rounded-3xl bg-gradient-to-b from-[#F5B041]/40 via-[#FF7A00]/20 to-[#1A1A1A] shadow-2xl shadow-black">
          <div 
            className="w-full aspect-square bg-[#0B0B0B] rounded-[22px] p-6 sm:p-10 relative overflow-hidden flex flex-col justify-between border border-[#1A1A1A]"
            style={{
              backgroundImage: `
                radial-gradient(circle at 10% 20%, rgba(255, 122, 0, 0.15) 0%, transparent 40%),
                radial-gradient(circle at 90% 80%, rgba(245, 176, 65, 0.12) 0%, transparent 45%),
                linear-gradient(to bottom, #0B0B0B, #121214)
              `
            }}
          >
            {/* Grid Overlay Line Pattern */}
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(#F5B041 1px, transparent 1px), linear-gradient(90deg, #F5B041 1px, transparent 1px)`,
                backgroundSize: '60px 60px'
              }}
            />

            {/* Silhouette Background Graphic */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-10 pointer-events-none flex items-center justify-center">
              <GiMuscleUp className="w-96 h-96 text-[#F5B041]" />
            </div>

            {/* Top Brand Header */}
            <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#FF7A00] to-[#F5B041] p-0.5 flex items-center justify-center shadow-md shadow-[#FF7A00]/40">
                  <div className="w-full h-full bg-[#0B0B0B] rounded-[10px] flex items-center justify-center">
                    <MdFitnessCenter className="text-xl text-[#F5B041]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-black text-lg sm:text-2xl tracking-wider text-white uppercase leading-none font-display">
                    MUSCLE CRAFT
                  </h3>
                  <p className="text-[11px] sm:text-xs font-semibold text-[#F5B041] tracking-widest uppercase mt-0.5">
                    FITNESS CLUB • RUNKATA, AGRA
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex items-center gap-2">
                <span className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A1A1A] border border-[#F5B041]/40 text-[#F5B041] text-[11px] font-bold uppercase tracking-wider">
                  <FiAward className="text-[#FF7A00]" /> Premium Gym
                </span>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#FF7A00] to-[#F5B041] text-black text-[11px] font-black uppercase tracking-wider">
                  LIMITED OFFER
                </span>
              </div>
            </div>

            {/* Poster Main Content Grid */}
            <div className="relative z-10 my-auto py-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Column (60%): Main Headings & Features */}
              <div className="md:col-span-7 space-y-4">
                
                {/* Offer Badge */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-lg bg-[#FF7A00]/20 border border-[#FF7A00]/50 text-[#FF7A00] font-extrabold text-xs tracking-wider uppercase">
                  <FiZap className="animate-bounce" /> 100% Free Instant Access
                </div>

                {/* Main Heading */}
                <div>
                  <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none font-display drop-shadow-md">
                    <span className="text-3xl sm:text-5xl">🎁</span> FREE DIET <br />
                    <span className="bg-gradient-to-r from-[#F5B041] via-[#FF7A00] to-[#F5B041] bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(255,122,0,0.5)]">
                      PLAN
                    </span>
                  </h1>
                  
                  {/* Subheading */}
                  <p className="mt-2 text-sm sm:text-base font-extrabold text-[#E5E7EB] tracking-wide flex items-center gap-2 flex-wrap">
                    <span className="text-[#F5B041]">Weight Loss</span> • 
                    <span className="text-[#FF7A00]">Fat Loss</span> • 
                    <span className="text-[#F5B041]">Muscle Gain</span>
                  </p>
                </div>

                {/* Bullet Features (Glassmorphism Cards) */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  {[
                    { title: "7-Day Weight Loss Plan", icon: <FaFire className="text-[#FF7A00]" /> },
                    { title: "7-Day Muscle Gain Plan", icon: <GiMuscleUp className="text-[#F5B041]" /> },
                    { title: "Beginner Friendly Diet", icon: <FiCheckCircle className="text-[#F5B041]" /> },
                    { title: "Easy Home Foods", icon: <GiWheat className="text-[#FF7A00]" /> },
                    { title: "Gym + Diet Combo", icon: <FaDumbbell className="text-[#F5B041]" /> },
                    { title: "Instant PDF Download", icon: <FiDownload className="text-[#FF7A00]" /> }
                  ].map((feat, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#1A1A1A]/80 backdrop-blur-md border border-white/10 hover:border-[#F5B041]/50 transition-all flex items-center gap-2 shadow-md"
                    >
                      <div className="p-1 rounded-md bg-[#0B0B0B] border border-white/10 text-sm">
                        {feat.icon}
                      </div>
                      <span className="text-xs font-bold text-white leading-tight">
                        {feat.title}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Healthy Indian Food Badges Tagline */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[#1A1A1A] to-[#0B0B0B] border border-[#F5B041]/30 flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[#FF7A00]/20 text-[#FF7A00] text-lg">
                    <MdRestaurant />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-[#F5B041] uppercase tracking-wider">
                      Includes Authentic Indian Food Items:
                    </p>
                    <p className="text-xs font-medium text-gray-300">
                      Roti • Rice • Paneer • Salad • Eggs • Oats
                    </p>
                  </div>
                </div>

              </div>

              {/* Right Column (40%): Scannable QR Code & Phone Access */}
              <div className="md:col-span-5 flex flex-col items-center justify-center space-y-4">
                
                {/* QR Code Container (Scannable Image + Direct Click Download) */}
                <div 
                  onClick={handleDownloadPdf}
                  title="Click to download PDF or scan with phone camera"
                  className="relative p-4 rounded-2xl bg-gradient-to-br from-[#1A1A1A] via-[#0B0B0B] to-[#1A1A1A] border-2 border-[#F5B041] shadow-2xl shadow-[#FF7A00]/30 w-full max-w-[240px] text-center group cursor-pointer hover:scale-105 transition-transform duration-300"
                >
                  
                  {/* Glowing Corner Accents */}
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#FF7A00]" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#FF7A00]" />
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#F5B041]" />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#F5B041]" />

                  {/* Real Scannable QR Code Image */}
                  <div className="bg-white p-3 rounded-xl relative shadow-inner flex flex-col items-center justify-center">
                    <div className="relative w-36 h-36 bg-white flex items-center justify-center overflow-hidden">
                      <img 
                        src={qrImageUrl} 
                        alt="Scan QR Code to Download Free Diet Plan PDF"
                        className="w-full h-full object-contain" 
                      />
                      {/* Center Brand Icon */}
                      <div className="absolute inset-0 m-auto w-8 h-8 rounded-lg bg-[#0B0B0B] border-2 border-[#F5B041] flex items-center justify-center text-[#F5B041] shadow-md pointer-events-none">
                        <MdFitnessCenter className="text-sm" />
                      </div>
                    </div>

                    <div className="mt-2 text-[10px] font-extrabold text-black uppercase tracking-wider flex items-center gap-1">
                      <MdQrCodeScanner className="text-[#FF7A00] text-xs" /> SCAN OR CLICK TO DOWNLOAD
                    </div>
                  </div>

                  {/* QR Tagline */}
                  <p className="mt-2.5 text-xs font-black text-white uppercase tracking-wider">
                    SCAN FOR FREE DIET PDF
                  </p>
                </div>

                {/* Smartphone Card Preview */}
                <div 
                  onClick={handleDownloadPdf}
                  className="w-full max-w-[240px] p-3 rounded-xl bg-[#1A1A1A]/90 border border-white/10 hover:border-[#F5B041]/60 flex items-center gap-3 cursor-pointer transition-all hover:bg-[#262626]"
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF7A00] to-[#F5B041] text-black font-extrabold flex items-center justify-center text-lg shadow-md shrink-0">
                    <FiSmartphone />
                  </div>
                  <div className="text-left">
                    <p className="text-[11px] font-bold text-[#F5B041] uppercase tracking-wider">
                      Instant Mobile Access
                    </p>
                    <p className="text-xs font-semibold text-white leading-tight">
                      Click / Scan to get PDF on Phone
                    </p>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom Call To Action Banner */}
            <div className="relative z-10 pt-2">
              <div 
                onClick={handleDownloadPdf}
                className="p-3 sm:p-4 rounded-xl bg-gradient-to-r from-[#FF7A00] via-[#F5B041] to-[#FF7A00] text-black text-center shadow-lg shadow-[#FF7A00]/30 flex flex-col sm:flex-row items-center justify-between gap-2 cursor-pointer hover:brightness-110 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">📲</span>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-black uppercase tracking-wider leading-tight">
                      Scan QR Code & Download Instantly
                    </p>
                    <p className="text-[11px] font-extrabold text-black/80">
                      Get Your Custom Diet Plan PDF Immediately!
                    </p>
                  </div>
                </div>

                <span className="px-4 py-1.5 rounded-lg bg-black text-[#F5B041] text-xs font-black uppercase tracking-wider shrink-0 shadow-md">
                  DOWNLOAD FREE PDF
                </span>
              </div>
            </div>

            {/* Footer Text */}
            <div className="relative z-10 border-t border-white/10 pt-3 mt-3 flex flex-wrap items-center justify-between text-gray-400 text-[11px] font-bold">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-ping" />
                <span className="text-white uppercase tracking-wider">
                  MUSCLE CRAFT FITNESS CLUB
                </span>
              </div>
              <span className="text-[#F5B041] uppercase tracking-wider">
                📍 RUNKATA, AGRA (U.P.)
              </span>
            </div>

          </div>
        </div>
      </div>

    </section>
  )
}

export default PromotionalPoster
