"use client";

import React, { useState, useEffect } from 'react';
import {
  Battery, CloudSun, Cpu, ShieldCheck, Sun,
  ThermometerSun, Wind, Zap, Activity, MapPin, 
  Droplets, Waves, Server, ArrowRightLeft, Terminal, ChevronDown, ChevronUp
} from 'lucide-react';
import { AnimatePresence, motion, Variants } from 'framer-motion';
import { SchoolFilter } from '../../constants/mockData';

type DynamicValuesKeys = 'solar' | 'battery' | 'load' | 'grid';
type SchoolKey = 'surana' | 'jeevanDhara';

type SchoolMetric = {
  pvGeneration: number;
  loadPower: number;
  batterySoc: number;
  yieldToday: number;
  co2Offset: number;
};

const schoolMeta: Record<SchoolKey, {
  name: string; system: string; location: string;
  capacity: string; classrooms: string; digitalLearning: string;
}> = {
  surana: {
    name: 'Govt. Primary School Surana', system: '5kW Hybrid', location: 'Haryana',
    capacity: '5kW Hybrid', classrooms: '2 Classrooms on Solar', digitalLearning: '2 hrs digital learning/classroom',
  },
  jeevanDhara: {
    name: 'Jeevan Dhara Welfare Society', system: '6kW Hybrid', location: 'Ghaziabad',
    capacity: '6kW Hybrid', classrooms: '2 Classrooms on Solar', digitalLearning: '2 hrs digital learning/classroom',
  },
};

