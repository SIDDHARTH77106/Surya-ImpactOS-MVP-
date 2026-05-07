"use client";

import React, { useState } from 'react';
import { ArrowDownToLine, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DASHBOARD_DATA } from '../../constants/mockData';
// 🚀 FIX: Import toJpeg instead of toPng
import { toJpeg } from 'html-to-image'; 
import jsPDF from 'jspdf';

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

    const targetId = reportTargetForTitle(title);
    let element = document.getElementById(targetId);

    if (!element) {
      if (title.includes('School')) element = document.getElementById('school-report-export') || document.getElementById('digital-learning-report-export');
      else element = document.getElementById('dashboard-content');
    }

    if (!element) {
      alert(`⚠️ ${title} ka data dashboard par nahi mila!`);
      setDownloading(null);
      return;
    }

    try {
      const style = document.createElement('style');
      style.innerHTML = `
        #${element.id}, #${element.id} * {
          animation: none !important;
          transition: none !important;
          opacity: 1 !important;
          transform: none !important;
        }
      `;
      document.head.appendChild(style);

      await new Promise((resolve) => setTimeout(resolve, 500));

      // 🚀 SIZE REDUCTION: Use JPEG with compression quality
      const dataUrl = await toJpeg(element, {
        cacheBust: true,
        backgroundColor: '#fcfdfa',
        pixelRatio: 1.5, // Dropped slightly from 2.0 to save MBs, still very sharp
        quality: 0.8, // Compress image by 20%
        style: {
          margin: '0', 
          padding: '20px' 
        }
      });

      document.head.removeChild(style);

      // 🚀 SIZE REDUCTION: Turn on PDF compression
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true, // Forces PDF size compression
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const headerHeight = 25;
      pdf.setFillColor(252, 250, 248);
      pdf.rect(0, 0, pdfWidth, headerHeight, 'F');

      pdf.setTextColor(6, 78, 59);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(title.toUpperCase(), pdfWidth / 2, 16, { align: 'center' });

      pdf.setDrawColor(209, 250, 229);
      pdf.setLineWidth(0.5);
      pdf.line(10, 22, pdfWidth - 10, 22);

      const imgProps = pdf.getImageProperties(dataUrl);
      const margin = 10;
      
      const availableWidth = pdfWidth - (margin * 2);
      const availableHeight = pdfHeight - headerHeight - margin;

      let finalImgWidth = availableWidth;
      let finalImgHeight = (imgProps.height * availableWidth) / imgProps.width;

      if (finalImgHeight > availableHeight) {
        finalImgHeight = availableHeight;
        finalImgWidth = (imgProps.width * availableHeight) / imgProps.height;
      }

      const xOffset = (pdfWidth - finalImgWidth) / 2;

      // 🚀 FIX: Insert as JPEG instead of PNG and use "FAST" compression alias
      pdf.addImage(dataUrl, 'JPEG', xOffset, headerHeight, finalImgWidth, finalImgHeight, undefined, 'FAST');
      
      pdf.save(`${filenameForTitle(title)}.pdf`);

    } catch (error) {
      console.error('PDF Generation Failed:', error);
      alert('PDF generation failed. Please check the console.');
    } finally {
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
                  <p className="text-base md:text-lg font-black text-[#0a192f] group-hover:text-[#ea580c]">
                    {isDownloading ? 'Capturing Report...' : report.title}
                  </p>
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