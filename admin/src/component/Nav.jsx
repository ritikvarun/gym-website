import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import { adminDataContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

function Nav() {
    let navigate = useNavigate()
    let { serverUrl } = useContext(authDataContext)
    let { getAdmin, adminData } = useContext(adminDataContext)

    const logOut = async () => {
        try {
            await axios.get(serverUrl + "/api/auth/logout", { withCredentials: true })
            localStorage.removeItem('adminToken')
            toast.success("Logged out successfully")
            getAdmin()
            navigate("/login")
        } catch (error) {
            console.log(error)
            toast.error("LogOut Failed")
        }
    }

    return (
        <div className='w-full h-[64px] bg-white border-b border-gray-200 z-[60] fixed top-0 flex items-center justify-between px-4 sm:px-[30px] shadow-sm'>
            <div className='flex items-center gap-2 sm:gap-[10px] cursor-pointer' onClick={() => navigate("/")}>
                <div className='flex flex-col justify-center'>
                    <span className='text-base sm:text-xl font-black text-black tracking-tight uppercase flex items-center gap-1.5 leading-none'>
                        Muscle Craft <span className='text-base sm:text-xl select-none'>💪</span>
                    </span>
                    <a href="tel:8439919640" onClick={(e) => e.stopPropagation()} className='text-[10px] sm:text-[11px] font-bold text-gray-600 hover:text-black transition-colors flex items-center gap-1 leading-none mt-0.5 tracking-wide'>
                        📞 8439919640
                    </a>
                </div>
                <span className='text-[10px] sm:text-[11px] font-semibold text-gray-500 uppercase tracking-widest bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-gray-200/80 inline-flex items-center gap-1'>
                    Gym Admin ⚡
                </span>
                {adminData?.email && (
                    <span className='hidden md:inline-flex text-[11px] font-semibold text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full items-center gap-1'>
                        👑 {adminData.email.split('@')[0]}
                    </span>
                )}
            </div>
            <button
                onClick={logOut}
                className='text-[12px] sm:text-[13px] font-semibold bg-black text-white px-3 sm:px-[18px] py-1.5 sm:py-[8px] rounded-full hover:bg-gray-800 transition-all duration-200 shadow-sm'
            >
                Log Out 🚪
            </button>
        </div>
    )
}

export default Nav
