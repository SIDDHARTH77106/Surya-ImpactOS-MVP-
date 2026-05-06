"use client";

import React from 'react';
import {
  Battery,
  CloudSun,
  Cpu,
  Droplets,
  ShieldCheck,
  Sun,
  ThermometerSun,
  Wind,
  Zap,
} from 'lucide-react';
import { AnimatePresence, motion, Variants } from 'framer-motion';

type DynamicValuesKeys = 'solar' | 'battery' | 'load' | 'grid';
type SchoolKey = 'surana' | 'jeevanDhara';

type SchoolMetric = {
  pvGeneration: number;
  loadPower: number;
  batterySoc: number;
};

const schoolMeta: Record<
  SchoolKey,
  {
    name: string;
    system: string;
    location: string;
    capacity: string;
    classrooms: string;
    digitalLearning: string;
  }
> = {
  surana: {
    name: 'Govt. Primary School Surana',
    system: '5kW Hybrid',
    location: 'Haryana',
    capacity: '5kW Hybrid',
    classrooms: '2 Classrooms on Solar',
    digitalLearning: '2 hrs digital learning/classroom',
  },
  jeevanDhara: {
    name: 'Jeevan Dhara Welfare Society',
    system: '6kW Hybrid',
    location: 'Ghaziabad',
    capacity: '6kW Hybrid',
    classrooms: '2 Classrooms on Solar',
    digitalLearning: '2 hrs digital learning/classroom',
  },
};

