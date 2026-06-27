import React, { useState, useContext, useEffect } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import uploadIcon from '../assets/upload_image.jpg'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'
import { FiTrash2, FiPlus, FiX } from 'react-icons/fi'

function Transformations() {
    const [transformations, setTransformations] = useState([])
    const { serverUrl } = useContext(authDataContext)
    const [loading, setLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    // Form states
    const [showForm, setShowForm] = useState(false)
    const [name, setName] = useState("")
    const [program, setProgram] = useState("")
    const [duration, setDuration] = useState("")
    const [tagline, setTagline] = useState("")
    const [quote, setQuote] = useState("")
    const [accentColor, setAccentColor] = useState("#ccff00") // Preset neon lime

    // Image states
    const [beforeImage, setBeforeImage] = useState(null)
    const [beforePreview, setBeforePreview] = useState("")
    const [afterImage, setAfterImage] = useState(null)
    const [afterPreview, setAfterPreview] = useState("")

    // Stats metrics states
    const [stat1Label, setStat1Label] = useState("")
    const [stat1Value, setStat1Value] = useState("")
    const [stat2Label, setStat2Label] = useState("")
    const [stat2Value, setStat2Value] = useState("")
    const [stat3Label, setStat3Label] = useState("")
    const [stat3Value, setStat3Value] = useState("")

    const fetchTransformations = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${serverUrl}/api/transformations`)
            setTransformations(res.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load transformations")
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchTransformations()
    }, [])

    const resetForm = () => {
        setName("")
        setProgram("")
        setDuration("")
        setTagline("")
        setQuote("")
        setAccentColor("#ccff00")
        setBeforeImage(null)
        setBeforePreview("")
        setAfterImage(null)
        setAfterPreview("")
        setStat1Label("")
        setStat1Value("")
        setStat2Label("")
        setStat2Value("")
        setStat3Label("")
        setStat3Value("")
        setShowForm(false)
    }

    const handleBeforeImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setBeforeImage(file)
            setBeforePreview(URL.createObjectURL(file))
        }
    }

    const handleAfterImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setAfterImage(file)
            setAfterPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!beforeImage || !afterImage) {
            toast.error("Please upload both Before and After images")
            return
        }
        if (!name || !program || !duration || !tagline || !quote) {
            toast.error("All text fields are required")
            return
        }

        setActionLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("program", program)
            formData.append("duration", duration)
            formData.append("tagline", tagline)
            formData.append("quote", quote)
            formData.append("accentColor", accentColor)
            formData.append("beforeImage", beforeImage)
            formData.append("afterImage", afterImage)

            // Construct stats structure
            const stats = []
            if (stat1Label && stat1Value) stats.push({ label: stat1Label, value: stat1Value })
            if (stat2Label && stat2Value) stats.push({ label: stat2Label, value: stat2Value })
            if (stat3Label && stat3Value) stats.push({ label: stat3Label, value: stat3Value })
            formData.append("stats", JSON.stringify(stats))

            const token = localStorage.getItem('adminToken')
            const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

            const result = await axios.post(`${serverUrl}/api/transformations`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', ...authHeaders },
                withCredentials: true
            })

            if (result.data.success) {
                toast.success("Transformation story added successfully!")
                fetchTransformations()
                resetForm()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed")
        }
        setActionLoading(false)
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this transformation story?")) return
        try {
            const token = localStorage.getItem('adminToken')
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            await axios.delete(`${serverUrl}/api/transformations/${id}`, { headers, withCredentials: true })
            toast.success("Transformation removed")
            fetchTransformations()
        } catch (error) {
            toast.error("Failed to delete transformation")
        }
    }

    const inputClass = 'w-full h-[44px] rounded-xl px-[14px] text-gray-800 text-[14px] placeholder-gray-300 outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50 border border-gray-200'
    const labelClass = 'text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-[6px] block'

    return (
        <div className='w-[100vw] min-h-[100vh] bg-gray-50'>
            <Nav />
            <Sidebar />

            <div className='md:ml-[220px] pt-[80px] pb-[100px] md:pb-[32px] px-[16px] md:px-[32px]'>
                
                {/* Header */}
                <div className='flex justify-between items-center mb-[28px] flex-wrap gap-4'>
                    <div>
                        <h1 className='text-[26px] font-bold text-gray-900'>Transformations</h1>
                        <p className='text-gray-400 text-[14px] mt-[4px]'>Manage the Before/After transformation comparison slider and success stories</p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className='flex items-center gap-[8px] px-[24px] h-[46px] bg-gradient-to-r from-gray-900 to-black text-white rounded-full text-[14px] font-bold hover:shadow-lg hover:shadow-gray-200 border border-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md'
                        >
                            <FiPlus size={18} /> Add Success Story
                        </button>
                    )}
                </div>

                {/* Add/Edit Form */}
                {showForm && (
                    <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-[32px] max-w-[850px] mb-[32px] relative animate-fadeIn'>
                        <button 
                            onClick={resetForm} 
                            className='absolute right-[20px] top-[20px] text-gray-400 hover:text-gray-600'
                        >
                            <FiX size={20} />
                        </button>
                        <h2 className='text-[18px] font-bold text-gray-900 mb-[24px]'>Add Transformation Story</h2>
                        
                        <form onSubmit={handleSubmit} className='flex flex-col gap-[24px]'>
                            
                            {/* Images Row */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-[24px]'>
                                {/* Before Image */}
                                <div>
                                    <label className={labelClass}>Before Image (Normal Body)</label>
                                    <label className='flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl h-[160px] cursor-pointer hover:bg-gray-50 transition duration-150 overflow-hidden relative'>
                                        {beforePreview ? (
                                            <img src={beforePreview} alt="Before preview" className='w-full h-full object-cover' />
                                        ) : (
                                            <div className='flex flex-col items-center justify-center p-4 text-center'>
                                                <img src={uploadIcon} alt="Upload icon" className='w-[40px] opacity-40 mb-2' />
                                                <span className='text-[12px] text-gray-400 font-medium'>Upload Before Photo</span>
                                            </div>
                                        )}
                                        <input type="file" onChange={handleBeforeImageChange} className='hidden' accept="image/*" />
                                    </label>
                                </div>

                                {/* After Image */}
                                <div>
                                    <label className={labelClass}>After Image (Transformed Body)</label>
                                    <label className='flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl h-[160px] cursor-pointer hover:bg-gray-50 transition duration-150 overflow-hidden relative'>
                                        {afterPreview ? (
                                            <img src={afterPreview} alt="After preview" className='w-full h-full object-cover' />
                                        ) : (
                                            <div className='flex flex-col items-center justify-center p-4 text-center'>
                                                <img src={uploadIcon} alt="Upload icon" className='w-[40px] opacity-40 mb-2' />
                                                <span className='text-[12px] text-gray-400 font-medium'>Upload After Photo</span>
                                            </div>
                                        )}
                                        <input type="file" onChange={handleAfterImageChange} className='hidden' accept="image/*" />
                                    </label>
                                </div>
                            </div>

                            {/* Bio Details */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-[20px]'>
                                <div>
                                    <label className={labelClass}>Full Name</label>
                                    <input 
                                        type="text" 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        placeholder="e.g. Marcus Vance" 
                                        className={inputClass} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Program Name</label>
                                    <input 
                                        type="text" 
                                        value={program} 
                                        onChange={(e) => setProgram(e.target.value)} 
                                        placeholder="e.g. HyperPhysique hypertrophy" 
                                        className={inputClass} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Duration / Timeline</label>
                                    <input 
                                        type="text" 
                                        value={duration} 
                                        onChange={(e) => setDuration(e.target.value)} 
                                        placeholder="e.g. 16 Weeks Program" 
                                        className={inputClass} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Accent Color Theme</label>
                                    <select 
                                        value={accentColor} 
                                        onChange={(e) => setAccentColor(e.target.value)}
                                        className={inputClass}
                                    >
                                        <option value="#ccff00">Neon Lime (#ccff00)</option>
                                        <option value="#00f0ff">Neon Cyan (#00f0ff)</option>
                                        <option value="#ff007f">Neon Pink (#ff007f)</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className={labelClass}>Tagline Description</label>
                                <input 
                                    type="text" 
                                    value={tagline} 
                                    onChange={(e) => setTagline(e.target.value)} 
                                    placeholder="e.g. Rebuilt with Lean Muscle mass" 
                                    className={inputClass} 
                                    required 
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Testimonial Quote</label>
                                <textarea 
                                    value={quote} 
                                    onChange={(e) => setQuote(e.target.value)} 
                                    placeholder="Brief quotes about the member's transformation journey..." 
                                    className='w-full min-h-[90px] rounded-xl p-[14px] text-gray-800 text-[14px] placeholder-gray-300 outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50 border border-gray-200'
                                    required
                                />
                            </div>

                            {/* Metrics Section */}
                            <div>
                                <label className='text-[13px] font-bold text-gray-800 border-b border-gray-100 pb-2 mb-4 block'>Key Metrics (Add up to 3 Stats)</label>
                                <div className='grid grid-cols-1 md:grid-cols-3 gap-[16px]'>
                                    {/* Stat 1 */}
                                    <div className='p-4 border border-gray-200 rounded-xl bg-gray-50/50 flex flex-col gap-2'>
                                        <span className='text-[11px] font-extrabold text-gray-400 tracking-wider uppercase'>Metric 1</span>
                                        <input type="text" placeholder="Label: Lean Mass Gained" value={stat1Label} onChange={(e) => setStat1Label(e.target.value)} className={inputClass} />
                                        <input type="text" placeholder="Value: +6.2 kg" value={stat1Value} onChange={(e) => setStat1Value(e.target.value)} className={inputClass} />
                                    </div>
                                    {/* Stat 2 */}
                                    <div className='p-4 border border-gray-200 rounded-xl bg-gray-50/50 flex flex-col gap-2'>
                                        <span className='text-[11px] font-extrabold text-gray-400 tracking-wider uppercase'>Metric 2</span>
                                        <input type="text" placeholder="Label: Body Fat Reduced" value={stat2Label} onChange={(e) => setStat2Label(e.target.value)} className={inputClass} />
                                        <input type="text" placeholder="Value: -12.5%" value={stat2Value} onChange={(e) => setStat2Value(e.target.value)} className={inputClass} />
                                    </div>
                                    {/* Stat 3 */}
                                    <div className='p-4 border border-gray-200 rounded-xl bg-gray-50/50 flex flex-col gap-2'>
                                        <span className='text-[11px] font-extrabold text-gray-400 tracking-wider uppercase'>Metric 3</span>
                                        <input type="text" placeholder="Label: Bench Press Max" value={stat3Label} onChange={(e) => setStat3Label(e.target.value)} className={inputClass} />
                                        <input type="text" placeholder="Value: +45 kg" value={stat3Value} onChange={(e) => setStat3Value(e.target.value)} className={inputClass} />
                                    </div>
                                </div>
                            </div>

                            {/* Buttons */}
                            <div className='flex justify-end gap-[14px] mt-[10px]'>
                                <button 
                                    type="button" 
                                    onClick={resetForm}
                                    className='px-[24px] h-[46px] border border-gray-200 rounded-full font-bold text-[14px] hover:bg-gray-50 cursor-pointer active:scale-95 transition'
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    disabled={actionLoading}
                                    className='px-[28px] h-[46px] bg-gradient-to-r from-gray-900 to-black text-white rounded-full font-bold text-[14px] hover:shadow-lg hover:shadow-gray-200 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-md'
                                >
                                    {actionLoading ? <Loading /> : 'Publish Story'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Transformations List */}
                {loading ? (
                    <div className='text-center py-[80px] text-gray-400'>Loading transformations stories...</div>
                ) : (
                    <div>
                        {transformations.length === 0 ? (
                            <div className='bg-white border border-gray-200 rounded-2xl p-[48px] text-center max-w-[600px] mx-auto'>
                                <p className='text-gray-400 text-[15px] font-medium'>No custom transformations uploaded yet.</p>
                                <p className='text-gray-300 text-[13px] mt-[4px]'>Use the button in the top right to post your first client transformation slider!</p>
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]'>
                                {transformations.map((item) => (
                                    <div key={item._id} className='bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col group'>
                                        
                                        {/* Before/After Previews Grid */}
                                        <div className='grid grid-cols-2 aspect-[4/3] border-b border-gray-100 relative bg-gray-900'>
                                            <div className='relative h-full'>
                                                <img src={item.beforeImage} alt="Before" className='w-full h-full object-cover grayscale brightness-75' />
                                                <span className='absolute bottom-2 left-2 bg-black/60 backdrop-blur text-[8px] tracking-widest font-extrabold text-white px-2 py-0.5 rounded'>BEFORE</span>
                                            </div>
                                            <div className='relative h-full'>
                                                <img src={item.afterImage} alt="After" className='w-full h-full object-cover' />
                                                <span className='absolute bottom-2 right-2 bg-black/60 backdrop-blur text-[8px] tracking-widest font-extrabold text-white px-2 py-0.5 rounded' style={{ color: item.accentColor }}>AFTER</span>
                                            </div>
                                        </div>

                                        {/* Card Info */}
                                        <div className='p-[20px] flex-1 flex flex-col justify-between'>
                                            <div>
                                                <div className='flex items-center gap-2 mb-1.5'>
                                                    <span className='text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-500'>{item.duration}</span>
                                                    <span className='text-[10px] font-bold text-gray-400 truncate max-w-[150px]'>{item.program}</span>
                                                </div>
                                                <h3 className='text-[16px] font-bold text-gray-900 truncate'>{item.name}</h3>
                                                <p className='text-gray-400 text-[12px] italic line-clamp-2 mt-1'>"{item.quote}"</p>
                                                
                                                {/* Metrics Badge */}
                                                <div className='flex flex-wrap gap-1.5 mt-3'>
                                                    {item.stats.map((stat, i) => (
                                                        <span key={i} className='text-[9px] font-semibold text-gray-600 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md'>
                                                            <strong style={{ color: item.accentColor }}>{stat.value}</strong> {stat.label}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Action footer */}
                                            <div className='mt-[20px] pt-[14px] border-t border-gray-100 flex justify-end'>
                                                <button
                                                    onClick={() => handleDelete(item._id)}
                                                    className='text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition duration-150'
                                                    title="Delete Success Story"
                                                >
                                                    <FiTrash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

            </div>
        </div>
    )
}

export default Transformations
