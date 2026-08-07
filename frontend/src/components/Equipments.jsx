import React, { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { 
  IoCloseOutline, 
  IoChevronBackOutline, 
  IoChevronForwardOutline, 
  IoCheckmarkCircle,
  IoEyeOutline 
} from 'react-icons/io5'
import { FiShield, FiCpu, FiLayers } from 'react-icons/fi'

// Local generated & captured assets
import powerRackImg from '../assets/equipment_power_rack.png'
import dumbbellsImg from '../assets/equipment_dumbbells_real.jpg'
import legPressImg from '../assets/equipment_leg_press.jpg'
import spinBikesImg from '../assets/equipment_spin_bikes.jpg'
import punchingBagImg from '../assets/equipment_punching_bag.jpg'
import functionalPlyoImg from '../assets/equipment_functional_plyo.jpg'
import treadmillsImg from '../assets/equipment_treadmills.jpg'
import smithRackImg from '../assets/equipment_smith_rack.jpg'
import functionalV2Img from '../assets/equipment_functional_v2.jpg'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const categories = [
  { id: 'all', name: 'All Machinery' },
  { id: 'racks-weights', name: 'Racks & Free Weights' },
  { id: 'iso-machines', name: 'Iso-Lateral Machines' },
  { id: 'cables-functional', name: 'Cables & Turf' },
  { id: 'cardio', name: 'Cardio & HIIT' },
  { id: 'recovery', name: 'Recovery Tech' }
]

const equipmentItems = [
  {
    id: 1,
    name: 'CPU Urethane Dumbbell Set & Rack',
    category: 'racks-weights',
    categoryName: 'Heavy Racks & Free Weights',
    badge: 'PRO FREE WEIGHTS',
    img: dumbbellsImg,
    fallbackUrl: dumbbellsImg,
    specs: ['Solid Steel Core', 'CPU Urethane Dumbbells', 'Multi-Tier Heavy Storage Rack'],
    targetMuscle: 'Targeted Isolation & Free Weight Lifts',
    description: 'Commercial-grade multi-tier dumbbell rack equipped with solid steel CPU urethane dumbbells, knurled anti-slip handles, and full mirror wall integration.',
    highlights: [
      'High-grade CPU urethane dumbbells resistant to cracking or fading',
      'Precision welded solid steel head-to-handle construction',
      'Ergonomic knurled anti-slip handles',
      'Heavy-duty multi-tier rack with mirror reflection setup'
    ]
  },
  {
    id: 2,
    name: 'Heavy Smith Machine & Bumper Plates',
    category: 'racks-weights',
    categoryName: 'Heavy Racks & Free Weights',
    badge: 'OLYMPIC BUMPER PLATES',
    img: smithRackImg,
    fallbackUrl: smithRackImg,
    specs: ['Heavy Smith Guide System', 'Color Bumper Plates', 'Hanuman Mural Zone'],
    targetMuscle: 'Full Body / Heavy Compound Lifts',
    description: 'Professional heavy-duty Smith rack station loaded with color bumper plates, dual safety hooks, knurled Olympic barbells, and custom mural backdrop.',
    highlights: [
      'Precision linear bearing guided Smith bar motion',
      'Commercial-grade color-coded bumper plates',
      'Multi-position safety hook increments for solo squatting & pressing',
      'Heavy steel base frame engineered for maximum load stability'
    ]
  },
  {
    id: 3,
    name: 'Commercial Endurance Treadmills',
    category: 'cardio',
    categoryName: 'Cardio & HIIT',
    badge: 'HIGH END TREADMILLS',
    img: treadmillsImg,
    fallbackUrl: treadmillsImg,
    specs: ['High-Torque Motor', 'Telemetry Console', 'Shock-Absorbing Deck'],
    targetMuscle: 'Cardiovascular Endurance & Fat Loss',
    description: 'Line of commercial endurance treadmills featuring high-torque motors, digital console telemetry, dynamic inclination control, and orthopedic running belts.',
    highlights: [
      'Powerful quiet commercial motor built for continuous heavy operation',
      'Multi-screen telemetry console tracking speed, distance & incline',
      'Shock-absorbing cushioned deck reducing joint impact',
      'Quick-speed & elevation hotkeys for high-intensity interval sprints'
    ]
  },
  {
    id: 4,
    name: '45° Incline Leg Press & Hack Station',
    category: 'iso-machines',
    categoryName: 'Iso-Lateral Machines',
    badge: 'LEGS & POWER',
    img: legPressImg,
    fallbackUrl: legPressImg,
    specs: ['1200kg Max Capacity', 'Linear Roller Bearings', 'Quad & Calf Focus'],
    targetMuscle: 'Quadriceps, Hamstrings, Glutes & Calves',
    description: 'Massive plate-loaded 45-degree incline leg press & hack squat machine with linear guide rails, safety lockouts, and calf raise plate.',
    highlights: [
      'Extra-wide diamond plate foot platform for multiple stance variations',
      'Triple-position safety lockout levers for solo heavy training',
      'Adjustable padded backrest angle for optimal spinal positioning',
      'Heavy dual weight horns for high-capacity plate loading'
    ]
  },
  {
    id: 5,
    name: 'Heavy Boxing Punching Bag',
    category: 'cables-functional',
    categoryName: 'Cables & Turf',
    badge: 'COMBAT CONDITIONING',
    img: punchingBagImg,
    fallbackUrl: punchingBagImg,
    specs: ['Heavy Synthetic Leather', 'Steel Chain Suspended', 'High-Density Foam Core'],
    targetMuscle: 'Full Body Endurance & Combat Conditioning',
    description: 'Overhead steel rig suspended heavy punching bag designed for martial arts, boxing drills, explosive power output, and stamina building.',
    highlights: [
      'Thick multi-layer synthetic leather construction',
      '360-degree heavy-duty steel swivel chain ceiling mount',
      'Shock-absorbing high-density inner core padding',
      'Ideal for heavy kickboxing, punching combinations, and HIIT intervals'
    ]
  },
  {
    id: 6,
    name: 'Indoor Studio Cycling Spin Bikes',
    category: 'cardio',
    categoryName: 'Cardio & HIIT',
    badge: 'CARDIO ENDURANCE',
    img: spinBikesImg,
    fallbackUrl: spinBikesImg,
    specs: ['Precision Flywheel', 'Magnetic Resistance', 'Adjustable Saddle & Handlebars'],
    targetMuscle: 'Cardiovascular & Lower Body Endurance',
    description: 'Elite indoor studio cycle spin bikes featuring smooth magnetic resistance, dual SPD pedals, and micro-adjustments under custom hex lighting.',
    highlights: [
      'Ultra-quiet magnetic resistance system with emergency stop brake',
      'Multi-grip sweat-resistant handlebars with micro-adjustment controls',
      'Dual-function SPD clips & caged toe pedals',
      'Heavy-duty commercial steel frame built for high-intensity studio rides'
    ]
  },
  {
    id: 7,
    name: 'Athletic Stepper & Agility Turf Zone',
    category: 'cables-functional',
    categoryName: 'Cables & Turf',
    badge: 'ATHLETIC CONDITIONING',
    img: functionalV2Img,
    fallbackUrl: functionalV2Img,
    specs: ['Aerobic Step Board', 'Soft Jump Box', 'Swiss Stability Ball'],
    targetMuscle: 'Footwork Speed, Balance & Core Stability',
    description: 'Specialized athletic conditioning bay with non-slip aerobic step platforms, heavy soft plyo blocks, exercise balls, and workout mat storage.',
    highlights: [
      'Adjustable height aerobic step board for cardio stepper workouts',
      'Heavy-duty commercial gear storage rack with dumbbells & foam rollers',
      'High-durability wood-grain rubber flooring optimized for impact reduction',
      'Ideal for personal training sessions & high-tempo metabolic conditioning'
    ]
  },
  {
    id: 8,
    name: 'Dual Swivel Cable Crossover Tower',
    category: 'cables-functional',
    categoryName: 'Cables & Turf',
    badge: 'SMOOTH RESISTANCE',
    img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop',
    specs: ['Dual 210 lbs Stacks', '180° Swivel Pulley', '3:1 Cable Ratio'],
    targetMuscle: 'Functional Strength & Stability',
    description: 'Multi-functional dual cable system featuring independent weight stacks, fluid roller bearings, and multi-position height adjustments for unlimited movement paths.',
    highlights: [
      'Aerospace-grade 7x19 coated aircraft cable lines',
      '180-degree free rotating swivel pulley heads',
      'Over 24 vertical locking positions per column',
      'Includes triceps ropes, ankle cuffs, and wide bars'
    ]
  },
  {
    id: 9,
    name: 'Percussion & Cryo Recovery Station',
    category: 'recovery',
    categoryName: 'Recovery Tech',
    badge: 'ADVANCED RECOVERY',
    img: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1200&auto=format&fit=crop',
    specs: ['Percussive Tech', 'Air-Compression Boots', 'Thermal Therapy'],
    targetMuscle: 'Muscle Flushing & Rapid Recovery',
    description: 'State-of-the-art post-workout recovery zone featuring percussive therapy guns, dynamic air compression leg boots, and thermal heat vibration wraps.',
    highlights: [
      'Normatec dynamic air compression sequence for lactic acid removal',
      'QuietGlide percussion tools for deep muscle knot release',
      'Ergonomic zero-gravity recovery loungers with ambient audio',
      'Accelerates muscular repair & reduces delayed onset soreness (DOMS)'
    ]
  },
  {
    id: 10,
    name: 'Rogue Monster Olympic Power Rack',
    category: 'racks-weights',
    categoryName: 'Heavy Racks & Free Weights',
    badge: 'HEAVY DUTY STRENGTH',
    img: powerRackImg,
    fallbackUrl: powerRackImg,
    specs: ['3x3" 11-Gauge Steel', '1000 lbs Max Load', 'Laser-Cut Markers'],
    targetMuscle: 'Full Body / Compound Lifts',
    description: 'Precision-engineered commercial power rack engineered for elite squatting, benching, overhead pressing, and pull-up variations with maximum safety.',
    highlights: [
      'Heavy-duty 1" hardware with magnetic lock pins',
      'Dual multi-grip pull-up crossmembers & dip handles',
      'Commercial-grade band pegs & spotter arm paddings',
      'High-impact powder-coated anti-scratch finish'
    ]
  }
]

const Equipments = () => {
  const sectionRef = useRef(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedItem, setSelectedItem] = useState(null)
  const [selectedIndex, setSelectedIndex] = useState(null)
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)

  // Filter items based on active category
  const filteredItems = activeCategory === 'all' 
    ? equipmentItems 
    : equipmentItems.filter(item => item.category === activeCategory)

  // Lightbox navigation handlers
  const openModal = (item, index) => {
    setSelectedItem(item)
    setSelectedIndex(index)
  }

  const closeModal = () => {
    setSelectedItem(null)
    setSelectedIndex(null)
  }

  const handlePrev = () => {
    if (selectedIndex === null) return
    const newIdx = selectedIndex === 0 ? filteredItems.length - 1 : selectedIndex - 1
    setSelectedIndex(newIdx)
    setSelectedItem(filteredItems[newIdx])
  }

  const handleNext = () => {
    if (selectedIndex === null) return
    const newIdx = selectedIndex === filteredItems.length - 1 ? 0 : selectedIndex + 1
    setSelectedIndex(newIdx)
    setSelectedItem(filteredItems[newIdx])
  }

  // Prevent scroll when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [selectedItem])

  // Keyboard navigation
  useEffect(() => {
    if (!selectedItem) return
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') handleNext()
      else if (e.key === 'ArrowLeft') handlePrev()
      else if (e.key === 'Escape') closeModal()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedItem, selectedIndex, activeCategory])

  // Touch Swipe for Mobile
  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX
  }

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX
    const diff = touchStartX.current - touchEndX.current
    if (diff > 50) handleNext()
    else if (diff < -50) handlePrev()
  }

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.equip-header-reveal',
        { opacity: 0, y: 35 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      )

      gsap.fromTo('.equip-card-item',
        { opacity: 0, y: 45, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [activeCategory])

  return (
    <section
      ref={sectionRef}
      id="equipments"
      className="relative w-full py-24 md:py-32 bg-[#08080a] overflow-hidden border-t border-white/5"
    >
      {/* Dynamic Background Glow & Grid Patterns */}
      <div className="absolute top-1/3 right-1/4 w-[450px] h-[450px] bg-neon-lime/3 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[380px] h-[380px] bg-neon-cyan/3 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute inset-0 grid-pattern opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="equip-header-reveal text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neon-lime/10 border border-neon-lime/20 text-neon-lime text-xs font-bold uppercase tracking-widest mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-neon-lime animate-ping inline-block"></span>
            <span>Commercial Machinery & Gear</span>
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase tracking-tight leading-none mb-6">
            WORLD-CLASS <span className="text-stroke-neon">EQUIPMENT</span> <br />
            COLLECTION
          </h2>

          <p className="text-gray-400 font-sans text-sm md:text-base leading-relaxed max-w-2xl mx-auto">
            Engineered with precision biomechanics and heavy-duty structural steel. Explore our elite array of power racks, plate-loaded isolations, custom cable towers, and recovery systems.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="equip-header-reveal flex flex-wrap justify-center items-center gap-2.5 sm:gap-3 mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 relative border ${
                  isActive
                    ? 'bg-neon-lime text-black border-neon-lime shadow-lg shadow-neon-lime/20 font-black'
                    : 'bg-dark-surface/60 text-gray-400 border-white/10 hover:border-neon-lime/40 hover:text-white'
                }`}
              >
                {cat.name}
              </button>
            )
          })}
        </div>

        {/* Modern Equipment Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openModal(item, idx)}
              className="equip-card-item group relative glass-card glass-card-hover rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between transition-all duration-500 hover:-translate-y-1.5"
            >
              {/* Image Container */}
              <div className="relative w-full h-64 sm:h-72 overflow-hidden bg-black/40">
                <img
                  src={item.img}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = item.fallbackUrl
                  }}
                  className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

                {/* Badge Tag */}
                <div className="absolute top-4 left-4 z-10">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-extrabold tracking-wider text-neon-lime uppercase">
                    {item.badge}
                  </span>
                </div>

                {/* Hover Click & View Indicator */}
                <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-[2px]">
                  <span className="px-5 py-2.5 rounded-full bg-neon-lime text-black font-extrabold text-xs tracking-wider uppercase flex items-center gap-2 shadow-xl shadow-neon-lime/30 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <IoEyeOutline className="text-lg" />
                    <span>Click & View Specs</span>
                  </span>
                </div>
              </div>

              {/* Card Details */}
              <div className="p-6 flex flex-col flex-grow justify-between bg-dark-surface/40">
                <div>
                  <span className="text-[10px] font-bold text-neon-cyan uppercase tracking-widest block mb-1.5">
                    {item.categoryName}
                  </span>
                  <h3 className="font-display text-lg sm:text-xl font-extrabold text-white uppercase tracking-wide group-hover:text-neon-lime transition-colors duration-300 mb-3 line-clamp-1">
                    {item.name}
                  </h3>
                  <p className="text-gray-400 text-xs line-clamp-2 mb-4 leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>

                {/* Spec Pills */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/5">
                  {item.specs.slice(0, 2).map((spec, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2.5 py-1 rounded-md bg-white/5 text-[10px] font-semibold text-gray-300 border border-white/5"
                    >
                      {spec}
                    </span>
                  ))}
                  {item.specs.length > 2 && (
                    <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] font-bold text-neon-lime border border-white/5">
                      +{item.specs.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal (Click and View) */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/90 backdrop-blur-xl transition-all duration-300 animate-fade-in"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-5 right-5 text-white/70 hover:text-white transition-all p-3 rounded-full bg-white/10 hover:bg-white/20 text-2xl focus:outline-none z-[60] cursor-pointer"
            aria-label="Close Lightbox"
          >
            <IoCloseOutline />
          </button>

          {/* Nav Prev */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrev()
            }}
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-2xl focus:outline-none z-[60] cursor-pointer hidden sm:flex items-center justify-center"
            aria-label="Previous Equipment"
          >
            <IoChevronBackOutline />
          </button>

          {/* Nav Next */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all p-3.5 rounded-full bg-white/10 hover:bg-white/20 text-2xl focus:outline-none z-[60] cursor-pointer hidden sm:flex items-center justify-center"
            aria-label="Next Equipment"
          >
            <IoChevronForwardOutline />
          </button>

          {/* Modal Content Box */}
          <div
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c0c0f] border border-white/10 rounded-3xl shadow-2xl overflow-y-auto flex flex-col lg:flex-row select-none"
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {/* Left Image Side */}
            <div className="w-full lg:w-1/2 relative bg-black/60 min-h-[260px] sm:min-h-[340px] flex items-center justify-center overflow-hidden">
              <img
                src={selectedItem.img}
                alt={selectedItem.name}
                onError={(e) => {
                  e.target.src = selectedItem.fallbackUrl
                }}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0f] via-transparent to-transparent lg:hidden" />
              
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 rounded-full bg-neon-lime text-black font-extrabold text-[10px] tracking-wider uppercase shadow-md">
                  {selectedItem.badge}
                </span>
              </div>
            </div>

            {/* Right Details Side */}
            <div className="w-full lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-[#0c0c0f]">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-neon-cyan uppercase tracking-widest">
                    {selectedItem.categoryName}
                  </span>
                  <span className="text-xs font-mono text-gray-500">
                    {selectedIndex + 1} / {filteredItems.length}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-tight mb-4">
                  {selectedItem.name}
                </h3>

                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
                  {selectedItem.description}
                </p>

                {/* Target Muscle Group */}
                <div className="mb-6 p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center gap-3">
                  <FiCpu className="text-neon-lime text-lg shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase block tracking-wider">
                      Target Muscle Focus
                    </span>
                    <span className="text-xs font-bold text-white">
                      {selectedItem.targetMuscle}
                    </span>
                  </div>
                </div>

                {/* Technical Specs Pills */}
                <div className="mb-6">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <FiLayers className="text-neon-cyan" />
                    <span>Technical Specs</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.specs.map((spec, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-gray-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights Bulleted List */}
                <div className="mb-6">
                  <h4 className="text-xs font-extrabold text-white uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                    <FiShield className="text-neon-lime" />
                    <span>Key Features & Safety</span>
                  </h4>
                  <ul className="space-y-2">
                    {selectedItem.highlights.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-300 leading-snug">
                        <IoCheckmarkCircle className="text-neon-lime text-base shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Modal Action CTA */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
                <a
                  href="#join"
                  onClick={closeModal}
                  className="w-full text-center py-3 rounded-xl bg-neon-lime hover:bg-[#b0dc00] text-black font-extrabold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 shadow-lg shadow-neon-lime/20 hover:-translate-y-0.5"
                >
                  Test This Gear At Gym
                </a>
              </div>

            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default Equipments
