"use client";
import React from 'react';
import Image from 'next/image';
import { Laptop, TrendingUp, CheckCircle2, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LearningImpact() {
  const impactData = [
    {
      val: "400h", // Updated to match stakeholder's WhatsApp feedback
      title: "Learning Hrs Protected",
      desc: "↑ 41% vs last year without solar",
      color: "text-blue-600",
      bg: "bg-blue-50/80",
      border: "border-blue-100",
      icon: <TrendingUp size={20} className="text-blue-600" />
    },
    {
      val: "99.2%",
      title: "System Uptime",
      desc: "Zero disruptions during exams",
      color: "text-[#10b981]",
      bg: "bg-emerald-50/80",
      border: "border-emerald-100",
      icon: <CheckCircle2 size={20} className="text-[#10b981]" />
    },
    {
      val: "100%",
      title: "Smart Classes Active",
      desc: "Consistent attendance growth",
      color: "text-[#ea580c]",
      bg: "bg-orange-50/80",
      border: "border-orange-100",
      icon: <Users size={20} className="text-[#ea580c]" />
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] sm:p-6 md:rounded-[2.5rem] md:p-8 lg:p-10"
      style={{ perspective: '1200px' }}
    >
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.06)_0%,rgba(245,158,11,0)_75%)]" />

      {/* Left static logo - FIXED */}
      <div className="pointer-events-none absolute left-6 top-6 z-0 h-16 w-16">
        <Image
          src="/sangam logo.png"
          alt="Surya Sangam Logo Left"
          fill
          sizes="64px"
          /* Added rotate-180 and mix-blend-multiply */
          className="object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)] rotate-180 mix-blend-multiply"
          style={{ opacity: 1 }}
        />
      </div>

      {/* Right static logo - FIXED */}
      <div className="pointer-events-none absolute right-6 top-6 z-0 h-16 w-16">
        <Image
          src="/sangam logo.png"
          alt="Surya Sangam Logo Right"
          fill
          sizes="64px"
          /* Added rotate-180 and mix-blend-multiply */
          className="object-contain drop-shadow-[0_4px_10px_rgba(0,0,0,0.1)] rotate-180 mix-blend-multiply"
          style={{ opacity: 1 }}
        />
      </div>

      <div className="relative z-10 mb-8 flex flex-col items-center gap-3 text-center md:mb-12">
        <div className="rounded-2xl border border-orange-200/50 bg-gradient-to-br from-orange-50 to-orange-100 p-4 shadow-md">
          <Laptop className="text-[#ea580c]" size={30} strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-[#0a192f] md:text-4xl">Digital Learning Impact</h2>
          <p className="mt-2 max-w-lg text-sm font-semibold text-slate-500 md:text-base">Real-world outcomes powered by continuous energy and standardized setup.</p>
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:gap-6">
        {impactData.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.15 + 0.3, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{ scale: 1.05, y: -6, rotateY: 5, rotateX: 2 }}
            className={`${item.bg} group rounded-2xl border ${item.border} p-5 shadow-sm transition-all duration-300 hover:shadow-md sm:p-6 md:rounded-[2.25rem] md:p-8`}
            style={{ transformStyle: 'preserve-3d' }}
          >
            <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl border border-white bg-white/90 shadow-sm transition-transform duration-300 ease-out group-hover:rotate-6 group-hover:scale-110">
              {item.icon}
            </div>

            <h4 className={`mb-2 text-4xl font-black tracking-tighter md:text-5xl ${item.color}`}>
              {item.val}
            </h4>
            <p className="text-xs font-extrabold uppercase tracking-widest text-[#0a192f] md:text-sm">
              {item.title}
            </p>
            <p className="mt-2 text-xs font-semibold text-slate-500">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}