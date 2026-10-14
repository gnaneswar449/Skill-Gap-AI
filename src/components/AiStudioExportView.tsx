import React, { useState } from 'react';
import {
  Download,
  Copy,
  Check,
  ExternalLink,
  Sliders,
  Sparkles,
  Award,
  Layers,
  Terminal,
  FileJson,
  CheckCircle2,
} from 'lucide-react';
import {
  SYSTEM_INSTRUCTION_TEXT,
  PROMPT_TEMPLATE_TEXT,
  JSON_SCHEMA_SPEC,
  FEW_SHOT_EXAMPLE,
} from '../data/promptSpec';

export const AiStudioExportView: React.FC = () => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const fullAiStudioBundle = {
    app_metadata: {
      name: 'SkillGap AI: Dynamic Skill-to-Job Readiness & Portfolio Generator',
      alignment: 'UN SDG 8: Decent Work and Economic Growth',
      version: '2026.1',
      target_demographic: 'University Students, Tier-2/3 College Job Seekers, Non-Traditional Tech Switchers',
    },
    model_config: {
      model: 'models/gemini-3.8-flash',
      temperature: 0.4,
      topP: 0.95,
      topK: 64,
      response_mime_type: 'application/json',
      response_schema: JSON_SCHEMA_SPEC,
    },
    system_instruction: {
      parts: [
        {
          text: SYSTEM_INSTRUCTION_TEXT,
        },
      ],
    },
    prompt_template: {
      text: PROMPT_TEMPLATE_TEXT,
      input_variables: [
        'studentName',
        'academicMajor',
        'currentSkills',
        'targetRole',
        'experienceLevel',
        'locationContext',
      ],
    },
    few_shot_calibration: FEW_SHOT_EXAMPLE,
  };

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(fullAiStudioBundle, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'skillgap-ai-studio-prompt-config.json';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 mb-3">
              <FileJson className="w-3.5 h-3.5" />
              Direct Google AI Studio Deployment
            </div>
            <h2 className="text-2xl font-bold text-white">Google AI Studio Setup & Export</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Export and copy the complete configuration required to launch SkillGap AI directly in Google AI Studio or integrate via the Gemini API SDK.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleDownloadJson}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition shadow-lg shadow-blue-500/20"
            >
              <Download className="w-4 h-4" />
              Download Config JSON
            </button>
            <a
              href="https://aistudio.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              <ExternalLink className="w-4 h-4" />
              Open AI Studio
            </a>
          </div>
        </div>
      </div>

      {/* Step-by-Step AI Studio Setup Instructions */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          5-Minute Google AI Studio Configuration Steps
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-blue-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-300 flex items-center justify-center text-[10px]">
                  1
                </span>
                Model Selection
              </span>
              <span className="font-mono text-emerald-400">gemini-3.8-flash</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              In Google AI Studio, select <strong>gemini-3.8-flash</strong>. It provides ultra-fast latency (~1s), reliable JSON schema adherence, and zero cost.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px]">
                  2
                </span>
                System Instructions
              </span>
              <button
                onClick={() => handleCopy(SYSTEM_INSTRUCTION_TEXT, 'sys_step')}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
              >
                {copiedKey === 'sys_step' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy Prompt
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Expand the <strong>&quot;System Instructions&quot;</strong> panel on the left sidebar. Paste the provided Role Definition, SDG 8 Persona, and non-inflated scoring calibration text.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-purple-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center text-[10px]">
                  3
                </span>
                Structured Output (JSON Schema)
              </span>
              <button
                onClick={() => handleCopy(JSON.stringify(JSON_SCHEMA_SPEC, null, 2), 'schema_step')}
                className="text-slate-400 hover:text-white flex items-center gap-1 font-mono text-[11px]"
              >
                {copiedKey === 'schema_step' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                Copy Schema
              </button>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Under &quot;Run Settings&quot;, switch <strong>Response MIME type</strong> to <code className="text-purple-300">application/json</code> and paste the structured JSON Schema with <code className="text-purple-300">readinessScore</code>, <code className="text-purple-300">skillGaps</code>, and <code className="text-purple-300">roadmap</code>.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-400 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-[10px]">
                  4
                </span>
                Model Parameters
              </span>
              <span className="font-mono text-slate-400">Temp: 0.4 | Top-P: 0.95</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              Set <strong>Temperature to 0.3 - 0.5</strong>. This prevents creative hallucination, ensuring skill gaps and recommended study hours remain grounded in real technical hiring realities.
            </p>
          </div>
        </div>
      </div>

      {/* Raw Configuration JSON Preview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileJson className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-bold text-white">
              Complete AI Studio Prompt & Schema Package (.json)
            </h4>
          </div>
          <button
            onClick={() => handleCopy(JSON.stringify(fullAiStudioBundle, null, 2), 'bundle')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            {copiedKey === 'bundle' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied Full Package!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Full Package
              </>
            )}
          </button>
        </div>

        <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed">
          {JSON.stringify(fullAiStudioBundle, null, 2)}
        </pre>
      </div>

      {/* SDG 8 Alignment & Decent Work Impact Section */}
      <div className="bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/20 rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <h4 className="text-base font-bold text-white">
            UN SDG 8 Alignment: Decent Work & Economic Growth Rationale
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/10 space-y-1.5">
            <div className="font-bold text-emerald-400">Target 8.5: Full & Productive Employment</div>
            <p className="text-slate-400 leading-relaxed">
              Provides equal, unconstrained career guidance regardless of university brand, helping graduates from non-metro areas secure livable tech compensation.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/10 space-y-1.5">
            <div className="font-bold text-emerald-400">Target 8.6: Substantially Reduce Youth NEET</div>
            <p className="text-slate-400 leading-relaxed">
              Bridges the critical 4-week gap between academic graduation and market readiness with step-by-step verifiable milestones.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/10 space-y-1.5">
            <div className="font-bold text-emerald-400">Proof-of-Work Equalizer</div>
            <p className="text-slate-400 leading-relaxed">
              Substitutes pedigree filtering with public GitHub repositories, unit tests, and live deployed applications that recruiters can verify in 60 seconds.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
