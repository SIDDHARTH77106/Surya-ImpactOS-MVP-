"use client";
import React from 'react';
import { ShieldCheck, Zap, MapPin } from 'lucide-react';
import { DASHBOARD_DATA, SchoolFilter } from '../../constants/mockData';
import { motion } from 'framer-motion';

type InstitutionsProps = {
  selectedSchool: SchoolFilter;
};

export default function Institutions({ selectedSchool }: InstitutionsProps) {
  const institutions = DASHBOARD_DATA.institutions.filter((inst) => (
    selectedSchool === 'all' || inst.key === selectedSchool
  ));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-8"
    >
      {/* Premium Header Section */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 shadow-sm">
           <ShieldCheck className="text-[#10b981]" size={24} strokeWidth={2.5} />
        </div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a192f] tracking-tight">
          Real Impact Proof
        </h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
        {institutions.map((inst, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.2, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="group relative bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[2rem] p-6 lg:p-8 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-500 overflow-hidden z-10"
          >
            {/* Subtle Gradient Accent on Top Right */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-orange-50 to-transparent rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110" />

            <div className="flex justify-between items-start mb-6">
              <h4 className="text-xl md:text-2xl font-bold text-[#0a192f] leading-tight max-w-[75%]">
                {inst.name}
              </h4>
              
              {/* Premium Pulsing Live Badge */}
              <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest border border-emerald-100/50 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live
              </span>
            </div>

            {/* Dynamic Tags */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="text-sm font-bold text-[#ea580c] flex items-center gap-1.5 bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 shadow-sm">
                <Zap size={16} fill="currentColor" /> {inst.setup}
              </div>
              <div className="text-sm font-bold text-slate-500 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                <MapPin size={16} /> {inst.location}
              </div>
            </div>

            {/* Internal Info Boxes */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-[1.25rem] group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-[0_4px_15px_rgb(0,0,0,0.03)] transition-all duration-300">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Infrastructure</p>
                <p className="text-sm font-bold text-[#0a192f] leading-snug">{inst.details}</p>
              </div>
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-[1.25rem] group-hover:bg-white group-hover:border-slate-200 group-hover:shadow-[0_4px_15px_rgb(0,0,0,0.03)] transition-all duration-300">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1.5">Daily Impact</p>
                <p className="text-sm font-bold text-[#0a192f] leading-snug">{inst.impact}</p>
              </div>
            </div>

          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
