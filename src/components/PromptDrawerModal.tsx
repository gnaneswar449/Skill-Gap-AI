import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  FileJson,
  Layers,
  Code2,
  ExternalLink,
  Award,
  Sliders,
} from 'lucide-react';
import {
  SYSTEM_INSTRUCTION_TEXT,
  PROMPT_TEMPLATE_TEXT,
  JSON_SCHEMA_SPEC,
  FEW_SHOT_EXAMPLE,
} from '../data/promptSpec';

interface PromptDrawerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PromptDrawerModal: React.FC<PromptDrawerModalProps> = ({ isOpen, onClose }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'system' | 'template' | 'schema' | 'fewshot'>('system');

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center font-bold">
              <Code2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm sm:text-base">
                Google AI Studio Architecture &amp; Prompt Spec
              </h3>
              <p className="text-xs text-slate-400">
                System Instructions, Prompt Template, JSON Schema &amp; SDG 8 calibration
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-800 px-4 bg-slate-950/30 gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('system')}
            className={`py-2.5 px-3 border-b-2 font-semibold transition ${
              activeTab === 'system'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            System Prompt
          </button>
          <button
            onClick={() => setActiveTab('template')}
            className={`py-2.5 px-3 border-b-2 font-semibold transition ${
              activeTab === 'template'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            User Prompt Template
          </button>
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-2.5 px-3 border-b-2 font-semibold transition ${
              activeTab === 'schema'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            JSON Schema
          </button>
          <button
            onClick={() => setActiveTab('fewshot')}
            className={`py-2.5 px-3 border-b-2 font-semibold transition ${
              activeTab === 'fewshot'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Few-Shot Example
          </button>
        </div>

        {/* Content Box */}
        <div className="p-5 flex-1 overflow-y-auto space-y-4 text-xs font-mono">
          {activeTab === 'system' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400">
                <span>Google AI Studio &gt; System Instructions:</span>
                <button
                  onClick={() => handleCopy(SYSTEM_INSTRUCTION_TEXT, 'modal_sys')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-sans text-xs font-medium"
                >
                  {copiedKey === 'modal_sys' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy System Prompt
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
                {SYSTEM_INSTRUCTION_TEXT}
              </pre>
            </div>
          )}

          {activeTab === 'template' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400">
                <span>Google AI Studio &gt; User Prompt (Variables: {`{{targetRole}}, {{currentSkills}}...`}):</span>
                <button
                  onClick={() => handleCopy(PROMPT_TEMPLATE_TEXT, 'modal_tmpl')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-sans text-xs font-medium"
                >
                  {copiedKey === 'modal_tmpl' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Template
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
                {PROMPT_TEMPLATE_TEXT}
              </pre>
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400">
                <span>Google AI Studio &gt; Structured Output (JSON Schema):</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(JSON_SCHEMA_SPEC, null, 2), 'modal_sch')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-sans text-xs font-medium"
                >
                  {copiedKey === 'modal_sch' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Schema
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-emerald-400/90 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
                {JSON.stringify(JSON_SCHEMA_SPEC, null, 2)}
              </pre>
            </div>
          )}

          {activeTab === 'fewshot' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-slate-400">
                <span>Few-Shot Calibration Example:</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(FEW_SHOT_EXAMPLE, null, 2), 'modal_few')}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1 font-sans text-xs font-medium"
                >
                  {copiedKey === 'modal_few' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Example
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[400px] overflow-y-auto">
                {JSON.stringify(FEW_SHOT_EXAMPLE, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs font-sans text-slate-400">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" />
            <span>UN SDG 8: Decent Work &amp; Economic Growth</span>
          </div>
          <a
            href="https://aistudio.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
          >
            Open Google AI Studio <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
