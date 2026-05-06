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

export default function ImpactOSDashboard() {
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
        <KPICards />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          <div className="xl:col-span-2">
            <Institutions />
          </div>
          <div>
            <Analytics />
          </div>
        </div>

        {/* 
          1. ESG REPORT EXPORT TARGET 
          Includes RealTimeMonitor (Environment/Live Stats) and Analytics
        */}
        <div id="esg-report-export" className="space-y-8 sm:space-y-10 lg:space-y-12">
          <RealTimeMonitor />
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