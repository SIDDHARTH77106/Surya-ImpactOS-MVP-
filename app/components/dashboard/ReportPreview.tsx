"use client";

import React, { useMemo, useState } from "react";
import { ArrowDownToLine, FileText, Loader2, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import jsPDF from "jspdf";
import { DASHBOARD_DATA, SCHOOL_DATA, SCHOOL_OPTIONS, SchoolFilter } from "../../constants/mockData";

type InstitutionSchool = Exclude<SchoolFilter, "all">;

type ReportItem = {
  title: string;
  date: string;
  type: string;
  size: string;
};

type EnvironmentStat = {
  label: string;
  value: string;
  status: string;
};

type ReportSchoolProfile = {
  institution: string;
  location: string;
  system: string;
  activeHours: number;
  dailyAverageMins: number;
  uptime: string;
  batteryHealth: number;
  inverterLoad: number;
  energyGenerated: number;
  co2Offset: number;
  environment: EnvironmentStat[];
  alerts: string[];
};

type ReportPreviewProps = {
  selectedSchool?: InstitutionSchool | "all";
};

const schoolOptions = SCHOOL_OPTIONS.filter((option): option is { key: InstitutionSchool; label: string } => option.key !== "all");

const schoolProfiles: Record<InstitutionSchool, ReportSchoolProfile> = {
  government: {
    institution: "Govt. Primary School Surana",
    location: "Surana, Haryana",
    system: "5kW Hybrid Solar Lab",
    activeHours: 400,
    dailyAverageMins: 120,
    uptime: "99.4%",
    batteryHealth: 91,
    inverterLoad: 68,
    energyGenerated: 184.62,
    co2Offset: 5.84,
    environment: [
      { label: "Temperature", value: "31.8 C", status: "Normal" },
      { label: "Humidity", value: "46%", status: "Stable" },
      { label: "AQI", value: "42", status: "Good" },
    ],
    alerts: [
      "Panel cleaning due on east-facing array after dust accumulation.",
      "Inverter fan inspection recommended during next service window.",
    ],
  },
  jeevanDhara: {
    institution: "Jeevan Dhara Welfare Society",
    location: "Ghaziabad, Uttar Pradesh",
    system: "6kW Hybrid Solar Lab",
    activeHours: 380,
    dailyAverageMins: 90,
    uptime: "99.0%",
    batteryHealth: 87,
    inverterLoad: 74,
    energyGenerated: 216.48,
    co2Offset: 6.76,
    environment: [
      { label: "Temperature", value: "32.6 C", status: "Normal" },
      { label: "Humidity", value: "51%", status: "Stable" },
      { label: "AQI", value: "58", status: "Moderate" },
    ],
    alerts: [
      "Battery bank health review required for cell balancing.",
      "Panel cleaning due after reduced morning generation trend.",
      "Inverter DC input terminal torque check scheduled.",
    ],
  },
};

function filenameForTitle(title: string, schoolName: string) {
  const rawName = `${title}_${schoolName}`;
  return rawName.replace(/[^a-z0-9]+/gi, "_").replace(/^_+|_+$/g, "") || "Surya_ImpactOS_Report";
}

async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const response = await fetch("/sangam%20logo.png");
    if (!response.ok) return null;
    const blob = await response.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function addReportPdf(report: ReportItem, schoolKey: InstitutionSchool, logoDataUrl: string | null) {
  const profile = schoolProfiles[schoolKey];
  const schoolData = SCHOOL_DATA[schoolKey];
  const institution = DASHBOARD_DATA.institutions.find((item) => item.key === schoolKey);
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const marginX = 14;
  const contentWidth = pageWidth - marginX * 2;
  const footerTop = pageHeight - 18;
  let y = 42;

  // Design System Functions
  const drawHeader = () => {
    pdf.setFillColor(252, 250, 248);
    pdf.rect(0, 0, pageWidth, pageHeight, "F");

    pdf.setFillColor(6, 78, 59); // Emerald 900
    pdf.rect(0, 0, pageWidth, 30, "F");

    if (logoDataUrl) {
      pdf.addImage(logoDataUrl, "PNG", marginX, 7, 18, 16, undefined, "FAST");
    }

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(16);
    pdf.text("Surya ImpactOS", logoDataUrl ? marginX + 24 : marginX, 13);
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(8);
    pdf.text("Powering Learning. Sustaining Futures.", logoDataUrl ? marginX + 24 : marginX, 19);
    
    pdf.setFont("helvetica", "bold");
    pdf.text(report.title.toUpperCase(), pageWidth - marginX, 13, { align: "right" });
    pdf.setFont("helvetica", "normal");
    pdf.text(`Date: ${report.date}`, pageWidth - marginX, 19, { align: "right" });
  };

  const addPage = () => {
    pdf.addPage();
    drawHeader();
    y = 42;
  };

  const ensureSpace = (height: number) => {
    if (y + height > footerTop) addPage();
  };

  const sectionTitle = (title: string) => {
    ensureSpace(12);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.setTextColor(6, 78, 59);
    pdf.text(title.toUpperCase(), marginX, y);
    pdf.setDrawColor(16, 185, 129); // Emerald 500
    pdf.setLineWidth(0.5);
    pdf.line(marginX, y + 2, marginX + contentWidth, y + 2);
    y += 9;
  };

  const labelValue = (label: string, value: string, x: number, top: number, width: number) => {
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(100, 116, 139);
    pdf.text(label.toUpperCase(), x + 4, top + 7);
    pdf.setFontSize(10);
    pdf.setTextColor(10, 25, 47);
    pdf.text(value, x + 4, top + 14, { maxWidth: width - 8 });
  };

  const drawSummary = () => {
    const boxHeight = 22;
    ensureSpace(boxHeight + 4);
    pdf.setFillColor(255, 255, 255);
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(marginX, y, contentWidth, boxHeight, 3, 3, "FD"); // Rounded Corners

    const colWidth = contentWidth / 3;
    labelValue("Institution", profile.institution, marginX, y, colWidth);
    labelValue("Location", profile.location, marginX + colWidth, y, colWidth);
    labelValue("System", profile.system, marginX + colWidth * 2, y, colWidth);

    pdf.setDrawColor(226, 232, 240);
    pdf.line(marginX + colWidth, y + 4, marginX + colWidth, y + boxHeight - 4);
    pdf.line(marginX + colWidth * 2, y + 4, marginX + colWidth * 2, y + boxHeight - 4);
    y += boxHeight + 8;
  };

  const drawKpis = () => {
    const cardGap = 5;
    const cardHeight = 22;
    const columns = 3;
    const cardWidth = (contentWidth - cardGap * 2) / 3;

    let startY = y;
    ensureSpace(cardHeight + 4);

    schoolData.kpis.forEach((kpi, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);

      const x = marginX + col * (cardWidth + cardGap);
      const cardY = startY + row * (cardHeight + cardGap);

      if (col === 0 && row > 0) ensureSpace(cardHeight + 4);

      pdf.setFillColor(248, 250, 252);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(x, cardY, cardWidth, cardHeight, 3, 3, "FD");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(7);
      pdf.setTextColor(100, 116, 139);
      pdf.text(kpi.label.toUpperCase(), x + 4, cardY + 7, { maxWidth: cardWidth - 8 });
      
      pdf.setFontSize(13);
      pdf.setTextColor(6, 78, 59);
      pdf.text(`${kpi.value.toLocaleString("en-IN")}${kpi.suffix}`, x + 4, cardY + 16);
    });

    const totalRows = Math.ceil(schoolData.kpis.length / columns);
    y = startY + totalRows * (cardHeight + cardGap) + 4;
  };

  const drawTable = (title: string, headers: string[], rows: string[][]) => {
    sectionTitle(title);
    const rowHeight = 10;
    const colWidth = contentWidth / headers.length;

    const drawTableHeader = () => {
      ensureSpace(rowHeight * 2);
      pdf.setFillColor(236, 253, 245); // Emerald 50
      pdf.setDrawColor(167, 243, 208);
      pdf.roundedRect(marginX, y, contentWidth, rowHeight, 2, 2, "FD");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(6, 78, 59);
      headers.forEach((header, index) => {
        pdf.text(header.toUpperCase(), marginX + index * colWidth + 4, y + 6.5);
      });
      y += rowHeight + 1;
    };

    drawTableHeader();

    rows.forEach((row) => {
      ensureSpace(rowHeight);
      if (y === 42) drawTableHeader();

      pdf.setFillColor(255, 255, 255);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(marginX, y, contentWidth, rowHeight, 2, 2, "FD");
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(51, 65, 85);
      
      row.forEach((cell, index) => {
        // Make the first column slightly darker/bolder
        if(index === 0) pdf.setTextColor(15, 23, 42); 
        else pdf.setTextColor(100, 116, 139);
        
        pdf.text(cell, marginX + index * colWidth + 4, y + 6.5, { maxWidth: colWidth - 6 });
      });
      y += rowHeight + 1;
    });
    y += 6;
  };

  const drawAlertCards = () => {
    sectionTitle("Hardware Maintenance & Alerts");
    profile.alerts.forEach((alert, index) => {
      const lines = pdf.splitTextToSize(alert, contentWidth - 16) as string[];
      const height = Math.max(16, lines.length * 5 + 8);
      ensureSpace(height + 4);

      pdf.setFillColor(255, 251, 235); // Amber 50
      pdf.setDrawColor(253, 230, 138); // Amber 200
      pdf.roundedRect(marginX, y, contentWidth, height, 3, 3, "FD");
      
      // Orange Accent Line
      pdf.setFillColor(245, 158, 11);
      pdf.roundedRect(marginX, y, 3, height, 2, 2, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(8);
      pdf.setTextColor(180, 83, 9);
      pdf.text(`Alert ${index + 1}`, marginX + 6, y + 6);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(69, 26, 3);
      pdf.text(lines, marginX + 6, y + 12);
      y += height + 4;
    });
  };

  const drawNarrative = () => {
    sectionTitle("Infrastructure Scope & Notes");
    const notes = [
      `Infrastructure scope: ${institution?.details ?? "Solar-enabled classroom infrastructure"}.`,
      `Daily learning outcome: ${institution?.impact ?? "Regular digital learning enabled by clean power"}.`,
      "No critical failures recorded during academic operating hours."
    ];

    notes.forEach((note) => {
      const lines = pdf.splitTextToSize(`• ${note}`, contentWidth - 4) as string[];
      const height = lines.length * 5 + 2;
      ensureSpace(height);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(71, 85, 105);
      pdf.text(lines, marginX, y);
      y += height;
    });
    y += 5;
  };

  // ==================== PDF GENERATION FLOW ==================== //

  drawHeader();

  pdf.setTextColor(10, 25, 47);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text(report.title, marginX, y);
  y += 8;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(100, 116, 139);
  pdf.text(`Detailed analytics export generated for ${profile.institution}`, marginX, y);
  y += 12;

  drawSummary();

  const isESG = report.title.toLowerCase().includes("esg");
  const isSchool = report.title.toLowerCase().includes("school");
  const isCSR = report.title.toLowerCase().includes("csr");

  // 🚀 DYNAMIC CONTENT ROUTING (Yehi feature missing tha!)
  if (isESG) {
    drawTable("Energy Performance Tracking", ["Metric", "Value", "Status"], [
      ["Energy Generated", `${profile.energyGenerated.toFixed(2)} kWh`, "Optimal"],
      ["CO2 Offset", `${profile.co2Offset.toFixed(2)} tons`, "Tracked"],
      ["Battery Health", `${profile.batteryHealth}%`, "Monitored"],
      ["Inverter Load", `${profile.inverterLoad}%`, "Within limits"],
    ]);
    drawTable("Live Environment Sensors", ["Sensor Type", "Current Reading", "System Status"], 
      profile.environment.map((item) => [item.label, item.value, item.status])
    );
    drawAlertCards();
  } 
  else if (isSchool) {
    sectionTitle("Institution Key Metrics");
    drawKpis();
    drawTable("Digital Learning Continuity", ["Metric", "Value", "Status"], [
      ["Learning Hours Protected", `${profile.activeHours} hrs`, "Protected"],
      ["Daily Digital Learning", `${profile.dailyAverageMins} mins`, "Active"],
      ["System Uptime", profile.uptime, "Zero Disruptions"],
    ]);
    drawNarrative();
  } 
  else if (isCSR) {
    sectionTitle("Impact & Scale Metrics");
    drawKpis();
    drawTable("Financial & Expansion ROI", ["Impact Area", "Current Value", "Notes"], [
      ["Electricity Cost Savings", "₹ 2,48,650", "Annual estimation"],
      ["Equivalent Trees Planted", "95 Trees", "Based on offset"],
      ["Future Target Reach", "100 Schools", "Phase 2 Pipeline"],
      ["Total Students Impacted", "1,24,350+", "Active beneficiaries"]
    ]);
  }

  // Footer Setup
  const totalPages = pdf.getNumberOfPages();
  for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
    pdf.setPage(pageNumber);
    pdf.setDrawColor(226, 232, 240);
    pdf.setLineWidth(0.5);
    pdf.line(marginX, footerTop, pageWidth - marginX, footerTop);
    
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(8);
    pdf.setTextColor(148, 163, 184);
    pdf.text("Surya ImpactOS Ecosystem", marginX, pageHeight - 10);
    
    pdf.setFont("helvetica", "normal");
    pdf.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - marginX, pageHeight - 10, { align: "right" });
  }

  pdf.save(`${filenameForTitle(report.title, profile.institution)}.pdf`);
}

