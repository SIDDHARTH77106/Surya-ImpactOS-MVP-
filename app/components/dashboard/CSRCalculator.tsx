"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CSRCalculator() {
  const [investment, setInvestment] = useState(40);
  const schools = (investment / 40) * 10;

  return (
    <motion.section 
      // Smooth Shutter Reveal
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      // Less Boxy, Floating Shadow, Premium Border
      className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.75rem] md:rounded-[2.5rem] p-5 sm:p-6 md:p-8 lg:p-10 relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-500"
    >
      {/* Background Subtle Gradient Glow */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#10b981]" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-[#10b981]/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-10 relative z-10">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-[#0a192f] tracking-tight">CSR Impact Calculator</h2>
          <p className="text-slate-500 font-medium mt-3 text-sm md:text-base">Drag the slider to project the massive scale of your potential investment.</p>
        </div>
        
        {/* Calculator Interactive Area */}
        <div className="bg-gradient-to-b from-slate-50/80 to-white p-5 sm:p-6 md:p-8 lg:p-10 rounded-2xl md:rounded-[2rem] border border-slate-100 shadow-inner relative">
          
          {/* Custom Styled Slider */}
          <div className="relative mb-8 md:mb-12">
            <input 
              type="range" min="40" max="400" step="40" 
              value={investment} 
              onChange={(e) => setInvestment(parseInt(e.target.value))}
              className="w-full h-3 bg-slate-200 rounded-full appearance-none cursor-pointer accent-[#ea580c] hover:accent-[#f59e0b] transition-all relative z-10"
            />
            {/* Visual markers for scale */}
            <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-3 px-2 uppercase tracking-widest">
              <span>₹40L Base</span>
              <span>₹2Cr Scale</span>
              <span>₹4Cr National</span>
            </div>
          </div>
          
          {/* Output Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[
              { label: "INVESTMENT", value: investment >= 100 ? `₹${(investment/100).toFixed(1)} Cr` : `₹${investment} L`, color: "text-[#ea580c]" },
              { label: "SCHOOLS", value: schools, color: "text-[#0a192f]" },
              { label: "STUDENTS", value: `${(schools * 500).toLocaleString()}+`, color: "text-[#0a192f]" },
              { label: "CO2 AVOIDED", value: `${(schools * 6.3).toFixed(0)}T`, color: "text-[#10b981]" }
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="p-4 sm:p-5 bg-white rounded-xl md:rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 flex flex-col items-center justify-center hover:border-[#ea580c]/30 hover:shadow-md transition-all duration-300 group/card"
              >
                <p className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest group-hover/card:text-slate-500 transition-colors">
                  {stat.label}
                </p>
                {/* Dynamic Value Animation */}
                <AnimatePresence mode="popLayout">
                  <motion.p 
                    key={stat.value} // Triggers animation when value changes
                    initial={{ scale: 0.8, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 1.1, opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className={`text-2xl md:text-3xl font-black ${stat.color} tracking-tight`}
                  >
                    {stat.value}
                  </motion.p>
                </AnimatePresence>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </motion.section>
  );
}
