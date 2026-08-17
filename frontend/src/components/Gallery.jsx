import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import gallery1 from '../assets/gallery_1.webp'
import gallery2 from '../assets/gallery_2.webp'
import gallery3 from '../assets/gallery_3.webp'
import gallery4 from '../assets/gallery_4.webp'
import gallery5 from '../assets/gallery_5.webp'
import gallery6 from '../assets/gallery_6.webp'
import { API_URL } from '../config'
import { 
  IoCloseOutline, 
  IoChevronBackOutline, 
  IoChevronForwardOutline, 
  IoGridOutline, 
  IoAlbumsOutline,
  IoExpandOutline
} from 'react-icons/io5'
import { FiMaximize2 } from 'react-icons/fi'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const Gallery = () => {
  const sectionRef = useRef(null)
  const [galleryItems, setGalleryItems] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)
  const [mobileViewMode, setMobileViewMode] = useState('grid') // 'grid' or 'feed'
  
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  const fallbackGalleryItems = [
    {
      img: gallery1,
      title: 'Muscle Craft Sanctuary',
      tag: 'Interior Architecture',
      aspect: 'aspect-[3/4]',
      glowColor: 'group-hover:border-neon-lime/30'
    },
    {
      img: gallery2,
      title: 'Peak Output Session',
      tag: 'Workout Session',
      aspect: 'aspect-square',
      glowColor: 'group-hover:border-neon-cyan/30'
    },
    {
      img: gallery3,
      title: 'Precision Heavy Gears',
      tag: 'Strength Equipment',
      aspect: 'aspect-[4/3]',
      glowColor: 'group-hover:border-neon-pink/30'
    },
    {
      img: gallery4,
      title: 'Master Coaching Floor',
      tag: 'Trainer Session',
      aspect: 'aspect-[3/4]',
      glowColor: 'group-hover:border-neon-lime/30'
    },
    {
      img: gallery5,
      title: 'Apex Athlete Focus',
      tag: 'Club Member',
      aspect: 'aspect-[4/3]',
      glowColor: 'group-hover:border-neon-cyan/30'
    },
    {
      img: gallery6,
      title: 'Zen Recovery Lounge',
      tag: 'Mind & Body Recovery',
      aspect: 'aspect-square',
      glowColor: 'group-hover:border-neon-pink/30'
    }
  ]

  useEffect(() => {
    fetch(`${API_URL}/api/gallery`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setGalleryItems(data)
        } else {
          setGalleryItems(fallbackGalleryItems)
        }
        setDataLoaded(true)
      })
      .catch(err => {
        console.log("Using default fallback gallery:", err.message)
        setGalleryItems(fallbackGalleryItems)
        setDataLoaded(true)
      })
  }, [])

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1))
  }

  const handleClose = () => {
    setActiveIndex(null)
  }

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX
  }

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX
    handleSwipe()
  }

  const handleSwipe = () => {
    const diff = touchStartX.current - touchEndX.current
    const threshold = 40
    if (diff > threshold) {
      handleNext()
    } else if (diff < -threshold) {
      handlePrev()
    }
  }

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (activeIndex !== null) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeIndex])

  // Keyboard navigation controls
  useEffect(() => {
    if (activeIndex === null) return

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        handleNext()
      } else if (e.key === 'ArrowLeft') {
        handlePrev()
      } else if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeIndex, galleryItems])

  useEffect(() => {
    if (!dataLoaded) return

    // ScrollReveal header elements
    gsap.fromTo('.gallery-reveal-header',
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Parallax scrolling & entrance reveals for cards on desktop
    const items = gsap.utils.toArray('.gallery-item-card')
    items.forEach((item) => {
      gsap.fromTo(item,
        { opacity: 0, y: 40, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 92%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    })
  }, [dataLoaded])

  return (
    <section 
      ref={sectionRef}
      id="gallery" 
      className="relative w-full py-16 sm:py-24 md:py-28 bg-[#08080a] overflow-hidden border-t border-white/5"
    >
      {/* Background neon ambient gradients */}
      <div className="absolute top-1/3 left-1/4 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-neon-lime/2 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-neon-cyan/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="gallery-reveal-header text-center max-w-2xl mx-auto mb-8 sm:mb-14">
          <div className="text-neon-cyan text-[11px] sm:text-xs font-bold uppercase tracking-widest mb-2.5 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan inline-block animate-pulse"></span>
            Club Visual Experience
          </div>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-tight mb-4">
            Muscle Craft <span className="text-stroke-neon">ATMOSPHERE</span> <br />
            GALLERY
          </h2>
          <p className="text-gray-400 font-sans text-xs sm:text-sm md:text-base leading-relaxed px-2">
            Explore our state-of-the-art strength training floors, customized conditioning machines, and luxury recovery spaces.
          </p>
        </div>

        {/* Mobile View Switcher Header (Visible only on phone/mobile screens) */}
        <div className="flex sm:hidden items-center justify-between gap-2 mb-5 px-1">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-lime animate-pulse" />
            {galleryItems.length} Gallery Photos
          </span>

          <div className="flex items-center bg-dark-surface/80 border border-white/10 p-1 rounded-xl shadow-lg backdrop-blur-md">
            <button
              onClick={() => setMobileViewMode('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                mobileViewMode === 'grid'
                  ? 'bg-neon-lime text-black font-extrabold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-label="Grid View"
            >
              <IoGridOutline size={14} />
              Grid
            </button>
            <button
              onClick={() => setMobileViewMode('feed')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all ${
                mobileViewMode === 'feed'
                  ? 'bg-neon-lime text-black font-extrabold shadow-sm'
                  : 'text-gray-400 hover:text-white'
              }`}
              aria-label="Feed View"
            >
              <IoAlbumsOutline size={14} />
              Stories
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MOBILE VIEW (< 640px): 2 Modes (Grid vs Stories Feed)                     */}
        {/* ========================================================================= */}
        <div className="block sm:hidden">
          {mobileViewMode === 'grid' ? (
            /* Mode 1: Sleek 2-Column Mobile Grid */
            <div className="grid grid-cols-2 gap-3">
              {galleryItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className="gallery-item-card group relative rounded-2xl overflow-hidden aspect-[4/5] bg-dark-surface/40 border border-white/10 shadow-lg active:scale-[0.96] transition-all duration-200 cursor-pointer"
                >
                  {/* Image */}
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Subtle top-right zoom badge */}
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 shadow-md">
                    <FiMaximize2 size={10} />
                  </div>

                  {/* Subtle bottom gradient & Tag on mobile */}
                  <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/95 via-black/50 to-transparent flex flex-col justify-end text-left">
                    {item.tag && (
                      <span className="text-[8px] font-extrabold text-neon-cyan uppercase tracking-wider line-clamp-1">
                        {item.tag}
                      </span>
                    )}
                    <h3 className="font-display text-[10.5px] font-bold text-white uppercase leading-tight line-clamp-1 mt-0.5">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Mode 2: Full-Width Story / Feed Cards for Mobile */
            <div className="space-y-4">
              {galleryItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className="group relative rounded-3xl overflow-hidden aspect-[4/3] bg-dark-surface/50 border border-white/10 shadow-xl active:scale-[0.98] transition-all cursor-pointer"
                >
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30" />

                  {/* Top Tag & Zoom pill */}
                  <div className="absolute top-3.5 inset-x-3.5 flex items-center justify-between">
                    {item.tag && (
                      <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md border border-neon-cyan/40 text-neon-cyan text-[10px] font-extrabold uppercase tracking-wider">
                        {item.tag}
                      </span>
                    )}
                    <span className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white text-xs">
                      <IoExpandOutline size={16} />
                    </span>
                  </div>

                  {/* Bottom Title bar */}
                  <div className="absolute bottom-4 inset-x-4 text-left">
                    <h3 className="font-display text-lg font-black text-white uppercase tracking-wide drop-shadow-md">
                      {item.title}
                    </h3>
                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1.5 font-sans">
                      <span>Tap to expand full visual</span> • <span className="text-neon-lime font-bold">Photo {idx + 1} of {galleryItems.length}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* DESKTOP & TABLET VIEW (>= 640px): Luxury Masonry with Hover Reveals       */}
        {/* ========================================================================= */}
        <div className="hidden sm:block columns-2 lg:columns-3 gap-6 sm:gap-8 w-full max-w-6xl mx-auto">
          {galleryItems.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`gallery-item-card cursor-pointer relative overflow-hidden rounded-[1.75rem] border border-white/5 bg-dark-surface/30 shadow-lg shadow-black/40 group break-inside-avoid mb-6 sm:mb-8 transition-colors duration-500 ${item.aspect || 'aspect-[4/3]'} ${item.glowColor || 'group-hover:border-neon-lime/30'}`}
            >
              {/* Image container */}
              <div className="absolute inset-0 overflow-hidden w-full h-full">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="absolute inset-0 w-full h-full object-cover object-center scale-100 transition-transform duration-700 group-hover:scale-110 pointer-events-none" 
                  loading="lazy"
                />
              </div>

              {/* Hover content gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/95 via-dark-bg/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

              {/* Hover text detail panels */}
              <div className="absolute inset-x-0 bottom-0 p-8 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-left">
                {item.tag && (
                  <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest block mb-1">
                    {item.tag}
                  </span>
                )}
                <h3 className="font-display text-xl font-extrabold text-white uppercase tracking-wide">
                  {item.title}
                </h3>
              </div>

              {/* Desktop Zoom Corner Accent */}
              <div className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md border border-white/10 flex items-center justify-center text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <FiMaximize2 size={14} />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ========================================================================= */}
      {/* LIGHTBOX MODAL (Touch-optimized for Mobile & Fullscreen for Desktop)     */}
      {/* ========================================================================= */}
      {activeIndex !== null && galleryItems[activeIndex] && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-xl transition-all duration-300 animate-fade-in p-4 sm:p-6"
          onClick={handleClose}
        >
          {/* Top Bar: Counter & Close */}
          <div className="w-full max-w-5xl flex items-center justify-between z-[60] pt-2" onClick={(e) => e.stopPropagation()}>
            <div className="px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-mono text-white/90">
              <span className="text-neon-lime font-bold">{activeIndex + 1}</span> / {galleryItems.length}
            </div>

            <button 
              onClick={handleClose}
              className="text-white hover:text-neon-lime transition-all p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-2xl focus:outline-none cursor-pointer"
              aria-label="Close Lightbox"
            >
              <IoCloseOutline />
            </button>
          </div>

          {/* Center Image Container with Gestures */}
          <div 
            className="relative w-full max-w-5xl flex-1 flex items-center justify-center my-auto select-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Desktop Left / Prev Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handlePrev()
              }}
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 text-white hover:text-neon-lime transition-all p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-2xl focus:outline-none z-[60] cursor-pointer hidden sm:flex items-center justify-center backdrop-blur-md"
              aria-label="Previous Image"
            >
              <IoChevronBackOutline />
            </button>

            {/* Active Image */}
            <img 
              src={galleryItems[activeIndex].img} 
              alt={galleryItems[activeIndex].title} 
              className="max-w-full max-h-[65vh] sm:max-h-[75vh] object-contain rounded-2xl shadow-2xl shadow-black/80 transition-all duration-300" 
            />

            {/* Desktop Right / Next Button */}
            <button 
              onClick={(e) => {
                e.stopPropagation()
                handleNext()
              }}
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 text-white hover:text-neon-lime transition-all p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-2xl focus:outline-none z-[60] cursor-pointer hidden sm:flex items-center justify-center backdrop-blur-md"
              aria-label="Next Image"
            >
              <IoChevronForwardOutline />
            </button>
          </div>

          {/* Bottom Bar (Captions & Mobile Navigation buttons) */}
          <div 
            className="w-full max-w-md mx-auto p-4 rounded-2xl bg-dark-surface/80 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center gap-2.5 z-[60]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              {galleryItems[activeIndex].tag && (
                <span className="text-[10px] font-extrabold text-neon-cyan uppercase tracking-widest block mb-0.5">
                  {galleryItems[activeIndex].tag}
                </span>
              )}
              <h3 className="font-display text-sm sm:text-base font-black text-white uppercase tracking-wide">
                {galleryItems[activeIndex].title}
              </h3>
            </div>

            {/* Mobile Nav Arrows Bar */}
            <div className="flex sm:hidden items-center justify-center gap-6 w-full pt-1 border-t border-white/5">
              <button
                onClick={handlePrev}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold active:scale-95 transition-all"
              >
                <IoChevronBackOutline size={16} /> Prev
              </button>
              <span className="text-[11px] font-mono text-gray-400">
                Swipe ↔
              </span>
              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-white/10 text-white text-xs font-bold active:scale-95 transition-all"
              >
                Next <IoChevronForwardOutline size={16} />
              </button>
            </div>
          </div>

        </div>
      )}
    </section>
  )
}

export default Gallery