const liveMetrics = [
  { label: 'Solar Output', unit: 'kW', icon: Zap, color: 'text-[#f59e0b]', metricKey: 'solar' as DynamicValuesKeys },
  { label: 'Battery Status', unit: '%', icon: Battery, color: 'text-[#10b981]', metricKey: 'battery' as DynamicValuesKeys },
  { label: 'Load Power', unit: 'kW', icon: Cpu, color: 'text-blue-400', metricKey: 'load' as DynamicValuesKeys },
  { label: 'Grid Status', unit: '', icon: ShieldCheck, color: 'text-slate-300', metricKey: 'grid' as DynamicValuesKeys },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function RealTimeMonitor() {
  const [dynamicValues, setDynamicValues] = React.useState<Record<DynamicValuesKeys, string>>({
    solar: '8.4',
    battery: '85',
    load: '4.2',
    grid: 'Stable',
  });

  const [envValues, setEnvValues] = React.useState({
    irradiance: 850,
    temperature: 32.4,
    windSpeed: 12,
    humidity: 45,
  });

  const [schoolMetrics, setSchoolMetrics] = React.useState<Record<SchoolKey, SchoolMetric>>({
    surana: { pvGeneration: 3.8, loadPower: 2.1, batterySoc: 87 },
    jeevanDhara: { pvGeneration: 4.5, loadPower: 2.5, batterySoc: 84 },
  });

  React.useEffect(() => {
    const timer = setInterval(() => {
      setDynamicValues((prev) => ({
        solar: clamp(parseFloat(prev.solar) + (Math.random() - 0.5) * 0.38, 7.8, 9.2).toFixed(1),
        load: clamp(parseFloat(prev.load) + (Math.random() - 0.5) * 0.22, 3.7, 4.9).toFixed(1),
        battery: Math.round(clamp(parseFloat(prev.battery) + (Math.random() - 0.5) * 1.2, 80, 92)).toString(),
        grid: 'Stable',
      }));

      setEnvValues((prev) => ({
        irradiance: Math.round(clamp(prev.irradiance + (Math.random() - 0.5) * 24, 800, 950)),
        temperature: Number(clamp(prev.temperature + (Math.random() - 0.5) * 0.5, 30, 38).toFixed(1)),
        windSpeed: Number(clamp(prev.windSpeed + (Math.random() - 0.5) * 1.4, 8, 18).toFixed(1)),
        humidity: Math.round(clamp(prev.humidity + (Math.random() - 0.5) * 2.4, 35, 65)),
      }));

      setSchoolMetrics((prev) => ({
        surana: {
          pvGeneration: Number(clamp(prev.surana.pvGeneration + (Math.random() - 0.5) * 0.24, 3.3, 4.3).toFixed(1)),
          loadPower: Number(clamp(prev.surana.loadPower + (Math.random() - 0.5) * 0.14, 1.8, 2.6).toFixed(1)),
          batterySoc: Math.round(clamp(prev.surana.batterySoc + (Math.random() - 0.5) * 2, 78, 92)),
        },
        jeevanDhara: {
          pvGeneration: Number(clamp(prev.jeevanDhara.pvGeneration + (Math.random() - 0.5) * 0.28, 4.0, 5.2).toFixed(1)),
          loadPower: Number(clamp(prev.jeevanDhara.loadPower + (Math.random() - 0.5) * 0.16, 2.1, 3.0).toFixed(1)),
          batterySoc: Math.round(clamp(prev.jeevanDhara.batterySoc + (Math.random() - 0.5) * 2, 76, 91)),
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
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className="enterprise-dark-panel relative overflow-hidden rounded-[1.75rem] bg-[#0B1120] p-5 text-white shadow-[0_20px_60px_rgba(10,25,47,0.2)] sm:p-6 md:rounded-[2.5rem] md:p-8 lg:p-10"
    >
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.15)_0%,rgba(245,158,11,0)_70%)] blur-[100px]" />

      <div className="relative z-10 grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-4 lg:gap-12">
        <div className="space-y-6 md:space-y-8 lg:col-span-1">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Live Platform
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Live Monitor</h2>
            <p className="mt-2 text-sm font-medium text-slate-400">System health and site telemetry tracking.</p>
          </div>

          <motion.div variants={itemVariants} className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-inner">
            <div className="mb-4 flex items-center gap-3 border-b border-white/10 pb-3">
              <CloudSun className="text-[#f59e0b]" size={24} />
              <p className="text-sm font-bold text-white">Weather / Environment</p>
              <span className="ml-auto flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="flex items-center gap-1 text-[10px] uppercase text-slate-400"><Sun size={12} /> Irradiance</p>
                <p className="mt-1 font-mono text-lg font-bold text-amber-400">{envValues.irradiance} <span className="text-xs">W/m2</span></p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[10px] uppercase text-slate-400"><ThermometerSun size={12} /> Temperature</p>
                <p className="mt-1 font-mono text-lg font-bold text-rose-400">{envValues.temperature}C</p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[10px] uppercase text-slate-400"><Wind size={12} /> Wind Speed</p>
                <p className="mt-1 font-mono text-lg font-bold text-sky-300">{envValues.windSpeed} <span className="text-xs">km/h</span></p>
              </div>
              <div>
                <p className="flex items-center gap-1 text-[10px] uppercase text-slate-400"><Droplets size={12} /> Humidity</p>
                <p className="mt-1 font-mono text-lg font-bold text-blue-300">{envValues.humidity}%</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-lg border border-emerald-900 bg-emerald-950/40 p-3 text-xs font-bold text-emerald-300">
              <ShieldCheck size={16} /> All inverters online.
            </div>
          </div>
        </div>

        <div className="space-y-6 md:space-y-10 lg:col-span-3">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {liveMetrics.map((stat) => (
              <motion.div
                variants={itemVariants}
                key={stat.label}
                whileHover={{ scale: 1.05, y: -4, backgroundColor: 'rgba(255,255,255,0.08)' }}
                className="cursor-pointer rounded-2xl border border-white/10 bg-white/5 p-4 shadow-sm backdrop-blur-md"
              >
                <div className="mb-4 flex items-start justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                  <stat.icon className={stat.color} size={20} />
                </div>
                <AnimatePresence mode="popLayout">
                  <motion.p
                    key={dynamicValues[stat.metricKey]}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-2xl font-black tracking-tight text-white md:text-3xl"
                  >
                    {dynamicValues[stat.metricKey]} <span className="text-sm text-slate-400">{stat.unit}</span>
                  </motion.p>
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {Object.keys(schoolMeta).map((key) => {
              const schoolKey = key as SchoolKey;
              const school = schoolMeta[schoolKey];
              const metrics = schoolMetrics[schoolKey];

              return (
                <div key={schoolKey} className="rounded-[1.5rem] border border-white/10 bg-white/5 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md">
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white">{school.name}</h4>
                      <p className="mt-1 text-xs text-slate-400">{school.system} | {school.location}</p>
                    </div>
                    <span className="flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-300">
                      <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      Status: Active
                    </span>
                  </div>

                  <div className="mb-4 grid grid-cols-1 gap-2 text-xs font-bold text-slate-400 sm:grid-cols-3">
                    <div className="rounded-xl border border-white/10 bg-[#081423] p-3">{school.capacity}</div>
                    <div className="rounded-xl border border-white/10 bg-[#081423] p-3">{school.classrooms}</div>
                    <div className="rounded-xl border border-white/10 bg-[#081423] p-3">{school.digitalLearning}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-xl bg-white/5 p-3">
                      <p className="text-[10px] uppercase text-slate-400">Live Generation</p>
                      <p className="mt-1 font-mono text-emerald-300">{metrics.pvGeneration.toFixed(1)} kW</p>
                    </div>
                    <div className="rounded-xl bg-white/5 p-3">
                      <p className="text-[10px] uppercase text-slate-400">Load / Battery</p>
                      <p className="mt-1 font-mono text-white">{metrics.loadPower.toFixed(1)} kW | {metrics.batterySoc}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
