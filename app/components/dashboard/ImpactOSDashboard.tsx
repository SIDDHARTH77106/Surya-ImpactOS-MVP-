"use client";

import React from "react";
import { MapPin } from "lucide-react";
import Header from "@/app/components/dashboard/Header";
import KPICards from "@/app/components/dashboard/KPICards";
import Institutions from "@/app/components/dashboard/Institutions";
import Analytics from "@/app/components/dashboard/Analytics";
import RealTimeMonitor from "@/app/components/dashboard/RealTimeMonitor";
import DigitalLearningReport from "@/app/components/dashboard/DigitalLearningReport";
import CSRCalculator from "@/app/components/dashboard/CSRCalculator";
import ReportPreview from "@/app/components/dashboard/ReportPreview";
import FutureScaleCTA from "@/app/components/dashboard/FutureScaleCTA";
import SolarBackground from "@/app/components/dashboard/SolarBackground";
import { SCHOOL_OPTIONS, SchoolFilter } from "@/app/constants/mockData";
import { SIMULATION_ASSUMPTIONS } from "@/app/constants/solarSchedule";

type IndiaClock = { date: string; minutes: number; label: string };

function getIndiaClock(): IndiaClock {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: SIMULATION_ASSUMPTIONS.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date()).reduce<Record<string, string>>((result, part) => {
    result[part.type] = part.value;
    return result;
  }, {});
  const date = `${parts.year}-${parts.month}-${parts.day}`;
  const minutes = Number(parts.hour) * 60 + Number(parts.minute);
  return { date, minutes, label: `${parts.hour}:${parts.minute} IST` };
}

export default function ImpactOSDashboard() {
  const [selectedSchool, setSelectedSchool] = React.useState<SchoolFilter>("government");
  const [simulatedDate, setSimulatedDate] = React.useState<string>(SIMULATION_ASSUMPTIONS.defaultDate);
  const [isLive, setIsLive] = React.useState(true);
  const [liveClock, setLiveClock] = React.useState<IndiaClock | null>(null);
  const monitorSchool: Exclude<SchoolFilter, "all"> = selectedSchool === "all" ? "government" : selectedSchool;
  const activeDate = isLive && liveClock ? liveClock.date : simulatedDate;

  React.useEffect(() => {
    const updateClock = () => setLiveClock(getIndiaClock());
    updateClock();
    const timer = window.setInterval(updateClock, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const handleSimulationDateChange = (date: string) => {
    setSimulatedDate(date);
    setIsLive(false);
  };

  const handleExitLive = () => {
    // Preserve today's India date when a user moves from Live mode into playback.
    const currentClock = liveClock ?? getIndiaClock();
    setLiveClock(currentClock);
    setSimulatedDate(currentClock.date);
    setIsLive(false);
  };

  const handleLiveNow = () => {
    // A direct clock read makes the return control immediate rather than waiting
    // for the next 30-second refresh.
    const currentClock = getIndiaClock();
    setLiveClock(currentClock);
    setSimulatedDate(currentClock.date);
    setIsLive(true);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#fcfaf8]">
      <SolarBackground />

      <div
        id="dashboard-content"
        className="relative z-10 mx-auto max-w-[1440px] px-4 py-5 font-sans text-[#0a192f] sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-10 lg:py-10"
      >
        <div id="dashboard-header" className="mb-8">
          <Header />
        </div>

        <div id="section-overview" className="space-y-8 sm:space-y-10 lg:space-y-12">
          <div className="flex flex-col gap-4 rounded-[1.5rem] border border-emerald-100 bg-white/80 p-4 shadow-[0_8px_30px_rgba(6,78,59,0.05)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Institution View</p>
              <h2 className="mt-1 text-xl font-extrabold tracking-tight text-[#064e3b]">
                {SCHOOL_OPTIONS.find((option) => option.key === selectedSchool)?.label}
              </h2>
            </div>

            <label className="flex w-full items-center gap-3 rounded-2xl border border-emerald-100 bg-[#fcfdfa] px-4 py-3 text-sm font-extrabold text-[#064e3b] shadow-sm sm:w-auto">
              <MapPin size={20} className="shrink-0 text-emerald-600" strokeWidth={2.5} />
              <select
                value={selectedSchool}
                onChange={(event) => setSelectedSchool(event.target.value as SchoolFilter)}
                className="w-full bg-transparent outline-none sm:min-w-72"
              >
                {SCHOOL_OPTIONS.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <KPICards selectedSchool={selectedSchool} />

          <div className="grid grid-cols-1 gap-6 md:gap-8 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <Institutions selectedSchool={selectedSchool} />
            </div>
            <div>
              <Analytics selectedSchool={selectedSchool} simulatedDate={activeDate} />
            </div>
          </div>
        </div>

        <div id="section-monitor" className="mt-8 sm:mt-10 lg:mt-12">
          <RealTimeMonitor
            selectedSchool={monitorSchool}
            simulatedDate={activeDate}
            onSimulatedDateChange={handleSimulationDateChange}
            isLive={isLive}
            liveMinutes={liveClock?.minutes ?? null}
            liveClockLabel={liveClock?.label ?? "Loading IST…"}
            onLiveNow={handleLiveNow}
            onExitLive={handleExitLive}
          />
        </div>

        <div id="section-learning" className="mt-8 sm:mt-10 lg:mt-12">
          <DigitalLearningReport />
        </div>

        <div id="section-csr" className="mt-8 space-y-8 sm:mt-10 sm:space-y-10 lg:mt-12 lg:space-y-12">
          <CSRCalculator />
          <FutureScaleCTA />
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <ReportPreview key={monitorSchool} selectedSchool={monitorSchool} simulatedDate={activeDate} />
        </div>
      </div>
    </main>
  );
}
