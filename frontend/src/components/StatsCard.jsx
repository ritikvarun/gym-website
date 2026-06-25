import React from 'react'

const StatsCard = ({ icon: Icon, number, label, highlightClass = 'text-neon-lime' }) => {
  return (
    <div className="glass-card glass-card-hover p-5 rounded-2xl flex items-center gap-4 pointer-events-auto">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 ${highlightClass}`}>
        {Icon && <Icon className="text-xl" />}
      </div>
      <div>
        <div className="text-2xl lg:text-3xl font-extrabold font-display text-white tracking-tight">
          {number}
        </div>
        <div className="text-[10px] lg:text-xs font-semibold text-gray-400 uppercase tracking-widest mt-0.5">
          {label}
        </div>
      </div>
    </div>
  )
}

export default StatsCard
