"use client";

import React, { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  BatteryCharging,
  BookOpenCheck,
  CalendarClock,
  CheckCircle2,
  CircleDotDashed,
  CloudSun,
  Droplets,
  GraduationCap,
  Leaf,
  MapPin,
  MonitorCheck,
  School,
  Server,
  ThermometerSun,
  Wrench,
  Zap,
} from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { SchoolFilter } from '../../constants/mockData';

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
    activeHours: 400,
    dailyAverageMins: 120,
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

function getInitialSchool(selectedSchool: SchoolFilter): MonitorSchoolKey {
  return selectedSchool === 'jeevanDhara' ? 'jeevan' : 'government';
}

function formatSyncTime(date: Date) {
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
}

function getProfileState(school: MonitorSchoolKey) {
  const profile = SCHOOL_PROFILES[school];

  return {
    telemetry: {
      co2Offset: profile.co2Offset,
      energyGenerated: profile.energyGenerated,
    },
    env: {
      temperature: profile.temperature,
      humidity: profile.humidity,
      aqi: profile.aqi,
    },
  };
}

export default function RealTimeMonitor({ selectedSchool }: { selectedSchool: SchoolFilter }) {
  const initialSchool = getInitialSchool(selectedSchool);
  const [monitorSchool, setMonitorSchool] = useState<MonitorSchoolKey>(initialSchool);
  const [now, setNow] = useState<Date | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const [telemetry, setTelemetry] = useState(() => getProfileState(initialSchool).telemetry);
  const [envValues, setEnvValues] = useState(() => getProfileState(initialSchool).env);

  const handleMonitorSchoolChange = (school: MonitorSchoolKey) => {
    const nextState = getProfileState(school);
    setMonitorSchool(school);
    setTelemetry(nextState.telemetry);
    setEnvValues(nextState.env);
    setLastSync(new Date());
  };

  useEffect(() => {
    const initializeClock = window.setTimeout(() => {
      const hydratedTime = new Date();
      setNow(hydratedTime);
      setLastSync(hydratedTime);
    }, 0);

    const timer = window.setInterval(() => {
      const profile = SCHOOL_PROFILES[monitorSchool];

      setTelemetry((prev) => ({
        co2Offset: Number(clamp(prev.co2Offset + (Math.random() - 0.35) * 0.06, profile.co2Offset - 0.12, profile.co2Offset + 0.42).toFixed(2)),
        energyGenerated: Number(clamp(prev.energyGenerated + Math.random() * 0.42, profile.energyGenerated - 0.5, profile.energyGenerated + 5.8).toFixed(2)),
      }));

      setEnvValues((prev) => ({
        temperature: Number(clamp(prev.temperature + (Math.random() - 0.5) * 0.4, profile.temperature - 1.2, profile.temperature + 1.4).toFixed(1)),
        humidity: Math.round(clamp(prev.humidity + (Math.random() - 0.5) * 2, profile.humidity - 8, profile.humidity + 8)),
        aqi: Math.round(clamp(prev.aqi + (Math.random() - 0.5) * 3, profile.aqi - 10, profile.aqi + 12)),
      }));

      setNow(new Date());
      setLastSync(new Date());
    }, 2000);

    return () => {
      window.clearTimeout(initializeClock);
      window.clearInterval(timer);
    };
  }, [monitorSchool]);

  const profile = SCHOOL_PROFILES[monitorSchool];
  const co2Parts = splitDecimal(telemetry.co2Offset);
  const energyParts = splitDecimal(telemetry.energyGenerated);
  const minutesFromMidnight = now ? now.getHours() * 60 + now.getMinutes() : null;
  const classesActive = minutesFromMidnight !== null && minutesFromMidnight > 11 * 60 && minutesFromMidnight < 14 * 60;
  const offHours = minutesFromMidnight === null || minutesFromMidnight < 10 * 60 || minutesFromMidnight > 15 * 60;
  const activeClassValue = now ? (classesActive ? '2 / 2' : '0 / 2') : '-- / 2';

  const statusTone = classesActive
    ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
    : offHours
      ? 'border-slate-200 bg-slate-100 text-slate-400'
      : 'border-amber-200 bg-amber-50 text-amber-700';

  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 36 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], staggerChildren: 0.06 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] } },
  };

  const monitorCards = useMemo(() => [
    {
      label: 'CO2 Offset',
      icon: Leaf,
      unit: 'tons',
      parts: co2Parts,
      tone: 'text-emerald-600',
      bg: 'from-emerald-50 to-green-50 border-emerald-100',
    },
    {
      label: 'Energy Generated',
      icon: Zap,
      unit: 'kWh',
      parts: energyParts,
      tone: 'text-lime-700',
      bg: 'from-lime-50 to-teal-50 border-lime-100',
    },
  ], [co2Parts, energyParts]);

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      className="relative overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-[#f7fbf5] p-5 text-[#083827] shadow-[0_18px_55px_rgba(6,78,59,0.12)] sm:p-6 md:p-8 print:break-inside-avoid"
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-emerald-500 via-green-400 to-lime-400" />

      <div className="relative z-10 mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-700 shadow-sm">
            <CircleDotDashed size={14} className="animate-spin text-emerald-500" />
            Live Telemetry
          </div>
          <h2 className="text-3xl font-black tracking-tight text-[#064e3b] md:text-4xl">System Monitor</h2>
          <p className="mt-2 max-w-2xl text-sm font-semibold text-slate-600">
            Real-time solar, environment, learning continuity, and maintenance status for school infrastructure.
          </p>
        </div>

        <div className="grid w-full grid-cols-2 gap-2 rounded-2xl border border-emerald-100 bg-white p-1.5 shadow-sm sm:w-auto">
          {(Object.keys(SCHOOL_PROFILES) as MonitorSchoolKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => handleMonitorSchoolChange(key)}
              className={`rounded-xl px-4 py-2.5 text-xs font-black transition-all sm:min-w-40 ${
                monitorSchool === key
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/10'
                  : 'text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              {SCHOOL_PROFILES[key].tabLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 grid grid-cols-1 gap-5 xl:grid-cols-12">
        <motion.div variants={itemVariants} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm xl:col-span-4">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Selected Institution</p>
              <h3 className="mt-1 text-xl font-black text-[#064e3b]">{profile.name}</h3>
            </div>
            <School className="text-emerald-600" size={24} />
          </div>
          <div className="space-y-3 text-sm font-bold text-slate-600">
            <p className="flex items-center gap-2"><MapPin size={16} className="text-emerald-500" /> {profile.location}</p>
            <p className="flex items-center gap-2"><Server size={16} className="text-emerald-500" /> {profile.system}</p>
            <p className="flex items-center gap-2"><BatteryCharging size={16} className="text-emerald-500" /> Battery Health: {profile.batteryHealth}%</p>
          </div>
          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-widest text-emerald-700">
              <span>Inverter Load</span>
              <span>{profile.inverterLoad}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-lime-400" style={{ width: `${profile.inverterLoad}%` }} />
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:col-span-8">
          {monitorCards.map((card) => (
            <motion.div
              variants={itemVariants}
              key={card.label}
              className={`rounded-2xl border bg-gradient-to-br ${card.bg} p-5 shadow-sm`}
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs font-black uppercase tracking-widest text-slate-600">{card.label}</p>
                <card.icon size={24} className={card.tone} />
              </div>
              <div className="font-mono leading-none">
                <span className={`text-4xl font-black tracking-tight md:text-5xl ${card.tone}`}>{card.parts.integer}</span>
                <span className={`text-lg font-black md:text-xl ${card.tone}`}>.{card.parts.decimal}</span>
                <span className="ml-2 text-xs font-black uppercase tracking-widest text-slate-500">{card.unit}</span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div variants={itemVariants} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm xl:col-span-4">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Env</p>
              <h3 className="text-lg font-black text-[#064e3b]">Environment Monitor</h3>
            </div>
            <CloudSun className="text-emerald-600" size={24} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
              <ThermometerSun className="mx-auto mb-2 text-rose-500" size={20} />
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Temp</p>
              <p className="mt-1 font-mono text-lg font-black text-slate-800">{envValues.temperature.toFixed(1)}C</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
              <Droplets className="mx-auto mb-2 text-sky-500" size={20} />
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Humidity</p>
              <p className="mt-1 font-mono text-lg font-black text-slate-800">{envValues.humidity}%</p>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center">
              <Activity className="mx-auto mb-2 text-emerald-500" size={20} />
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">AQI</p>
              <p className="mt-1 font-mono text-lg font-black text-slate-800">{envValues.aqi}</p>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm xl:col-span-4">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Digital Learning Impact</p>
              <h3 className="text-lg font-black text-[#064e3b]">Continuity Outcomes</h3>
              <p className="mt-1 text-xs font-semibold text-slate-500">Real-world outcomes powered by continuous energy and standardized setup.</p>
            </div>
            <GraduationCap className="shrink-0 text-emerald-600" size={24} />
          </div>
          <p className="font-mono text-5xl font-black leading-none text-emerald-700 md:text-6xl">{profile.activeHours} <span className="text-2xl">Hrs</span></p>
          <p className="mt-3 text-sm font-black text-slate-600">
            Daily Average: {profile.dailyAverageMins} Mins ({profile.dailyAverageMins / 60} Hrs)
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className={`rounded-2xl border p-5 shadow-sm xl:col-span-4 ${statusTone}`}>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Live Active Classes</p>
              <h3 className="text-lg font-black">Smart Classroom Feed</h3>
            </div>
            <BookOpenCheck size={24} />
          </div>
          <p className="font-mono text-5xl font-black leading-none md:text-6xl">{activeClassValue}</p>
          <p className="mt-3 text-sm font-bold">
            {!now ? 'Checking classroom schedule...' : classesActive ? 'Classes are actively powered and online.' : offHours ? 'Outside active teaching hours.' : 'Class window opens at 11:00 AM.'}
          </p>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm xl:col-span-8">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Maintenance & Alerts</p>
              <h3 className="text-lg font-black text-[#064e3b]">Hardware Maintenance Queue</h3>
            </div>
            <Wrench className="text-amber-600" size={24} />
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {profile.alerts.map((alert) => (
              <div key={alert} className="flex gap-3 rounded-xl border border-amber-100 bg-amber-50/70 p-3">
                <AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-600" />
                <p className="text-sm font-bold leading-snug text-amber-900">{alert}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm xl:col-span-4">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Controls</p>
              <h3 className="text-lg font-black text-[#064e3b]">Operational Checks</h3>
            </div>
            <MonitorCheck className="text-emerald-600" size={24} />
          </div>
          <div className="space-y-3">
            {['Telemetry sync', 'Classroom UPS', 'Sensor gateway'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl border border-emerald-100 bg-emerald-50 p-3">
                <span className="text-sm font-black text-emerald-900">{item}</span>
                <CheckCircle2 size={18} className="text-emerald-600" />
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="relative z-10 mt-5 flex flex-col gap-3 border-t border-emerald-100 pt-4 text-xs font-black text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_0_6px_rgba(16,185,129,0.14)] animate-pulse" />
          System Status: Online
        </p>
        <p className="flex items-center gap-2">
          <CalendarClock size={14} className="text-emerald-600" />
          Last Sync: {lastSync ? formatSyncTime(lastSync) : 'Syncing...'}
        </p>
      </div>
    </motion.section>
  );
}
