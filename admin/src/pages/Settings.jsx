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
    
    // Stats About
    const [aboutYears, setAboutYears] = useState("")
    const [aboutMembers, setAboutMembers] = useState("")
    const [aboutCoaches, setAboutCoaches] = useState("")
    const [estYear, setEstYear] = useState("")
    const [estTagline, setEstTagline] = useState("")
    
    // Contact Info
    const [contactEmail, setContactEmail] = useState("")
    const [contactPhone, setContactPhone] = useState("")
    const [contactAddress, setContactAddress] = useState("")
    const [instagramId, setInstagramId] = useState("")
    const [ownerPhone, setOwnerPhone] = useState("")
    const [receptionPhone, setReceptionPhone] = useState("")

    // Pricing Tiers
    const [basicPrice, setBasicPrice] = useState("")
    const [basicPeriod, setBasicPeriod] = useState("")
    const [standardPrice, setStandardPrice] = useState("")
    const [standardPeriod, setStandardPeriod] = useState("")
    const [elitePrice, setElitePrice] = useState("")
    const [elitePeriod, setElitePeriod] = useState("")

    // About Photo
    const [aboutPhoto, setAboutPhoto] = useState("")
    const [aboutPhotoFile, setAboutPhotoFile] = useState(null)
    const [aboutPhotoPreview, setAboutPhotoPreview] = useState("")
    const [photoUploading, setPhotoUploading] = useState(false)

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
            setAboutYears(data.aboutYears || "12")
            setAboutMembers(data.aboutMembers || "8500")
            setAboutCoaches(data.aboutCoaches || "24")
            setEstYear(data.estYear || "2014")
            setEstTagline(data.estTagline || "12 Years of Athletic Innovation")
            setContactEmail(data.contactEmail || "")
            setContactPhone(data.contactPhone || "")
            setContactAddress(data.contactAddress || "")
            setInstagramId(data.instagramId || "")
            setOwnerPhone(data.ownerPhone || "")
            setReceptionPhone(data.receptionPhone || "")
            setBasicPrice(data.basicPrice || "200")
            setBasicPeriod(data.basicPeriod || "1-Day Trial Pass")
            setStandardPrice(data.standardPrice || "8,000")
            setStandardPeriod(data.standardPeriod || "for 6 months")
            setElitePrice(data.elitePrice || "12,000")
            setElitePeriod(data.elitePeriod || "for 1 year")
            setAboutPhoto(data.aboutPhoto || "")
            setAboutPhotoPreview(data.aboutPhoto || "")
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
                aboutYears,
                aboutMembers,
                aboutCoaches,
                contactEmail,
                contactPhone,
                contactAddress,
                instagramId,
                ownerPhone,
                receptionPhone,
                basicPrice,
                basicPeriod,
                standardPrice,
                standardPeriod,
                elitePrice,
                elitePeriod,
                estYear,
                estTagline
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

    const handleAboutPhotoChange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setAboutPhotoFile(file)
        setAboutPhotoPreview(URL.createObjectURL(file))
    }

    const handleAboutPhotoUpload = async () => {
        if (!aboutPhotoFile) return toast.error('Please select a photo first')
        setPhotoUploading(true)
        try {
            const formData = new FormData()
            formData.append('photo', aboutPhotoFile)
            const token = localStorage.getItem('adminToken')
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            const res = await axios.post(`${serverUrl}/api/settings/about-photo`, formData, {
                headers: { ...headers, 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            })
            if (res.data.success) {
                setAboutPhoto(res.data.aboutPhoto)
                setAboutPhotoFile(null)
                toast.success('About photo uploaded successfully!')
            }
        } catch (error) {
            console.error(error)
            toast.error('Failed to upload about photo')
        }
        setPhotoUploading(false)
    }

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

                            {/* About Page Stats */}
                            <div>
                                <h3 className='text-[15px] font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4'>4. About Section Counters</h3>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-[20px]'>
                                    <div>
                                        <label className={labelClass}>Stat 1 (Years of Excellence)</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 12" 
                                            className={inputClass} 
                                            value={aboutYears} 
                                            onChange={(e) => setAboutYears(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Stat 2 (Members Transformed)</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 8500" 
                                            className={inputClass} 
                                            value={aboutMembers} 
                                            onChange={(e) => setAboutMembers(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Stat 3 (Elite Coaches)</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 24" 
                                            className={inputClass} 
                                            value={aboutCoaches} 
                                            onChange={(e) => setAboutCoaches(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>
                                {/* EST Year & Tagline */}
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-[20px] mt-4'>
                                    <div>
                                        <label className={labelClass}>EST. Year (Photo Badge)</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 2014" 
                                            className={inputClass} 
                                            value={estYear} 
                                            onChange={(e) => setEstYear(e.target.value)} 
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>EST. Tagline (Photo Badge)</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. 12 Years of Athletic Innovation" 
                                            className={inputClass} 
                                            value={estTagline} 
                                            onChange={(e) => setEstTagline(e.target.value)} 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer & Contact */}
                            <div>
                                <h3 className='text-[15px] font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4'>5. Footer Contact & Social Details</h3>
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
                                        <label className={labelClass}>Owner Phone</label>
                                        <input 
                                            type="text" 
                                            className={inputClass} 
                                            value={ownerPhone} 
                                            onChange={(e) => setOwnerPhone(e.target.value)} 
                                            placeholder="e.g. 8439919640"
                                        />
                                    </div>
                                </div>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-[20px] mb-4'>
                                    <div>
                                        <label className={labelClass}>Reception Phone</label>
                                        <input 
                                            type="text" 
                                            className={inputClass} 
                                            value={receptionPhone} 
                                            onChange={(e) => setReceptionPhone(e.target.value)} 
                                            placeholder="e.g. 8439919640"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Instagram Username/ID</label>
                                        <input 
                                            type="text" 
                                            className={inputClass} 
                                            value={instagramId} 
                                            onChange={(e) => setInstagramId(e.target.value)} 
                                            placeholder="e.g. musclecraftfitness"
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

                            {/* Pricing Plans Config */}
                            <div>
                                <h3 className='text-[15px] font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4'>6. Pricing Plans Config</h3>
                                
                                {/* Basic Access */}
                                <div className='mb-6'>
                                    <h4 className='text-[13px] font-bold text-gray-600 mb-3 uppercase tracking-wider'>Basic Access Plan</h4>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-[20px]'>
                                        <div>
                                            <label className={labelClass}>Price (₹)</label>
                                            <input 
                                                type="text" 
                                                className={inputClass} 
                                                value={basicPrice} 
                                                onChange={(e) => setBasicPrice(e.target.value)} 
                                                required 
                                                placeholder="e.g. 200"
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Period/Duration Text</label>
                                            <input 
                                                type="text" 
                                                className={inputClass} 
                                                value={basicPeriod} 
                                                onChange={(e) => setBasicPeriod(e.target.value)} 
                                                required 
                                                placeholder="e.g. 1-Day Trial Pass"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Standard Tier */}
                                <div className='mb-6'>
                                    <h4 className='text-[13px] font-bold text-gray-600 mb-3 uppercase tracking-wider'>Standard Tier Plan</h4>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-[20px]'>
                                        <div>
                                            <label className={labelClass}>Price (₹)</label>
                                            <input 
                                                type="text" 
                                                className={inputClass} 
                                                value={standardPrice} 
                                                onChange={(e) => setStandardPrice(e.target.value)} 
                                                required 
                                                placeholder="e.g. 8,000"
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Period/Duration Text</label>
                                            <input 
                                                type="text" 
                                                className={inputClass} 
                                                value={standardPeriod} 
                                                onChange={(e) => setStandardPeriod(e.target.value)} 
                                                required 
                                                placeholder="e.g. for 6 months"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Elite Premium */}
                                <div className='mb-2'>
                                    <h4 className='text-[13px] font-bold text-gray-600 mb-3 uppercase tracking-wider'>Elite Premium Plan</h4>
                                    <div className='grid grid-cols-1 md:grid-cols-2 gap-[20px]'>
                                        <div>
                                            <label className={labelClass}>Price (₹)</label>
                                            <input 
                                                type="text" 
                                                className={inputClass} 
                                                value={elitePrice} 
                                                onChange={(e) => setElitePrice(e.target.value)} 
                                                required 
                                                placeholder="e.g. 12,000"
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Period/Duration Text</label>
                                            <input 
                                                type="text" 
                                                className={inputClass} 
                                                value={elitePeriod} 
                                                onChange={(e) => setElitePeriod(e.target.value)} 
                                                required 
                                                placeholder="e.g. for 1 year"
                                            />
                                        </div>
                                    </div>
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

                        {/* About Section Photo — Separate Upload Card */}
                        <div className='mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm p-[32px] max-w-[820px]'>
                            <h3 className='text-[15px] font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4'>7. About Section Photo</h3>
                            <p className='text-[12px] text-gray-400 mb-5'>About page par left side mein jo photo dikhti hai, use yahan se change karein.</p>
                            <div className='flex flex-col md:flex-row gap-6 items-start'>
                                {/* Preview */}
                                <div className='w-full md:w-[200px] h-[220px] rounded-xl overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0'>
                                    {aboutPhotoPreview ? (
                                        <img src={aboutPhotoPreview} alt='About Preview' className='w-full h-full object-cover' />
                                    ) : (
                                        <div className='w-full h-full flex items-center justify-center text-gray-400 text-[12px] font-medium'>No Photo</div>
                                    )}
                                </div>
                                {/* Upload Controls */}
                                <div className='flex flex-col gap-4 flex-1'>
                                    <div>
                                        <label className={labelClass}>Choose New Photo</label>
                                        <input 
                                            type='file' 
                                            accept='image/*'
                                            onChange={handleAboutPhotoChange}
                                            className='w-full text-[13px] text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[12px] file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-700 cursor-pointer'
                                        />
                                    </div>
                                    {aboutPhotoFile && (
                                        <p className='text-[11px] text-gray-400'>Selected: {aboutPhotoFile.name} ({(aboutPhotoFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                                    )}
                                    <button
                                        type='button'
                                        onClick={handleAboutPhotoUpload}
                                        disabled={photoUploading || !aboutPhotoFile}
                                        className='w-fit px-[24px] h-[42px] rounded-full bg-gradient-to-r from-gray-900 to-black text-white font-bold text-[13px] flex items-center justify-center gap-[8px] hover:shadow-lg hover:shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md disabled:opacity-40 disabled:cursor-not-allowed'
                                    >
                                        {photoUploading ? <Loading /> : <><FiSave /> Upload Photo</>}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Settings
