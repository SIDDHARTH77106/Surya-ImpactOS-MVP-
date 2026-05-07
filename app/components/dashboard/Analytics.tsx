"use client";
import React from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';
import { SCHOOL_DATA, SchoolFilter } from '../../constants/mockData';
import { motion } from 'framer-motion';

const emptySubscribe = () => () => {};
const chartInitialDimension = { width: 1, height: 1 };

type AnalyticsProps = {
  selectedSchool: SchoolFilter;
};

export default function Analytics({ selectedSchool }: AnalyticsProps) {
  const chartData = SCHOOL_DATA[selectedSchool].chartData;

  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[1.5rem] md:rounded-[2rem] p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col h-full hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-500 group relative overflow-hidden"
    >
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-50/50 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      <div className="mb-5 md:mb-8 relative z-10">
        <h4 className="text-xl font-extrabold text-[#0a192f] tracking-tight">Solar Gen vs Consumption</h4>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Measured in kWh</p>
      </div>
      
      {/* Keep a strict chart box so Recharts never measures a zero-height parent during animation. */}
      <div className="w-full h-[300px] min-h-[300px] relative z-10 pb-2 md:pb-4">
        {isMounted ? (
          <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} initialDimension={chartInitialDimension}>
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 20 }}>
              <defs>
                <linearGradient id="colorGen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.5}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                tickMargin={15}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94a3b8', fontWeight: 600 }}
                dx={-10}
              />

              <Tooltip
                cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '5 5' }}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(241, 245, 249, 1)',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                  fontWeight: '700',
                  color: '#0a192f',
                  padding: '12px 16px'
                }}
              />

              <Area
                type="monotone"
                dataKey="gen"
                name="Generation"
                stroke="#f59e0b"
                fillOpacity={1}
                fill="url(#colorGen)"
                strokeWidth={4}
                activeDot={{ r: 8, strokeWidth: 0, fill: '#ea580c', filter: 'drop-shadow(0px 4px 6px rgba(234,88,12,0.4))' }}
              />
              <Area
                type="monotone"
                dataKey="cons"
                name="Consumption"
                stroke="#94a3b8"
                fill="transparent"
                strokeDasharray="6 6"
                strokeWidth={2.5}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full rounded-[1.25rem] bg-slate-50" />
        )}
      </div>
    </motion.div>
  );
}
