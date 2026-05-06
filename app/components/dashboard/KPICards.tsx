"use client";
import React from 'react';
import { School, Zap, Users, Leaf, Activity } from 'lucide-react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { DASHBOARD_DATA } from '../../constants/mockData';

export default function KPICards() {
  
  // Har card ke liye unique theme generator
  const getCardTheme = (label: string) => {
    switch(label) {
      case "Total Institutions": 
        return { icon: <School size={22} className="text-blue-600"/>, bg: "bg-blue-50/80", accent: "from-blue-400 to-blue-600" };
      case "Total Capacity": 
        return { icon: <Zap size={22} className="text-[#ea580c]"/>, bg: "bg-orange-50/80", accent: "from-[#f59e0b] to-[#ea580c]" };
      case "Students Impacted": 
        return { icon: <Users size={22} className="text-purple-600"/>, bg: "bg-purple-50/80", accent: "from-purple-400 to-purple-600" };
      case "CO2 Avoided": 
        return { icon: <Leaf size={22} className="text-[#10b981]"/>, bg: "bg-emerald-50/80", accent: "from-emerald-400 to-emerald-600" };
      default: 
        return { icon: <Activity size={22} className="text-rose-600"/>, bg: "bg-rose-50/80", accent: "from-rose-400 to-rose-600" };
    }
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
      {DASHBOARD_DATA.kpis.map((kpi, idx) => {
        const theme = getCardTheme(kpi.label);
        
        return (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true, margin: "-20px" }}
            transition={{ delay: idx * 0.1, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }} 
            key={idx} 
            className="group relative bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[1.5rem] p-6 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 overflow-hidden"
          >
            {/* Elegant Top Gradient Line */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.accent} opacity-80`} />
            
            {/* Soft Ambient Background Glow on Hover */}
            <div className={`absolute -bottom-10 -right-10 w-32 h-32 ${theme.bg} rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />

            <div className="flex justify-between items-start mb-6 relative z-10">
               <p className="text-[10px] md:text-[11px] font-extrabold text-slate-400 uppercase tracking-widest max-w-[60%] leading-snug">
                 {kpi.label}
               </p>
               {/* Premium Icon Dock */}
               <div className={`p-2.5 rounded-xl ${theme.bg} shadow-sm group-hover:scale-110 transition-transform duration-300 ease-out`}>
                 {theme.icon}
               </div>
            </div>

            <div className="flex items-end gap-1 text-[#0a192f] relative z-10">
              <h3 className="text-3xl md:text-4xl font-black tracking-tight">
                <CountUp 
                  end={kpi.value} 
                  decimals={kpi.value % 1 !== 0 ? 1 : 0} 
                  duration={2.5} 
                  separator="," 
                  useEasing={true}
                />
              </h3>
              <span className="text-base md:text-lg font-bold text-slate-400 mb-1 md:mb-1.5">{kpi.suffix}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}