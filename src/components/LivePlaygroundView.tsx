import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
  Eye,
  Sliders,
  Check,
  AlertCircle,
  Loader2,
  Bookmark,
} from 'lucide-react';
import { SAMPLE_PRESETS, CareerGuidanceOutput } from '../data/promptSpec';
import { ResultsDashboard } from './ResultsDashboard';

export const LivePlaygroundView: React.FC = () => {
  const [formData, setFormData] = useState({
    studentName: SAMPLE_PRESETS[0].data.studentName,
    academicMajor: SAMPLE_PRESETS[0].data.academicMajor,
    currentSkills: SAMPLE_PRESETS[0].data.currentSkills,
    targetRole: SAMPLE_PRESETS[0].data.targetRole,
    experienceLevel: SAMPLE_PRESETS[0].data.experienceLevel,
    locationContext: SAMPLE_PRESETS[0].data.locationContext,
  });

  const [activePresetId, setActivePresetId] = useState<string>(SAMPLE_PRESETS[0].id);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [results, setResults] = useState<CareerGuidanceOutput | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPromptPreview, setShowPromptPreview] = useState<boolean>(false);

  const handleSelectPreset = (presetId: string) => {
    const selected = SAMPLE_PRESETS.find((p) => p.id === presetId);
    if (selected) {
      setActivePresetId(presetId);
      setFormData({
        studentName: selected.data.studentName,
        academicMajor: selected.data.academicMajor,
        currentSkills: selected.data.currentSkills,
        targetRole: selected.data.targetRole,
        experienceLevel: selected.data.experienceLevel,
        locationContext: selected.data.locationContext,
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRunEvaluation = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-career-guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const guidance: CareerGuidanceOutput = await response.json();
      setResults(guidance);
    } catch (err: any) {
      console.error('Execution error:', err);
      setErrorMsg(err.message || 'Failed to generate career guidance. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Interpolated prompt preview
  const interpolatedPrompt = `Please evaluate the following candidate for the role of ${formData.targetRole} and generate an actionable skill-to-job readiness evaluation, 4-week roadmap, and portfolio block aligned with SDG 8.

Candidate Profile:
- Full Name: ${formData.studentName}
- Academic Major & Degree: ${formData.academicMajor}
- Current Technical Skills: ${formData.currentSkills}
- Target Role: ${formData.targetRole}
- Experience Status: ${formData.experienceLevel}
- Institution / Location Context: ${formData.locationContext}

Analyze the candidate's profile against 2026 industry standards and provide:
1. An objective readiness percentage score (0-100) and readiness stage classification.
2. An executive summary summarizing strengths, latent potential, and primary bridges needed.
3. Categorized critical skill gaps prioritized by hiring urgency, explaining why each is required on day-one and recommending high-quality free learning resources.
4. A 4-week intensive upskilling roadmap with weekly themes, core topics, concrete task checklists, realistic weekly study hours, and a weekly capstone deliverable.
5. A recruiter-ready Portfolio Summary in Markdown format containing:
   - A high-impact LinkedIn Headline and About Bio.
   - Three quantified resume bullet points highlighting technical outcomes (Google XYZ format: "Accomplished [X], as measured by [Y], by doing [Z]").
   - A Capstone Project Blueprint designed to prove production readiness to hiring managers.
6. A brief market viability analysis highlighting target role hiring trends and SDG 8 economic mobility context.`;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Playground Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            Live Prompt Runner & Verification Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Test the prompt template and JSON Schema against real student profiles with live Gemini API execution
          </p>
        </div>

        {/* Preset Selector Dropdown / Chips */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Load Persona:</span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                className={`px-2.5 py-1 text-xs rounded-lg font-medium transition ${
                  activePresetId === p.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {p.title.split('→')[0].trim()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Variables Form (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                Prompt Template Variables
              </h3>
              <button
                onClick={() => setShowPromptPreview(!showPromptPreview)}
                className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
              >
                <Eye className="w-3.5 h-3.5" />
                {showPromptPreview ? 'Hide Prompt' : 'Preview Prompt'}
              </button>
            </div>

            {/* Variable Inputs */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Student Name <span className="text-purple-400 font-mono">{"{{studentName}}"}</span>
                </label>
                <input
                  type="text"
                  value={formData.studentName}
                  onChange={(e) => handleInputChange('studentName', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Aarav Sharma"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Academic Major <span className="text-purple-400 font-mono">{"{{academicMajor}}"}</span>
                </label>
                <input
                  type="text"
                  value={formData.academicMajor}
                  onChange={(e) => handleInputChange('academicMajor', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. B.Tech in Electronics (Tier-3 College)"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Target Job Role <span className="text-purple-400 font-mono">{"{{targetRole}}"}</span>
                </label>
                <input
                  type="text"
                  value={formData.targetRole}
                  onChange={(e) => handleInputChange('targetRole', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Junior Full-Stack Developer (React & Node.js)"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Current Skills & Tools <span className="text-purple-400 font-mono">{"{{currentSkills}}"}</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.currentSkills}
                  onChange={(e) => handleInputChange('currentSkills', e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-blue-500 resize-none font-mono text-[11px]"
                  placeholder="e.g. C++, Python basics, HTML/CSS, MySQL, Git basics"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Experience Status <span className="text-purple-400 font-mono">{"{{experienceLevel}}"}</span>
                  </label>
                  <input
                    type="text"
                    value={formData.experienceLevel}
                    onChange={(e) => handleInputChange('experienceLevel', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    College / Region <span className="text-purple-400 font-mono">{"{{locationContext}}"}</span>
                  </label>
                  <input
                    type="text"
                    value={formData.locationContext}
                    onChange={(e) => handleInputChange('locationContext', e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-blue-500 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Interpolated Prompt Preview Modal/Accordion */}
            {showPromptPreview && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                  <span>Interpolated Prompt Payload:</span>
                  <span className="font-mono text-purple-400">gemini-3.8-flash</span>
                </div>
                <pre className="text-[11px] font-mono text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                  {interpolatedPrompt}
                </pre>
              </div>
            )}

            {/* Action Run Button */}
            <button
              onClick={handleRunEvaluation}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Structured Career Guidance...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  Run SkillGap AI Evaluation
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Execution Output & Dashboard (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <div>
                <strong>Execution Notice:</strong> {errorMsg}
              </div>
            </div>
          )}

          {results ? (
            <ResultsDashboard
              data={results}
              candidateName={formData.studentName}
              targetRole={formData.targetRole}
              academicMajor={formData.academicMajor}
              currentSkills={formData.currentSkills}
            />
          ) : (
            <div className="bg-slate-900/60 border border-dashed border-slate-800 rounded-2xl p-12 text-center flex flex-col items-center justify-center min-h-[460px]">
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">Ready to Run Evaluation</h3>
              <p className="text-xs text-slate-400 max-w-md leading-relaxed mb-6">
                Click &quot;Run SkillGap AI Evaluation&quot; on the left to execute the system prompt with the candidate profile. You will receive an objective readiness score (0-100), prioritized skill gaps, 4-week roadmap checklist, and recruiter portfolio summary.
              </p>
              <button
                onClick={handleRunEvaluation}
                disabled={isLoading}
                className="px-5 py-2.5 rounded-xl font-semibold text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition flex items-center gap-2"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                Run Default Preset ({formData.studentName})
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
