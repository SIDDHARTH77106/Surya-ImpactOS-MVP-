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

export default function ImpactOSDashboard() {
  const [selectedSchool, setSelectedSchool] = React.useState<SchoolFilter>("all");
  const monitorSchool: Exclude<SchoolFilter, "all"> = selectedSchool === "all" ? "government" : selectedSchool;

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
              <Analytics selectedSchool={selectedSchool} />
            </div>
          </div>
        </div>

        <div id="section-monitor" className="mt-8 sm:mt-10 lg:mt-12">
          <RealTimeMonitor key={monitorSchool} selectedSchool={monitorSchool} />
        </div>

        <div id="section-learning" className="mt-8 sm:mt-10 lg:mt-12">
          <DigitalLearningReport />
        </div>

        <div id="section-csr" className="mt-8 space-y-8 sm:mt-10 sm:space-y-10 lg:mt-12 lg:space-y-12">
          <CSRCalculator />
          <FutureScaleCTA />
        </div>

        <div className="mt-12 border-t border-slate-200 pt-8">
          <ReportPreview key={monitorSchool} selectedSchool={monitorSchool} />
        </div>
      </div>
    </main>
  );
}
