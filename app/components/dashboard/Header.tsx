"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar, Download, Loader2 } from 'lucide-react';
import { DASHBOARD_DATA } from '../../constants/mockData';
import { motion } from 'framer-motion';
// 🚀 FIX: Import toJpeg
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

export default function Header() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    setIsDownloading(true);
    
    const elementId = 'digital-learning-report-export';
    const element = document.getElementById(elementId) || document.getElementById('dashboard-content');

    if (!element) {
      alert('Error: Report content not found!');
      setIsDownloading(false);
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

      // 🚀 SIZE REDUCTION
      const dataUrl = await toJpeg(element, {
        cacheBust: true,
        backgroundColor: '#fcfdfa',
        pixelRatio: 1.5,
        quality: 0.8,
        style: {
          margin: '0', 
          padding: '20px' 
        }
      });

      document.head.removeChild(style);

      // 🚀 SIZE REDUCTION
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true, // Compress PDF
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const headerHeight = 25;
      pdf.setFillColor(252, 250, 248);
      pdf.rect(0, 0, pdfWidth, headerHeight, 'F');

      pdf.setTextColor(6, 78, 59);
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SURYA IMPACTOS PERFORMANCE REPORT', pdfWidth / 2, 16, { align: 'center' });

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

      // 🚀 Insert as JPEG
      pdf.addImage(dataUrl, 'JPEG', xOffset, headerHeight, finalImgWidth, finalImgHeight, undefined, 'FAST');
      
      pdf.save(`Surya_ImpactOS_ESG_Report.pdf`);

    } catch (error) {
      console.error('Print failed:', error);
      alert('Failed to generate PDF. Check console.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative z-20 flex flex-col items-start justify-between gap-4 border-b border-slate-200/50 pb-5 md:flex-row md:items-center md:gap-6 md:pb-6"
    >
      <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
        <div className="relative group cursor-pointer flex-shrink-0">
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ea580c] blur-md opacity-25 transition duration-500 group-hover:opacity-50" />
          <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full sm:h-14 sm:w-14 md:h-16 md:w-16 bg-transparent">
            <Image
              src="/sangam logo.png"
              alt="Surya Sangam Logo"
              fill
              sizes="64px"
              className="object-contain p-1 rotate-180 mix-blend-multiply" 
            />
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="mb-1 text-2xl font-black leading-none tracking-tight text-[#0a192f] sm:text-3xl md:text-4xl lg:text-[2.75rem]">
            {DASHBOARD_DATA.header.title}
          </h1>
          <p className="text-[13px] font-semibold leading-none tracking-wide text-slate-500 md:text-[15px]">
            {DASHBOARD_DATA.header.tagline}
          </p>
        </div>
      </div>

      <div className="mt-2 flex w-full flex-wrap gap-3 md:mt-0 md:w-auto md:gap-4">
        <button className="flex flex-1 items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-600 sm:px-5 sm:py-3 sm:text-sm md:flex-none">
          <Calendar size={18} className="text-blue-500" /> May 2024 - May 2025
        </button>

        <button
          onClick={!isDownloading ? downloadPDF : undefined}
          className={`group relative flex items-center justify-center rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ea580c] px-4 py-2.5 text-xs font-bold text-white shadow-md sm:px-6 sm:py-3 sm:text-sm transition-all hover:scale-[1.02] active:scale-95 ${isDownloading ? 'opacity-80 cursor-wait' : ''}`}
        >
            {isDownloading ? (
              <Loader2 size={18} className="mr-2 animate-spin" />
            ) : (
              <Download size={18} className="mr-2" />
            )}
            {isDownloading ? 'Processing...' : 'Download ESG Report'}
        </button>
      </div>
    </motion.header>
  );
}