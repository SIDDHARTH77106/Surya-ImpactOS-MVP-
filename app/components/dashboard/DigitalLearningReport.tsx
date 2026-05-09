"use client";
import React, { useState, useEffect } from 'react';
import {
  BatteryCharging,
  BookOpen,
  BrainCircuit,
  Camera,
  GraduationCap,
  IndianRupee,
  Leaf,
  Lightbulb,
  LineChart,
  MonitorSmartphone,
  Network,
  ServerCog,
  Trees,
  Wifi,
} from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart as RechartsLineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const emptySubscribe = () => () => {};
const chartInitialDimension = { width: 1, height: 1 };

const continuityData = [
  { name: 'Before Solar (2023)', value: 1305, fill: '#cbd5e1' },
  { name: 'After Solar (2024-25)', value: 400, fill: '#f59e0b' },
];

const uptimeData = [
  { name: 'Uptime with Solar', value: 99.2, fill: '#10b981' },
  { name: 'Downtime (Grid Failures)', value: 0.6, fill: '#f97316' },
  { name: 'Scheduled Maintenance', value: 0.2, fill: '#0f172a' },
];

const performanceData = [
  { month: 'May', generation: 820, consumption: 710 },
  { month: 'Jul', generation: 760, consumption: 690 },
  { month: 'Sep', generation: 880, consumption: 730 },
  { month: 'Nov', generation: 910, consumption: 760 },
  { month: 'Jan', generation: 790, consumption: 700 },
  { month: 'Mar', generation: 940, consumption: 780 },
];

const infrastructureItems = [
  { label: 'Smart Classrooms', icon: MonitorSmartphone },
  { label: 'Computer Labs', icon: GraduationCap },
  { label: 'Wi-Fi & Internet', icon: Wifi },
  { label: 'Digital Boards', icon: BookOpen },
  { label: 'CCTV & Security', icon: Camera },
  { label: 'Admin & ERP Systems', icon: ServerCog },
];

const recommendations = [
  {
    title: 'Optimize Solar Usage',
    text: 'Increase daytime load usage.',
    action: 'Schedule High-Load Tasks (10 AM - 3 PM)',
    icon: Lightbulb,
  },
  {
    title: 'Battery Health',
    text: 'Performance is optimal.',
    action: 'Continue Current Maintenance',
    icon: BatteryCharging,
  },
  {
    title: 'Load Management',
    text: 'Some devices run during non-solar hours.',
    action: 'Shift 20% Load to Daytime',
    icon: Network,
  },
  {
    title: 'Monsoon Preparedness',
    text: 'Cloudy days may reduce generation.',
    action: 'Enable Monsoon Mode',
    icon: BrainCircuit,
  },
];

const summaryCards = [
  { label: 'Learning Uptime', value: '99.2%', change: '+32% vs last year' },
  { label: 'Learning Hours', value: '400', change: '+41% vs last year' },
  { label: 'Electricity Cost Savings', value: 'Rs 2,48,650', change: '-22% vs last year' },
  { label: 'CO2 Avoided (Per Year)', value: '12.6 Tonnes', change: '+26% vs last year' },
  { label: 'Students Impacted', value: '1200+', change: 'Across all institutions' },
  { label: 'Solar Classrooms', value: '4', change: 'Across 2 active sites' },
];

