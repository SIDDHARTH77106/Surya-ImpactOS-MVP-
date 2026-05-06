"use client";

import React, { useState } from 'react';
import { ArrowDownToLine, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DASHBOARD_DATA } from '../../constants/mockData';

function reportTargetForTitle(title: string) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('esg')) return 'esg-report-export';
  if (lowerTitle.includes('school')) return 'school-report-export';
  if (lowerTitle.includes('csr')) return 'csr-report-export';
  return 'dashboard-content';
}

function filenameForTitle(title: string) {
  return title.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'Surya_ImpactOS_Report';
}

export default function ReportPreview() {
  const reports = DASHBOARD_DATA.reports || [
    { title: 'Monthly ESG Report', date: 'May 2025', type: 'Full Analytics', size: '2.4 MB' },
    { title: 'School Impact Report', date: 'Q1 2025', type: 'Digital Learning', size: '1.8 MB' },
    { title: 'CSR Summary Report', date: 'Annual 2024', type: 'Financial Impact', size: '3.1 MB' },
  ];

  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownloadClick = async (title: string) => {
    setDownloading(title);

    // REQUIREMENT 1: Accurate Data Routing - Route to specific container based on report name
    const targetId = reportTargetForTitle(title);
    const element = document.getElementById(targetId);

    if (!element) {
      alert(`⚠️ ${title} ka data nahi mila!\n\nKripya apne dashboard code mein us section ke bahaar id="${targetId}" lagayein.`);
      setDownloading(null);
      return;
    }

    try {
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentWindow?.document;
      if (!iframeDoc) return;

      const styles = document.querySelectorAll('style, link[rel="stylesheet"]');
      let stylesHtml = '';
      styles.forEach((node) => { stylesHtml += node.outerHTML; });

      const logoUrl = window.location.origin + '/sangam logo.png';
      
      const clonedElement = element.cloneNode(true) as HTMLElement;
      
      // REQUIREMENT 2: Perfect Margins & Padding - Ensure no content pushed to second page
      clonedElement.style.setProperty('margin-top', '0', 'important');
      clonedElement.style.setProperty('padding-top', '0', 'important');
      clonedElement.style.setProperty('height', 'auto', 'important');
      clonedElement.style.setProperty('min-height', '0', 'important');

      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${filenameForTitle(title)}</title>
            ${stylesHtml}
            <style>
              /* ========================================
                 REQUIREMENT 2: PERFECT A4 FORMATTING
                 ======================================== */
              @page { 
                size: A4 portrait; 
                margin: 15mm !important; 
              }

              html, body {
                /* REQUIREMENT 3: Eco-Friendly Background Tint */
                background-color: #fcfdfa !important;
                margin: 0 !important;
                padding: 0 !important;
                height: auto !important;
                min-height: 0 !important;
                overflow: visible !important;
                font-family: sans-serif;
              }

              /* ========================================
                 REQUIREMENT 2: KILL BLANK PAGES
                 Remove height constraints & page breaks
                 ======================================== */
              * {
                page-break-inside: auto !important;
                break-inside: auto !important;
                page-break-before: auto !important;
                break-before: auto !important;
                perspective: none !important;
                transform-style: flat !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }

              /* REQUIREMENT 2: Strip Tailwind Full-Height Classes */
              .min-h-screen, .h-screen, .h-full { 
                min-height: 0 !important; 
                height: auto !important; 
              }

              /* REQUIREMENT 2: Main wrapper - allow natural flowing pages */
              #pdf-content-wrapper {
                margin-top: 0 !important;
                padding-top: 0 !important;
                display: block !important;
                height: auto !important;
                min-height: 0 !important;
                page-break-inside: auto !important;
              }

              /* REQUIREMENT 2: Apply page-break-inside: avoid only on inner cards/grid items */
              #pdf-content-wrapper [class*="card"],
              #pdf-content-wrapper [class*="grid"] > * {
                page-break-inside: avoid !important;
              }

              /* ========================================
                 REQUIREMENT 3: ECO-FRIENDLY THEME
                 Green aesthetics integration
                 ======================================== */
              .pdf-header {
                display: flex; 
                flex-direction: column; 
                align-items: center; 
                text-align: center;
                margin-bottom: 20px; 
                /* Change border to subtle green */
                border-bottom: 2px solid #d1fae5 !important;
                padding-bottom: 15px;
              }

              .pdf-header img {
                height: 65px; 
                width: auto; 
                margin-bottom: 10px;
                /* Logo remains straight and blends seamlessly */
                transform: rotate(180deg) !important; 
                mix-blend-mode: multiply !important; 
              }

              /* REQUIREMENT 3: H1 color changed to deep emerald green */
              .pdf-header h1 { 
                font-size: 22px; 
                color: #064e3b !important;
                font-weight: 800; 
                margin: 0; 
              }
            </style>
          </head>
          <body>
            <div class="pdf-header">
              <img src="${logoUrl}" alt="Logo" />
              <h1>${title}</h1>
            </div>
            <div id="pdf-content-wrapper">
              ${clonedElement.outerHTML}
            </div>
          </body>
        </html>
      `);
      iframeDoc.close();

      setTimeout(() => {
        if (iframe.contentWindow) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print(); 
        }
        setDownloading(null);
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
      }, 2000);

    } catch (error) {
      console.error('Print failed:', error);
      alert('Failed to generate PDF. Check console for details.');
      setDownloading(null);
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="space-y-5 md:space-y-8"
    >
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#0a192f] tracking-tight">
          Report Repository
        </h2>
      </div>

      <div className="space-y-3 md:space-y-5">
        {reports.map((report, i) => {
          const isDownloading = downloading === report.title;
          return (
            <motion.div
              key={report.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              whileHover={!isDownloading ? { scale: 1.02, x: 8 } : {}}
              onClick={() => !isDownloading && handleDownloadClick(report.title)}
              className={`group relative bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] p-4 sm:p-5 md:p-6 rounded-2xl md:rounded-[2rem] flex items-center justify-between transition-all duration-300 ${isDownloading ? 'opacity-75 cursor-wait' : 'cursor-pointer hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-[#ea580c]/30'}`}
            >
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
                <div className="relative">
                  <div className={`relative p-3 md:p-4 rounded-xl md:rounded-2xl border transition-colors duration-300 ${isDownloading ? 'bg-[#ea580c] text-white' : 'bg-orange-50 text-[#ea580c] group-hover:bg-[#ea580c] group-hover:text-white'}`}>
                    {isDownloading ? <Loader2 size={26} className="animate-spin" /> : <FileText size={26} />}
                  </div>
                </div>
                <div>
                  <p className="text-base md:text-lg font-black text-[#0a192f] group-hover:text-[#ea580c]">{isDownloading ? 'Preparing PDF...' : report.title}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{report.date} • {report.type}</p>
                </div>
              </div>
              <div className={`p-2 rounded-full ${isDownloading ? 'bg-orange-50 text-[#ea580c]' : 'bg-slate-50 text-slate-300 group-hover:bg-orange-50 group-hover:text-[#ea580c]'}`}>
                {isDownloading ? <Loader2 size={22} className="animate-spin" /> : <ArrowDownToLine size={22} />}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}