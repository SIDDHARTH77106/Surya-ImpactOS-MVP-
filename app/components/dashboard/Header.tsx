"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Calendar, Download, Loader2 } from 'lucide-react';
import { DASHBOARD_DATA } from '../../constants/mockData';
import { motion } from 'framer-motion';

export default function Header() {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadPDF = async () => {
    setIsDownloading(true);
    
    const elementId = 'digital-learning-report-export';
    const element = document.getElementById(elementId) || document.getElementById('dashboard-content');

    if (!element) {
      alert('Error: Report content not found! Please ensure your report section has id="digital-learning-report-export".');
      setIsDownloading(false);
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

      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Surya_ImpactOS_ESG_Report</title>
            ${stylesHtml}
            <style>
              /* 1. PAGE SETUP */
              @page { 
                size: A4 portrait; 
                margin: 10mm !important; 
              }
              
              body {
                background-color: transparent !important;
                margin: 0 !important;
                padding: 0 !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                font-family: sans-serif;
              }

              /* 2. PDF HEADER - SEEDHA LOGO (rotate(180deg)) & BG REMOVED */
              .pdf-header {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                margin-bottom: 15px;
                border-bottom: 2px solid #f1f5f9;
                padding-bottom: 10px;
                page-break-after: avoid !important; /* Header ke baad page break na ho */
              }
              .pdf-header img {
                height: 65px;
                width: auto;
                margin-bottom: 10px;
                transform: rotate(180deg) !important; /* Ulat logo ko seedha karta hai */
                mix-blend-mode: multiply !important; /* White background hatata hai */
              }
              .pdf-header h1 {
                font-size: 22px;
                color: #0a192f;
                font-weight: 800;
                margin: 0;
              }

              /* 3. FIX FOR BLANK FIRST PAGE */
              /* Main container ko normal flow karne do */
              #${elementId} {
                page-break-inside: auto !important; 
              }
              
              /* Sirf chhote cards ko break hone se roko, pure page ko nahi */
              .grid > div, section > div {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
                margin-bottom: 15px !important;
              }
              
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            </style>
          </head>
          <body>
            <div class="pdf-header">
              <img src="${logoUrl}" alt="Logo" />
              <h1>Surya ImpactOS Performance Report</h1>
            </div>
            ${element.outerHTML}
          </body>
        </html>
      `);
      iframeDoc.close();

      setTimeout(() => {
        if (iframe.contentWindow) {
          iframe.contentWindow.focus();
          iframe.contentWindow.print(); 
        }
        setIsDownloading(false);
        setTimeout(() => { document.body.removeChild(iframe); }, 1000);
      }, 2000);

    } catch (error) {
      console.error('Print failed:', error);
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
              /* rotate-180 logo ko ghuma kar seedha karega, mix-blend-multiply bg hatayega */
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