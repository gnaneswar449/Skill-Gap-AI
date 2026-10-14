import React, { useState } from 'react';
import {
  Copy,
  Check,
  Code2,
  FileText,
  Sparkles,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  ExternalLink,
} from 'lucide-react';
import {
  SYSTEM_INSTRUCTION_TEXT,
  PROMPT_TEMPLATE_TEXT,
  JSON_SCHEMA_SPEC,
  FEW_SHOT_EXAMPLE,
  PROMPT_VARIABLES,
} from '../data/promptSpec';

interface PromptBlueprintViewProps {
  onLoadPresetToPlayground?: (presetId: string) => void;
}

export const PromptBlueprintView: React.FC<PromptBlueprintViewProps> = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [schemaMode, setSchemaMode] = useState<'json' | 'ts'>('json');
  const [showFewShotOutput, setShowFewShotOutput] = useState(true);

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const tsSchemaSnippet = `// @google/genai TypeScript SDK responseSchema definition
import { GoogleGenAI, Type } from "@google/genai";

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    readinessScore: {
      type: Type.INTEGER,
      description: "Objective market readiness percentage (0-100).",
    },
    readinessLevel: {
      type: Type.STRING,
      description: "Readiness stage classification.",
    },
    executiveSummary: {
      type: Type.STRING,
      description: "2-3 sentence overview assessing candidate strengths and bridges.",
    },
    skillGaps: {
      type: Type.ARRAY,
      description: "List of critical missing technical skills or tools.",
      items: {
        type: Type.OBJECT,
        properties: {
          skill: { type: Type.STRING },
          category: {
            type: Type.STRING,
            description: "core_language | framework | tools_devops | system_design | testing | database",
          },
          priority: { type: Type.STRING, description: "Critical | High | Moderate" },
          marketDemandReason: { type: Type.STRING },
          recommendedFreeResource: { type: Type.STRING },
        },
        required: ["skill", "category", "priority", "marketDemandReason", "recommendedFreeResource"],
      },
    },
    roadmap: {
      type: Type.ARRAY,
      description: "Structured 4-week actionable checklist.",
      items: {
        type: Type.OBJECT,
        properties: {
          weekNumber: { type: Type.INTEGER },
          theme: { type: Type.STRING },
          coreConcepts: { type: Type.ARRAY, items: { type: Type.STRING } },
          checklist: { type: Type.ARRAY, items: { type: Type.STRING } },
          capstoneDeliverable: { type: Type.STRING },
          estimatedHours: { type: Type.INTEGER },
        },
        required: ["weekNumber", "theme", "coreConcepts", "checklist", "capstoneDeliverable", "estimatedHours"],
      },
    },
    portfolioSummary: {
      type: Type.STRING,
      description: "Recruiter-ready portfolio markdown block with LinkedIn headline/about and resume bullets.",
    },
    marketViabilityAnalysis: {
      type: Type.OBJECT,
      properties: {
        targetRoleDemand: { type: Type.STRING },
        entryLevelExpectations: { type: Type.ARRAY, items: { type: Type.STRING } },
        sdg8ImpactNote: { type: Type.STRING },
      },
      required: ["targetRoleDemand", "entryLevelExpectations", "sdg8ImpactNote"],
    },
  },
  required: [
    "readinessScore",
    "readinessLevel",
    "executiveSummary",
    "skillGaps",
    "roadmap",
    "portfolioSummary",
    "marketViabilityAnalysis",
  ],
};`;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-blue-900/40 via-indigo-900/30 to-slate-900/60 border border-blue-500/20 rounded-2xl p-6 sm:p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
            <Award className="w-3.5 h-3.5" />
            UN SDG 8: Decent Work & Economic Growth
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Google AI Studio Prompt Engineering Blueprint
          </h2>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
            A comprehensive, battle-tested system prompt, dynamic variable template, and JSON schema contract designed for
            <span className="text-blue-400 font-semibold"> SkillGap AI</span>. Calibrated to evaluate academic graduates and tier-2/3 college job seekers with high-signal proof-of-work hiring guidance.
          </p>

          <div className="mt-5 flex flex-wrap gap-3 text-xs text-slate-300">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Recommended Model: <strong className="text-white">gemini-3.8-flash</strong>
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              Temperature: <strong className="text-white">0.3 - 0.5</strong> (Structured Precision)
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700">
              <Code2 className="w-3.5 h-3.5 text-indigo-400" />
              Response Format: <strong className="text-white">application/json</strong>
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 1: System Instructions / Role Definition */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-sm">
              01
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                System Instructions / Role Definition
              </h3>
              <p className="text-xs text-slate-400">
                Persona configuration, SDG 8 economic growth framing, scoring calibration & operational constraints
              </p>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(SYSTEM_INSTRUCTION_TEXT, 'system')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {copiedSection === 'system' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy System Prompt
              </>
            )}
          </button>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-5">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              Recruitment Persona
            </div>
            <div className="text-sm font-medium text-slate-200">Senior Hiring Architect & Talent Scout</div>
            <p className="text-xs text-slate-400 mt-1">
              Calibrated to evaluate candidate skills against 2026 production hiring standards without credential bias.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              SDG 8 Alignment
            </div>
            <div className="text-sm font-medium text-slate-200">Decent Work & Economic Mobility</div>
            <p className="text-xs text-slate-400 mt-1">
              Bypasses regional placement barriers in tier-2/3 universities by engineering proof-of-work repositories.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50">
            <div className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
              Scoring Calibration
            </div>
            <div className="text-sm font-medium text-slate-200">Strict Non-Inflated Rubric (0-100%)</div>
            <p className="text-xs text-slate-400 mt-1">
              Honest scoring that distinguishes syllabus knowledge from production readiness, avoiding false confidence.
            </p>
          </div>
        </div>

        {/* System Prompt Code Box */}
        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-mono">Google AI Studio &gt; System Instructions (Ready to paste)</span>
            <span>~510 tokens</span>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
            {SYSTEM_INSTRUCTION_TEXT}
          </pre>
        </div>
      </section>

      {/* SECTION 2: Structured Output Requirements (JSON Schema / Markdown) */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold text-sm">
              02
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Structured Output Requirements (JSON Schema & Markdown)
              </h3>
              <p className="text-xs text-slate-400">
                Guarantees deterministic JSON output with <code className="text-indigo-300">readinessScore</code>, <code className="text-indigo-300">skillGaps</code>, <code className="text-indigo-300">roadmap</code>, and <code className="text-indigo-300">portfolioSummary</code>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex p-1 bg-slate-950 border border-slate-800 rounded-lg text-xs">
              <button
                onClick={() => setSchemaMode('json')}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  schemaMode === 'json' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                JSON Schema
              </button>
              <button
                onClick={() => setSchemaMode('ts')}
                className={`px-3 py-1 rounded-md font-medium transition ${
                  schemaMode === 'ts' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                @google/genai SDK
              </button>
            </div>
            <button
              onClick={() =>
                copyToClipboard(
                  schemaMode === 'json' ? JSON.stringify(JSON_SCHEMA_SPEC, null, 2) : tsSchemaSnippet,
                  'schema'
                )
              }
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
            >
              {copiedSection === 'schema' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  Copy Schema
                </>
              )}
            </button>
          </div>
        </div>

        {/* Required Fields Spec Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-5">
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-emerald-400">readinessScore</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Integer (0-100)
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Unflinching market suitability score calibrated against real hiring screens.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-rose-400">skillGaps</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                Array of Objects
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              High-friction tools & skills missing from the profile with hiring rationale and free learning pathways.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-amber-400">roadmap</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                4-Week Array
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              Week-by-week actionable checklist, study hours, and verifiable Sunday capstone deliverable.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-semibold text-blue-400">portfolioSummary</span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Markdown String
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-2">
              LinkedIn headline, about bio, 3 XYZ quantified resume bullets, and production project blueprint.
            </p>
          </div>
        </div>

        {/* Code Box */}
        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-mono">
              {schemaMode === 'json' ? 'Standard JSON Schema (Draft-7)' : '@google/genai Type Schema'}
            </span>
            <span className="text-emerald-400 font-mono">Strict Structured Output Compliant</span>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
            {schemaMode === 'json' ? JSON.stringify(JSON_SCHEMA_SPEC, null, 2) : tsSchemaSnippet}
          </pre>
        </div>
      </section>

      {/* SECTION 3: Prompt Template / User Input Variables */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold text-sm">
              03
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Prompt Template / User Input Variables
              </h3>
              <p className="text-xs text-slate-400">
                Template syntax using double curly brace variables for Google AI Studio parameterization
              </p>
            </div>
          </div>
          <button
            onClick={() => copyToClipboard(PROMPT_TEMPLATE_TEXT, 'template')}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {copiedSection === 'template' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied Template!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Template
              </>
            )}
          </button>
        </div>

        {/* Variables Table */}
        <div className="my-5 overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden">
            <thead className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-4 font-mono text-purple-400">Variable Key</th>
                <th className="py-2.5 px-4">Label</th>
                <th className="py-2.5 px-4">Description & Example</th>
                <th className="py-2.5 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-950/40 text-slate-300">
              {PROMPT_VARIABLES.map((v) => (
                <tr key={v.key} className="hover:bg-slate-800/20">
                  <td className="py-2.5 px-4 font-mono text-purple-300 font-semibold">
                    {`{{${v.key}}}`}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-white">{v.label}</td>
                  <td className="py-2.5 px-4 text-slate-400">
                    <div>{v.description}</div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">{v.placeholder}</div>
                  </td>
                  <td className="py-2.5 px-4 text-center">
                    {v.required ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        Required
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-700 text-slate-300">
                        Optional
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Template Code Box */}
        <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs text-slate-400">
            <span className="font-mono">Google AI Studio &gt; User Prompt Box (Dynamic Template)</span>
            <span>~170 tokens</span>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {PROMPT_TEMPLATE_TEXT}
          </pre>
        </div>
      </section>

      {/* SECTION 4: Few-Shot Example & Tone Guidance */}
      <section className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
              04
            </div>
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Few-Shot Example & Tone Guidance
              </h3>
              <p className="text-xs text-slate-400">
                Calibrated for university students and tier-2/3 city candidates: encouraging, dignified, and razor-sharp
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              copyToClipboard(JSON.stringify(FEW_SHOT_EXAMPLE, null, 2), 'fewshot')
            }
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            {copiedSection === 'fewshot' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied Few-Shot!
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy Few-Shot Data
              </>
            )}
          </button>
        </div>

        {/* Tone Principles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-5">
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              Dignified & Empathetic
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Recognizes that students from tier-2/3 universities often lack on-campus company visits or industry mentors. Replaces imposter syndrome with clear, incremental agency.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
              Jargon Demystifier
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Never throws abstract requirements like &quot;scalable microservices&quot; or &quot;enterprise architecture&quot; without translating them into concrete GitHub repositories and test suites.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60">
            <div className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
              Proof-of-Work Focus
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Emphasizes live URLs, Dockerfiles, and GitHub commits as the ultimate equalizer against prestige-school resume filtering.
            </p>
          </div>
        </div>

        {/* Few-Shot Example Card */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
          <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white">
                Golden Few-Shot Example: Rohan Deshmukh (Tier-3 IT → Java Backend Engineer)
              </span>
            </div>
            <button
              onClick={() => setShowFewShotOutput(!showFewShotOutput)}
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 font-medium"
            >
              {showFewShotOutput ? (
                <>
                  Collapse Output <ChevronUp className="w-3.5 h-3.5" />
                </>
              ) : (
                <>
                  Expand Output <ChevronDown className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>

          <div className="p-4 space-y-4">
            {/* Input Snapshot */}
            <div className="bg-slate-900/80 rounded-lg p-3 text-xs border border-slate-800/80">
              <span className="text-slate-400 font-semibold block mb-1">Sample User Input:</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                <div>
                  <span className="text-slate-400">Student:</span> Rohan Deshmukh
                </div>
                <div>
                  <span className="text-slate-400">Target Role:</span> Junior Backend Engineer (Java / Spring Boot)
                </div>
                <div>
                  <span className="text-slate-400">Major:</span> B.E. Information Technology (Tier-3 Private College)
                </div>
                <div>
                  <span className="text-slate-400">Current Skills:</span> Core Java, OOPs, Basic SQL, JDBC, Git clone/push
                </div>
              </div>
            </div>

            {/* Model Output Snapshot */}
            {showFewShotOutput && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-semibold">Structured Model Response:</span>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 font-mono font-bold">
                      readinessScore: 58%
                    </span>
                    <span className="text-slate-400">4 Critical Gaps Identified</span>
                  </div>
                </div>

                <div className="bg-slate-950 rounded-lg p-4 font-mono text-[11px] text-slate-300 max-h-80 overflow-y-auto border border-slate-800/60 leading-relaxed whitespace-pre-wrap">
                  {JSON.stringify(FEW_SHOT_EXAMPLE.output, null, 2)}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
