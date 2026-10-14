import React, { useState } from 'react';
import {
  Download,
  AlertTriangle,
  ArrowRight,
  Copy,
  Check,
  Calendar,
  Clock,
  ExternalLink,
  Award,
  Sparkles,
  BookOpen,
  Code2,
  CheckCircle2,
  Circle,
  Search,
  Globe,
  SlidersHorizontal,
  Flame,
  Briefcase,
  FileText,
  TrendingUp,
  Building2,
  Layers,
  Banknote,
} from 'lucide-react';
import { CareerGuidanceOutput, SkillGapItem, CandidateSkill } from '../data/promptSpec';
import { generateSkillGapPdf } from '../utils/pdfGenerator';
import { getEstimatedSalaryBenchmark } from '../utils/salaryBenchmark';

interface ResultsDashboardProps {
  data: CareerGuidanceOutput;
  candidateName: string;
  targetRole: string;
  targetTier?: string;
  experienceLevel?: string;
  academicMajor: string;
  currentSkills: string;
  skillsWithProficiency?: CandidateSkill[];
}

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  data,
  candidateName,
  targetRole,
  targetTier = 'Product-Based MNC',
  experienceLevel = 'Fresher / Entry-Level',
  academicMajor,
  currentSkills,
  skillsWithProficiency = [],
}) => {
  const [activeTab, setActiveTab] = useState<'gaps' | 'roadmap' | 'portfolio'>('gaps');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [checkedTasks, setCheckedTasks] = useState<Record<string, boolean>>({});
  
  // Interactive Simulation: user can simulate learning skills to see readiness score increase!
  const [simulatedSkills, setSimulatedSkills] = useState<Record<string, boolean>>({});
  
  // Priority filter for skill gaps
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'Critical' | 'High' | 'Moderate'>('ALL');
  
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isCustomizingPdf, setIsCustomizingPdf] = useState(false);

  // Toggle state for optional PDF report sections
  const [pdfSections, setPdfSections] = useState({
    includeExecutiveSummary: true,
    includeSkillGaps: true,
    includeRoadmap: true,
    includePortfolioSummary: true,
    includeMarketViability: true,
  });

  const toggleSimulatedSkill = (skillName: string) => {
    setSimulatedSkills((prev) => ({
      ...prev,
      [skillName]: !prev[skillName],
    }));
  };

  const toggleTask = (taskId: string) => {
    setCheckedTasks((prev) => ({
      ...prev,
      [taskId]: !prev[taskId],
    }));
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadPdf = () => {
    setIsDownloadingPdf(true);
    try {
      generateSkillGapPdf({
        candidateName,
        targetRole,
        targetTier,
        experienceLevel,
        academicMajor,
        currentSkills,
        skillsWithProficiency,
        data,
        searchQueries: data.searchQueries || [],
        searchSources: data.searchSources || [],
        sections: pdfSections,
      });
    } catch (err) {
      console.error('PDF Generation error:', err);
    } finally {
      setTimeout(() => setIsDownloadingPdf(false), 600);
    }
  };

  const activeSectionsCount = Object.values(pdfSections).filter(Boolean).length;
  const salaryBenchmark = getEstimatedSalaryBenchmark(targetRole, experienceLevel, targetTier);

  // Calculate dynamic simulated score
  const simulatedCount = Object.values(simulatedSkills).filter(Boolean).length;
  const totalGapsCount = data.skillGaps.length;
  const potentialScoreBoost = totalGapsCount > 0 ? Math.round(((100 - data.readinessScore) / totalGapsCount) * simulatedCount) : 0;
  const dynamicScore = Math.min(100, data.readinessScore + potentialScoreBoost);

  // Score Styling (Light mode optimized)
  const getScoreStyle = (score: number) => {
    if (score >= 75) return { text: 'text-emerald-700', border: 'border-emerald-500', stroke: '#059669', bg: 'bg-emerald-50 text-emerald-800' };
    if (score >= 52) return { text: 'text-amber-700', border: 'border-amber-500', stroke: '#d97706', bg: 'bg-amber-50 text-amber-800' };
    return { text: 'text-rose-700', border: 'border-rose-500', stroke: '#e11d48', bg: 'bg-rose-50 text-rose-800' };
  };

  const scoreColor = getScoreStyle(dynamicScore);

  // Filter skill gaps
  const filteredGaps = data.skillGaps.filter((gap) => {
    if (priorityFilter === 'ALL') return true;
    return gap.priority === priorityFilter;
  });

  // Calculate task completion progress
  const totalChecklistItems = data.roadmap.reduce((acc, week) => acc + week.checklist.length, 0);
  const completedChecklistItems = Object.values(checkedTasks).filter(Boolean).length;
  const progressPercent = totalChecklistItems > 0 ? Math.round((completedChecklistItems / totalChecklistItems) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Quota rate-limit graceful notice if applicable */}
      {(data as any).quotaRateLimited && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Market Calibration Notice:</strong> Gemini API live quota rate-limit (429) was reached. Analysis was generated using verified 2026 industry standards for <strong>{targetTier}</strong>. Your roadmap and PDF download are 100% active.
            </span>
          </div>
        </div>
      )}

      {/* Top Action Bar: Role Summary & PDF Download (Light mode white card) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {/* Circular Readiness Gauge */}
          <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                strokeWidth="3.2"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                strokeDasharray={`${dynamicScore}, 100`}
                strokeWidth="3.2"
                strokeLinecap="round"
                stroke={scoreColor.stroke}
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                className="transition-all duration-700 ease-out"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-3xl font-black font-mono tracking-tight ${scoreColor.text}`}>
                {dynamicScore}%
              </span>
              <span className="text-[9px] font-bold uppercase text-slate-400">
                {simulatedCount > 0 ? 'Simulated' : 'Readiness'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {targetRole}
              </span>
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                Benchmark: {targetTier}
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {experienceLevel}
              </span>
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-2xs">
                <Banknote className="w-3.5 h-3.5 text-emerald-600" />
                Est. Salary: {salaryBenchmark.inrShort} ({salaryBenchmark.usdShort})
              </span>
            </div>
            
            <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Skill Gap Audit for {candidateName || 'Candidate'}
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              {data.executiveSummary}
            </p>
          </div>
        </div>

        {/* PDF Download Area with Section Customizer */}
        <div className="shrink-0 flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf || activeSectionsCount === 0}
              className="flex-1 sm:flex-initial px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition hover:scale-101 active:scale-99 disabled:opacity-50 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download PDF Report'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsCustomizingPdf(!isCustomizingPdf)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
                isCustomizingPdf
                  ? 'bg-blue-50 border-blue-400 text-blue-700 ring-2 ring-blue-400/20'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700 shadow-xs'
              }`}
              title="Customize PDF report sections"
            >
              <SlidersHorizontal className="w-4 h-4 text-blue-600" />
              <span className="hidden md:inline">Sections</span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700">
                {activeSectionsCount}/5
              </span>
            </button>
          </div>

          <span className="text-[11px] text-slate-500 font-medium">
            {activeSectionsCount === 5
              ? 'All 5 report sections included'
              : activeSectionsCount === 0
              ? 'Please select at least 1 section'
              : `${activeSectionsCount} of 5 sections selected`}
          </span>
        </div>
      </div>

      {/* PDF Export Section Customizer Panel */}
      {isCustomizingPdf && (
        <div className="bg-white border border-blue-200 rounded-xl p-4 shadow-sm animate-in fade-in duration-150 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
            <div>
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Customize PDF Report Sections
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  {activeSectionsCount} of 5 Active
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Toggle specific report modules before downloading to tailor your portfolio document for recruiters or learning sprints.
              </p>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setPdfSections({
                  includeExecutiveSummary: true,
                  includeSkillGaps: true,
                  includeRoadmap: true,
                  includePortfolioSummary: true,
                  includeMarketViability: true,
                })}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
              >
                Select All
              </button>
              <button
                type="button"
                onClick={() => setPdfSections({
                  includeExecutiveSummary: true,
                  includeSkillGaps: false,
                  includeRoadmap: false,
                  includePortfolioSummary: true,
                  includeMarketViability: false,
                })}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
              >
                Portfolio Only
              </button>
              <button
                type="button"
                onClick={() => setPdfSections({
                  includeExecutiveSummary: true,
                  includeSkillGaps: true,
                  includeRoadmap: true,
                  includePortfolioSummary: false,
                  includeMarketViability: false,
                })}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition cursor-pointer"
              >
                Upskilling Sprint Only
              </button>
            </div>
          </div>

          {/* Section Toggles Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 text-xs">
            {/* 1. Executive Summary */}
            <label className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition ${
              pdfSections.includeExecutiveSummary
                ? 'bg-blue-50/50 border-blue-300 text-blue-950 shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-500 opacity-75'
            }`}>
              <input
                type="checkbox"
                checked={pdfSections.includeExecutiveSummary}
                onChange={(e) => setPdfSections({ ...pdfSections, includeExecutiveSummary: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <span className="font-bold block text-slate-900">1. Executive Skill Assessment</span>
                <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                  Summary assessment &amp; Google Search grounding verification.
                </span>
              </div>
            </label>

            {/* 2. Detailed Skill Gaps */}
            <label className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition ${
              pdfSections.includeSkillGaps
                ? 'bg-blue-50/50 border-blue-300 text-blue-950 shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-500 opacity-75'
            }`}>
              <input
                type="checkbox"
                checked={pdfSections.includeSkillGaps}
                onChange={(e) => setPdfSections({ ...pdfSections, includeSkillGaps: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <span className="font-bold block text-slate-900">2. Detailed Technical Gaps</span>
                <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                  Full gap matrix with priority tags &amp; free learning links.
                </span>
              </div>
            </label>

            {/* 3. 4-Week Roadmap */}
            <label className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition ${
              pdfSections.includeRoadmap
                ? 'bg-blue-50/50 border-blue-300 text-blue-950 shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-500 opacity-75'
            }`}>
              <input
                type="checkbox"
                checked={pdfSections.includeRoadmap}
                onChange={(e) => setPdfSections({ ...pdfSections, includeRoadmap: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <span className="font-bold block text-slate-900">3. 4-Week Actionable Roadmap</span>
                <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                  Structured weekly checklist &amp; Sunday proof-of-work capstone.
                </span>
              </div>
            </label>

            {/* 4. Portfolio & LinkedIn */}
            <label className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition ${
              pdfSections.includePortfolioSummary
                ? 'bg-blue-50/50 border-blue-300 text-blue-950 shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-500 opacity-75'
            }`}>
              <input
                type="checkbox"
                checked={pdfSections.includePortfolioSummary}
                onChange={(e) => setPdfSections({ ...pdfSections, includePortfolioSummary: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <span className="font-bold block text-slate-900">4. Recruiter Portfolio Block</span>
                <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                  LinkedIn headline, bio &amp; resume XYZ quantified bullets.
                </span>
              </div>
            </label>

            {/* 5. SDG 8 Impact */}
            <label className={`flex items-start gap-2.5 p-3 rounded-lg border cursor-pointer transition ${
              pdfSections.includeMarketViability
                ? 'bg-blue-50/50 border-blue-300 text-blue-950 shadow-2xs'
                : 'bg-slate-50 border-slate-200 text-slate-500 opacity-75'
            }`}>
              <input
                type="checkbox"
                checked={pdfSections.includeMarketViability}
                onChange={(e) => setPdfSections({ ...pdfSections, includeMarketViability: e.target.checked })}
                className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <div>
                <span className="font-bold block text-slate-900">5. SDG 8 &amp; Market Viability</span>
                <span className="text-[11px] text-slate-500 leading-tight block mt-0.5">
                  Decent work impact note &amp; 2026 industry demand outlook.
                </span>
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Google Search Grounding Intelligence Banner (Light Mode) */}
      {((data.searchQueries && data.searchQueries.length > 0) || (data.searchSources && data.searchSources.length > 0)) && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-xs text-slate-600 shadow-sm space-y-2.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-blue-700 font-bold">
              <Search className="w-3.5 h-3.5" />
              <span>Grounded with 2026 Tech Market Hiring Intelligence</span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium">
              Calibrated for: <strong className="text-slate-800">{targetTier}</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 text-[11px] font-medium">Live Queries:</span>
            {(data.searchQueries || [`${targetRole} requirements ${targetTier} 2026`]).slice(0, 3).map((query, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-md bg-slate-50 text-slate-700 border border-slate-200 text-[11px] font-mono flex items-center gap-1"
              >
                <Search className="w-2.5 h-2.5 text-blue-500" />
                {query}
              </span>
            ))}
          </div>

          {data.searchSources && data.searchSources.length > 0 && (
            <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px]">
              <span className="text-slate-400 font-medium">Verified Sources:</span>
              {data.searchSources.slice(0, 3).map((src, idx) => (
                <a
                  key={idx}
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 font-medium underline flex items-center gap-1 truncate max-w-xs"
                >
                  <Globe className="w-3 h-3 shrink-0" />
                  <span className="truncate">{src.title}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Target Role Market Salary Benchmark Banner */}
      <div className="bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-white border border-emerald-200/90 rounded-xl p-4 shadow-sm space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-emerald-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <Banknote className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                  Target Role Market Salary Benchmark
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {salaryBenchmark.demandStatus}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">
                Localized 2025/2026 tech compensation for <strong>{targetTier}</strong> ({experienceLevel})
              </span>
            </div>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black text-emerald-900 tracking-tight">
              {salaryBenchmark.inrRange}
            </span>
            <span className="text-xs font-semibold text-slate-500">
              ({salaryBenchmark.usdRange})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
          <div className="bg-white/80 border border-emerald-100 rounded-lg p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Median Pay</span>
            <span className="text-sm font-bold text-slate-900">{salaryBenchmark.medianInr} <span className="text-[11px] text-slate-500 font-normal">({salaryBenchmark.medianUsd})</span></span>
          </div>
          <div className="bg-white/80 border border-emerald-100 rounded-lg p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">75th Percentile (Top Performer)</span>
            <span className="text-sm font-bold text-emerald-800">{salaryBenchmark.percentile75}</span>
          </div>
          <div className="bg-white/80 border border-emerald-100 rounded-lg p-2.5">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">25th Percentile (Entry Baseline)</span>
            <span className="text-sm font-bold text-slate-700">{salaryBenchmark.percentile25}</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-600 pt-0.5">
          <strong className="text-slate-800">Compensation Unlock Factor:</strong> {salaryBenchmark.keyCompensationDriver}. Closing the identified technical gaps positions your profile directly within the 75th percentile band.
        </p>
      </div>

      {/* Candidate Verified Skills with Proficiency Badges */}
      {skillsWithProficiency && skillsWithProficiency.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              <span>Assessed Baseline Skills &amp; Proficiency ({skillsWithProficiency.length}):</span>
            </span>
            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-medium">
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Advanced</span>
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Intermediate</span>
              <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Beginner</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            {skillsWithProficiency.map((skill) => {
              const badgeStyle = {
                Beginner: 'bg-amber-50 text-amber-800 border-amber-200',
                Intermediate: 'bg-blue-50 text-blue-800 border-blue-200',
                Advanced: 'bg-emerald-50 text-emerald-800 border-emerald-200',
              }[skill.proficiency];

              return (
                <div
                  key={skill.name}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-50 border border-slate-200 shadow-2xs"
                >
                  <span className="font-bold text-slate-800">{skill.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${badgeStyle}`}>
                    {skill.proficiency}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Interactive Simulation Callout (Light Mode) */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-slate-50 border border-blue-200/60 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-slate-900 flex items-center gap-2 text-sm">
              <span>Interactive ROI Simulator:</span>
              <span className="text-blue-600 font-extrabold">
                {simulatedCount > 0 ? `+${potentialScoreBoost}% Readiness Boost Simulated!` : 'Simulate Upskilling Impact'}
              </span>
            </div>
            <p className="text-slate-500 text-xs">
              Click &quot;Simulate Learning&quot; on any missing skill below to see your market readiness climb in real time.
            </p>
          </div>
        </div>

        {simulatedCount > 0 && (
          <button
            onClick={() => setSimulatedSkills({})}
            className="px-3.5 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-xs font-semibold transition self-start sm:self-auto shadow-xs cursor-pointer"
          >
            Reset Simulator
          </button>
        )}
      </div>

      {/* Navigation Tabs (Light Mode) */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('gaps')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'gaps'
                ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Missing Skills ({data.skillGaps.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('roadmap')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'roadmap'
                ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>4-Week Action Plan ({progressPercent}% Done)</span>
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition border-b-2 flex items-center gap-2 cursor-pointer ${
              activeTab === 'portfolio'
                ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Resume &amp; LinkedIn Bullets</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Skill Gaps */}
      {activeTab === 'gaps' && (
        <div className="space-y-4">
          {/* Priority Filters */}
          <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
            <span className="text-slate-500 font-medium">Filter by Hiring Urgency for {targetTier}:</span>
            <div className="flex gap-1.5">
              {(['ALL', 'Critical', 'High', 'Moderate'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                    priorityFilter === p
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p === 'ALL' ? 'All Gaps' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Cards Grid (Crisp white cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGaps.map((gap, idx) => {
              const isSimulated = Boolean(simulatedSkills[gap.skill]);
              return (
                <div
                  key={idx}
                  className={`rounded-xl p-5 transition flex flex-col justify-between border shadow-xs ${
                    isSimulated
                      ? 'bg-emerald-50/50 border-emerald-300 ring-1 ring-emerald-300'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                          <span>{gap.skill}</span>
                          {isSimulated && (
                            <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200">
                              ✓ Acquired
                            </span>
                          )}
                        </h4>
                        <span className="text-[10px] uppercase font-mono text-slate-400 font-medium">
                          {gap.category.replace('_', ' ')}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shrink-0 ${
                          gap.priority === 'Critical'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : gap.priority === 'High'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {gap.priority}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed my-3">
                      <strong className="text-slate-800">Recruiter Demand Reason: </strong>
                      {gap.marketDemandReason}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="text-slate-700 text-[11px] truncate font-medium">
                        {gap.recommendedFreeResource}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-500 font-medium">
                        {gap.estimatedHoursToLearn ? `~${gap.estimatedHoursToLearn} hrs` : '~12 hrs effort'}
                      </span>
                      <button
                        onClick={() => toggleSimulatedSkill(gap.skill)}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
                          isSimulated
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {isSimulated ? (
                          <>
                            <Check className="w-3 h-3" />
                            Skill Mastered
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-3 h-3 text-blue-600" />
                            Simulate Learning
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: 4-Week Action Plan */}
      {activeTab === 'roadmap' && (
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Interactive Sprint Checklist</h4>
              <p className="text-slate-500">
                Check off tasks as you finish them. Each week ends with a verifiable Sunday proof-of-work deliverable.
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono font-bold text-emerald-700 text-sm">
                {completedChecklistItems} of {totalChecklistItems} Completed
              </span>
              <div className="w-36 h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {data.roadmap.map((week) => (
              <div
                key={week.weekNumber}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 transition shadow-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-bold text-xs flex items-center justify-center">
                      W{week.weekNumber}
                    </span>
                    <div>
                      <h5 className="font-bold text-slate-900 text-sm">{week.theme}</h5>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {week.coreConcepts.map((concept, i) => (
                          <span key={i} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{week.estimatedHours} hrs</span>
                  </div>
                </div>

                <div className="my-3 space-y-2">
                  {week.checklist.map((task, tIdx) => {
                    const taskId = `w${week.weekNumber}-t${tIdx}`;
                    const isChecked = Boolean(checkedTasks[taskId]);
                    return (
                      <div
                        key={tIdx}
                        onClick={() => toggleTask(taskId)}
                        className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition text-xs border ${
                          isChecked
                            ? 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
                            : 'bg-slate-50/60 hover:bg-slate-100 border-slate-200/80 text-slate-700'
                        }`}
                      >
                        <button className="mt-0.5 text-slate-400 shrink-0">
                          {isChecked ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Circle className="w-4 h-4 text-slate-400" />
                          )}
                        </button>
                        <span className={`leading-relaxed ${isChecked ? 'line-through text-slate-400' : ''}`}>
                          {task}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="p-3 rounded-lg bg-blue-50/80 border border-blue-200 flex items-start gap-2 text-xs text-blue-900">
                  <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-blue-950">Sunday Milestone Deliverable: </strong>
                    {week.capstoneDeliverable}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Portfolio Summary */}
      {activeTab === 'portfolio' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Recruiter Portfolio &amp; Resume Block</h4>
              <p className="text-xs text-slate-500">
                Ready to paste into your resume (Google XYZ format) and LinkedIn profile
              </p>
            </div>
            <button
              onClick={() => handleCopy(data.portfolioSummary, 'port_text')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {copiedKey === 'port_text' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Markdown
                </>
              )}
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl p-6 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed font-sans shadow-xs">
            {data.portfolioSummary}
          </div>
        </div>
      )}
    </div>
  );
};
