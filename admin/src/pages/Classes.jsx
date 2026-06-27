import React, { useState, useContext, useEffect } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'
import { FiTrash2, FiEdit2, FiPlus, FiX, FiActivity, FiZap, FiTarget, FiShield } from 'react-icons/fi'

function Classes() {
    const [classes, setClasses] = useState([])
    const { serverUrl } = useContext(authDataContext)
    const [loading, setLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    // Form states
    const [isEditing, setIsEditing] = useState(false)
    const [editId, setEditId] = useState(null)
    const [showForm, setShowForm] = useState(false)
    
    const [title, setTitle] = useState("")
    const [desc, setDesc] = useState("")
    const [features, setFeatures] = useState([])
    const [newFeature, setNewFeature] = useState("")
    const [iconName, setIconName] = useState("FiZap")
    const [themeColor, setThemeColor] = useState("lime") // 'lime' | 'cyan' | 'pink'

    const fetchClasses = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${serverUrl}/api/programs`)
            setClasses(res.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load programs")
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchClasses()
    }, [])

    const handleAddFeature = () => {
        if (newFeature.trim()) {
            setFeatures([...features, newFeature.trim()])
            setNewFeature("")
        }
    }

    const handleRemoveFeature = (index) => {
        setFeatures(features.filter((_, i) => i !== index))
    }

    const resetForm = () => {
        setTitle("")
        setDesc("")
        setFeatures([])
        setNewFeature("")
        setIconName("FiZap")
        setThemeColor("lime")
        setIsEditing(false)
        setEditId(null)
        setShowForm(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title || !desc) {
            toast.error("Title and description are required")
            return
        }

        setActionLoading(true)
        try {
            // Automap themes to tailwind classes
            let accent = 'group-hover:border-neon-lime'
            let textAccent = 'text-neon-lime'
            let glow = 'shadow-neon-lime/5 group-hover:shadow-neon-lime/15'

            if (themeColor === 'cyan') {
                accent = 'group-hover:border-neon-cyan'
                textAccent = 'text-neon-cyan'
                glow = 'shadow-neon-cyan/5 group-hover:shadow-neon-cyan/15'
            } else if (themeColor === 'pink') {
                accent = 'group-hover:border-neon-pink'
                textAccent = 'text-neon-pink'
                glow = 'shadow-neon-pink/5 group-hover:shadow-neon-pink/15'
            }

            const payload = {
                title,
                desc,
                features,
                iconName,
                accent,
                textAccent,
                glow
            }

            const token = localStorage.getItem('adminToken')
            const headers = token ? { Authorization: `Bearer ${token}` } : {}

            let result
            if (isEditing) {
                result = await axios.put(`${serverUrl}/api/programs/${editId}`, payload, { headers, withCredentials: true })
                toast.success("Program updated successfully")
            } else {
                result = await axios.post(`${serverUrl}/api/programs`, payload, { headers, withCredentials: true })
                toast.success("Program added successfully")
            }

            if (result.data.success) {
                fetchClasses()
                resetForm()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed")
        }
        setActionLoading(false)
    }

    const startEdit = (prog) => {
        setIsEditing(true)
        setEditId(prog._id)
        setTitle(prog.title)
        setDesc(prog.desc)
        setFeatures(prog.features || [])
        setIconName(prog.iconName || "FiZap")
        
        // Detect theme color
        if (prog.textAccent?.includes('neon-cyan')) {
            setThemeColor('cyan')
        } else if (prog.textAccent?.includes('neon-pink')) {
            setThemeColor('pink')
        } else {
            setThemeColor('lime')
        }

        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this program?")) return
        try {
            const token = localStorage.getItem('adminToken')
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            await axios.delete(`${serverUrl}/api/programs/${id}`, { headers, withCredentials: true })
            toast.success("Program deleted successfully")
            fetchClasses()
        } catch (error) {
            toast.error("Failed to delete program")
        }
    }

    const getIconComponent = (name) => {
        switch (name) {
            case 'FiZap': return <FiZap />;
            case 'FiActivity': return <FiActivity />;
            case 'FiTarget': return <FiTarget />;
            case 'FiShield': return <FiShield />;
            default: return <FiZap />;
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
                        <h1 className='text-[26px] font-bold text-gray-900'>Training Programs & Classes</h1>
                        <p className='text-gray-400 text-[14px] mt-[4px]'>Customize the Weapon training paths on your landing page</p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className='flex items-center gap-[8px] px-[24px] h-[46px] bg-gradient-to-r from-gray-900 to-black text-white rounded-full text-[14px] font-bold hover:shadow-lg hover:shadow-gray-200 border border-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md'
                        >
                            <FiPlus size={18} /> Add New Class
                        </button>
                    )}
                </div>

                {/* Form Section */}
                {showForm && (
                    <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-[32px] max-w-[760px] mb-[32px] relative'>
                        <button 
                            onClick={resetForm} 
                            className='absolute right-[20px] top-[20px] text-gray-400 hover:text-gray-600'
                        >
                            <FiX size={20} />
                        </button>
                        <h2 className='text-[18px] font-bold text-gray-900 mb-[24px]'>
                            {isEditing ? "Edit Program Details" : "Create New Program"}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className='flex flex-col gap-[24px]'>
                            
                            {/* Title & Icon Selection */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-[20px]'>
                                <div className='md:col-span-2'>
                                    <label className={labelClass}>Program Title</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Metcon Redline" 
                                        className={inputClass} 
                                        value={title} 
                                        onChange={(e) => setTitle(e.target.value)} 
                                        required 
                                    />
                                </div>

                                <div>
                                    <label className={labelClass}>Program Icon</label>
                                    <select 
                                        className={inputClass} 
                                        value={iconName} 
                                        onChange={(e) => setIconName(e.target.value)}
                                    >
                                        <option value="FiZap">⚡ Lightning (Zap)</option>
                                        <option value="FiActivity">💓 Heartbeat (Activity)</option>
                                        <option value="FiTarget">🎯 Crosshair (Target)</option>
                                        <option value="FiShield">🛡️ Protection (Shield)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label className={labelClass}>Program Description</label>
                                <textarea 
                                    placeholder="Write a clear, motivating summary of what this program does..." 
                                    className='w-full h-[100px] rounded-xl px-[14px] py-[10px] text-gray-800 text-[14px] placeholder-gray-300 outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50 border border-gray-200 resize-none'
                                    value={desc} 
                                    onChange={(e) => setDesc(e.target.value)} 
                                    required 
                                />
                            </div>

                            {/* Theme & Features */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-[24px]'>
                                {/* Color theme select */}
                                <div>
                                    <label className={labelClass}>Accent Theme Color</label>
                                    <div className='flex gap-[10px] mt-[6px]'>
                                        {[
                                            { id: 'lime', name: 'Neon Lime', color: 'bg-lime-500' },
                                            { id: 'cyan', name: 'Neon Cyan', color: 'bg-cyan-400' },
                                            { id: 'pink', name: 'Neon Pink', color: 'bg-pink-500' }
                                        ].map(theme => (
                                            <button
                                                type="button"
                                                key={theme.id}
                                                onClick={() => setThemeColor(theme.id)}
                                                className={`flex items-center gap-[6px] px-[12px] py-[8px] border rounded-xl text-[13px] font-semibold transition-all
                                                    ${themeColor === theme.id 
                                                        ? 'bg-gray-900 text-white border-gray-900 shadow-sm' 
                                                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
                                            >
                                                <span className={`w-3 h-3 rounded-full ${theme.color}`} />
                                                {theme.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Features lists */}
                                <div>
                                    <label className={labelClass}>Class Bullet Features</label>
                                    <div className='flex gap-[10px]'>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. HIIT circuit modules" 
                                            className={`${inputClass} flex-1`}
                                            value={newFeature}
                                            onChange={(e) => setNewFeature(e.target.value)}
                                            onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                                        />
                                        <button
                                            type="button"
                                            onClick={handleAddFeature}
                                            className='h-[44px] px-[16px] rounded-xl bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-800 transition-all'
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Features items display */}
                            <div>
                                <div className='flex flex-wrap gap-[8px]'>
                                    {features.map((feat, index) => (
                                        <span 
                                            key={index} 
                                            className='inline-flex items-center gap-[6px] px-[12px] py-[6px] bg-lime-50 text-lime-800 border border-lime-200 rounded-full text-[12px] font-semibold'
                                        >
                                            {feat}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFeature(index)}
                                                className='text-lime-600 hover:text-lime-900'
                                            >
                                                <FiX size={14} />
                                            </button>
                                        </span>
                                    ))}
                                    {features.length === 0 && (
                                        <p className='text-gray-400 text-[13px] italic'>No bullet features added yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Submit & Cancel */}
                            <div className='flex gap-[12px]'>
                                <button
                                    type="submit"
                                    className='px-[28px] h-[46px] rounded-full bg-gradient-to-r from-gray-900 to-black text-white font-bold text-[14px] flex items-center justify-center gap-[8px] hover:shadow-lg hover:shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md'
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <Loading /> : (isEditing ? "Update Program" : "Create Program")}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className='px-[24px] h-[46px] rounded-full border border-gray-200 bg-white text-gray-700 font-bold text-[14px] hover:bg-gray-50 active:scale-[0.98] transition-all duration-200 cursor-pointer'
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Programs List */}
                {loading ? (
                    <div className='text-center py-[60px] text-gray-500'>Loading programs list...</div>
                ) : classes.length === 0 ? (
                    <div className='bg-white rounded-2xl border border-gray-200 p-[40px] text-center text-gray-400 text-[15px]'>
                        No customizable programs found. Standard fallback programs are loaded on the website.
                        <br /> Add your first program above!
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]'>
                        {classes.map((prog) => (
                            <div 
                                key={prog._id} 
                                className='bg-white border border-gray-200 rounded-2xl p-[24px] shadow-sm flex flex-col justify-between relative overflow-hidden'
                            >
                                <div className='absolute top-2 right-4 text-gray-100 font-bold text-5xl select-none'>
                                    {prog.num}
                                </div>

                                <div className='relative z-10'>
                                    {/* Icon */}
                                    <div className='w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center text-xl text-gray-700 mb-6'>
                                        {getIconComponent(prog.iconName)}
                                    </div>

                                    {/* Title */}
                                    <h3 className='font-bold text-gray-900 text-[18px] mb-3'>{prog.title}</h3>
                                    
                                    {/* Description */}
                                    <p className='text-gray-400 text-[13px] leading-relaxed mb-[16px]'>{prog.desc}</p>
                                    
                                    {/* Features bullets */}
                                    <div className='flex flex-wrap gap-[6px] mb-4'>
                                        {prog.features?.map((feat, i) => (
                                            <span key={i} className='bg-gray-100 text-gray-600 px-[10px] py-[3px] rounded-full text-[10px] font-semibold'>
                                                {feat}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='border-t border-gray-100 pt-[14px] flex justify-end gap-[10px] relative z-10'>
                                    <button
                                        onClick={() => startEdit(prog)}
                                        className='w-[34px] h-[34px] rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-black transition-all'
                                        title="Edit Class"
                                    >
                                        <FiEdit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(prog._id)}
                                        className='w-[34px] h-[34px] rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all'
                                        title="Delete Class"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Classes