const liveMetrics = [
  { label: 'Solar Output', unit: 'kW', icon: Zap, color: 'text-[#f59e0b]', metricKey: 'solar' as DynamicValuesKeys },
  { label: 'Battery Status', unit: '%', icon: Battery, color: 'text-[#10b981]', metricKey: 'battery' as DynamicValuesKeys },
  { label: 'Load Power', unit: 'kW', icon: Cpu, color: 'text-blue-400', metricKey: 'load' as DynamicValuesKeys },
  { label: 'Grid Export', unit: 'kW', icon: ArrowRightLeft, color: 'text-purple-400', metricKey: 'grid' as DynamicValuesKeys },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function RealTimeMonitor({ selectedSchool }: { selectedSchool: SchoolFilter }) {
  // Weather Dropdown State
  const [showWeather, setShowWeather] = useState(false);

  const [envValues, setEnvValues] = useState({
    irradiance: 850, temperature: 32.4, windSpeed: 12, aqi: 45, humidity: 42, uvIndex: 7.2
  });

  const [schoolMetrics, setSchoolMetrics] = useState<Record<SchoolKey, SchoolMetric>>({
    surana: { pvGeneration: 3.8, loadPower: 2.1, batterySoc: 87, yieldToday: 14.5, co2Offset: 12.1 },
    jeevanDhara: { pvGeneration: 4.5, loadPower: 2.5, batterySoc: 84, yieldToday: 18.2, co2Offset: 15.3 },
  });

  const logs = [
    "SYS_INIT: Telemetry sync established.",
    "BATT_CTRL: Optimal charging at 1.2kW.",
    "GRID_MON: Frequency stable at 50.02Hz."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setEnvValues((prev) => ({
        irradiance: Math.round(clamp(prev.irradiance + (Math.random() - 0.5) * 24, 800, 950)),
        temperature: Number(clamp(prev.temperature + (Math.random() - 0.5) * 0.5, 30, 38).toFixed(1)),
        windSpeed: Number(clamp(prev.windSpeed + (Math.random() - 0.5) * 1.4, 8, 18).toFixed(1)),
        aqi: Math.round(clamp(prev.aqi + (Math.random() - 0.5) * 3, 38, 58)),
        humidity: Math.round(clamp(prev.humidity + (Math.random() - 0.5) * 2, 35, 60)),
        uvIndex: Number(clamp(prev.uvIndex + (Math.random() - 0.5) * 0.2, 6, 9).toFixed(1)),
      }));

      setSchoolMetrics((prev) => ({
        surana: {
          pvGeneration: Number(clamp(prev.surana.pvGeneration + (Math.random() - 0.5) * 0.24, 3.3, 4.3).toFixed(1)),
          loadPower: Number(clamp(prev.surana.loadPower + (Math.random() - 0.5) * 0.14, 1.8, 2.6).toFixed(1)),
          batterySoc: Math.round(clamp(prev.surana.batterySoc + (Math.random() - 0.5) * 2, 78, 92)),
          yieldToday: Number((prev.surana.yieldToday + 0.01).toFixed(2)),
          co2Offset: Number((prev.surana.co2Offset + 0.008).toFixed(2)),
        },
        jeevanDhara: {
          pvGeneration: Number(clamp(prev.jeevanDhara.pvGeneration + (Math.random() - 0.5) * 0.28, 4.0, 5.2).toFixed(1)),
          loadPower: Number(clamp(prev.jeevanDhara.loadPower + (Math.random() - 0.5) * 0.16, 2.1, 3.0).toFixed(1)),
          batterySoc: Math.round(clamp(prev.jeevanDhara.batterySoc + (Math.random() - 0.5) * 2, 76, 91)),
          yieldToday: Number((prev.jeevanDhara.yieldToday + 0.01).toFixed(2)),
          co2Offset: Number((prev.jeevanDhara.co2Offset + 0.008).toFixed(2)),
        },
      }));
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  };

  const activeSchoolKeys = (selectedSchool === 'all' ? Object.keys(schoolMeta) : [selectedSchool]) as SchoolKey[];

  const liveCardValues: Record<DynamicValuesKeys, string> = {
    solar: activeSchoolKeys.reduce((total, schoolKey) => total + schoolMetrics[schoolKey].pvGeneration, 0).toFixed(1),
    load: activeSchoolKeys.reduce((total, schoolKey) => total + schoolMetrics[schoolKey].loadPower, 0).toFixed(1),
    battery: Math.round(activeSchoolKeys.reduce((total, schoolKey) => total + schoolMetrics[schoolKey].batterySoc, 0) / activeSchoolKeys.length).toString(),
    grid: (activeSchoolKeys.reduce((total, schoolKey) => total + Math.max(0, schoolMetrics[schoolKey].pvGeneration - schoolMetrics[schoolKey].loadPower), 0) * 0.4).toFixed(1),
  };

  return (
    <motion.section
      variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }}
      className="enterprise-dark-panel relative overflow-hidden rounded-[1.75rem] bg-[#0B1120] p-5 text-white shadow-[0_20px_60px_rgba(10,25,47,0.2)] sm:p-6 md:rounded-[2.5rem] md:p-8 lg:p-10"
    >
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0%,rgba(245,158,11,0)_70%)] blur-[100px]" />
      <div className="pointer-events-none absolute -left-32 -bottom-32 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.1)_0%,rgba(16,185,129,0)_70%)] blur-[100px]" />

      {/* TOP HEADER WITH WEATHER BUTTON */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live Telemetry
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">System Monitor</h2>
          <p className="mt-2 text-sm font-medium text-slate-400">Enterprise-grade environment & health tracking.</p>
        </div>

        {/* WEATHER TOGGLE BUTTON */}
        <button 
          onClick={() => setShowWeather(!showWeather)}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95"
        >
          <CloudSun size={16} className="text-[#f59e0b]" />
          {showWeather ? 'Hide Environment' : 'View Environment'}
          {showWeather ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {/* WEATHER DROPDOWN / COLLAPSIBLE PANEL */}
      <AnimatePresence>
        {showWeather && (
          <motion.div 
            initial={{ height: 0, opacity: 0, marginBottom: 0 }}
            animate={{ height: 'auto', opacity: 1, marginBottom: 32 }}
            exit={{ height: 0, opacity: 0, marginBottom: 0 }}
            className="relative z-10 overflow-hidden"
          >
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-inner backdrop-blur-md">
              <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <CloudSun className="text-[#f59e0b]" size={20} />
                  <p className="text-xs font-bold uppercase tracking-widest text-white">Live Weather Sensors</p>
                </div>
                <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 bg-[#0B1120] px-3 py-1.5 rounded-full border border-white/10">
                  <MapPin size={10} className="text-emerald-400"/> 
                  {/* Dynamic Location based on school selected */}
                  {selectedSchool === 'all' ? 'Network Avg (All Sites)' : schoolMeta[selectedSchool as SchoolKey].location}
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-y-6 gap-x-4">
                <div className="flex flex-col items-center text-center gap-2">
                  <ThermometerSun className="text-rose-400" size={24} />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Temperature</p>
                    <p className="font-mono text-sm font-bold text-white">{envValues.temperature}°C</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Sun className="text-amber-400" size={24} />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Irradiance</p>
                    <p className="font-mono text-sm font-bold text-white">{envValues.irradiance} <span className="text-[10px]">W/m²</span></p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Wind className="text-sky-300" size={24} />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Wind Speed</p>
                    <p className="font-mono text-sm font-bold text-white">{envValues.windSpeed} <span className="text-[10px]">km/h</span></p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Activity className="text-emerald-400" size={24} />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">AQI Level</p>
                    <p className="font-mono text-sm font-bold text-white">{envValues.aqi} <span className="text-[10px] text-emerald-400">Good</span></p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Droplets className="text-blue-400" size={24} />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">Humidity</p>
                    <p className="font-mono text-sm font-bold text-white">{envValues.humidity}%</p>
                  </div>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <Waves className="text-purple-400" size={24} />
                  <div>
                    <p className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">UV Index</p>
                    <p className="font-mono text-sm font-bold text-white">{envValues.uvIndex} <span className="text-[10px] text-orange-400">High</span></p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-12 lg:gap-8">
        
        {/* --- LEFT PANEL: TERMINAL LOGS (Col Span 4) --- */}
        <div className="space-y-6 lg:col-span-4 h-full flex flex-col">
          <motion.div variants={itemVariants} className="flex-1 rounded-xl border border-[#10b981]/30 bg-[#022c22]/50 p-5 font-mono text-xs shadow-inner flex flex-col min-h-[200px]">
             <div className="flex items-center justify-between gap-2 mb-4 border-b border-[#10b981]/20 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal size={14} className="text-emerald-400"/>
                  <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest">System Event Log</span>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"/>
             </div>
             <div className="space-y-3 flex-1 overflow-hidden">
                {logs.map((log, idx) => (
                  <p key={idx} className="text-emerald-300/80 flex gap-2">
                    <span className="text-emerald-500">{`>`}</span> {log}
                  </p>
                ))}
                <p className="text-emerald-400 animate-pulse">_</p>
             </div>
          </motion.div>
        </div>

        {/* --- RIGHT PANEL: METRICS & SCHOOL CARDS (Col Span 8) --- */}
        <div className="space-y-6 lg:col-span-8">
          
          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
            {liveMetrics.map((stat) => (
              <motion.div
                variants={itemVariants} key={stat.label}
                whileHover={{ scale: 1.05, y: -4, backgroundColor: 'rgba(255,255,255,0.08)' }}
                className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-md flex flex-col justify-between"
              >
                <div className="mb-2 flex items-start justify-between">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                  <stat.icon className={stat.color} size={18} />
                </div>
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={liveCardValues[stat.metricKey]}
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className="text-2xl sm:text-3xl font-black tracking-tight text-white mt-2"
                  >
                    {liveCardValues[stat.metricKey]} <span className="text-xs text-slate-400 font-bold">{stat.unit}</span>
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          {/* Deep School Metrics Cards */}
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {activeSchoolKeys.map((key) => {
              const schoolKey = key as SchoolKey;
              const school = schoolMeta[schoolKey];
              const metrics = schoolMetrics[schoolKey];

              return (
                <motion.div variants={itemVariants} key={schoolKey} className="rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md relative overflow-hidden">
                  
                  {/* Subtle Background Icon */}
                  <ShieldCheck className="absolute -right-6 -bottom-6 text-white/5" size={120} />

                  <div className="mb-5 flex items-start justify-between gap-4 relative z-10">
                    <div>
                      <h4 className="font-extrabold text-white text-base">{school.name}</h4>
                      <p className="mt-1 text-[11px] font-bold tracking-widest uppercase text-slate-400 flex items-center gap-1">
                        <Server size={10}/> {school.system} • {school.location}
                      </p>
                    </div>
                    <span className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-300">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm relative z-10">
                    <div className="rounded-xl bg-[#081423]/50 border border-white/5 p-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Current Load</p>
                      <p className="mt-1 font-mono text-lg text-white font-bold">{metrics.loadPower.toFixed(1)} <span className="text-xs">kW</span></p>
                    </div>
                    <div className="rounded-xl bg-[#081423]/50 border border-white/5 p-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Battery SOC</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-400" style={{ width: `${metrics.batterySoc}%` }}/>
                        </div>
                        <p className="font-mono text-emerald-300 font-bold">{metrics.batterySoc}%</p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-gradient-to-r from-[#f59e0b]/20 to-[#ea580c]/20 border border-[#f59e0b]/20 p-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-orange-200">Yield Today</p>
                      <p className="mt-1 font-mono text-lg text-orange-400 font-bold">{metrics.yieldToday.toFixed(1)} <span className="text-xs">kWh</span></p>
                    </div>
                    <div className="rounded-xl bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 p-3">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-200">CO2 Avoided</p>
                      <p className="mt-1 font-mono text-lg text-emerald-400 font-bold">{metrics.co2Offset.toFixed(1)} <span className="text-xs">kg</span></p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center relative z-10">
                     <p className="text-[10px] text-slate-400 font-bold"><span className="text-white">Classrooms:</span> {school.classrooms.split(' ')[0]}</p>
                     <p className="text-[10px] text-slate-400 font-bold"><span className="text-white">Uptime:</span> 99.9%</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </motion.section>
  );
}
