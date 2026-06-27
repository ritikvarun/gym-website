import React, { useState, useContext, useEffect } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import uploadIcon from '../assets/upload_image.jpg'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'
import { FiTrash2, FiPlus, FiX } from 'react-icons/fi'

function Gallery() {
    const [gallery, setGallery] = useState([])
    const { serverUrl } = useContext(authDataContext)
    const [loading, setLoading] = useState(false)
    const [actionLoading, setActionLoading] = useState(false)

    // Form states
    const [showForm, setShowForm] = useState(false)
    const [title, setTitle] = useState("")
    const [tag, setTag] = useState("")
    const [aspect, setAspect] = useState("aspect-square")
    const [glowColor, setGlowColor] = useState("group-hover:border-neon-lime/30")
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState("")

    const fetchGallery = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${serverUrl}/api/gallery`)
            setGallery(res.data)
        } catch (error) {
            console.error(error)
            toast.error("Failed to load gallery items")
        }
        setLoading(false)
    }

    useEffect(() => {
        fetchGallery()
    }, [])

    const resetForm = () => {
        setTitle("")
        setTag("")
        setAspect("aspect-square")
        setGlowColor("group-hover:border-neon-lime/30")
        setImage(null)
        setImagePreview("")
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
        if (!image) {
            toast.error("Please upload an image file")
            return
        }

        setActionLoading(true)
        try {
            const formData = new FormData()
            formData.append("title", title || "Muscle Craft Session")
            formData.append("tag", tag || "Workout")
            formData.append("aspect", aspect)
            formData.append("glowColor", glowColor)
            formData.append("image", image)

            const token = localStorage.getItem('adminToken')
            const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

            const result = await axios.post(`${serverUrl}/api/gallery`, formData, {
                headers: { 'Content-Type': 'multipart/form-data', ...authHeaders },
                withCredentials: true
            })

            if (result.data.success) {
                toast.success("Image added to gallery!")
                fetchGallery()
                resetForm()
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Upload failed")
        }
        setActionLoading(false)
    }

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this gallery photo?")) return
        try {
            const token = localStorage.getItem('adminToken')
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            await axios.delete(`${serverUrl}/api/gallery/${id}`, { headers, withCredentials: true })
            toast.success("Gallery item removed")
            fetchGallery()
        } catch (error) {
            toast.error("Failed to delete gallery item")
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
                        <h1 className='text-[26px] font-bold text-gray-900'>Gallery Sections</h1>
                        <p className='text-gray-400 text-[14px] mt-[4px]'>Customize the visual atmospheric gallery on the website</p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className='flex items-center gap-[8px] px-[24px] h-[46px] bg-gradient-to-r from-gray-900 to-black text-white rounded-full text-[14px] font-bold hover:shadow-lg hover:shadow-gray-200 border border-gray-800 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md'
                        >
                            <FiPlus size={18} /> Upload Image
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
                        <h2 className='text-[18px] font-bold text-gray-900 mb-[24px]'>Upload Gallery Image</h2>
                        
                        <form onSubmit={handleSubmit} className='flex flex-col gap-[24px]'>
                            
                            {/* Photo Upload */}
                            <div className='flex flex-wrap gap-[32px] items-center'>
                                <div>
                                    <label className={labelClass}>Upload Image</label>
                                    <label htmlFor="gallery-image" className='cursor-pointer block'>
                                        <div className={`w-[140px] h-[110px] rounded-2xl border-2 overflow-hidden transition-all
                                            ${imagePreview ? 'border-black' : 'border-dashed border-gray-300 hover:border-gray-500 bg-gray-50'} flex items-center justify-center`}>
                                            <img
                                                src={imagePreview || uploadIcon}
                                                alt="Preview"
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                        <input type="file" id="gallery-image" accept="image/*" hidden onChange={handleImageChange} required />
                                    </label>
                                </div>

                                <div className='flex-1 min-w-[200px] flex flex-col gap-[14px]'>
                                    <div>
                                        <label className={labelClass}>Photo Title</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Zen Recovery Lounge" 
                                            className={inputClass} 
                                            value={title} 
                                            onChange={(e) => setTitle(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Photo Tag / Subtitle</label>
                                        <input 
                                            type="text" 
                                            placeholder="e.g. Mind & Body Recovery" 
                                            className={inputClass} 
                                            value={tag} 
                                            onChange={(e) => setTag(e.target.value)} 
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Aspect Ratio & Glow Theme */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-[20px]'>
                                <div>
                                    <label className={labelClass}>Masonry Layout (Aspect Ratio)</label>
                                    <select 
                                        className={inputClass} 
                                        value={aspect} 
                                        onChange={(e) => setAspect(e.target.value)}
                                    >
                                        <option value="aspect-square">Square (1:1)</option>
                                        <option value="aspect-[3/4]">Tall (3:4)</option>
                                        <option value="aspect-[4/3]">Wide (4:3)</option>
                                    </select>
                                </div>

                                <div>
                                    <label className={labelClass}>Interactive Glow Color</label>
                                    <select 
                                        className={inputClass} 
                                        value={glowColor} 
                                        onChange={(e) => setGlowColor(e.target.value)}
                                    >
                                        <option value="group-hover:border-neon-lime/30">Neon Lime (Green)</option>
                                        <option value="group-hover:border-neon-cyan/30">Neon Cyan (Blue)</option>
                                        <option value="group-hover:border-neon-pink/30">Neon Pink (Pink)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Submit & Cancel */}
                            <div className='flex gap-[12px]'>
                                <button
                                    type="submit"
                                    className='px-[28px] h-[46px] rounded-full bg-gradient-to-r from-gray-900 to-black text-white font-bold text-[14px] flex items-center justify-center gap-[8px] hover:shadow-lg hover:shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md'
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <Loading /> : "Upload to Website"}
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

                {/* Gallery List Grid */}
                {loading ? (
                    <div className='text-center py-[60px] text-gray-500'>Loading gallery list...</div>
                ) : gallery.length === 0 ? (
                    <div className='bg-white rounded-2xl border border-gray-200 p-[40px] text-center text-gray-400 text-[15px]'>
                        No customizable gallery images found. Original default gallery is active on the website.
                        <br /> Upload your first image above!
                    </div>
                ) : (
                    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[20px]'>
                        {gallery.map((item) => (
                            <div 
                                key={item._id} 
                                className='bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between group'
                            >
                                <div className='relative overflow-hidden aspect-[4/3] bg-gray-100'>
                                    <img 
                                        src={item.img} 
                                        alt={item.title} 
                                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300' 
                                    />
                                </div>
                                <div className='p-[12px] border-t border-gray-100 flex items-center justify-between'>
                                    <div className='truncate pr-[8px]'>
                                        <h3 className='font-bold text-gray-800 text-[13px] truncate'>{item.title}</h3>
                                        <p className='text-gray-400 text-[10px] mt-0.5 truncate'>{item.tag}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(item._id)}
                                        className='w-[30px] h-[30px] rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all flex-shrink-0'
                                        title="Delete Photo"
                                    >
                                        <FiTrash2 size={13} />
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

export default Gallery
