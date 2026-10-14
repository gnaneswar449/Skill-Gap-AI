import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CareerGuidanceOutput, CandidateSkill } from '../data/promptSpec';

export interface PdfSectionToggles {
  includeExecutiveSummary?: boolean;
  includeSkillGaps?: boolean;
  includeRoadmap?: boolean;
  includePortfolioSummary?: boolean;
  includeMarketViability?: boolean;
}

export interface PdfExportOptions {
  candidateName: string;
  targetRole: string;
  targetTier?: string;
  experienceLevel?: string;
  academicMajor: string;
  currentSkills: string;
  skillsWithProficiency?: CandidateSkill[];
  data: CareerGuidanceOutput;
  searchQueries?: string[];
  searchSources?: Array<{ title: string; url: string }>;
  sections?: PdfSectionToggles;
}

export function generateSkillGapPdf(options: PdfExportOptions): void {
  const {
    candidateName,
    targetRole,
    targetTier = 'Product-Based MNC',
    experienceLevel = 'Fresher / Entry-Level',
    academicMajor,
    currentSkills,
    skillsWithProficiency = [],
    data,
    searchQueries = [],
    searchSources = [],
    sections = {},
  } = options;

  // Defaults: all true unless explicitly set to false
  const includeExecutive = sections.includeExecutiveSummary !== false;
  const includeGaps = sections.includeSkillGaps !== false;
  const includeRoadmap = sections.includeRoadmap !== false;
  const includePortfolio = sections.includePortfolioSummary !== false;
  const includeViability = sections.includeMarketViability !== false;

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;

  // --- BRAND HEADER BAR ---
  doc.setFillColor(15, 23, 42); // Deep slate #0f172a
  doc.rect(0, 0, pageWidth, 28, 'F');

  // Accent gradient line
  doc.setFillColor(59, 130, 246); // Blue #3b82f6
  doc.rect(0, 27, pageWidth, 1.5, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  doc.text('SKILLGAP AI', margin, 13);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(148, 163, 184); // Slate 400
  doc.text('Industry Skill Gap Audit & Career Readiness Report', margin, 18);

  // SDG 8 Badge & Date
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(52, 211, 153); // Emerald
  doc.text('UN SDG 8: Decent Work & Economic Growth', pageWidth - margin, 12, { align: 'right' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(203, 213, 225);
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  doc.text(`Generated on: ${dateStr}`, pageWidth - margin, 18, { align: 'right' });

  let y = 34;

  // --- CANDIDATE PROFILE SUMMARY BOX ---
  doc.setFillColor(248, 250, 252); // Slate 50
  doc.setDrawColor(226, 232, 240); // Slate 200
  doc.roundedRect(margin, y, pageWidth - margin * 2, 29, 2, 2, 'FD');

  // Candidate Name
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('CANDIDATE:', margin + 4, y + 6);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  doc.text(candidateName || 'Candidate', margin + 26, y + 6);

  // Target Role
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('TARGET ROLE:', margin + 4, y + 11.5);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(37, 99, 235); // Blue 600
  doc.text(targetRole, margin + 28, y + 11.5);

  // Target Benchmark (Prominently displayed)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text('TARGET BENCHMARK:', margin + 4, y + 17);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(16, 185, 129); // Emerald 600
  doc.text(`${targetTier}  |  ${experienceLevel}`, margin + 38, y + 17);

  // Academic Background & Skills
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`Academic Background: ${academicMajor || 'N/A'}`, margin + 4, y + 22);
  
  const skillsDisplayStr = skillsWithProficiency && skillsWithProficiency.length > 0
    ? skillsWithProficiency.map(s => `${s.name} [${s.proficiency}]`).join(', ')
    : currentSkills;
  const currentSkillsTrunc = skillsDisplayStr.length > 76 ? skillsDisplayStr.substring(0, 73) + '...' : skillsDisplayStr;
  doc.text(`Assessed Skills: ${currentSkillsTrunc || 'None listed'}`, margin + 4, y + 26.5);

  // Score Badge in Profile Box
  const scoreBoxWidth = 36;
  const scoreBoxX = pageWidth - margin - scoreBoxWidth - 3;
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(scoreBoxX, y + 3, scoreBoxWidth, 23, 2, 2, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  const score = data.readinessScore;
  if (score >= 75) doc.setTextColor(52, 211, 153);
  else if (score >= 50) doc.setTextColor(251, 191, 36);
  else doc.setTextColor(248, 113, 113);
  doc.text(`${score}%`, scoreBoxX + scoreBoxWidth / 2, y + 12, { align: 'center' });

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(255, 255, 255);
  doc.text('READINESS SCORE', scoreBoxX + scoreBoxWidth / 2, y + 18, { align: 'center' });

  y += 32;
  let sectionCounter = 1;

  // --- SECTION: EXECUTIVE AUDIT SUMMARY (TOGGLEABLE) ---
  if (includeExecutive) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${sectionCounter++}. Executive Skill Gap Assessment`, margin, y);
    y += 4;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(51, 65, 85);
    const splitSummary = doc.splitTextToSize(data.executiveSummary, pageWidth - margin * 2);
    doc.text(splitSummary, margin, y);
    y += splitSummary.length * 3.5 + 4;

    // Search Grounding Notice (if available)
    if (searchQueries.length > 0 || searchSources.length > 0) {
      doc.setFillColor(239, 246, 255); // Blue 50
      doc.setDrawColor(191, 219, 254);
      doc.roundedRect(margin, y, pageWidth - margin * 2, 10, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7);
      doc.setTextColor(30, 64, 175); // Blue 800
      doc.text('Verified with Google Search Grounding:', margin + 3, y + 4.5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(59, 130, 246);
      const queryDisplay = searchQueries.slice(0, 3).join(' • ') || 'Live tech job market postings 2026';
      doc.text(queryDisplay, margin + 3, y + 8);

      y += 14;
    }
  }

  // --- SECTION: CRITICAL SKILL GAPS TABLE (TOGGLEABLE) ---
  if (includeGaps && data.skillGaps.length > 0) {
    if (y > pageHeight - 50) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${sectionCounter++}. Identified Technical Gaps (${data.skillGaps.length} Areas)`, margin, y);
    y += 3;

    const tableBody = data.skillGaps.map((gap, index) => [
      `#${index + 1}`,
      gap.skill,
      gap.priority.toUpperCase(),
      gap.marketDemandReason,
      gap.recommendedFreeResource,
    ]);

    autoTable(doc, {
      startY: y,
      head: [['#', 'Missing Skill / Tool', 'Priority', 'Why Industry Requires This', 'Recommended Free Resource']],
      body: tableBody,
      theme: 'grid',
      styles: {
        fontSize: 7,
        cellPadding: 2,
        textColor: [30, 41, 59],
        lineColor: [226, 232, 240],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [15, 23, 42],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7,
      },
      columnStyles: {
        0: { cellWidth: 8, halign: 'center' },
        1: { cellWidth: 38, fontStyle: 'bold' },
        2: { cellWidth: 18, halign: 'center', fontStyle: 'bold' },
        3: { cellWidth: 70 },
        4: { cellWidth: 48 },
      },
      margin: { left: margin, right: margin },
      didParseCell: (dataCell) => {
        if (dataCell.section === 'body' && dataCell.column.index === 2) {
          const val = dataCell.cell.raw;
          if (val === 'CRITICAL') {
            dataCell.cell.styles.textColor = [225, 29, 72]; // Rose
          } else if (val === 'HIGH') {
            dataCell.cell.styles.textColor = [217, 119, 6]; // Amber
          } else {
            dataCell.cell.styles.textColor = [37, 99, 235]; // Blue
          }
        }
      },
    });

    const finalY = (doc as any).lastAutoTable?.finalY || y + 50;
    y = finalY + 8;
  }

  // --- SECTION: 4-WEEK ACTIONABLE ROADMAP (TOGGLEABLE) ---
  if (includeRoadmap && data.roadmap.length > 0) {
    if (y > pageHeight - 65) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${sectionCounter++}. 4-Week Actionable Upskilling Roadmap`, margin, y);
    y += 3;

    const roadmapBody = data.roadmap.map((week) => [
      `Week ${week.weekNumber}\n(${week.estimatedHours} hrs)`,
      week.theme,
      week.checklist.map((c) => `• ${c}`).join('\n'),
      week.capstoneDeliverable,
    ]);

    autoTable(doc, {
      startY: y,
      head: [['Timeline', 'Focus Theme', 'Weekly Action Checklist', 'Sunday Proof-of-Work Deliverable']],
      body: roadmapBody,
      theme: 'grid',
      styles: {
        fontSize: 6.5,
        cellPadding: 2,
        textColor: [30, 41, 59],
        lineColor: [226, 232, 240],
        lineWidth: 0.2,
      },
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 7,
      },
      columnStyles: {
        0: { cellWidth: 20, halign: 'center', fontStyle: 'bold' },
        1: { cellWidth: 42, fontStyle: 'bold' },
        2: { cellWidth: 70 },
        3: { cellWidth: 50 },
      },
      margin: { left: margin, right: margin },
    });

    const finalRoadmapY = (doc as any).lastAutoTable?.finalY || y + 50;
    y = finalRoadmapY + 8;
  }

  // --- SECTION: PORTFOLIO & LINKEDIN SUMMARY (TOGGLEABLE) ---
  if (includePortfolio && data.portfolioSummary) {
    // If running on first page and has space or start clean page
    if (y > pageHeight - 75) {
      doc.addPage();
      y = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${sectionCounter++}. Recruiter-Ready Portfolio & LinkedIn Blueprint`, margin, y);
    y += 4.5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('Optimized for resume screeners, LinkedIn algorithms, and technical hiring manager review.', margin, y);
    y += 5.5;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    
    const portfolioText = data.portfolioSummary || '';
    const splitPortfolio = doc.splitTextToSize(portfolioText, pageWidth - margin * 2 - 8);
    const maxLines = Math.floor((pageHeight - y - 35) / 3.8);
    const visibleLines = splitPortfolio.slice(0, Math.max(12, maxLines));
    const blockHeight = visibleLines.length * 3.8 + 6;
    
    doc.roundedRect(margin, y, pageWidth - margin * 2, blockHeight, 2, 2, 'FD');

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(30, 41, 59);
    doc.text(visibleLines, margin + 4, y + 5.5);

    y += blockHeight + 7;
  }

  // --- SECTION: SDG 8 & MARKET VIABILITY (TOGGLEABLE) ---
  if (includeViability && data.marketViabilityAnalysis) {
    if (y > pageHeight - 32) {
      doc.addPage();
      y = 20;
    }

    doc.setFillColor(240, 253, 244); // Green 50
    doc.setDrawColor(187, 247, 208);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 18, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(22, 101, 52); // Green 800
    doc.text('SDG 8 & Economic Growth Impact:', margin + 4, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.8);
    doc.setTextColor(21, 128, 61);
    const splitNote = doc.splitTextToSize(data.marketViabilityAnalysis.sdg8ImpactNote, pageWidth - margin * 2 - 8);
    doc.text(splitNote, margin + 4, y + 9);
  }

  // Footer on all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `SkillGap AI • Skill Gap Audit for ${targetRole} • Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  // Trigger browser download
  const safeFileName = `SkillGap-Audit-${targetRole.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`;
  doc.save(safeFileName);
}
