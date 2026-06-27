import React, { useState, useContext, useEffect } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'
import { FiSave } from 'react-icons/fi'

function Settings() {
    const { serverUrl } = useContext(authDataContext)
    const [loading, setLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    // Form fields
    const [gymName, setGymName] = useState("")
    const [logoText, setLogoText] = useState("")
    
    // Hero
    const [heroTitle1, setHeroTitle1] = useState("")
    const [heroTitle2, setHeroTitle2] = useState("")
    const [heroSubheadline, setHeroSubheadline] = useState("")
    
    // Stats
    const [membersActive, setMembersActive] = useState("")
    const [eliteCoaches, setEliteCoaches] = useState("")
    const [successRate, setSuccessRate] = useState("")
    
    // Contact Info
    const [contactEmail, setContactEmail] = useState("")
    const [contactPhone, setContactPhone] = useState("")
    const [contactAddress, setContactAddress] = useState("")

    const fetchSettings = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${serverUrl}/api/settings`)
            const data = res.data
            setGymName(data.gymName || "")
            setLogoText(data.logoText || "")
            setHeroTitle1(data.heroTitle1 || "")
            setHeroTitle2(data.heroTitle2 || "")
            setHeroSubheadline(data.heroSubheadline || "")
            setMembersActive(data.membersActive || "")
            setEliteCoaches(data.eliteCoaches || "")
            setSuccessRate(data.successRate || "")
            setContactEmail(data.contactEmail || "")
            setContactPhone(data.contactPhone || "")
            setContactAddress(data.contactAddress || "")
        } catch (error) {
            console.error(error)
            toast.error("Failed to load settings")
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchSettings()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setActionLoading(true)
        try {
            const payload = {
                gymName,
                logoText,
                heroTitle1,
                heroTitle2,
                heroSubheadline,
                membersActive,
                eliteCoaches,
                successRate,
                contactEmail,
                contactPhone,
                contactAddress
            }
            const token = localStorage.getItem('adminToken')
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            const res = await axios.post(`${serverUrl}/api/settings`, payload, { headers, withCredentials: true })
            if (res.data.success) {
                toast.success("Settings saved successfully!")
            }
        } catch (error) {
            console.error(error)
            toast.error("Failed to save settings")
        }
        setActionLoading(false)
    }

    const inputClass = 'w-full h-[44px] rounded-xl px-[14px] text-gray-800 text-[14px] placeholder-gray-300 outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50 border border-gray-200'
    const labelClass = 'text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-[6px] block'

    return (
        <div className='w-[100vw] min-h-[100vh] bg-gray-50'>
            <Nav />
            <Sidebar />

            <div className='md:ml-[220px] pt-[80px] pb-[100px] md:pb-[32px] px-[16px] md:px-[32px]'>
                
                {/* Header */}
                <div className='mb-[28px]'>
                    <h1 className='text-[26px] font-bold text-gray-900'>General Settings</h1>
                    <p className='text-gray-400 text-[14px] mt-[4px]'>Customize the global copy, hero section and footer of your Gym website</p>
                </div>

                {loading ? (
                    <div className='text-center py-[60px] text-gray-500'>Loading settings details...</div>
                ) : (
                    <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-[32px] max-w-[820px]'>
                        <form onSubmit={handleSubmit} className='flex flex-col gap-[28px]'>
                            
                            {/* General Branding */}
                            <div>
                                <h3 className='text-[15px] font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4'>1. General Branding</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-[20px]'>
                                    <div>
                                        <label className={labelClass}>Gym Name</label>
                                        <input 
                                            type="text" 
                                            className={inputClass} 
                                            value={gymName} 
                                            onChange={(e) => setGymName(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Header Logo Text</label>
                                        <input 
                                            type="text" 
                                            className={inputClass} 
                                            value={logoText} 
                                            onChange={(e) => setLogoText(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Hero Copy */}
                            <div>
                                <h3 className='text-[15px] font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4'>2. Hero Headline & Text</h3>
                                <div className='flex flex-col gap-[16px]'>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-[20px]'>
                                        <div>
                                            <label className={labelClass}>Headline Line 1</label>
                                            <input 
                                                type="text" 
                                                className={inputClass} 
                                                value={heroTitle1} 
                                                onChange={(e) => setHeroTitle1(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Headline Line 2</label>
                                            <input 
                                                type="text" 
                                                className={inputClass} 
                                                value={heroTitle2} 
                                                onChange={(e) => setHeroTitle2(e.target.value)} 
                                                required 
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Hero Subheadline (Description)</label>
                                        <textarea 
                                            className='w-full h-[80px] rounded-xl px-[14px] py-[10px] text-gray-800 text-[14px] placeholder-gray-300 outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50 border border-gray-200 resize-none'
                                            value={heroSubheadline} 
                                            onChange={(e) => setHeroSubheadline(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Landing Page Stats */}
                            <div>
                                <h3 className='text-[15px] font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4'>3. Floating Page Counters</h3>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-[20px]'>
                                    <div>
                                        <label className={labelClass}>Stat 1 (Members Active)</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 15k+" 
                                            className={inputClass} 
                                            value={membersActive} 
                                            onChange={(e) => setMembersActive(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Stat 2 (Elite Coaches)</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 25+" 
                                            className={inputClass} 
                                            value={eliteCoaches} 
                                            onChange={(e) => setEliteCoaches(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Stat 3 (Success Rate)</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 99.8%" 
                                            className={inputClass} 
                                            value={successRate} 
                                            onChange={(e) => setSuccessRate(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer & Contact */}
                            <div>
                                <h3 className='text-[15px] font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4'>4. Footer Contact Details</h3>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-[20px] mb-4'>
                                    <div>
                                        <label className={labelClass}>Contact Email</label>
                                        <input 
                                            type="email" 
                                            className={inputClass} 
                                            value={contactEmail} 
                                            onChange={(e) => setContactEmail(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Contact Phone</label>
                                        <input 
                                            type="text" 
                                            className={inputClass} 
                                            value={contactPhone} 
                                            onChange={(e) => setContactPhone(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelClass}>Gym Address</label>
                                    <input 
                                        type="text" 
                                        className={inputClass} 
                                        value={contactAddress} 
                                        onChange={(e) => setContactAddress(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                className='w-fit px-[32px] h-[46px] rounded-full bg-gradient-to-r from-gray-900 to-black text-white font-bold text-[14px] flex items-center justify-center gap-[8px] hover:shadow-lg hover:shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md'
                                disabled={actionLoading}
                            >
                                {actionLoading ? <Loading /> : <><FiSave /> Save Settings</>}
                            </button>

                        </form>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Settings
