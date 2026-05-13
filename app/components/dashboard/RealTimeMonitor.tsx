"use client";

import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  BatteryCharging,
  CalendarClock,
  CheckCircle2,
  CircleDotDashed,
  CloudSun,
  MapPin,
  School,
  Server,
  ThermometerSun,
  Wrench,
  Zap,
  TrendingUp,
  Laptop,
  Users,
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';

// Mock Data Types (Replace with your actual imports if needed)
type SchoolFilter = 'government' | 'jeevanDhara';
type MonitorSchoolKey = 'government' | 'jeevan';

type SchoolProfile = {
  tabLabel: string;
  name: string;
  location: string;
  system: string;
  co2Offset: number;
  energyGenerated: number;
  temperature: number;
  humidity: number;
  aqi: number;
  activeHours: number;
  dailyAverageMins: number;
  uptime: string;
  batteryHealth: number;
  inverterLoad: number;
  alerts: string[];
};

const SCHOOL_PROFILES: Record<MonitorSchoolKey, SchoolProfile> = {
  government: {
    tabLabel: 'Government School',
    name: 'Government School',
    location: 'Surana, Haryana',
    system: '5kW Hybrid Solar Lab',
    co2Offset: 5.84,
    energyGenerated: 184.62,
    temperature: 31.8,
    humidity: 46,
    aqi: 42,
    activeHours: 400,
    dailyAverageMins: 120,
    uptime: '99.2%',
    batteryHealth: 91,
    inverterLoad: 68,
    alerts: [
      'Panel cleaning due on east-facing array after dust accumulation.',
      'Inverter fan inspection recommended during next service window.',
    ],
  },
  jeevan: {
    tabLabel: 'Jeevan Dhaara',
    name: 'Jeevan Dhaara',
    location: 'Ghaziabad, Uttar Pradesh',
    system: '6kW Hybrid Solar Lab',
    co2Offset: 6.76,
    energyGenerated: 216.48,
    temperature: 32.6,
    humidity: 51,
    aqi: 58,
    activeHours: 380,
    dailyAverageMins: 90,
    uptime: '98.5%',
    batteryHealth: 87,
    inverterLoad: 74,
    alerts: [
      'Battery bank health review required for cell balancing.',
      'Panel cleaning due after reduced morning generation trend.',
      'Inverter DC input terminal torque check scheduled.',
    ],
  },
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function splitDecimal(value: number, decimals = 2) {
  const [integer, decimal] = value.toFixed(decimals).split('.');
  return { integer, decimal };
}

function formatSyncTime(date: Date) {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

export default function RealTimeMonitor({ selectedSchool = 'government' }: { selectedSchool?: SchoolFilter }) {
  const initialSchool: MonitorSchoolKey = selectedSchool === 'jeevanDhara' ? 'jeevan' : 'government';
  const [monitorSchool, setMonitorSchool] = useState<MonitorSchoolKey>(initialSchool);
  const [now, setNow] = useState<Date | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  
  const [telemetry, setTelemetry] = useState({
    co2Offset: SCHOOL_PROFILES[initialSchool].co2Offset,
    energyGenerated: SCHOOL_PROFILES[initialSchool].energyGenerated,
  });
  
  const [envValues, setEnvValues] = useState({
    temperature: SCHOOL_PROFILES[initialSchool].temperature,
    humidity: SCHOOL_PROFILES[initialSchool].humidity,
    aqi: SCHOOL_PROFILES[initialSchool].aqi,
  });

  const handleMonitorSchoolChange = (school: MonitorSchoolKey) => {
    const profile = SCHOOL_PROFILES[school];
    setMonitorSchool(school);
    setTelemetry({ co2Offset: profile.co2Offset, energyGenerated: profile.energyGenerated });
    setEnvValues({ temperature: profile.temperature, humidity: profile.humidity, aqi: profile.aqi });
    setLastSync(new Date());
  };

  // Real-time Fluctuation Logic
  useEffect(() => {
    const syncTelemetry = () => {
      const profile = SCHOOL_PROFILES[monitorSchool];
      const syncTime = new Date();

      setTelemetry((prev) => ({
        co2Offset: Number(clamp(prev.co2Offset + (Math.random() - 0.35) * 0.06, profile.co2Offset - 0.12, profile.co2Offset + 0.42).toFixed(2)),
        energyGenerated: Number(clamp(prev.energyGenerated + Math.random() * 0.42, profile.energyGenerated - 0.5, profile.energyGenerated + 5.8).toFixed(2)),
      }));

      setEnvValues((prev) => ({
        temperature: Number(clamp(prev.temperature + (Math.random() - 0.5) * 0.4, profile.temperature - 1.2, profile.temperature + 1.4).toFixed(1)),
        humidity: Math.round(clamp(prev.humidity + (Math.random() - 0.5) * 2, profile.humidity - 8, profile.humidity + 8)),
        aqi: Math.round(clamp(prev.aqi + (Math.random() - 0.5) * 3, profile.aqi - 10, profile.aqi + 12)),
      }));

      setNow(syncTime);
      setLastSync(syncTime);
    };

    const initialTimer = window.setTimeout(syncTelemetry, 0);
    const timer = window.setInterval(syncTelemetry, 2000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearInterval(timer);
    };
  }, [monitorSchool]);

  const profile = SCHOOL_PROFILES[monitorSchool];
  const co2Parts = splitDecimal(telemetry.co2Offset);
  const energyParts = splitDecimal(telemetry.energyGenerated);
  
  // Time Logic for Active Classes (11 AM to 2 PM)
  const minutesFromMidnight = now ? now.getHours() * 60 + now.getMinutes() : null;
  const classesActive = minutesFromMidnight !== null && minutesFromMidnight >= 11 * 60 && minutesFromMidnight <= 14 * 60;
  const activeClassValue = now ? (classesActive ? '2 / 2' : '0 / 2') : '-- / 2';

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.06 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="relative overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-white p-5 text-[#083827] shadow-[0_18px_55px_rgba(6,78,59,0.08)] sm:p-6 md:p-8 print:break-inside-avoid"
    >
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-green-400 to-lime-400" />

      {/* HEADER & SCHOOL SELECTOR */}
      <div className="relative z-10 mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between border-b border-gray-100 pb-6">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 shadow-sm">
            <CircleDotDashed size={14} className="animate-spin text-emerald-500" />
            Live System Monitor
          </div>
          <h2 className="text-3xl font-black tracking-tight text-[#064e3b] md:text-4xl">Institution Impact Overview</h2>
        </div>

        <div className="flex w-full sm:w-auto p-1.5 bg-gray-50 rounded-2xl border border-gray-200 shadow-inner">
          {(Object.keys(SCHOOL_PROFILES) as MonitorSchoolKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleMonitorSchoolChange(key)}
              className={`flex-1 sm:flex-none rounded-xl px-5 py-2.5 text-sm font-black transition-all ${
                monitorSchool === key
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-emerald-800'
              }`}
            >
              {SCHOOL_PROFILES[key].tabLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-6 xl:grid-cols-12">
        
        {/* MERGED: DIGITAL LEARNING IMPACT (Top Section) */}
        <div className="xl:col-span-12 rounded-3xl border border-slate-100 bg-[#f8fafc] p-6 shadow-sm relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
             <Laptop className="w-48 h-48 text-emerald-900" />
           </div>
           
           <div className="mb-6">
             <h3 className="text-xl font-extrabold text-[#0a192f] flex items-center gap-2">
                <Laptop className="text-[#ea580c]" size={24} /> Digital Learning Impact
             </h3>
             <p className="text-sm font-semibold text-slate-500 mt-1">Real-world outcomes powered by continuous energy.</p>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Card 1: Hours */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl p-5 border border-blue-100 shadow-sm flex flex-col justify-center">
                <TrendingUp size={24} className="text-blue-600 mb-3" />
                <h4 className="text-4xl font-black text-blue-600 tracking-tighter">{profile.activeHours} Hrs</h4>
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#0a192f] mt-1">Learning Hrs Protected</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">Daily Avg: {profile.dailyAverageMins} Mins ({profile.dailyAverageMins / 60} Hrs)</p>
              </motion.div>

              {/* Card 2: Uptime */}
              <motion.div variants={itemVariants} className="bg-white rounded-2xl p-5 border border-emerald-100 shadow-sm flex flex-col justify-center">
                <CheckCircle2 size={24} className="text-emerald-500 mb-3" />
                <h4 className="text-4xl font-black text-emerald-500 tracking-tighter">{profile.uptime}</h4>
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#0a192f] mt-1">System Uptime</p>
                <p className="mt-1 text-xs font-semibold text-slate-500">Zero disruptions during core hours</p>
              </motion.div>

              {/* Card 3: Live Active Classes (Time Based) */}
              <motion.div variants={itemVariants} className={`bg-white rounded-2xl p-5 border shadow-sm flex flex-col justify-center transition-colors ${classesActive ? 'border-orange-200 bg-orange-50/30' : 'border-gray-200 opacity-80'}`}>
                <Users size={24} className={classesActive ? "text-[#ea580c] mb-3" : "text-gray-400 mb-3"} />
                <h4 className={`text-4xl font-black tracking-tighter ${classesActive ? 'text-[#ea580c]' : 'text-gray-500'}`}>{activeClassValue}</h4>
                <p className="text-xs font-extrabold uppercase tracking-widest text-[#0a192f] mt-1">Smart Classes Active</p>
                <p className={`mt-1 text-xs font-semibold ${classesActive ? 'text-orange-700' : 'text-gray-500'}`}>
                  {classesActive ? 'Classes are running live.' : 'Outside operating hours (11 AM - 2 PM)'}
                </p>
              </motion.div>
           </div>
        </div>

        {/* TELEMETRY & SCHOOL DETAILS */}
        <motion.div variants={itemVariants} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm xl:col-span-4">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Institution</p>
              <h3 className="mt-1 text-xl font-black text-[#064e3b]">{profile.name}</h3>
            </div>
            <School className="text-emerald-600 bg-emerald-50 p-2 rounded-lg" size={36} />
          </div>
          <div className="space-y-3 text-sm font-bold text-slate-600">
            <p className="flex items-center gap-2"><MapPin size={16} className="text-emerald-500" /> {profile.location}</p>
            <p className="flex items-center gap-2"><Server size={16} className="text-emerald-500" /> {profile.system}</p>
            <p className="flex items-center gap-2"><BatteryCharging size={16} className="text-emerald-500" /> Battery Health: {profile.batteryHealth}%</p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:col-span-8">
          {/* CO2 Offset */}
          <motion.div variants={itemVariants} className="rounded-2xl border bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100 p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-widest text-slate-600">CO2 Offset</p>
              <CloudSun size={24} className="text-emerald-600" />
            </div>
            <div className="font-mono leading-none flex items-baseline">
              <span className="text-5xl font-black tracking-tight text-emerald-700">{co2Parts.integer}</span>
              <span className="text-xl font-bold text-emerald-600">.{co2Parts.decimal}</span>
              <span className="ml-2 text-xs font-black uppercase tracking-widest text-emerald-800">tons</span>
            </div>
          </motion.div>

          {/* Energy Generated */}
          <motion.div variants={itemVariants} className="rounded-2xl border bg-gradient-to-br from-lime-50 to-teal-50 border-lime-100 p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-xs font-black uppercase tracking-widest text-slate-600">Energy Generated</p>
              <Zap size={24} className="text-lime-700" />
            </div>
            <div className="font-mono leading-none flex items-baseline">
              <span className="text-5xl font-black tracking-tight text-lime-800">{energyParts.integer}</span>
              <span className="text-xl font-bold text-lime-600">.{energyParts.decimal}</span>
              <span className="ml-2 text-xs font-black uppercase tracking-widest text-lime-800">kWh</span>
            </div>
          </motion.div>
        </div>

        {/* ENVIRONMENT MONITOR */}
        <motion.div variants={itemVariants} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm xl:col-span-4">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Sensors</p>
              <h3 className="text-lg font-black text-[#064e3b]">Environment</h3>
            </div>
            <ThermometerSun className="text-emerald-600" size={24} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Temp</p>
              <p className="mt-1 font-mono text-lg font-black text-slate-800">{envValues.temperature.toFixed(1)}°</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Humidity</p>
              <p className="mt-1 font-mono text-lg font-black text-slate-800">{envValues.humidity}%</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">AQI</p>
              <p className="mt-1 font-mono text-lg font-black text-slate-800">{envValues.aqi}</p>
            </div>
          </div>
        </motion.div>

        {/* ALERTS SECTION (Dynamic based on selected school) */}
        <motion.div variants={itemVariants} className="rounded-2xl border border-amber-200 bg-[#fffbeb] p-5 shadow-sm xl:col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Hardware & Maintenance</p>
              <h3 className="text-lg font-black text-amber-900">Active Alerts ({profile.alerts.length})</h3>
            </div>
            <Wrench className="text-amber-600 bg-amber-100 p-1.5 rounded-lg" size={32} />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {profile.alerts.map((alert, idx) => (
              <div key={idx} className="flex gap-3 rounded-xl border border-amber-200 bg-white p-3 shadow-sm">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" />
                <p className="text-sm font-bold leading-snug text-slate-700">{alert}</p>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* FOOTER */}
      <div className="relative z-10 mt-6 flex flex-col gap-3 border-t border-gray-100 pt-4 text-xs font-black text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.14)] animate-pulse" />
          System Status: <span className="text-emerald-700">Online & Tracking</span>
        </p>
        <p className="flex items-center gap-2">
          <CalendarClock size={14} className="text-slate-400" />
          Last Sync: {lastSync ? formatSyncTime(lastSync) : 'Syncing...'}
        </p>
      </div>
    </motion.section>
  );
}
