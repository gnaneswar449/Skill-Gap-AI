import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Plus,
  X,
  ArrowRight,
  Award,
  Globe,
  Loader2,
  CheckCircle2,
  RotateCcw,
  Sliders,
  Code2,
  Banknote,
  TrendingUp,
  Briefcase,
  Layers,
  Building2,
  User,
  GraduationCap,
  Gauge,
  Check,
} from 'lucide-react';
import { CareerGuidanceOutput, CandidateSkill, SkillProficiency } from './data/promptSpec';
import { generateTailoredCareerGuidance } from './utils/fallbackAnalyzer';
import { getEstimatedSalaryBenchmark } from './utils/salaryBenchmark';
import { ResultsDashboard } from './components/ResultsDashboard';

const COMPANY_TIERS = [
  { id: 'Product-Based MNC', label: 'Product-Based MNC', desc: 'High algorithmic rigor, concurrency & system design (e.g. Google, Microsoft, Amazon)' },
  { id: 'Fast-Growing Startup', label: 'Fast-Growing Startup', desc: 'Rapid product shipping, TypeScript, modern full-stack & CI/CD agility' },
  { id: 'Service-Based IT', label: 'Service-Based IT', desc: 'Enterprise frameworks, clean databases, testing & client delivery (e.g. TCS, Infosys)' },
  { id: 'AI/ML Research Lab', label: 'AI/ML Research Lab', desc: 'Mathematical modeling, PyTorch tensor manipulation & cutting-edge AI systems' },
];

const EXPERIENCE_LEVELS = [
  'Fresher / Entry-Level (0 Yrs)',
  '1-2 Years (Associate / Junior)',
  'Pre-Final / Internship',
];

const POPULAR_ROLES = [
  'Junior Full-Stack Developer (React & Node.js)',
  'AI & Machine Learning Engineer',
  'Cloud & DevOps Associate (Docker, AWS)',
  'Junior Data Analyst & BI Specialist',
  'Cybersecurity & Network Security Analyst',
  'Mobile App Engineer (React Native)',
];

const SUGGESTED_SKILLS = [
  'Python',
  'JavaScript (ES6+)',
  'React',
  'Git & GitHub',
  'SQL / MySQL',
  'Node.js',
  'C++',
  'Docker',
  'Linux Basics',
  'Java (OOPs)',
  'TypeScript',
  'AWS Basics',
];