export default function ReportPreview({ selectedSchool = "government" }: ReportPreviewProps) {
  const reports = useMemo<ReportItem[]>(
    () =>
      DASHBOARD_DATA.reports || [
        { title: "Monthly ESG Report", date: "May 2025", type: "Full Analytics", size: "2.4 MB" },
        { title: "School Impact Report", date: "Q1 2025", type: "Digital Learning", size: "1.8 MB" },
        { title: "CSR Summary Report", date: "Annual 2024", type: "Financial Impact", size: "3.1 MB" },
      ],
    [],
  );

  const [reportSchool, setReportSchool] = useState<InstitutionSchool>(
    selectedSchool === "all" ? "government" : selectedSchool
  );
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownloadClick = async (report: ReportItem) => {
    setDownloading(report.title);

    try {
      const logoDataUrl = await loadLogoDataUrl();
      addReportPdf(report, reportSchool, logoDataUrl);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("PDF generation failed. Check console for details.");
    } finally {
      setDownloading(null);
    }
  };

  const selectedLabel = schoolOptions.find((option) => option.key === reportSchool)?.label ?? "Selected Institution";

  return (
    <motion.section
      id="report-preview-section"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-5 md:space-y-8 print:hidden"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-[#0a192f] md:text-3xl">Report Repository</h2>
          <p className="mt-1 text-sm font-semibold text-slate-500">
            Downloads will include only {selectedLabel}.
          </p>
        </div>

        <label className="flex w-full items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3 text-sm font-extrabold text-[#064e3b] shadow-sm md:w-auto">
          <MapPin size={18} className="shrink-0 text-emerald-600" strokeWidth={2.5} />
          <select
            value={reportSchool}
            onChange={(event) => setReportSchool(event.target.value as InstitutionSchool)}
            className="w-full bg-transparent outline-none md:min-w-72"
            aria-label="Select school for report export"
          >
            {schoolOptions.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-3 md:space-y-5">
        {reports.map((report, index) => {
          const isDownloading = downloading === report.title;

          return (
            <motion.button
              key={report.title}
              type="button"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              whileHover={!isDownloading ? { scale: 1.02, x: 8 } : {}}
              onClick={() => !isDownloading && handleDownloadClick(report)}
              disabled={isDownloading}
              className={`group relative flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-[0_4px_20px_rgba(0,0,0,0.03)] transition-all duration-300 sm:p-5 md:rounded-[2rem] md:p-6 ${
                isDownloading
                  ? "cursor-wait opacity-75"
                  : "cursor-pointer hover:border-[#ea580c]/30 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)]"
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                <div
                  className={`relative rounded-xl border p-3 transition-colors duration-300 md:rounded-2xl md:p-4 ${
                    isDownloading
                      ? "bg-[#ea580c] text-white"
                      : "bg-orange-50 text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white"
                  }`}
                >
                  {isDownloading ? <Loader2 size={26} className="animate-spin" /> : <FileText size={26} />}
                </div>
                <div>
                  <p className="text-base font-black text-[#0a192f] group-hover:text-[#ea580c] md:text-lg">
                    {isDownloading ? "Generating PDF..." : report.title}
                  </p>
                  <p className="text-[10px] font-bold uppercase text-slate-400">
                    {report.date} &bull; {report.type}
                  </p>
                </div>
              </div>
              <div
                className={`rounded-full p-2 ${
                  isDownloading
                    ? "bg-orange-50 text-[#ea580c]"
                    : "bg-slate-50 text-slate-300 group-hover:bg-orange-50 group-hover:text-[#ea580c]"
                }`}
              >
                {isDownloading ? <Loader2 size={22} className="animate-spin" /> : <ArrowDownToLine size={22} />}
              </div>
            </motion.button>
          );
        })}
      </div>
    </motion.section>
  );
}