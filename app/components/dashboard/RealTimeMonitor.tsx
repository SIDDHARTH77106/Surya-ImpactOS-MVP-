"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle, BatteryCharging, CalendarClock, CheckCircle2, CircleDot, CloudSun,
  Gauge, MapPin, Pause, Play, Radio, RotateCcw, School, Server, SunMedium,
  ThermometerSun, TrendingUp, Wrench, Zap,
} from "lucide-react";
import { motion, Variants } from "framer-motion";
import { Bar, BarChart, Cell, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import {
  createDailySchedule, formatSimulatedTime, getEstimatedDailyGeneration, getEstimatedGenerationSoFar,
  getForecastAssumptionNote, getOutageDurationHours, PROJECTS, SIMULATION_ASSUMPTIONS, type ProjectKey,
} from "@/app/constants/solarSchedule";

type ProjectProfile = { temperature: number; humidity: number; aqi: number; activeHours: number; dailyAverageMins: number; uptime: string; batteryHealth: number; alerts: string[] };
const PROJECT_PROFILES: Record<ProjectKey, ProjectProfile> = {
  government: { temperature: 31.8, humidity: 46, aqi: 42, activeHours: 400, dailyAverageMins: 120, uptime: "99.4%", batteryHealth: 91, alerts: ["Panel cleaning due on east-facing array after dust accumulation.", "Inverter fan inspection recommended during next service window."] },
  jeevanDhara: { temperature: 32.6, humidity: 51, aqi: 58, activeHours: 380, dailyAverageMins: 90, uptime: "99.0%", batteryHealth: 87, alerts: ["Battery bank health review required for cell balancing.", "Panel cleaning due after reduced morning generation trend.", "Inverter DC input terminal torque check scheduled."] },
};
const emptySubscribe = () => () => {};
const chartInitialDimension = { width: 1, height: 1 };

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(`${date}T12:00:00`));
}

type RealTimeMonitorProps = {
  selectedSchool?: ProjectKey;
  simulatedDate: string;
  onSimulatedDateChange: (date: string) => void;
  isLive: boolean;
  liveMinutes: number | null;
  liveClockLabel: string;
  onLiveNow: () => void;
  onExitLive: () => void;
};

