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
import { IoCloseOutline, IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const Gallery = () => {
  const sectionRef = useRef(null)
  const [galleryItems, setGalleryItems] = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const [activeIndex, setActiveIndex] = useState(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

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
    const threshold = 50
    if (diff > threshold) {
      handleNext()
    } else if (diff < -threshold) {
      handlePrev()
    }
  }

  // Prevent scroll when modal is open
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
      title: 'Peak Output',
      tag: 'Workout Session',
      aspect: 'aspect-square',
      glowColor: 'group-hover:border-neon-cyan/30'
    },
    {
      img: gallery3,
      title: 'Precision Gears',
      tag: 'Strength Equipment',
      aspect: 'aspect-[4/3]',
      glowColor: 'group-hover:border-neon-pink/30'
    },
    {
      img: gallery4,
      title: 'Master Coaching',
      tag: 'Trainer Session',
      aspect: 'aspect-[3/4]',
      glowColor: 'group-hover:border-neon-lime/30'
    },
    {
      img: gallery5,
      title: 'Apex Focus',
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

  useEffect(() => {
    if (!dataLoaded) return

    // ScrollReveal header elements
    gsap.fromTo('.gallery-reveal-header',
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

    // Parallax scrolling & entrance reveals for each card
    const items = gsap.utils.toArray('.gallery-item')
    items.forEach((item) => {
      // Staggered entrance reveals
      gsap.fromTo(item,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 92%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      // Parallax effect on the internal image
      const img = item.querySelector('.gallery-img')
      if (img) {
        gsap.fromTo(img,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: true
            }
          }
        )
      }
    })
  }, [dataLoaded])

  return (
    <section 
      ref={sectionRef}
      id="gallery" 
      className="relative w-full py-20 md:py-28 bg-[#08080a] overflow-hidden border-t border-white/5"
    >
      {/* Background neon elements */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-neon-lime/2 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="gallery-reveal-header text-center max-w-2xl mx-auto mb-20">
          <div className="text-neon-cyan text-xs font-bold uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan inline-block animate-pulse"></span>
            Club Visuals
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-black text-white uppercase tracking-tight leading-none mb-6">
            Muscle Craft <span className="text-stroke-neon">ATMOSPHERE</span> <br />
            GALLERY
          </h2>
          <p className="text-gray-400 font-sans text-sm md:text-base leading-relaxed">
            Take a visual tour through our state-of-the-art strength training floors, customized conditioning machines, and recovery spaces.
          </p>
        </div>

        {/* Masonry Grid layout */}
        <div className="columns-2 gap-4 sm:gap-8 lg:columns-3 w-full max-w-6xl mx-auto">
          {galleryItems.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={`gallery-item cursor-pointer relative overflow-hidden rounded-[1.25rem] sm:rounded-[2rem] border border-white/5 bg-dark-surface/30 shadow-lg shadow-black/35 group break-inside-avoid mb-4 sm:mb-8 transition-colors duration-500 ${item.aspect} ${item.glowColor}`}
            >
              {/* Parallax Image container */}
              <div className="absolute inset-0 overflow-hidden w-full h-full">
                <img 
                  src={item.img} 
                  alt={item.title} 
                  className="gallery-img absolute inset-x-0 -top-[10%] w-full h-[120%] object-cover object-center scale-110 transition-transform duration-700 group-hover:scale-[1.18] pointer-events-none" 
                />
              </div>

              {/* Hover content gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/95 via-dark-bg/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />

              {/* Hover text detail panels */}
              <div className="absolute inset-x-0 bottom-0 p-8 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out text-left">
                <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest block mb-1">
                  {item.tag}
                </span>
                <h3 className="font-display text-xl font-extrabold text-white uppercase tracking-wide">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      {activeIndex !== null && galleryItems[activeIndex] && (
        <div 
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md transition-all duration-300 animate-fade-in"
          onClick={handleClose}
        >
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-all p-3 rounded-full bg-white/5 hover:bg-white/10 text-3xl focus:outline-none z-[60] cursor-pointer"
            aria-label="Close Lightbox"
          >
            <IoCloseOutline />
          </button>

          {/* Left / Prev Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation()
              handlePrev()
            }}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all p-3 rounded-full bg-white/5 hover:bg-white/10 text-3xl focus:outline-none z-[60] cursor-pointer hidden md:flex items-center justify-center"
            aria-label="Previous Image"
          >
            <IoChevronBackOutline />
          </button>

          {/* Right / Next Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all p-3 rounded-full bg-white/5 hover:bg-white/10 text-3xl focus:outline-none z-[60] cursor-pointer hidden md:flex items-center justify-center"
            aria-label="Next Image"
          >
            <IoChevronForwardOutline />
          </button>

          {/* Modal Content */}
          <div 
            className="relative max-w-[90%] max-h-[75vh] md:max-h-[80vh] flex flex-col items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img 
              src={galleryItems[activeIndex].img} 
              alt={galleryItems[activeIndex].title} 
              className="max-w-full max-h-[70vh] md:max-h-[75vh] object-contain rounded-lg shadow-2xl transition-all duration-300 transform scale-100" 
            />
            
            {/* Caption */}
            <div className="mt-6 text-center max-w-xl px-4">
              <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest block mb-1">
                {galleryItems[activeIndex].tag}
              </span>
              <h3 className="font-display text-lg md:text-xl font-black text-white uppercase tracking-wide">
                {galleryItems[activeIndex].title}
              </h3>
              <p className="text-gray-500 text-xs font-mono mt-2">
                {activeIndex + 1} / {galleryItems.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Gallery