export default function App() {
  // 1. User Name & Top Benchmark Section
  const [candidateName, setCandidateName] = useState('Aarav Sharma');
  const [targetTier, setTargetTier] = useState('Product-Based MNC');
  const [customTierInput, setCustomTierInput] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher / Entry-Level (0 Yrs)');

  // 2. Target Role & Skills with Proficiency
  const [targetRole, setTargetRole] = useState('Junior Full-Stack Developer (React & Node.js)');
  const [skillsList, setSkillsList] = useState<CandidateSkill[]>([
    { name: 'C++', proficiency: 'Beginner' },
    { name: 'Python', proficiency: 'Beginner' },
    { name: 'HTML & CSS', proficiency: 'Intermediate' },
    { name: 'JavaScript (ES6+)', proficiency: 'Intermediate' },
    { name: 'MySQL', proficiency: 'Intermediate' },
    { name: 'Git & GitHub', proficiency: 'Intermediate' },
  ]);
  const [customSkillInput, setCustomSkillInput] = useState('');
  const [selectedProficiencyForNew, setSelectedProficiencyForNew] = useState<SkillProficiency>('Intermediate');
  
  // 3. Academic background
  const [academicMajor, setAcademicMajor] = useState('B.Tech in Electronics & Communication');
  const [locationContext, setLocationContext] = useState('Tier-3 Engineering College (Class of 2026)');

  // Execution state
  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<CareerGuidanceOutput | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Add / Remove / Update Skills with Proficiency
  const handleAddSkill = (skillName: string, proficiency: SkillProficiency = selectedProficiencyForNew) => {
    const trimmed = skillName.trim();
    if (trimmed && !skillsList.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setSkillsList([...skillsList, { name: trimmed, proficiency }]);
      setCustomSkillInput('');
    }
  };

  const handleUpdateProficiency = (skillName: string, newProficiency: SkillProficiency) => {
    setSkillsList(
      skillsList.map((s) => (s.name === skillName ? { ...s, proficiency: newProficiency } : s))
    );
  };

  const handleRemoveSkill = (skillNameToRemove: string) => {
    setSkillsList(skillsList.filter((s) => s.name !== skillNameToRemove));
  };

  const handleKeyDownSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddSkill(customSkillInput);
    }
  };

  // Run Skill Gap Analysis
  const handleRunAudit = async () => {
    if (!targetRole.trim()) {
      setErrorMsg('Please specify a target role to audit.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    const activeTier = customTierInput.trim() || targetTier;
    const formattedSkillsString = skillsList.map((s) => `${s.name} (${s.proficiency})`).join(', ');

    try {
      let data: CareerGuidanceOutput | null = null;

      try {
        const response = await fetch('/api/generate-career-guidance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: candidateName,
            targetRole,
            targetTier: activeTier,
            academicMajor,
            currentSkills: formattedSkillsString,
            skillsWithProficiency: skillsList,
            experienceLevel,
            locationContext,
          }),
        });

        if (response.ok) {
          data = await response.json();
        } else {
          console.info(`API returned status ${response.status}; running verified client-side audit engine.`);
        }
      } catch (networkErr) {
        console.info('Backend API unavailable on static host; running verified client-side audit engine.');
      }

      // If backend was not reachable (e.g. Vercel static deployment 404), execute client-side audit engine
      if (!data) {
        data = generateTailoredCareerGuidance({
          studentName: candidateName,
          targetRole,
          targetTier: activeTier,
          academicMajor,
          currentSkills: formattedSkillsString,
          skillsWithProficiency: skillsList,
          experienceLevel,
          locationContext,
        });
      }

      setAuditResult(data);
    } catch (err: any) {
      console.info('Audit fallback activated.');
      const safeData = generateTailoredCareerGuidance({
        studentName: candidateName,
        targetRole,
        targetTier: activeTier,
        academicMajor,
        currentSkills: formattedSkillsString,
        skillsWithProficiency: skillsList,
        experienceLevel,
        locationContext,
      });
      setAuditResult(safeData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setAuditResult(null);
    setErrorMsg(null);
  };

  const effectiveTier = customTierInput.trim() || targetTier;
  const salaryBenchmark = getEstimatedSalaryBenchmark(targetRole, experienceLevel, effectiveTier);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Top Header Bar (Clean Light Mode) */}
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base sm:text-lg text-slate-900 tracking-tight">
                  SkillGap AI
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  UN SDG 8 Compliant
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                Dynamic Skill-to-Job Readiness &amp; Official PDF Portfolio Generator
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {auditResult && (
              <button
                onClick={handleReset}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>New Audit</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {!auditResult ? (
          /* STEP 1: Streamlined Input Form */
          <div className="space-y-6 max-w-3xl mx-auto">
            {/* Header Title */}
            <div className="text-center space-y-2 py-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                <Search className="w-3.5 h-3.5" />
                Grounded with 2026 Live Market Data
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Skill Gap &amp; Career Readiness Audit
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
                Benchmark your candidate profile against employer tiers with granular proficiency levels. Get a calibrated readiness score, missing tools, 4-week sprint, and download an official PDF report.
              </p>
            </div>

            {/* Main Form Card (Crisp White Card with Slate Border) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              
              {/* SECTION A: User Full Name (Top) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Candidate Full Name</span>
                </label>
                <input
                  type="text"
                  value={candidateName}
                  onChange={(e) => setCandidateName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition font-medium"
                />
              </div>

              {/* SECTION B: Target Role Benchmark (Immediately below User Name) */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Target Role Benchmark &amp; Industry Rigor
                    </span>
                  </div>
                  <span className="text-[11px] font-semibold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded-full">
                    Affects Screening Expectations
                  </span>
                </div>

                {/* Company Tier Selector */}
                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-slate-700">
                    Target Industry / Company Tier:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {COMPANY_TIERS.map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => {
                          setTargetTier(tier.id);
                          setCustomTierInput('');
                        }}
                        className={`text-left p-3 rounded-lg border transition text-xs cursor-pointer ${
                          targetTier === tier.id && !customTierInput
                            ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 text-blue-900 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="font-bold">{tier.label}</div>
                        <div className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2">
                          {tier.desc}
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Or Type Custom Tier */}
                  <div className="pt-1">
                    <input
                      type="text"
                      value={customTierInput}
                      onChange={(e) => setCustomTierInput(e.target.value)}
                      placeholder="Or specify custom tier (e.g. High-Frequency Trading, Remote US Tech, Boutique Agency)..."
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Experience Level Selector */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200/80">
                  <span className="block text-xs font-semibold text-slate-700">
                    Experience Level:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {EXPERIENCE_LEVELS.map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setExperienceLevel(level)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                          experienceLevel === level
                            ? 'bg-blue-600 text-white shadow-xs'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION C: Target Job Role */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>Target Job Role</span>
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Junior Full-Stack Developer, AI/ML Engineer..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white transition font-medium"
                />

                {/* Quick Role Suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400">Popular:</span>
                  {POPULAR_ROLES.map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setTargetRole(role)}
                      className={`text-[11px] px-2.5 py-1 rounded-md transition font-medium cursor-pointer ${
                        targetRole === role
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      {role.split('(')[0].trim()}
                    </button>
                  ))}
                </div>

                {/* Localized Tech Industry Salary Benchmark Card */}
                <div className="mt-3 bg-gradient-to-r from-emerald-50/90 via-teal-50/40 to-slate-50 border border-emerald-200 rounded-xl p-3.5 shadow-2xs space-y-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-emerald-600 text-white flex items-center justify-center shadow-2xs">
                        <Banknote className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                        Estimated Market Salary Benchmark
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {salaryBenchmark.demandStatus}
                      </span>
                    </div>

                    <span className="text-[11px] text-slate-500 font-medium">
                      Calibrated for <strong className="text-slate-800">{effectiveTier}</strong> • {experienceLevel}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-baseline gap-3 pt-0.5">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-lg font-black text-emerald-900 tracking-tight">
                        {salaryBenchmark.inrRange}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        ({salaryBenchmark.usdRange})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-600 border-l border-emerald-200 pl-3">
                      <span>Median: <strong className="text-slate-800">{salaryBenchmark.medianInr}</strong></span>
                      <span>•</span>
                      <span>Top 25%: <strong className="text-slate-800">{salaryBenchmark.percentile75}</strong></span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-snug">
                    <strong className="text-emerald-950 font-semibold">Key Compensation Driver:</strong> {salaryBenchmark.keyCompensationDriver}
                  </p>
                </div>
              </div>

              {/* SECTION D: Current Skills with Granular Proficiency */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Current Skills &amp; Proficiency ({skillsList.length} Added):
                    </label>
                    <span className="text-[11px] text-slate-500">
                      Specify Beginner, Intermediate, or Advanced for each skill to refine gap depth analysis.
                    </span>
                  </div>
                  {skillsList.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSkillsList([])}
                      className="text-[11px] text-slate-400 hover:text-rose-600 transition cursor-pointer"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Active Skill Tags Display with Interactive Dropdown/Badges */}
                <div className="min-h-[64px] bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-wrap gap-2.5 items-center">
                  {skillsList.map((skill) => {
                    const profStyles = {
                      Beginner: 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200',
                      Intermediate: 'bg-blue-100 text-blue-900 border-blue-300 hover:bg-blue-200',
                      Advanced: 'bg-emerald-100 text-emerald-900 border-emerald-300 hover:bg-emerald-200',
                    }[skill.proficiency];

                    return (
                      <div
                        key={skill.name}
                        className="inline-flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-xs transition hover:border-slate-300"
                      >
                        <span className="font-bold text-slate-900">{skill.name}</span>
                        
                        {/* Interactive Proficiency Toggle Selector */}
                        <div className="relative inline-flex items-center">
                          <select
                            value={skill.proficiency}
                            onChange={(e) => handleUpdateProficiency(skill.name, e.target.value as SkillProficiency)}
                            className={`text-[10px] font-bold px-2 py-0.5 rounded border transition cursor-pointer focus:outline-none ${profStyles}`}
                            title="Click to change proficiency level"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill.name)}
                          className="w-4 h-4 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition cursor-pointer"
                          title="Remove skill"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })}

                  {skillsList.length === 0 && (
                    <div className="text-xs text-slate-400 italic py-1">
                      No skills added yet. Type a skill below or click suggestions.
                    </div>
                  )}
                </div>

                {/* Add New Skill Input Bar with Default Proficiency Selector */}
                <div className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={customSkillInput}
                      onChange={(e) => setCustomSkillInput(e.target.value)}
                      onKeyDown={handleKeyDownSkill}
                      placeholder="Type a skill (e.g. Docker, TypeScript, Fastify) and press Enter..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white font-medium"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      {(['Beginner', 'Intermediate', 'Advanced'] as SkillProficiency[]).map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setSelectedProficiencyForNew(level)}
                          className={`text-[10px] px-2.5 py-1 rounded-md font-bold transition cursor-pointer ${
                            selectedProficiencyForNew === level
                              ? level === 'Beginner'
                                ? 'bg-amber-600 text-white shadow-xs'
                                : level === 'Intermediate'
                                ? 'bg-blue-600 text-white shadow-xs'
                                : 'bg-emerald-600 text-white shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAddSkill(customSkillInput)}
                      disabled={!customSkillInput.trim()}
                      className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>

                {/* Suggested Skill Chips with Quick Add */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-slate-400 mr-1">Quick Add:</span>
                  {SUGGESTED_SKILLS.filter((s) => !skillsList.some((item) => item.name.toLowerCase() === s.toLowerCase()))
                    .slice(0, 8)
                    .map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleAddSkill(skill, selectedProficiencyForNew)}
                        className="text-[11px] px-2.5 py-1 rounded-md bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition flex items-center gap-1 cursor-pointer"
                        title={`Add ${skill} as ${selectedProficiencyForNew}`}
                      >
                        <Plus className="w-2.5 h-2.5 text-emerald-600" />
                        <span>{skill}</span>
                        <span className="text-[9px] text-slate-400">({selectedProficiencyForNew[0]})</span>
                      </button>
                    ))}
                </div>
              </div>

              {/* SECTION E: Academic Background */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Academic Major / Degree</label>
                  <input
                    type="text"
                    value={academicMajor}
                    onChange={(e) => setAcademicMajor(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                    placeholder="e.g. B.Tech Computer Science"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Institution / College Context</label>
                  <input
                    type="text"
                    value={locationContext}
                    onChange={(e) => setLocationContext(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-blue-500 font-medium"
                    placeholder="e.g. Tier-2/3 University, Class of 2026"
                  />
                </div>
              </div>

              {/* Error Notice */}
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  {errorMsg}
                </div>
              )}

              {/* Primary Action Button */}
              <button
                type="button"
                onClick={handleRunAudit}
                disabled={isLoading}
                className="w-full py-4 px-6 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20 flex items-center justify-center gap-2.5 transition transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Auditing Skills against {effectiveTier} 2026 Benchmarks...</span>
                  </>
                ) : (
                  <>
                    <span>Audit Skill Gap &amp; Generate Roadmap</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* STEP 2: Dashboard Result with PDF Download */
          <div className="space-y-6">
            <ResultsDashboard
              data={auditResult}
              candidateName={candidateName}
              targetRole={targetRole}
              targetTier={effectiveTier}
              experienceLevel={experienceLevel}
              academicMajor={academicMajor}
              currentSkills={skillsList.map((s) => `${s.name} (${s.proficiency})`).join(', ')}
              skillsWithProficiency={skillsList}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-5 mt-12 text-xs text-slate-500">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center">
            <Award className="w-4 h-4 text-emerald-600" />
            <span>
              <strong>SkillGap AI</strong> • Aligned with UN SDG 8 (Decent Work and Economic Growth).
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span>Powered by Gemini 3.8 Flash</span>
            <span>•</span>
            <span>Live 2026 Search Grounded</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