export default function RealTimeMonitor({ selectedSchool = "government", simulatedDate, onSimulatedDateChange, isLive, liveMinutes, liveClockLabel, onLiveNow, onExitLive }: RealTimeMonitorProps) {
  const [simulatedMinutes, setSimulatedMinutes] = useState(12 * 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);
  const isMounted = React.useSyncExternalStore(emptySubscribe, () => true, () => false);
  const project = PROJECTS[selectedSchool];
  const profile = PROJECT_PROFILES[selectedSchool];
  const schedule = useMemo(() => createDailySchedule(selectedSchool, simulatedDate), [selectedSchool, simulatedDate]);
  const currentMinutes = isLive && liveMinutes !== null ? liveMinutes : simulatedMinutes;
  const currentInterval = schedule.find((interval) => interval.startMinutes <= currentMinutes && interval.endMinutes > currentMinutes) ?? schedule[schedule.length - 1];
  const estimatedDailyGeneration = useMemo(() => getEstimatedDailyGeneration(selectedSchool, simulatedDate), [selectedSchool, simulatedDate]);
  const estimatedSoFar = useMemo(() => getEstimatedGenerationSoFar(schedule, currentMinutes), [schedule, currentMinutes]);
  const outageHours = getOutageDurationHours(selectedSchool);
  const isPlaybackActive = !isLive && isPlaying && simulatedMinutes < 1440;
  const comparisonProjects = (Object.keys(PROJECTS) as ProjectKey[]).map((projectKey) => ({ key: projectKey, project: PROJECTS[projectKey], dailyForecast: getEstimatedDailyGeneration(projectKey, simulatedDate), outageHours: getOutageDurationHours(projectKey) }));
  const containerVariants: Variants = { hidden: { opacity: 0, y: 36 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.05 } } };
  const itemVariants: Variants = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  useEffect(() => {
    if (!isPlaybackActive) return;
    const timer = window.setInterval(() => setSimulatedMinutes((minutes) => Math.min(minutes + SIMULATION_ASSUMPTIONS.intervalMinutes, 1440)), 800 / playbackSpeed);
    return () => window.clearInterval(timer);
  }, [isPlaybackActive, playbackSpeed]);

  const exitLiveAt = (minutes: number) => {
    if (isLive) onExitLive();
    setIsPlaying(false);
    setSimulatedMinutes(minutes);
  };
  const handlePlay = () => {
    const startMinutes = currentMinutes >= 1440 ? 0 : currentMinutes;
    if (isLive) onExitLive();
    setSimulatedMinutes(startMinutes);
    setIsPlaying(true);
  };
  const handleReset = () => exitLiveAt(0);
  const handleLiveNow = () => { setIsPlaying(false); onLiveNow(); };
  const classesActive = currentMinutes >= 11 * 60 && currentMinutes < 14 * 60;

  return (
    <motion.section variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} className="relative overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-white p-5 text-[#083827] shadow-[0_18px_55px_rgba(6,78,59,0.08)] sm:p-6 md:p-8 print:break-inside-avoid">
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-emerald-500 via-green-400 to-lime-400" />
      <div className="relative z-10 mb-6 flex flex-col gap-4 border-b border-gray-100 pb-6 lg:flex-row lg:items-start lg:justify-between">
        <div><div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-sm ${isLive ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>{isLive ? <Radio size={14} className="animate-pulse" /> : <CalendarClock size={14} />}{isLive ? `Live mode · ${SIMULATION_ASSUMPTIONS.timeZone}` : "Simulation playback · forecast only"}</div><h2 className="text-3xl font-black tracking-tight text-[#064e3b] md:text-4xl">Institution Energy Monitor</h2><p className="mt-2 text-sm font-semibold text-slate-500">Assessment-based forecast and simulated grid availability — not live meter readings.</p></div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-right"><p className="text-[10px] font-black uppercase tracking-widest text-emerald-700">Selected institution</p><p className="mt-1 font-black text-[#064e3b]">{project.name}</p></div>
      </div>

      <motion.div variants={itemVariants} className="relative z-10 mb-6 rounded-3xl border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-emerald-50 p-5 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end">
          <label className="block min-w-52"><span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Date reference</span><input type="date" value={simulatedDate} onChange={(event) => { setIsPlaying(false); onSimulatedDateChange(event.target.value || SIMULATION_ASSUMPTIONS.defaultDate); }} className="mt-2 block w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 outline-none focus:border-emerald-500" /></label>
          <div className="flex-1"><span className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500"><span>{isLive ? "Live clock" : "Playback clock"}</span><strong className="text-lg tracking-normal text-emerald-700">{formatSimulatedTime(currentMinutes)} {isLive && "IST"}</strong></span><input type="range" min="0" max="1440" step={SIMULATION_ASSUMPTIONS.intervalMinutes} value={currentMinutes} onChange={(event) => exitLiveAt(Number(event.target.value))} className="mt-3 w-full accent-emerald-600" aria-label="Timeline time of day" /><span className="mt-1 flex justify-between text-[10px] font-bold text-slate-400"><span>00:00</span><span>12:00</span><span>24:00</span></span></div>
          <div className={`rounded-2xl border px-4 py-3 ${currentInterval.gridStatus === "outage" ? "border-rose-200 bg-rose-50 text-rose-800" : "border-emerald-200 bg-white text-emerald-800"}`}><p className="text-[10px] font-black uppercase tracking-widest">Current grid status</p><p className="mt-1 text-sm font-black">{currentInterval.gridStatus === "outage" ? "Outage · backup status shown" : "Grid available"}</p></div>
        </div>
        <div className="mt-5 flex flex-col gap-4 border-t border-amber-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2"><button type="button" onClick={isPlaybackActive ? () => setIsPlaying(false) : handlePlay} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:bg-emerald-700">{isPlaybackActive ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}{isPlaybackActive ? "Pause" : "Play simulation"}</button><button type="button" onClick={handleReset} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-600 transition hover:border-emerald-300 hover:text-emerald-700"><RotateCcw size={16} />Reset</button><button type="button" onClick={handleLiveNow} className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition ${isLive ? "bg-emerald-100 text-emerald-800" : "border border-emerald-200 bg-white text-emerald-700 hover:bg-emerald-50"}`}><Radio size={16} />{isLive ? `Live now · ${liveClockLabel}` : "Return to Live now"}</button><span className="ml-1 inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-500"><Gauge size={14} />Speed</span>{([1, 2, 4] as const).map((speed) => <button key={speed} type="button" onClick={() => setPlaybackSpeed(speed)} className={`rounded-lg px-3 py-2 text-xs font-black transition ${playbackSpeed === speed ? "bg-amber-500 text-white shadow-sm" : "bg-white text-slate-500 hover:bg-amber-50"}`}>{speed}×</button>)}</div>
          <motion.p key={`${selectedSchool}-${simulatedDate}-${currentMinutes}-${isLive}`} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className={`max-w-xl rounded-xl px-3 py-2 text-xs font-bold ${currentInterval.gridStatus === "outage" ? "bg-rose-100 text-rose-800" : "bg-emerald-50 text-emerald-800"}`}>At {formatSimulatedTime(currentMinutes)}, the forecast for {currentInterval.label} is {currentInterval.generationKwh.toFixed(2)} kWh. {currentInterval.gridStatus === "outage" ? "Grid is unavailable; solar forecast continues and battery coverage is not modelled." : "Grid is available."}</motion.p>
        </div>
      </motion.div>

      <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-5">{[
        { label: "Installed capacity", value: `${project.capacityKw} kW`, icon: Zap, color: "text-amber-600" },
        { label: "Estimated daily generation", value: `${estimatedDailyGeneration.toFixed(2)} kWh`, icon: SunMedium, color: "text-orange-600" },
        { label: "Estimated generation so far", value: `${estimatedSoFar.toFixed(2)} kWh`, icon: TrendingUp, color: "text-emerald-600" },
        { label: "Simulated outage", value: `${outageHours} hours`, icon: AlertTriangle, color: "text-rose-600" },
        { label: "Actual meter data", value: "Unavailable", icon: CircleDot, color: "text-slate-500" },
      ].map((metric) => <motion.div key={metric.label} variants={itemVariants} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"><metric.icon size={20} className={metric.color} /><p className="mt-4 text-[10px] font-black uppercase tracking-widest text-slate-500">{metric.label}</p><p className="mt-1 text-xl font-black tracking-tight text-[#0a192f]">{metric.value}</p></motion.div>)}</div>

      <motion.div variants={itemVariants} className="relative z-10 mt-6 rounded-3xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-5"><div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Project comparison</p><h3 className="mt-1 text-lg font-black text-[#064e3b]">Selected-date forecast estimates</h3></div><p className="text-xs font-semibold text-slate-500">{formatDate(simulatedDate)} · assessment estimates</p></div><div className="grid gap-3 md:grid-cols-2">{comparisonProjects.map(({ key, project: comparisonProject, dailyForecast, outageHours: comparisonOutage }) => <div key={key} className={`rounded-2xl border p-4 ${key === selectedSchool ? "border-emerald-300 bg-emerald-50/70" : "border-slate-100 bg-slate-50"}`}><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-black text-[#0a192f]">{comparisonProject.name}</p><p className="mt-1 text-xs font-semibold text-slate-500">{comparisonProject.location}</p></div>{key === selectedSchool && <span className="rounded-full bg-emerald-600 px-2 py-1 text-[9px] font-black uppercase tracking-widest text-white">Selected</span>}</div><div className="mt-4 grid grid-cols-3 gap-2"><div><p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Capacity</p><p className="mt-1 font-black text-slate-800">{comparisonProject.capacityKw} kW</p></div><div><p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Daily forecast</p><p className="mt-1 font-black text-amber-700">{dailyForecast.toFixed(2)} kWh</p></div><div><p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Outage</p><p className="mt-1 font-black text-rose-700">{comparisonOutage} h/day</p></div></div></div>)}</div></motion.div>

      <motion.div variants={itemVariants} className="relative z-10 mt-6 rounded-3xl border border-slate-100 bg-slate-50 p-4 sm:p-5"><div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">30-minute forecast timeline</p><h3 className="mt-1 text-xl font-black text-[#064e3b]">Assessment profile & simulated outages</h3></div><p className="text-xs font-bold text-slate-500"><span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />Forecast <span className="ml-3 mr-2 inline-block h-2.5 w-2.5 rounded-full bg-rose-500" />Forecast during outage</p></div><div className="h-[300px] min-h-[300px] w-full">{isMounted ? <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} initialDimension={chartInitialDimension}><BarChart data={schedule} margin={{ top: 12, right: 8, left: -20, bottom: 0 }}><XAxis dataKey="startMinutes" tickFormatter={(value) => formatSimulatedTime(Number(value))} interval={3} tick={{ fontSize: 11, fill: "#64748b" }} /><YAxis tick={{ fontSize: 11, fill: "#64748b" }} unit=" kWh" /><Tooltip labelFormatter={(start) => schedule.find((interval) => interval.startMinutes === Number(start))?.label ?? ""} formatter={(value, _name, item) => [`${Number(value).toFixed(2)} kWh`, item.payload.gridStatus === "outage" ? "Forecast · grid outage" : "Forecast · grid available"]} contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontWeight: 700 }} /><ReferenceLine x={Math.min(currentMinutes, 1439)} stroke="#047857" strokeWidth={2} strokeDasharray="4 4" label={{ value: isLive ? "Live now" : "Playback", position: "top", fill: "#047857", fontSize: 11, fontWeight: 700 }} /><Bar dataKey="generationKwh" radius={[4, 4, 0, 0]}>{schedule.map((interval) => <Cell key={interval.startMinutes} fill={interval.gridStatus === "outage" ? "#f43f5e" : "#f59e0b"} />)}</Bar></BarChart></ResponsiveContainer> : <div className="h-full rounded-2xl bg-white" />}</div></motion.div>

      <motion.div variants={itemVariants} className="relative z-10 mt-6 overflow-hidden rounded-3xl border border-slate-200"><div className="border-b border-slate-200 bg-white px-5 py-4"><h3 className="font-black text-[#064e3b]">Daily forecast schedule</h3><p className="mt-1 text-xs font-semibold text-slate-500">{SIMULATION_ASSUMPTIONS.profileDescription}. {getForecastAssumptionNote(selectedSchool)}</p></div><div className="max-h-[440px] overflow-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="sticky top-0 bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500"><tr><th className="px-5 py-3">Time interval</th><th className="px-5 py-3">Forecast solar</th><th className="px-5 py-3">Actual reading</th><th className="px-5 py-3">Grid</th><th className="px-5 py-3">Backup / battery</th></tr></thead><tbody>{schedule.map((interval) => { const completed = interval.endMinutes <= currentMinutes; const current = interval.startMinutes <= currentMinutes && interval.endMinutes > currentMinutes; return <tr key={interval.startMinutes} className={`border-t border-slate-100 ${interval.gridStatus === "outage" ? "bg-rose-50/80" : "bg-white"} ${current ? "ring-1 ring-inset ring-emerald-400" : ""}`}><td className="px-5 py-3 font-bold text-slate-700">{interval.label}{current && <span className="ml-2 rounded-full bg-emerald-100 px-2 py-1 text-[9px] font-black uppercase text-emerald-700">Current</span>}</td><td className="px-5 py-3 font-mono font-black text-amber-700">Forecast {interval.generationKwh.toFixed(2)} kWh</td><td className="px-5 py-3 text-xs font-bold text-slate-500">{completed ? "Actual data unavailable" : "Forecast interval"}</td><td className="px-5 py-3"><span className={`rounded-full px-2.5 py-1 text-[10px] font-black uppercase ${interval.gridStatus === "outage" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"}`}>{interval.gridStatus}</span></td><td className="px-5 py-3 text-xs font-bold text-slate-600">{interval.backupStatus}</td></tr>; })}</tbody></table></div></motion.div>

      <div className="relative z-10 mt-6 grid grid-cols-1 gap-6 xl:grid-cols-12"><motion.div variants={itemVariants} className="rounded-2xl border border-emerald-100 bg-white p-5 shadow-sm xl:col-span-4"><div className="mb-4 flex items-start justify-between"><div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Institution</p><h3 className="mt-1 text-xl font-black text-[#064e3b]">{project.name}</h3></div><School className="rounded-lg bg-emerald-50 p-2 text-emerald-600" size={36} /></div><div className="space-y-3 text-sm font-bold text-slate-600"><p className="flex items-center gap-2"><MapPin size={16} className="text-emerald-500" />{project.location}</p><p className="flex items-center gap-2"><Server size={16} className="text-emerald-500" />{project.capacityKw} kW Hybrid Solar Lab</p><p className="flex items-center gap-2"><BatteryCharging size={16} className="text-emerald-500" />Battery health: {profile.batteryHealth}% (demo profile)</p></div></motion.div><motion.div variants={itemVariants} className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm xl:col-span-4"><div className="mb-5 flex items-center justify-between"><p className="text-xs font-black uppercase tracking-widest text-slate-600">Actual generation</p><CloudSun size={24} className="text-slate-500" /></div><p className="text-2xl font-black tracking-tight text-slate-700">Data unavailable</p><p className="mt-3 text-xs font-semibold text-slate-500">No verified meter/API source is connected. Forecast values are never presented as actual readings.</p></motion.div><motion.div variants={itemVariants} className="rounded-2xl border border-blue-100 bg-white p-5 shadow-sm xl:col-span-4"><div className="mb-5 flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Demo environment</p><h3 className="text-lg font-black text-[#064e3b]">Static profile</h3></div><ThermometerSun className="text-emerald-600" size={24} /></div><div className="grid grid-cols-3 gap-3">{[["Temp", `${profile.temperature.toFixed(1)}°`], ["Humidity", `${profile.humidity}%`], ["AQI", profile.aqi]].map(([label, value]) => <div key={String(label)} className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-center"><p className="text-[9px] font-black uppercase tracking-widest text-slate-500">{label}</p><p className="mt-1 font-mono text-lg font-black text-slate-800">{value}</p></div>)}</div></motion.div><motion.div variants={itemVariants} className="rounded-2xl border border-slate-100 bg-[#f8fafc] p-5 shadow-sm xl:col-span-6"><div className="mb-4 flex items-center gap-2"><TrendingUp className="text-blue-600" size={22} /><h3 className="font-black text-[#0a192f]">Digital Learning Impact</h3></div><div className="grid grid-cols-3 gap-3 text-center"><div><p className="text-2xl font-black text-blue-600">{profile.activeHours} h</p><p className="text-[10px] font-black uppercase text-slate-500">Learning protected</p></div><div><p className="text-2xl font-black text-emerald-600">{profile.uptime}</p><p className="text-[10px] font-black uppercase text-slate-500">Uptime</p></div><div><p className="text-2xl font-black text-orange-600">{classesActive ? "2 / 2" : "0 / 2"}</p><p className="text-[10px] font-black uppercase text-slate-500">Classes active</p></div></div><p className="mt-4 text-xs font-semibold text-slate-500">Daily average: {profile.dailyAverageMins} minutes. Class status follows the active clock.</p></motion.div><motion.div variants={itemVariants} className="rounded-2xl border border-amber-200 bg-[#fffbeb] p-5 shadow-sm xl:col-span-6"><div className="mb-4 flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-widest text-amber-600">Hardware & maintenance</p><h3 className="text-lg font-black text-amber-900">Active Alerts ({profile.alerts.length})</h3></div><Wrench className="rounded-lg bg-amber-100 p-1.5 text-amber-600" size={32} /></div><div className="grid gap-3 md:grid-cols-2">{profile.alerts.map((alert) => <div key={alert} className="flex gap-3 rounded-xl border border-amber-200 bg-white p-3 shadow-sm"><AlertTriangle size={18} className="mt-0.5 shrink-0 text-amber-500" /><p className="text-sm font-bold leading-snug text-slate-700">{alert}</p></div>)}</div></motion.div></div>
      <div className="relative z-10 mt-6 flex flex-col gap-3 border-t border-gray-100 pt-4 text-xs font-black text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald-600" />Forecast status: <span className="text-emerald-700">assessment-based estimate</span></p><p>Grid availability, solar forecast, and backup status are shown separately; load coverage is not modelled.</p></div>
    </motion.section>
  );
}
