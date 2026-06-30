import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FiUser, FiPhone, FiMapPin, FiSend, FiCheckCircle, FiAlertTriangle, FiLoader, FiZap } from 'react-icons/fi'
import gymFallback from '../assets/gym_hero_fallback.webp'
import { API_URL } from '../config'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

const CTA = () => {
  const sectionRef = useRef(null)
  const bgContainerRef = useRef(null)
  const bgImageRef = useRef(null)
  const formCardRef = useRef(null)

  // Form states
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [plan, setPlan] = useState('trial_pass')
  const [message, setMessage] = useState('')
  
  // Status states
  const [status, setStatus] = useState('idle') // idle, submitting, success, error
  const [errorMessage, setErrorMessage] = useState('')
  const [whatsappUrl, setWhatsappUrl] = useState('')
  const [upiUrl, setUpiUrl] = useState('')
  const [submittedName, setSubmittedName] = useState('')
  const [submittedPlan, setSubmittedPlan] = useState('')
  const [submittedAmount, setSubmittedAmount] = useState('')
  const [settings, setSettings] = useState({
    basicPrice: "200",
    basicPeriod: "1-Day Trial Pass",
    standardPrice: "8,000",
    standardPeriod: "for 6 months",
    elitePrice: "12,000",
    elitePeriod: "for 1 year",
    upiId: "",
    upiName: ""
  })

  useEffect(() => {
    fetch(`${API_URL}/api/settings`)
      .then(res => res.json())
      .then(data => {
        if (data) {
          setSettings(prev => ({
            ...prev,
            basicPrice: data.basicPrice || prev.basicPrice,
            basicPeriod: data.basicPeriod || prev.basicPeriod,
            standardPrice: data.standardPrice || prev.standardPrice,
            standardPeriod: data.standardPeriod || prev.standardPeriod,
            elitePrice: data.elitePrice || prev.elitePrice,
            elitePeriod: data.elitePeriod || prev.elitePeriod,
            upiId: data.upiId || prev.upiId,
            upiName: data.upiName || prev.upiName
          }))
        }
      })
      .catch(err => console.log("Using default fallback CTA settings:", err.message))
  }, [])

  useEffect(() => {
    // ScrollReveal for text elements
    gsap.fromTo('.cta-reveal',
      { opacity: 0, y: 35 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )

    // Stagger for form card
    if (formCardRef.current) {
      gsap.fromTo(formCardRef.current,
        { opacity: 0, scale: 0.95, y: 40 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: formCardRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        }
      )
    }

    // Hash change handler to pre-select plans from Pricing section and scroll
    const handleHashChange = () => {
      const hash = window.location.hash;
      let selected = '';
      if (hash === '#join-trial') {
        selected = 'trial_pass';
      } else if (hash === '#join-basic') {
        selected = 'basic';
      } else if (hash === '#join-standard') {
        selected = 'standard';
      } else if (hash === '#join-elite') {
        selected = 'elite';
      }

      if (selected) {
        setPlan(selected);
        // Clear hash/trigger scroll smoothly
        setTimeout(() => {
          const el = document.getElementById('join');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }, 80);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    // Call initially
    handleHashChange();

    // Mouse Move Parallax for background image
    const handleMouseMove = (e) => {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const { clientX, clientY } = e
      
      const xVal = (clientX - rect.left - rect.width / 2) / (rect.width / 2)
      const yVal = (clientY - rect.top - rect.height / 2) / (rect.height / 2)

      gsap.to(bgImageRef.current, {
        x: -xVal * 20,
        y: -yVal * 20,
        duration: 1.2,
        ease: 'power2.out'
      })
    }

    const sectionEl = sectionRef.current
    if (sectionEl) {
      sectionEl.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      if (sectionEl) {
        sectionEl.removeEventListener('mousemove', handleMouseMove)
      }
    }
  }, [])

  // Map option keys to user-friendly titles
  const planTitles = {
    trial_pass: '1-Day Trial Pass (Adjustable — ₹200)',
    basic: `Basic Access (${settings.basicPeriod} — ₹${settings.basicPrice})`,
    standard: `Standard Tier (${settings.standardPeriod} — ₹${settings.standardPrice})`,
    elite: `Elite Premium (${settings.elitePeriod} — ₹${settings.elitePrice})`
  }

  const getCleanPrice = (planKey) => {
    let priceStr = '';
    if (planKey === 'trial_pass') priceStr = '200';
    else if (planKey === 'basic') priceStr = settings.basicPrice;
    else if (planKey === 'standard') priceStr = settings.standardPrice;
    else if (planKey === 'elite') priceStr = settings.elitePrice;
    return priceStr.replace(/[^0-9.]/g, '');
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    const payload = {
      name,
      phone,
      address,
      plan: planTitles[plan] || plan,
      message
    }

    try {
      const response = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        const cleanAmount = getCleanPrice(plan)
        setSubmittedName(name)
        setSubmittedPlan(
          plan === 'trial_pass' ? '1-Day Trial Pass' :
          plan === 'basic' ? 'Basic Access' :
          plan === 'standard' ? 'Standard Tier' :
          'Elite Premium'
        )
        setSubmittedAmount(cleanAmount)

        // UPI deep link
        const upiId = settings.upiId || 'musclecraft@upi'
        const upiName = settings.upiName || 'Muscle Craft Fitness Club'
        const transactionNote = `${name} - ${
          plan === 'trial_pass' ? 'Trial Pass' :
          plan === 'basic' ? 'Basic' :
          plan === 'standard' ? 'Standard' :
          'Elite'
        }`
        const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(upiName)}&am=${cleanAmount}&cu=INR&tn=${encodeURIComponent(transactionNote)}`
        setUpiUrl(upiLink)

        // Construct WhatsApp URL
        const cleanPhone = data.whatsappNumber ? data.whatsappNumber.replace(/\D/g, '') : '919876543210'
        const customMessage = `Hi Muscle Craft Gym! 🚀\n\nI just filled out the trial/plan registration form on your website. Here are my details:\n\n👤 *Name*: ${name}\n📞 *Phone*: ${phone}\n📍 *Address*: ${address}\n💪 *Plan Selected*: ${planTitles[plan]}\n💳 *Paid Amount*: ₹${cleanAmount} via UPI\n${message ? `📝 *My Goals*: "${message}"\n` : ''}\nI am attaching my payment screenshot. Please confirm my registration pass! Thanks!`
        const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMessage)}`
        
        setWhatsappUrl(waLink)
        setStatus('success')
        
        // Reset form fields
        setName('')
        setPhone('')
        setAddress('')
        setMessage('')
      } else {
        setStatus('error')
        setErrorMessage(data.message || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      console.error(err)
      setStatus('error')
      setErrorMessage('Unable to connect to the server. Please check your network and try again.')
    }
  }

  return (
    <section 
      ref={sectionRef}
      id="join" 
      className="relative w-full py-20 md:py-32 bg-dark-bg overflow-hidden border-t border-white/5"
    >
      {/* Background Parallax Image Container */}
      <div 
        ref={bgContainerRef} 
        className="absolute inset-0 w-full h-full overflow-hidden select-none"
      >
        <img 
          ref={bgImageRef}
          src={gymFallback} 
          alt="Muscle Craft Elite Workspace" 
          className="absolute -inset-10 w-[calc(100%+80px)] h-[calc(100%+80px)] object-cover object-center filter scale-105 opacity-[0.12] brightness-50"
        />
        {/* Dark vignette overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg via-dark-bg/90 to-dark-bg z-10" />
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg/80 via-transparent to-dark-bg/80 z-10" />
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-15 z-10 pointer-events-none" />

      {/* Content wrapper */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Heading and info */}
          <div className="lg:col-span-6 flex flex-col text-left">
            {/* Subtitle Badge */}
            <div className="cta-reveal w-fit text-neon-lime text-xs font-bold uppercase tracking-widest mb-6 border border-neon-lime/20 px-4 py-1.5 rounded-full bg-neon-lime/5">
              🚀 Join The Elite Performance Club
            </div>

            {/* High-Impact Heading */}
            <h2 className="cta-reveal font-display text-4xl md:text-6xl font-black text-white uppercase tracking-tight leading-none mb-6">
              READY TO BECOME THE <br />
              <span className="text-stroke-neon">BEST VERSION</span> OF YOURSELF?
            </h2>

            {/* Subheadline description */}
            <p className="cta-reveal text-gray-400 font-sans text-sm md:text-base leading-relaxed mb-6 max-w-lg">
              Fill out this membership/trial form to lock in your pass. Our secure registration system logs your request instantly to our database and alerts our coaching team.
            </p>

            {/* Micro details / Features */}
            <div className="cta-reveal flex flex-col gap-4 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neon-lime/10 border border-neon-lime/20 flex items-center justify-center text-neon-lime font-bold text-sm">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Zero Lead Loss Protection</h4>
                  <p className="text-[11px] text-gray-500 font-sans">Every request is saved locally in our system so your booking is never lost.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center text-neon-cyan font-bold text-sm">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Instant Email Notifications</h4>
                  <p className="text-[11px] text-gray-500 font-sans">Automatic SMTP relays alert our head coach immediately on form submission.</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-neon-pink/10 border border-neon-pink/20 flex items-center justify-center text-neon-pink font-bold text-sm">✓</div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Direct WhatsApp Access</h4>
                  <p className="text-[11px] text-gray-500 font-sans">Option to directly message your profile for instant, VIP pass approvals.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Form Card */}
          <div ref={formCardRef} className="lg:col-span-6 w-full max-w-xl mx-auto">
            <div className="relative group p-8 md:p-10 rounded-[2.5rem] border border-white/5 bg-dark-surface/40 backdrop-blur-xl transition-all duration-500 shadow-2xl hover:border-white/10 overflow-hidden">
              {/* Highlight accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-neon-lime/20 via-neon-lime/50 to-neon-lime/20" />
              
              {status === 'success' ? (
                /* Success View */
                <div className="flex flex-col items-center text-center py-6 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-neon-lime/10 border border-neon-lime/40 flex items-center justify-center text-neon-lime mb-6 animate-pulse">
                    <FiCheckCircle size={36} />
                  </div>
                  <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight mb-4 text-center">
                    REGISTRATION RECEIVED!
                  </h3>
                  
                  {settings.upiId ? (
                    <div className="flex flex-col items-center bg-white/5 border border-white/10 rounded-3xl p-6 mb-6 w-full">
                      <p className="text-[10px] font-bold text-neon-lime uppercase tracking-widest mb-3">Scan to Pay via UPI</p>
                      
                      <div className="p-3 bg-white rounded-xl shadow-lg border border-neon-lime/30 mb-3">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(upiUrl)}`}
                          alt="UPI QR Code"
                          className="w-[180px] h-[180px]"
                        />
                      </div>
                      
                      <div className="text-center mb-4">
                        <p className="text-xs text-gray-400 font-sans">Amount to Pay: <span className="text-sm font-black text-white">₹{submittedAmount}</span></p>
                        <p className="text-[9px] text-gray-500 font-sans mt-0.5">UPI ID: {settings.upiId}</p>
                      </div>

                      {/* Direct UPI pay button (Mobile deep link) */}
                      <a 
                        href={upiUrl}
                        className="w-full py-3 rounded-xl bg-neon-lime/10 border border-neon-lime/30 hover:bg-neon-lime/20 text-neon-lime text-[11px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 mb-2 active:scale-[0.98]"
                      >
                        ⚡ Pay via UPI App (GPay/PhonePe)
                      </a>
                      
                      <p className="text-[9px] text-gray-500 font-sans text-center">
                        Tap above to pay directly from your mobile UPI apps.
                      </p>
                    </div>
                  ) : null}

                  <p className="text-xs text-gray-400 font-sans leading-relaxed max-w-sm mb-6 text-center">
                    {settings.upiId 
                      ? `Please complete your payment of ₹${submittedAmount} using the QR code or the UPI App button. After paying, click below to send the payment screenshot on WhatsApp to activate your pass!`
                      : "Your trial pass request is saved to our server and our team has been emailed. To accelerate your confirmation, click the WhatsApp button below to instantly connect with us!"
                    }
                  </p>
                  
                  <a 
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-extrabold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 shadow-lg shadow-[#25d366]/10 hover:shadow-[#25d366]/25 active:scale-[0.98]"
                  >
                    {/* SVG WhatsApp Logo */}
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 0 0 1.335 4.978L2 22l5.197-1.36a9.944 9.944 0 0 0 4.814 1.238h.005c5.504 0 9.99-4.478 9.99-9.985a9.965 9.965 0 0 0-9.994-9.893zm5.728 14.103c-.244.69-1.213 1.25-1.666 1.302-.454.053-.9.278-2.914-.526-2.427-.97-3.99-3.447-4.11-3.608-.122-.162-1.002-1.335-1.002-2.54 0-1.206.634-1.8 1.002-2.185.367-.387.807-.484 1.077-.484.269 0 .538.005.772.016.244.011.562-.09.88.66.318.75 1.088 2.658 1.185 2.854.098.194.162.42.033.678-.13.258-.2.42-.392.646-.194.226-.408.506-.58.694-.194.21-.398.436-.172.823a13.61 13.61 0 0 0 2.49 3.09 11.23 11.23 0 0 0 3.597 2.217c.392.177.624.15.855-.113.23-.263.99-1.145 1.258-1.532.269-.387.538-.323.899-.194.36.129 2.28 1.075 2.671 1.269.393.194.656.29.753.452.097.162.097.936-.147 1.626z" />
                    </svg>
                    Send Screenshot on WhatsApp
                  </a>

                  <button
                    onClick={() => setStatus('idle')}
                    className="mt-4 text-xs font-semibold text-gray-500 hover:text-white transition-colors uppercase tracking-widest"
                  >
                    Submit another response
                  </button>
                </div>
              ) : (
                /* Form View */
                <form onSubmit={handleSubmit} className="flex flex-col gap-6 text-left">
                  
                  <div>
                    <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight mb-2">
                      Lock In Your Pass
                    </h3>
                    <p className="text-xs text-gray-500 font-sans">
                      Fill out your profile below. All details are encrypted and sent securely.
                    </p>
                  </div>

                  {/* Input: Full Name */}
                  <div className="relative group/input">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2 group-focus-within/input:text-neon-lime transition-colors">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-neon-lime transition-colors">
                        <FiUser size={16} />
                      </div>
                      <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="e.g. John Doe"
                        className="w-full bg-white/5 border border-white/10 focus:border-neon-lime/40 rounded-xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-lime/20 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Input: Phone Number */}
                  <div className="relative group/input">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2 group-focus-within/input:text-neon-lime transition-colors">
                      Phone Number
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-neon-lime transition-colors">
                        <FiPhone size={16} />
                      </div>
                      <input 
                        type="tel" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                        placeholder="e.g. 9876543210"
                        className="w-full bg-white/5 border border-white/10 focus:border-neon-lime/40 rounded-xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-lime/20 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Input: Address */}
                  <div className="relative group/input">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2 group-focus-within/input:text-neon-lime transition-colors">
                      Home Address / City
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-neon-lime transition-colors">
                        <FiMapPin size={16} />
                      </div>
                      <input 
                        type="text" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        required
                        placeholder="e.g. 123 Main St, New Delhi"
                        className="w-full bg-white/5 border border-white/10 focus:border-neon-lime/40 rounded-xl pl-11 pr-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-lime/20 transition-all font-sans"
                      />
                    </div>
                  </div>

                  {/* Dropdown: Selected Plan */}
                  <div className="relative group/input">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2 group-focus-within/input:text-neon-lime transition-colors">
                      Choose Plan / Performance Tier
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within/input:text-neon-lime transition-colors">
                        <FiZap size={16} />
                      </div>
                      <select 
                        value={plan}
                        onChange={(e) => setPlan(e.target.value)}
                        required
                        className="w-full bg-white/5 border border-white/10 focus:border-neon-lime/40 rounded-xl pl-11 pr-10 py-3.5 text-xs text-white appearance-none focus:outline-none focus:ring-1 focus:ring-neon-lime/20 transition-all font-sans cursor-pointer"
                      >
                        <option value="trial_pass" className="bg-[#0c0c0e] text-white">1-Day Trial Pass (Adjustable — ₹200)</option>
                        <option value="basic" className="bg-[#0c0c0e] text-white">Basic Access ({settings.basicPeriod} — ₹{settings.basicPrice})</option>
                        <option value="standard" className="bg-[#0c0c0e] text-white">Standard Tier ({settings.standardPeriod} — ₹{settings.standardPrice})</option>
                        <option value="elite" className="bg-[#0c0c0e] text-white">Elite Premium ({settings.elitePeriod} — ₹{settings.elitePrice})</option>
                      </select>
                      {/* Down Arrow Indicator */}
                      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Textarea: Message / Goals */}
                  <div className="relative group/input">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2 group-focus-within/input:text-neon-lime transition-colors">
                      Brief Message or Fitness Goals (Optional)
                    </label>
                    <textarea 
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows="3"
                      placeholder="e.g. I want to build muscle and increase endurance..."
                      className="w-full bg-white/5 border border-white/10 focus:border-neon-lime/40 rounded-xl px-4 py-3.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-neon-lime/20 transition-all font-sans resize-none"
                    />
                  </div>

                  {/* Submission States */}
                  {status === 'error' && (
                    <div className="flex items-center gap-2.5 p-3 rounded-xl border border-red-500/20 bg-red-500/5 text-red-400 text-[11px] font-sans">
                      <FiAlertTriangle className="flex-shrink-0" size={16} />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="relative">
                    <button 
                      type="submit" 
                      disabled={status === 'submitting'}
                      className="w-full py-4 rounded-xl bg-neon-lime hover:bg-[#b0dc00] disabled:bg-neon-lime/40 text-black text-xs font-extrabold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-neon-lime/10 hover:shadow-neon-lime/25 disabled:cursor-not-allowed group"
                    >
                      {status === 'submitting' ? (
                        <>
                          <FiLoader className="animate-spin text-sm" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Request</span>
                          <FiSend className="text-xs transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default CTA

