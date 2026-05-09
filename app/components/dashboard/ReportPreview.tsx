"use client";

import React, { useState } from 'react';
import { ArrowDownToLine, FileText, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { DASHBOARD_DATA } from '../../constants/mockData';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';

function filenameForTitle(title: string) {
  return title.replace(/[^a-z0-9]+/gi, '_').replace(/^_+|_+$/g, '') || 'Surya_ImpactOS_Report';
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default function ReportPreview() {
  const reports = DASHBOARD_DATA.reports || [
    { title: 'Monthly ESG Report', date: 'May 2025', type: 'Full Analytics', size: '2.4 MB' },
    { title: 'School Impact Report', date: 'Q1 2025', type: 'Digital Learning', size: '1.8 MB' },
    { title: 'CSR Summary Report', date: 'Annual 2024', type: 'Financial Impact', size: '3.1 MB' },
  ];

  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownloadClick = async (title: string) => {
    setDownloading(title);

    const dashboard = document.getElementById('dashboard-content');

    if (!dashboard) {
      alert(`${title} data is not available on the screen.`);
      setDownloading(null);
      return;
    }

    const hiddenNodes = new Map<HTMLElement, string>();
    let animationBlocker: HTMLStyleElement | null = null;

    const hideNode = (node: HTMLElement | null) => {
      if (!node || hiddenNodes.has(node)) return;

      hiddenNodes.set(node, node.style.display);
      node.style.display = 'none';
    };

    try {
      const normalizedTitle = title.toLowerCase();
      const isSchoolReport = normalizedTitle.includes('school');
      const isCSRReport = normalizedTitle.includes('csr');
      const sectionIdsToHide = isSchoolReport
        ? ['section-overview', 'section-csr']
        : isCSRReport
          ? ['section-overview', 'section-monitor', 'section-learning']
          : ['section-learning', 'section-csr'];

      sectionIdsToHide.forEach((id) => hideNode(document.getElementById(id)));

      const reportPreview = document.getElementById('report-preview-section');
      const reportPreviewWrapper = reportPreview?.parentElement;
      hideNode(reportPreviewWrapper instanceof HTMLElement ? reportPreviewWrapper : reportPreview);

      animationBlocker = document.createElement('style');
      animationBlocker.setAttribute('data-pdf-animation-blocker', 'true');
      
      // 🚀 MAGIC FIX FOR WHITE GAP: Forced opacity to 1 and disabled transform 
      // so Framer Motion doesn't keep off-screen cards invisible during capture.
      animationBlocker.innerHTML = `
        * {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
          animation: none !important;
        }
      `;
      document.head.appendChild(animationBlocker);

      await wait(1000);

      const visibleBlocks = Array.from(dashboard.children).filter((child): child is HTMLElement => {
        if (!(child instanceof HTMLElement)) return false;

        const styles = window.getComputedStyle(child);
        return styles.display !== 'none' && child.offsetHeight > 0;
      });

      if (visibleBlocks.length === 0) {
        throw new Error('No visible dashboard blocks found for this report.');
      }

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4', compress: true });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const marginX = 10;
      const marginTop = 10;
      const marginBottom = 10;
      const gap = 6;
      const imgWidth = pdfWidth - marginX * 2;
      let currentY = marginTop;
      let imagesAdded = 0;

      pdf.setFillColor(252, 250, 248);
      pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');

      for (const block of visibleBlocks) {
        try {
          const dataUrl = await toJpeg(block, {
            cacheBust: true,
            backgroundColor: '#fcfaf8',
            pixelRatio: 1.5,
            quality: 0.8,
            style: {
              margin: '0',
            },
          });

          if (!dataUrl || dataUrl === 'data:,') {
            continue;
          }

          const imgProps = pdf.getImageProperties(dataUrl);
          const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

          if (currentY + imgHeight > pdfHeight - marginBottom && currentY !== marginTop) {
            pdf.addPage();
            pdf.setFillColor(252, 250, 248);
            pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
            currentY = marginTop;
          }

          pdf.addImage(dataUrl, 'JPEG', marginX, currentY, imgWidth, imgHeight, undefined, 'FAST');
          imagesAdded += 1;

          const firstPageAvailableHeight = pdfHeight - marginBottom - currentY;
          const fullPageAvailableHeight = pdfHeight - marginTop - marginBottom;
          let heightLeft = imgHeight - firstPageAvailableHeight;

          if (heightLeft <= 0) {
            currentY += imgHeight + gap;
          } else {
            while (heightLeft > 0) {
              const renderedHeight = imgHeight - heightLeft;
              pdf.addPage();
              pdf.setFillColor(252, 250, 248);
              pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
              pdf.addImage(dataUrl, 'JPEG', marginX, marginTop - renderedHeight, imgWidth, imgHeight, undefined, 'FAST');
              heightLeft -= fullPageAvailableHeight;
            }

            const heightOnLastPage = fullPageAvailableHeight + heightLeft;
            currentY = marginTop + Math.max(heightOnLastPage, 0) + gap;
          }

          if (currentY > pdfHeight - marginBottom) {
            pdf.addPage();
            pdf.setFillColor(252, 250, 248);
            pdf.rect(0, 0, pdfWidth, pdfHeight, 'F');
            currentY = marginTop;
          }
        } catch (blockError) {
          console.warn('Skipping PDF block that failed to render:', block, blockError);
        }
      }

      if (imagesAdded === 0) {
        throw new Error('All captured dashboard blocks were blank.');
      }

      pdf.save(`${filenameForTitle(title)}.pdf`);
    } catch (error) {
      console.error('PDF Generation Failed:', error);
      alert('PDF generation failed. Check console for details.');
    } finally {
      if (animationBlocker?.parentNode) {
        animationBlocker.parentNode.removeChild(animationBlocker);
      }

      hiddenNodes.forEach((display, node) => {
        node.style.display = display;
      });

      setDownloading(null);
    }
  };

  return (
    <motion.section
      id="report-preview-section"
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
                    {isDownloading ? 'Structuring PDF...' : report.title}
                  </p>
                  {/* 🚀 VERCEL BUILD FIX: Used proper HTML entity &bull; instead of a raw character */}
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{report.date} &bull; {report.type}</p>
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