function ReportCard({
  title,
  children,
  className = '',
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[2rem] border border-slate-200 bg-white p-5 shadow-[0_14px_40px_rgba(15,23,42,0.05)] ${className}`}>
      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-slate-400">{title}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function DigitalLearningReport() {
  const [dateText, setDateText] = useState("Loading...");

  // Dynamic Date Logic (Same as header: Last 3 Days)
  useEffect(() => {
    const today = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(today.getDate() - 3);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    setDateText(`${threeDaysAgo.toLocaleDateString('en-US', options)} - ${today.toLocaleDateString('en-US', options)}`);
  }, []);

  const isMounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  return (
    <section
      id="digital-learning-report-export"
      data-pdf-width="1024"
      className="relative overflow-hidden rounded-[2rem] border border-[#f2e8dc] bg-[#fffdf9] p-5 shadow-[0_20px_60px_rgba(148,96,27,0.08)] sm:p-6 md:p-8 lg:p-10"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.16),transparent_68%)]" />
      <div className="relative space-y-6 md:space-y-8">
        
        {/* UPDATED HEADER: Dynamic Date aur Naya Title */}
        <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#ea580c]">SCHOOL IMPACT ANALYTICS</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0a192f] md:text-4xl">
              DIGITAL LEARNING UPKEEP REPORT
            </h2>
            <p className="mt-2 text-base font-semibold text-slate-500">
              Powering Uninterrupted Learning with Solar
            </p>
          </div>
          <div className="rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3 text-sm font-bold text-[#9a3412]">
            Report Period: {dateText}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-6">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-[1.5rem] border border-slate-200 bg-white px-4 py-4 shadow-[0_10px_28px_rgba(15,23,42,0.04)]"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{card.label}</p>
              <p className="mt-3 text-2xl font-black tracking-tight text-[#0a192f]">{card.value}</p>
              <p className={`mt-2 text-xs font-bold ${card.change.startsWith('-') ? 'text-[#ea580c]' : 'text-emerald-600'}`}>
                {card.change}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
          <ReportCard title="Learning Continuity Impact" className="xl:col-span-6">
            <p className="text-sm leading-6 text-slate-600">
              Solar + battery backup has significantly reduced power disruptions and improved digital learning continuity.
            </p>
            <div className="mt-5 rounded-[1.5rem] bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-bold text-[#0a192f]">41% increase in digital learning hours after solar installation.</p>
                <span className="text-xs font-black uppercase tracking-[0.16em] text-[#ea580c]">Visualized</span>
              </div>
              <div className="w-full h-[256px] min-h-[256px] relative">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} initialDimension={chartInitialDimension}>
                    <BarChart data={continuityData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} interval={0} />
                      <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
                      <Tooltip formatter={(value) => [`${value ?? 0} h`, 'Learning Hours']} />
                      <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                        {continuityData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full rounded-[1.25rem] bg-white" />
                )}
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-white p-3 text-sm font-bold text-slate-600">Before Solar (2023) - 1,305 h</div>
                <div className="rounded-2xl bg-white p-3 text-sm font-bold text-slate-600">After Solar (2024-25) - 400 h</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              Smart classrooms, labs, Wi-Fi and digital boards remained operational even during outages. Students experienced fewer class interruptions and better engagement.
            </p>
          </ReportCard>

          <ReportCard title="Power Reliability Improvement" className="xl:col-span-6">
            <p className="text-sm leading-6 text-slate-600">
              Solar backup ensures reliable power for all critical digital learning infrastructure.
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-[240px_1fr] md:items-center">
              <div className="w-full h-[224px] min-h-[224px] relative">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} initialDimension={chartInitialDimension}>
                    <PieChart>
                      <Pie
                        data={uptimeData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={58}
                        outerRadius={88}
                        paddingAngle={3}
                      >
                        {uptimeData.map((entry) => (
                          <Cell key={entry.name} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value ?? 0}%`, 'Share']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full rounded-full bg-slate-100" />
                )}
              </div>
              <div className="space-y-3">
                {uptimeData.map((item) => (
                  <div key={item.name} className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.fill }} />
                      <p className="text-sm font-bold text-slate-600">{item.name}</p>
                    </div>
                    <p className="text-base font-black text-[#0a192f]">{item.value}%</p>
                  </div>
                ))}
                <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 px-4 py-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Key Insight</p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-emerald-900">
                    Hybrid solar system with battery backup ensured near-zero disruption in digital learning.
                  </p>
                </div>
              </div>
            </div>
          </ReportCard>

          <ReportCard title="Financial & Environmental Impact" className="xl:col-span-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="rounded-[1.5rem] bg-orange-50 p-4">
                <IndianRupee className="text-[#ea580c]" size={22} />
                <p className="mt-3 text-2xl font-black text-[#0a192f]">₹2,48,650</p>
                <p className="text-sm font-semibold text-slate-600">Total Electricity Cost Savings</p>
              </div>
              <div className="rounded-[1.5rem] bg-slate-50 p-4">
                <LineChart className="text-slate-700" size={22} />
                <p className="mt-3 text-2xl font-black text-[#0a192f]">22%</p>
                <p className="text-sm font-semibold text-slate-600">Reduction in Energy Expenses</p>
              </div>
              <div className="rounded-[1.5rem] bg-emerald-50 p-4">
                <Leaf className="text-emerald-600" size={22} />
                <p className="mt-3 text-2xl font-black text-[#0a192f]">12.6 Tonnes</p>
                <p className="text-sm font-semibold text-slate-600">CO2 Emissions Avoided (Per Year)</p>
              </div>
              <div className="rounded-[1.5rem] bg-blue-50 p-4">
                <Trees className="text-blue-600" size={22} />
                <p className="mt-3 text-2xl font-black text-[#0a192f]">95</p>
                <p className="text-sm font-semibold text-slate-600">Equivalent Trees Planted</p>
              </div>
            </div>
          </ReportCard>

          <ReportCard title="System Performance Overview" className="xl:col-span-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-2xl font-black text-[#0a192f]">45.6 kWp</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">Solar Capacity</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-2xl font-black text-[#0a192f]">120 kWh</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">Battery Capacity</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-2xl font-black text-[#0a192f]">98.3%</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">System Efficiency</p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-2xl font-black text-[#0a192f]">24/7</p>
                <p className="mt-1 text-sm font-semibold text-slate-600">Monitoring</p>
              </div>
            </div>
            <div className="mt-5 rounded-[1.5rem] bg-slate-50 p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-[#0a192f]">Solar Generation vs Consumption (kWh)</p>
              </div>
              <div className="mt-4 w-full h-[208px] min-h-[208px] relative">
                {isMounted ? (
                  <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1} initialDimension={chartInitialDimension}>
                    <RechartsLineChart data={performanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" tick={{ fill: '#475569', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#475569', fontSize: 11 }} />
                      <Tooltip />
                      <Line type="monotone" dataKey="generation" stroke="#f59e0b" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="consumption" stroke="#0f172a" strokeWidth={3} dot={false} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full rounded-[1.25rem] bg-white" />
                )}
              </div>
            </div>
          </ReportCard>

          <ReportCard title="Solar Impact on Digital Learning Infrastructure" className="xl:col-span-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {infrastructureItems.map((item) => (
                <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                  <item.icon className="text-[#ea580c]" size={20} />
                  <p className="text-sm font-bold text-slate-700">{item.label}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-[1.5rem] border border-orange-200 bg-orange-50 px-4 py-4">
              <p className="text-sm font-semibold leading-6 text-[#7c2d12]">
                Consistent power availability keeps your digital infrastructure always up and running.
              </p>
            </div>
          </ReportCard>

          <ReportCard title="AI-Powered Recommendations" className="xl:col-span-12">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              {recommendations.map((item) => (
                <div key={item.title} className="rounded-[1.5rem] border border-slate-200 bg-slate-50 p-4">
                  <item.icon className="text-[#ea580c]" size={22} />
                  <p className="mt-3 text-base font-black text-[#0a192f]">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-600">{item.text}</p>
                  <div className="mt-4 rounded-xl bg-white px-3 py-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Action</p>
                    <p className="mt-1 text-sm font-bold text-slate-700">{item.action}</p>
                  </div>
                </div>
              ))}
            </div>
          </ReportCard>
        </div>
      </div>
    </section>
  );
}