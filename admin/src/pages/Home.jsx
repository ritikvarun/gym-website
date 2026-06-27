import React, { useState, useContext, useEffect } from 'react'
import Nav from '../component/Nav'
import Sidebar from '../component/Sidebar'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { FiUsers, FiImage, FiZap, FiSettings, FiActivity } from 'react-icons/fi'
import { toast } from 'react-toastify'
import Loading from '../component/Loading'

function Home() {
    const [totalTrainers, setTotalTrainers] = useState(0)
    const [totalGallery, setTotalGallery] = useState(0)
    const [totalClasses, setTotalClasses] = useState(0)
    const [totalTransformations, setTotalTransformations] = useState(0)
    const [settings, setSettings] = useState(null)
    const [gymName, setGymName] = useState("")
    const [loadingSettings, setLoadingSettings] = useState(false)
    const { serverUrl } = useContext(authDataContext)

    const fetchDashboardData = async () => {
        try {
            const trainersRes = await axios.get(`${serverUrl}/api/trainers`, { withCredentials: true })
            setTotalTrainers(trainersRes.data.length)
            
            const galleryRes = await axios.get(`${serverUrl}/api/gallery`, { withCredentials: true })
            setTotalGallery(galleryRes.data.length)
            
            const classesRes = await axios.get(`${serverUrl}/api/programs`, { withCredentials: true })
            setTotalClasses(classesRes.data.length)

            const transformationsRes = await axios.get(`${serverUrl}/api/transformations`, { withCredentials: true })
            setTotalTransformations(transformationsRes.data.length)

            const settingsRes = await axios.get(`${serverUrl}/api/settings`, { withCredentials: true })
            setSettings(settingsRes.data)
            setGymName(settingsRes.data.gymName || "Muscle Craft Fitness Club")
        } catch (err) {
            console.error("Failed to fetch dashboard counts", err)
        }
    }

    const handleQuickSettingsUpdate = async (e) => {
        e.preventDefault()
        setLoadingSettings(true)
        try {
            const token = localStorage.getItem('adminToken')
            const headers = token ? { Authorization: `Bearer ${token}` } : {}
            const res = await axios.post(`${serverUrl}/api/settings`, { gymName }, { headers, withCredentials: true })
            if (res.data.success) {
                toast.success("Gym Name updated!")
                setSettings(res.data.settings)
            }
        } catch (err) {
            toast.error("Failed to update settings")
        }
        setLoadingSettings(false)
    }

    useEffect(() => {
        fetchDashboardData()
    }, [])

    return (
        <div className='w-[100vw] min-h-[100vh] bg-gray-50'>
            <Nav />
            <Sidebar />

            <div className='md:ml-[220px] pt-[80px] pb-[100px] md:pb-[32px] px-[16px] md:px-[32px]'>
                {/* Page header */}
                <div className='mb-[32px]'>
                    <h1 className='text-[26px] font-bold text-gray-900'>Dashboard Overview</h1>
                    <p className='text-gray-400 text-[14px] mt-[4px]'>
                        Manage your Gym Website Customization from one place 👋
                    </p>
                </div>

                {/* Stat cards */}
                <div className='flex flex-wrap gap-[20px] mb-[32px]'>
                    {/* Trainers count */}
                    <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-[28px] flex items-center gap-[20px] flex-1 min-w-[220px]'>
                        <div className='w-[52px] h-[52px] bg-lime-50 rounded-xl flex items-center justify-center'>
                            <FiUsers className='w-[24px] h-[24px] text-lime-600' />
                        </div>
                        <div>
                            <p className='text-[13px] text-gray-400 font-medium'>Total Trainers</p>
                            <p className='text-[34px] font-bold text-gray-900 leading-tight'>{totalTrainers}</p>
                        </div>
                    </div>

                    {/* Gallery Count */}
                    <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-[28px] flex items-center gap-[20px] flex-1 min-w-[220px]'>
                        <div className='w-[52px] h-[52px] bg-cyan-50 rounded-xl flex items-center justify-center'>
                            <FiImage className='w-[24px] h-[24px] text-cyan-600' />
                        </div>
                        <div>
                            <p className='text-[13px] text-gray-400 font-medium'>Gallery Images</p>
                            <p className='text-[34px] font-bold text-gray-900 leading-tight'>{totalGallery}</p>
                        </div>
                    </div>

                    {/* Classes Count */}
                    <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-[28px] flex items-center gap-[20px] flex-1 min-w-[220px]'>
                        <div className='w-[52px] h-[52px] bg-pink-50 rounded-xl flex items-center justify-center'>
                            <FiZap className='w-[24px] h-[24px] text-pink-600' />
                        </div>
                        <div>
                            <p className='text-[13px] text-gray-400 font-medium'>Active Classes</p>
                            <p className='text-[34px] font-bold text-gray-900 leading-tight'>{totalClasses}</p>
                        </div>
                    </div>

                    {/* Transformations Count */}
                    <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-[28px] flex items-center gap-[20px] flex-1 min-w-[220px]'>
                        <div className='w-[52px] h-[52px] bg-violet-50 rounded-xl flex items-center justify-center'>
                            <FiActivity className='w-[24px] h-[24px] text-violet-600' />
                        </div>
                        <div>
                            <p className='text-[13px] text-gray-400 font-medium'>Transformations</p>
                            <p className='text-[34px] font-bold text-gray-900 leading-tight'>{totalTransformations}</p>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-[24px]'>
                    {/* Website Overview Info */}
                    <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-[32px]'>
                        <h2 className='text-[18px] font-bold text-gray-900 mb-[20px] flex items-center gap-[8px]'>
                            <FiActivity className='text-lime-600' /> Live Site Details
                        </h2>
                        {settings ? (
                            <div className='flex flex-col gap-[14px]'>
                                <div className='flex justify-between border-b border-gray-100 pb-[10px]'>
                                    <span className='text-[14px] text-gray-400 font-medium'>Gym Name</span>
                                    <span className='text-[14px] text-gray-800 font-semibold'>{settings.gymName}</span>
                                </div>
                                <div className='flex justify-between border-b border-gray-100 pb-[10px]'>
                                    <span className='text-[14px] text-gray-400 font-medium'>Members Counter</span>
                                    <span className='text-[14px] text-gray-800 font-semibold'>{settings.membersActive}</span>
                                </div>
                                <div className='flex justify-between border-b border-gray-100 pb-[10px]'>
                                    <span className='text-[14px] text-gray-400 font-medium'>Coaches Counter</span>
                                    <span className='text-[14px] text-gray-800 font-semibold'>{settings.eliteCoaches}</span>
                                </div>
                                <div className='flex justify-between border-b border-gray-100 pb-[10px]'>
                                    <span className='text-[14px] text-gray-400 font-medium'>Success Rate Counter</span>
                                    <span className='text-[14px] text-gray-800 font-semibold'>{settings.successRate}</span>
                                </div>
                                <div className='flex flex-col gap-[4px] mt-[10px]'>
                                    <span className='text-[12px] text-gray-400 font-semibold uppercase tracking-wider'>Contact Details</span>
                                    <p className='text-[14px] text-gray-700 font-medium'>📧 {settings.contactEmail}</p>
                                    <p className='text-[14px] text-gray-700 font-medium'>📞 {settings.contactPhone}</p>
                                    <p className='text-[14px] text-gray-700 font-medium'>📍 {settings.contactAddress}</p>
                                </div>
                            </div>
                        ) : (
                            <p className='text-gray-400 text-[14px]'>Loading live site details...</p>
                        )}
                    </div>

                    {/* Quick Settings */}
                    <div className='bg-white rounded-2xl border border-gray-200 shadow-sm p-[32px]'>
                        <h2 className='text-[18px] font-bold text-gray-900 mb-[20px] flex items-center gap-[8px]'>
                            <FiSettings className='text-cyan-600' /> Quick Customize
                        </h2>
                        <form onSubmit={handleQuickSettingsUpdate} className='flex flex-col gap-[20px]'>
                            <div>
                                <label className='text-[12px] font-semibold text-gray-500 uppercase tracking-wider mb-[6px] block'>
                                    Gym Name (Brand)
                                </label>
                                <input
                                    type='text'
                                    value={gymName}
                                    onChange={(e) => setGymName(e.target.value)}
                                    placeholder='e.g. Muscle Craft Gym'
                                    className='w-full h-[44px] rounded-xl px-[14px] text-gray-800 text-[14px] placeholder-gray-300 outline-none focus:ring-2 focus:ring-gray-300 bg-gray-50 border border-gray-200'
                                    required
                                />
                            </div>

                             <button
                                type='submit'
                                className='w-full h-[46px] rounded-full bg-gradient-to-r from-gray-900 to-black text-white font-bold text-[14px] flex items-center justify-center gap-[8px] hover:shadow-lg hover:shadow-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md'
                                disabled={loadingSettings}
                            >
                                {loadingSettings ? <Loading /> : 'Update Gym Name'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
