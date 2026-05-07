"use client";

import React from 'react';
import Header from '@/app/components/dashboard/Header';
import KPICards from '@/app/components/dashboard/KPICards';
import Institutions from '@/app/components/dashboard/Institutions';
import Analytics from '@/app/components/dashboard/Analytics';
import RealTimeMonitor from '@/app/components/dashboard/RealTimeMonitor';
import LearningImpact from '@/app/components/dashboard/LearningImpact';
import DigitalLearningReport from '@/app/components/dashboard/DigitalLearningReport';
import CSRCalculator from '@/app/components/dashboard/CSRCalculator';
import ReportPreview from '@/app/components/dashboard/ReportPreview';
import FutureScaleCTA from '@/app/components/dashboard/FutureScaleCTA';
import { MapPin } from 'lucide-react';
import { SCHOOL_OPTIONS, SchoolFilter } from '@/app/constants/mockData';

export default function ImpactOSDashboard() {
  const [selectedSchool, setSelectedSchool] = React.useState<SchoolFilter>('all');

  return (
    <div className="bg-[#fcfaf8] min-h-screen">
      {/* 
        This is the main dashboard content wrapper.
        The Header component's download button still uses this ID 
        to print the entire dashboard if needed.
      */}
      <div
        id="dashboard-content"
        className="max-w-[1440px] mx-auto px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8 lg:px-10 lg:py-10 space-y-8 sm:space-y-10 lg:space-y-12 font-sans text-[#0a192f]"
      >
        <Header />
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
              aria-label="Select school"
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

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          <div className="xl:col-span-2">
            <Institutions selectedSchool={selectedSchool} />
          </div>
          <div>
            <Analytics selectedSchool={selectedSchool} />
          </div>
        </div>

        {/* 
          1. ESG REPORT EXPORT TARGET 
          Includes RealTimeMonitor (Environment/Live Stats) and Analytics
        */}
        <div id="esg-report-export" className="space-y-8 sm:space-y-10 lg:space-y-12">
          <RealTimeMonitor selectedSchool={selectedSchool} />
        </div>

        {/* 
          2. SCHOOL IMPACT REPORT EXPORT TARGET
          Includes LearningImpact and DigitalLearningReport (The 6-Grid)
        */}
        <div id="school-report-export" className="space-y-8 sm:space-y-10 lg:space-y-12">
          <LearningImpact />
          <DigitalLearningReport />
        </div>

        {/* 
          3. CSR SUMMARY REPORT EXPORT TARGET
          Includes the Calculator and Future Scale CTA
        */}
        <div id="csr-report-export" className="space-y-8 sm:space-y-10 lg:space-y-12">
          <CSRCalculator />
          <FutureScaleCTA />
        </div>

        {/* Report Preview Component that triggers the specific downloads */}
        <ReportPreview />
        
      </div>
    </div>
  );
}
