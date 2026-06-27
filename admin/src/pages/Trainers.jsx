import React, { useState, useContext, useEffect } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import uploadIcon from '../assets/upload_image.jpg'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'
import { FiTrash2, FiEdit2, FiPlus, FiX, FiAward, FiInstagram, FiTwitter } from 'react-icons/fi'

function Trainers() {
    const [trainers, setTrainers] = useState([])
    const { serverUrl } = useContext(authDataContext)
    const [loading, setLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    // Form states
    const [isEditing, setIsEditing] = useState(false)
    const [editId, setEditId] = useState(null)
    const [showForm, setShowForm] = useState(false)
    
    const [name, setName] = useState("")
    const [role, setRole] = useState("")
    const [exp, setExp] = useState("")
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState("")
    const [instagram, setInstagram] = useState("")
    const [twitter, setTwitter] = useState("")
    const [certs, setCerts] = useState([])
    const [newCert, setNewCert] = useState("")
    const [themeColor, setThemeColor] = useState("lime") // 'lime' | 'cyan' | 'pink'

    const fetchTrainers = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${serverUrl}/api/trainers`)
            setTrainers(res.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load trainers")
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchTrainers()
    }, [])

    const handleAddCert = () => {
        if (newCert.trim()) {
            setCerts([...certs, newCert.trim()])
            setNewCert("")
        }
    }

    const handleRemoveCert = (index) => {
        setCerts(certs.filter((_, i) => i !== index))
    }

    const resetForm = () => {
        setName("")
        setRole("")
        setExp("")
        setImage(null)
        setImagePreview("")
        setInstagram("")
        setTwitter("")
        setCerts([])
        setNewCert("")
        setThemeColor("lime")
        setIsEditing(false)
        setEditId(null)
        setShowForm(false)
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!name || !role || !exp) {
            toast.error("Name, role, and experience are required")
            return
        }
        if (!isEditing && !image) {
            toast.error("Please upload a profile image")
            return
        }

        setActionLoading(true)
        try {
            const formData = new FormData()
            formData.append("name", name)
            formData.append("role", role)
            formData.append("exp", exp)
            formData.append("certs", JSON.stringify(certs))
            formData.append("instagram", instagram)
            formData.append("twitter", twitter)

            // Automap themes to tailwind classes
            let accentColor = 'text-neon-lime border-neon-lime/20'
            let badgeBg = 'bg-neon-lime/10'
            let glow = 'shadow-neon-lime/5 hover:shadow-neon-lime/20'
            let borderColor = 'group-hover:border-neon-lime/30'

            if (themeColor === 'cyan') {
                accentColor = 'text-neon-cyan border-neon-cyan/20'
                badgeBg = 'bg-neon-cyan/10'
                glow = 'shadow-neon-cyan/5 hover:shadow-neon-cyan/20'
                borderColor = 'group-hover:border-neon-cyan/30'
            } else if (themeColor === 'pink') {
                accentColor = 'text-neon-pink border-neon-pink/20'
                badgeBg = 'bg-neon-pink/10'
                glow = 'shadow-neon-pink/5 hover:shadow-neon-pink/20'
                borderColor = 'group-hover:border-neon-pink/30'
            }

            formData.append("accentColor", accentColor)
            formData.append("badgeBg", badgeBg)
            formData.append("glow", glow)
            formData.append("borderColor", borderColor)

            if (image) {
                formData.append("image", image)
            }

            const token = localStorage.getItem('adminToken')
            const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

            let result
            if (isEditing) {
                result = await axios.put(`${serverUrl}/api/trainers/${editId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', ...authHeaders },
                    withCredentials: true
                })
                toast.success("Trainer updated successfully")
            } else {
                result = await axios.post(`${serverUrl}/api/trainers`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data', ...authHeaders },
                    withCredentials: true
                })
                toast.success("Trainer added successfully")
            }

            if (result.data.success) {
                fetchTrainers()
                resetForm()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Operation failed")
        }
        setActionLoading(false)
    }

    const startEdit = (trainer) => {
        setIsEditing(true)
        setEditId(trainer._id)
        setName(trainer.name)
        setRole(trainer.role)
        setExp(trainer.exp)
        setImagePreview(trainer.image)
        setInstagram(trainer.socials?.instagram || "")
        setTwitter(trainer.socials?.twitter || "")
        setCerts(trainer.certs || [])
        
        // Detect theme color from accentColor string
        if (trainer.accentColor.includes('neon-cyan')) {
            setThemeColor('cyan')
        } else if (trainer.accentColor.includes('neon-pink')) {
            setThemeColor('pink')
        } else {
            setThemeColor('lime')
        }

        setShowForm(true)
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this trainer?")) return
        try {
            const token = localStorage.getItem('adminToken')
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            await axios.delete(`${serverUrl}/api/trainers/${id}`, { headers, withCredentials: true })
            toast.success("Trainer deleted successfully")
            fetchTrainers()
        } catch (error) {
            toast.error("Failed to delete trainer")
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
                        <h1 className='text-[26px] font-bold text-gray-900'>Trainers & Coaches</h1>
                        <p className='text-gray-400 text-[14px] mt-[4px]'>Customize the Elite Coaches section of the landing page</p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className='flex items-center gap-[8px] px-[24px] h-[46px] bg-gradient-to-r from-gray-900 to-black text-white rounded-full text-[14px] font-bold hover:shadow-lg hover:shadow-gray-200 border border-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md'
                        >
                            <FiPlus size={18} /> Add New Coach
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
                            {isEditing ? "Edit Coach Details" : "Add New Gym Coach"}
                        </h2>
                        
                        <form onSubmit={handleSubmit} className='flex flex-col gap-[24px]'>
                            
                            {/* Profile Image & Color Theme */}
                            <div className='flex flex-wrap gap-[32px] items-center'>
                                <div>
                                    <label className={labelClass}>Profile Photo</label>
                                    <label htmlFor="trainer-image" className='cursor-pointer block'>
                                        <div className={`w-[120px] h-[120px] rounded-2xl border-2 overflow-hidden transition-all
                                            ${imagePreview ? 'border-black' : 'border-dashed border-gray-300 hover:border-gray-500 bg-gray-50'} flex items-center justify-center`}>
                                            <img
                                                src={imagePreview || uploadIcon}
                                                alt="Preview"
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                        <input type="file" id="trainer-image" accept="image/*" hidden onChange={handleImageChange} />
                                    </label>
                                </div>

                                <div className='flex-1 min-w-[200px]'>
                                    <label className={labelClass}>Section Theme Highlight</label>
                                    <div className='flex gap-[12px] mt-[8px]'>
                                        {[
                                            { id: 'lime', name: 'Neon Lime', color: 'bg-lime-500 border-lime-600' },
                                            { id: 'cyan', name: 'Neon Cyan', color: 'bg-cyan-400 border-cyan-500' },
                                            { id: 'pink', name: 'Neon Pink', color: 'bg-pink-500 border-pink-600' }
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
                                                <span className={`w-3.5 h-3.5 rounded-full ${theme.color} inline-block`} />
                                                {theme.name}
                                            </button>
                                        ))}
                                    </div>
                                    <p className='text-gray-400 text-[11px] mt-[8px]'>
                                        Select the color scheme that highlights this coach's card layout.
                                    </p>
                                </div>
                            </div>

                            {/* Name, Role & Experience */}
                            <div className='grid grid-cols-1 md:grid-cols-3 gap-[20px]'>
                                <div>
                                    <label className={labelClass}>Coach Full Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Viktor Vance" 
                                        className={inputClass} 
                                        value={name} 
                                        onChange={(e) => setName(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div className='md:col-span-2'>
                                    <label className={labelClass}>Role / Specialization</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Strength & Hypertrophy Director" 
                                        className={inputClass} 
                                        value={role} 
                                        onChange={(e) => setRole(e.target.value)} 
                                        required 
                                    />
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-[20px]'>
                                <div>
                                    <label className={labelClass}>Experience Tag</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. 9 Yrs Exp" 
                                        className={inputClass} 
                                        value={exp} 
                                        onChange={(e) => setExp(e.target.value)} 
                                        required 
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Instagram URL</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. # or instagram.com/name" 
                                        className={inputClass} 
                                        value={instagram} 
                                        onChange={(e) => setInstagram(e.target.value)} 
                                    />
                                </div>
                                <div>
                                    <label className={labelClass}>Twitter URL</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. # or twitter.com/name" 
                                        className={inputClass} 
                                        value={twitter} 
                                        onChange={(e) => setTwitter(e.target.value)} 
                                    />
                                </div>
                            </div>

                            {/* Certifications list builder */}
                            <div>
                                <label className={labelClass}>Coach Credentials / Certifications</label>
                                <div className='flex gap-[10px] mb-[12px]'>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. CSCS (Certified Strength Specialist)" 
                                        className={`${inputClass} flex-1`}
                                        value={newCert}
                                        onChange={(e) => setNewCert(e.target.value)}
                                        onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); handleAddCert(); } }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddCert}
                                        className='h-[44px] px-[16px] rounded-xl bg-gray-900 text-white text-[13px] font-semibold hover:bg-gray-800 transition-all'
                                    >
                                        Add
                                    </button>
                                </div>

                                <div className='flex flex-col gap-[8px]'>
                                    {certs.length === 0 ? (
                                        <p className='text-gray-400 text-[13px] italic'>No credentials added yet.</p>
                                    ) : (
                                        certs.map((cert, index) => (
                                            <div key={index} className='flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl px-[16px] py-[8px]'>
                                                <span className='text-[13px] font-medium text-gray-700 flex items-center gap-[6px]'>
                                                    <FiAward className='text-gray-400' /> {cert}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveCert(index)}
                                                    className='text-gray-400 hover:text-red-500'
                                                >
                                                    <FiX size={16} />
                                                </button>
                                            </div>
                                        ))
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
                                    {actionLoading ? <Loading /> : (isEditing ? "Update Coach" : "Save Coach")}
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

                {/* Trainers List Grid */}
                {loading ? (
                    <div className='text-center py-[60px] text-gray-500'>Loading coaches list...</div>
                ) : trainers.length === 0 ? (
                    <div className='bg-white rounded-2xl border border-gray-200 p-[40px] text-center text-gray-400 text-[15px]'>
                        No customizable coaches found. Standard fallback coaches are loaded on the website.
                        <br /> Add your first custom coach above!
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]'>
                        {trainers.map((trainer) => (
                            <div 
                                key={trainer._id} 
                                className='bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between'
                            >
                                <div>
                                    {/* Photo with overlay details */}
                                    <div className='relative h-[240px] bg-gray-100'>
                                        <img 
                                            src={trainer.image} 
                                            alt={trainer.name} 
                                            className='w-full h-full object-cover' 
                                        />
                                        <div className='absolute top-4 right-4'>
                                            <span className='px-2.5 py-1 text-[9px] font-extrabold uppercase bg-black text-white rounded-full tracking-wider'>
                                                {trainer.exp}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Coach info */}
                                    <div className='p-[20px]'>
                                        <h3 className='font-bold text-gray-900 text-[18px]'>{trainer.name}</h3>
                                        <p className='text-gray-400 text-[12px] font-medium mt-1'>{trainer.role}</p>
                                        
                                        {/* Certifications summary */}
                                        <div className='mt-[16px] border-t border-gray-100 pt-[14px]'>
                                            <p className='text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2'>Credentials</p>
                                            <ul className='flex flex-col gap-1.5'>
                                                {trainer.certs?.slice(0, 3).map((cert, i) => (
                                                    <li key={i} className='text-[11px] text-gray-600 truncate flex items-center gap-1.5'>
                                                        <span className='w-1 h-1 rounded-full bg-gray-400' />
                                                        {cert}
                                                    </li>
                                                ))}
                                                {trainer.certs?.length > 3 && (
                                                    <li className='text-[10px] text-lime-600 font-bold'>+{trainer.certs.length - 3} more credentials</li>
                                                )}
                                                {(!trainer.certs || trainer.certs.length === 0) && (
                                                    <li className='text-[11px] text-gray-400 italic'>No credentials listed</li>
                                                )}
                                            </ul>
                                        </div>

                                        {/* Social Links */}
                                        <div className='flex gap-[12px] mt-[16px] text-gray-400'>
                                            {trainer.socials?.instagram && trainer.socials.instagram !== '#' && (
                                                <a href={trainer.socials.instagram} target='_blank' rel='noreferrer' className='hover:text-black'><FiInstagram /></a>
                                            )}
                                            {trainer.socials?.twitter && trainer.socials.twitter !== '#' && (
                                                <a href={trainer.socials.twitter} target='_blank' rel='noreferrer' className='hover:text-black'><FiTwitter /></a>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='border-t border-gray-100 bg-gray-50 px-[20px] py-[12px] flex justify-end gap-[10px]'>
                                    <button
                                        onClick={() => startEdit(trainer)}
                                        className='w-[34px] h-[34px] rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-black transition-all'
                                        title="Edit Coach"
                                    >
                                        <FiEdit2 size={14} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(trainer._id)}
                                        className='w-[34px] h-[34px] rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all'
                                        title="Delete Coach"
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

export default Trainers
