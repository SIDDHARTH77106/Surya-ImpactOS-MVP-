import { PROJECTS } from "./solarSchedule";

export type SchoolFilter = 'all' | 'government' | 'jeevanDhara';

export const SCHOOL_OPTIONS: { key: SchoolFilter; label: string }[] = [
  { key: 'all', label: 'All Institutions' },
  { key: 'government', label: PROJECTS.government.name },
  { key: 'jeevanDhara', label: PROJECTS.jeevanDhara.name },
];

export const SCHOOL_DATA = {
  all: {
    label: 'All Institutions',
    kpis: [
      { label: "Total Institutions", value: 2, suffix: "", icon: "School" },
      { label: "Total Capacity", value: PROJECTS.government.capacityKw + PROJECTS.jeevanDhara.capacityKw, suffix: " kW", icon: "Zap" },
      { label: "Students Impacted", value: 680, suffix: "+", icon: "Users" },
      { label: "Historic CO2 Avoided", value: 12.6, suffix: " Tons", icon: "Leaf" },
      { label: "Avg Uptime", value: 99.2, suffix: "%", icon: "Activity" },
    ],
  },
  government: {
    label: 'Govt. Primary School Surana',
    kpis: [
      { label: "Total Institutions", value: 1, suffix: "", icon: "School" },
      { label: "Total Capacity", value: PROJECTS.government.capacityKw, suffix: " kW", icon: "Zap" },
      { label: "Students Impacted", value: 296, suffix: "+", icon: "Users" },
      { label: "Historic CO2 Avoided", value: 5.8, suffix: " Tons", icon: "Leaf" },
      { label: "Avg Uptime", value: 99.4, suffix: "%", icon: "Activity" },
    ],
  },
  jeevanDhara: {
    label: 'Jeevan Dhara Welfare Society',
    kpis: [
      { label: "Total Institutions", value: 1, suffix: "", icon: "School" },
      { label: "Total Capacity", value: PROJECTS.jeevanDhara.capacityKw, suffix: " kW", icon: "Zap" },
      { label: "Students Impacted", value: 384, suffix: "+", icon: "Users" },
      { label: "Historic CO2 Avoided", value: 6.8, suffix: " Tons", icon: "Leaf" },
      { label: "Avg Uptime", value: 99.0, suffix: "%", icon: "Activity" },
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
      name: PROJECTS.government.name,
      setup: `${PROJECTS.government.capacityKw}kW Hybrid`, location: "Surana, Haryana",
      details: "2 classrooms on solar", impact: "2 hrs regular digital learning", status: "Active"
    },
    {
      key: "jeevanDhara",
      name: PROJECTS.jeevanDhara.name,
      setup: `${PROJECTS.jeevanDhara.capacityKw}kW Hybrid`, location: PROJECTS.jeevanDhara.location,
      details: "2 classrooms on solar", impact: "2 hrs regular digital learning", status: "Active"
    }
  ],
  reports: [
    { title: "Monthly ESG Report", date: "May 2025", type: "Full Analytics", size: "2.4 MB" },
    { title: "School Impact Report", date: "Q1 2025", type: "Digital Learning", size: "1.8 MB" },
    { title: "CSR Summary Report", date: "Annual 2024", type: "Financial Impact", size: "3.1 MB" },
  ],
};
