"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar, Download, Loader2 } from 'lucide-react';
import { DASHBOARD_DATA } from '../../constants/mockData';
import { motion } from 'framer-motion';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

// Naya Import: DatePicker aur uski CSS
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// 🚀 VERCEL FIX: TypeScript Interface add kiya gaya Custom Input ke liye
interface CustomDateInputProps {
  value?: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const CustomDateInput = React.forwardRef<HTMLButtonElement, CustomDateInputProps>(
  ({ value, onClick }, ref) => (
    <button
      onClick={onClick}
      ref={ref}
      className="flex w-full items-center justify-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-800 sm:px-5 sm:py-3 sm:text-sm transition hover:bg-emerald-100"
    >
      <Calendar size={18} className="text-emerald-600" />
      {value || "Select Date Range"}
    </button>
  )
);
CustomDateInput.displayName = 'CustomDateInput';

export default function Header() {
  const [isDownloading, setIsDownloading] = useState(false);
  
  // 🚀 VERCEL FIX: DateRange state ko properly type kiya gaya
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 3);
    return [start, end];
  });
  const [startDate, endDate] = dateRange;

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

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true, 
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const headerHeight = 25;
      pdf.setFillColor(252, 250, 248);
      pdf.rect(0, 0, pdfWidth, headerHeight, 'F');

      pdf.setTextColor(6, 78, 59); // Emerald Green Text
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text('SCHOOL IMPACT PERFORMANCE REPORT', pdfWidth / 2, 16, { align: 'center' }); // Text updated

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

      pdf.addImage(dataUrl, 'JPEG', xOffset, headerHeight, finalImgWidth, finalImgHeight, undefined, 'FAST');
      
      // Dynamic PDF Name logic
      const formattedStartDate = startDate ? startDate.toLocaleDateString('en-GB').replace(/\//g, '-') : 'Start';
      const formattedEndDate = endDate ? endDate.toLocaleDateString('en-GB').replace(/\//g, '-') : 'End';
      
      pdf.save(`Surya_Impact_Report_${formattedStartDate}_to_${formattedEndDate}.pdf`);

    } catch (error) {
      console.error('Print failed:', error);
      alert('Failed to generate PDF. Check console.');
    } finally {
      setIsDownloading(false);
    }
  };

  // 🚀 VERCEL FIX: Added types <HTMLButtonElement, CustomDateInputProps> to forwardRef
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

      <div className="mt-2 flex w-full flex-col sm:flex-row gap-3 md:mt-0 md:w-auto md:gap-4">
        
        {/* Working Interactive Date Picker */}
        <div className="flex-1 md:flex-none">
          <DatePicker
            selectsRange={true}
            startDate={startDate}
            endDate={endDate}
            onChange={(update: [Date | null, Date | null]) => setDateRange(update)}
            dateFormat="MMM d, yyyy"
            customInput={<CustomDateInput />}
            maxDate={new Date()} // Future dates disable karne ke liye
          />
        </div>

        <button
          onClick={!isDownloading ? downloadPDF : undefined}
          className={`group relative flex items-center justify-center rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ea580c] px-4 py-2.5 text-xs font-bold text-white shadow-md sm:px-6 sm:py-3 sm:text-sm transition-all hover:scale-[1.02] active:scale-95 ${isDownloading ? 'opacity-80 cursor-wait' : ''}`}
        >
            {isDownloading ? (
              <Loader2 size={18} className="mr-2 animate-spin" />
            ) : (
              <Download size={18} className="mr-2" />
            )}
            {isDownloading ? 'Processing...' : 'Download Report'}
        </button>
      </div>
    </motion.header>
  );
}
