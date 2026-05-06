"use client";
import React from 'react';
import { ArrowUpRight, BarChart3, FileText, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FutureScaleCTA() {
  return (
    <div className="space-y-10 md:space-y-16">
      
      {/* Scale Projection Section */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="grid md:grid-cols-2 gap-6 md:gap-10 items-center bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.75rem] md:rounded-[2.5rem] p-5 sm:p-6 md:p-8 lg:p-14 relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] transition-all duration-500"
      >
        {/* Subtle Background Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-50/50 via-transparent to-transparent rounded-full pointer-events-none" />

        <div className="relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0a192f] mb-4 md:mb-5 tracking-tight leading-tight">
            Proven in 2 Schools.<br/>Ready for 100 More.
          </h2>
          <p className="text-slate-500 font-medium mb-6 md:mb-8 text-base md:text-lg leading-relaxed max-w-md">
            Our standardized setup makes it extremely easy to replicate this success across any institution rapidly.
          </p>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <FileText size={18} className="text-blue-500"/> ESG Reports Ready
            </div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
              <BarChart3 size={18} className="text-[#ea580c]"/> CSR Compliant
            </div>
          </div>
        </div>

        {/* Visual representation of 2 -> 100 scale */}
        <motion.div 
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-44 sm:h-48 md:h-56 bg-gradient-to-br from-slate-50 to-white rounded-2xl md:rounded-[2rem] border border-slate-200 shadow-inner flex items-center justify-center relative overflow-hidden z-10"
        >
             {/* Decorative glow inside the box */}
             <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#f59e0b]/5 to-transparent animate-pulse" style={{ animationDuration: '3s' }} />
             
             <div className="text-center z-10 flex flex-col items-center justify-center">
                <div className="flex items-center justify-center gap-4 text-[#0a192f]">
                  <span className="text-6xl font-black">2</span>
                  <ArrowRight className="text-[#ea580c]" size={48} strokeWidth={2.5} />
                  <span className="text-6xl font-black text-[#ea580c]">100</span>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-4 bg-white px-3 py-1 rounded-full shadow-sm border border-slate-100">
                  Target Scale
                </p>
             </div>
        </motion.div>
      </motion.section>

      {/* Final CTA */}
      <motion.footer 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center py-8 md:py-16 lg:py-20 space-y-6 md:space-y-10"
      >
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#0a192f] tracking-tight">
          Let&apos;s Scale What <br className="md:hidden" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#f59e0b] to-[#ea580c]">Already Works.</span>
        </h2>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group mx-auto flex items-center justify-center"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-[#f59e0b] to-[#ea580c] rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
          <div className="relative flex items-center gap-3 bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white font-bold px-10 py-5 rounded-full shadow-xl text-lg md:text-xl">
            Partner With Us <ArrowUpRight size={24} strokeWidth={2.5} />
          </div>
        </motion.button>
      </motion.footer>
      
    </div>
  );
}
