export const DASHBOARD_DATA = {
  header: {
    title: "Surya ImpactOS",
    tagline: "Powering Learning. Sustaining Futures.",
  },
  kpis: [
    { label: "Total Institutions", value: 2, suffix: "", icon: "School" },
    { label: "Total Capacity", value: 11, suffix: " kW", icon: "Zap" },
    { label: "Students Impacted", value: 124350, suffix: "+", icon: "Users" },
    { label: "CO2 Avoided", value: 12.6, suffix: " Tons", icon: "Leaf" },
    { label: "Avg Uptime", value: 99.2, suffix: "%", icon: "Activity" },
  ],
  institutions: [
    {
      name: "Govt. Primary School Surana",
      setup: "5kW Hybrid", location: "Haryana",
      details: "2 classrooms on solar", impact: "2 hrs regular digital learning", status: "Active"
    },
    {
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
  chartData: [
    { name: 'May', gen: 400, cons: 340 }, { name: 'Jun', gen: 450, cons: 380 },
    { name: 'Jul', gen: 420, cons: 400 }, { name: 'Aug', gen: 500, cons: 420 },
  ]
};
