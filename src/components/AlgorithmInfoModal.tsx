import React, { useState } from 'react';
import { CipherType } from '../types/cipher';
import { CIPHER_METADATA } from '../ciphers/metadata';
import { X, BookOpen, ShieldAlert, Award, GraduationCap, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { sfx } from '../utils/audio';

interface Props {
  cipherType: CipherType;
  isOpen: boolean;
  onClose: () => void;
}

export const AlgorithmInfoModal: React.FC<Props> = ({ cipherType, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'viva'>('overview');
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(0);

  if (!isOpen) return null;

  const info = CIPHER_METADATA[cipherType];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.15)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-100 font-mono">{info.name}</h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${info.badgeColor}`}>
                  {info.category}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {info.inventor} • {info.era}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sfx.playClick();
              onClose();
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-5">
          <button
            onClick={() => {
              sfx.playClick();
              setActiveTab('overview');
            }}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-mono text-xs font-semibold transition-all ${
              activeTab === 'overview'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Award className="w-4 h-4" />
            Technical Architecture & History
          </button>
          <button
            onClick={() => {
              sfx.playClick();
              setActiveTab('viva');
            }}
            className={`flex items-center gap-2 py-3 px-4 border-b-2 font-mono text-xs font-semibold transition-all ${
              activeTab === 'viva'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            College Viva Prep ({info.vivaQuestions.length} Q&As)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
          {activeTab === 'overview' ? (
            <div className="space-y-6 text-xs font-mono">
              {/* Tagline */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 leading-relaxed">
                {info.tagline}
              </div>

              {/* Mathematical Formulas */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-cyan-400 font-semibold">
                  Modular Mathematical Formulation
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-slate-950 border border-cyan-500/20 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">Encryption Function</span>
                    <div className="text-cyan-300 font-bold font-mono text-xs">{info.formula.encrypt}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950 border border-emerald-500/20 space-y-1">
                    <span className="text-[10px] text-slate-500 uppercase">Decryption Function</span>
                    <div className="text-emerald-300 font-bold font-mono text-xs">{info.formula.decrypt}</div>
                  </div>
                </div>
              </div>

              {/* Key Space */}
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-[10px] text-slate-500 uppercase">Theoretical Key Space</span>
                <div className="text-slate-200 font-bold">{info.keySpace}</div>
              </div>

              {/* How It Works */}
              <div className="space-y-2">
                <span className="text-[11px] uppercase tracking-wider text-slate-300 font-semibold">
                  How The Algorithm Operates
                </span>
                <ul className="space-y-2 pl-1">
                  {info.howItWorks.map((step, idx) => (
                    <li key={`how-${idx}`} className="flex items-start gap-2.5 text-slate-400">
                      <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-emerald-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                    <Award className="w-4 h-4" />
                    <span>Cryptographic Strengths</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-400">
                    {info.strengths.map((str, idx) => (
                      <li key={`str-${idx}`} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">+</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/60 border border-rose-500/20 space-y-2">
                  <div className="flex items-center gap-1.5 text-rose-400 font-bold">
                    <ShieldAlert className="w-4 h-4" />
                    <span>Vulnerabilities & Attacks</span>
                  </div>
                  <ul className="space-y-1.5 text-slate-400">
                    {info.weaknesses.map((weak, idx) => (
                      <li key={`weak-${idx}`} className="flex items-start gap-2">
                        <span className="text-rose-400 font-bold">-</span>
                        <span>{weak}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-3 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-xs font-mono text-cyan-300">
                💡 <strong>College Viva Examiner Pro-Tip:</strong> Professors frequently ask about frequency analysis, key space limitations, and modular arithmetic proofs. Review the answers below before your demonstration!
              </div>

              <div className="space-y-3">
                {info.vivaQuestions.map((item, idx) => {
                  const isExpanded = expandedQuestion === idx;
                  return (
                    <div
                      key={`viva-${idx}`}
                      className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => {
                          sfx.playClick();
                          setExpandedQuestion(isExpanded ? null : idx);
                        }}
                        className="w-full flex items-center justify-between p-4 text-left font-mono text-xs font-semibold text-slate-200 hover:text-cyan-300 hover:bg-slate-900/50 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-400 flex items-center justify-center text-[10px]">
                            {idx + 1}
                          </span>
                          <span>{item.question}</span>
                        </span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                        )}
                      </button>

                      {isExpanded && (
                        <div className="p-4 pt-1 border-t border-slate-800/80 text-xs font-mono text-slate-400 leading-relaxed bg-slate-900/30">
                          <p className="pl-7">{item.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
