export type SchoolFilter = 'all' | 'government' | 'jeevanDhara';

export const SCHOOL_OPTIONS: { key: SchoolFilter; label: string }[] = [
  { key: 'all', label: 'All Institutions' },
  { key: 'government', label: 'Govt. Primary School Surana' },
  { key: 'jeevanDhara', label: 'Jeevan Dhara Welfare Society' },
];

export const SCHOOL_DATA = {
  all: {
    label: 'All Institutions',
    kpis: [
      { label: "Total Institutions", value: 2, suffix: "", icon: "School" },
      { label: "Total Capacity", value: 11, suffix: " kW", icon: "Zap" },
      { label: "Students Impacted", value: 124350, suffix: "+", icon: "Users" },
      { label: "CO2 Avoided", value: 12.6, suffix: " Tons", icon: "Leaf" },
      { label: "Avg Uptime", value: 99.2, suffix: "%", icon: "Activity" },
    ],
    chartData: [
      { name: 'May', gen: 400, cons: 340 }, { name: 'Jun', gen: 450, cons: 380 },
      { name: 'Jul', gen: 420, cons: 400 }, { name: 'Aug', gen: 500, cons: 420 },
    ],
  },
  government: {
    label: 'Govt. Primary School Surana',
    kpis: [
      { label: "Total Institutions", value: 1, suffix: "", icon: "School" },
      { label: "Total Capacity", value: 5, suffix: " kW", icon: "Zap" },
      { label: "Students Impacted", value: 56523, suffix: "+", icon: "Users" },
      { label: "CO2 Avoided", value: 5.8, suffix: " Tons", icon: "Leaf" },
      { label: "Avg Uptime", value: 99.4, suffix: "%", icon: "Activity" },
    ],
    chartData: [
      { name: 'May', gen: 180, cons: 152 }, { name: 'Jun', gen: 205, cons: 170 },
      { name: 'Jul', gen: 190, cons: 178 }, { name: 'Aug', gen: 225, cons: 188 },
    ],
  },
  jeevanDhara: {
    label: 'Jeevan Dhara Welfare Society',
    kpis: [
      { label: "Total Institutions", value: 1, suffix: "", icon: "School" },
      { label: "Total Capacity", value: 6, suffix: " kW", icon: "Zap" },
      { label: "Students Impacted", value: 67827, suffix: "+", icon: "Users" },
      { label: "CO2 Avoided", value: 6.8, suffix: " Tons", icon: "Leaf" },
      { label: "Avg Uptime", value: 99.0, suffix: "%", icon: "Activity" },
    ],
    chartData: [
      { name: 'May', gen: 220, cons: 188 }, { name: 'Jun', gen: 245, cons: 210 },
      { name: 'Jul', gen: 230, cons: 222 }, { name: 'Aug', gen: 275, cons: 232 },
    ],
  },
};

export const DASHBOARD_DATA = {
  header: {
    title: "Surya ImpactOS",
    tagline: "Powering Learning. Sustaining Futures.",
  },
  kpis: SCHOOL_DATA.all.kpis,
  institutions: [
    {
      key: "government",
      name: "Govt. Primary School Surana",
      setup: "5kW Hybrid", location: "Haryana",
      details: "2 classrooms on solar", impact: "2 hrs regular digital learning", status: "Active"
    },
    {
      key: "jeevanDhara",
      name: "Jeevan Dhara Welfare Society",
      setup: "6kW Hybrid", location: "Ghaziabad",
      details: "2 classrooms on solar", impact: "2 hrs regular digital learning", status: "Active"
    }
  ],
  reports: [
    { title: "Monthly ESG Report", date: "May 2025", type: "Full Analytics", size: "2.4 MB" },
    { title: "School Impact Report", date: "Q1 2025", type: "Digital Learning", size: "1.8 MB" },
    { title: "CSR Summary Report", date: "Annual 2024", type: "Financial Impact", size: "3.1 MB" },
  ],
  chartData: SCHOOL_DATA.all.chartData
};