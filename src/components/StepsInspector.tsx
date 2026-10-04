import React, { useState } from 'react';
import { CipherResult, StepItem } from '../types/cipher';
import { ArrowRight, Filter, Search, ChevronLeft, ChevronRight, Play, Pause, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { sfx } from '../utils/audio';

interface Props {
  result: CipherResult;
}

export const StepsInspector: React.FC<Props> = ({ result }) => {
  const [filterAlphaOnly, setFilterAlphaOnly] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'debugger' | 'table'>('grid');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const steps = result.steps || [];
  const filteredSteps = steps.filter((step) => {
    if (filterAlphaOnly && !step.isAlpha) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        step.originalChar.toLowerCase().includes(q) ||
        step.transformedChar.toLowerCase().includes(q) ||
        step.detail.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Auto-play through steps in debugger mode
  React.useEffect(() => {
    let timer: any;
    if (isPlaying && filteredSteps.length > 0) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= filteredSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          const next = prev + 1;
          sfx.playBeep(440 + (next % 20) * 15, 'sine', 0.02, 0.02);
          return next;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, filteredSteps.length]);

  if (steps.length === 0) {
    return (
      <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <Terminal className="w-8 h-8 text-slate-600 mx-auto" />
        <div className="text-sm font-mono text-slate-400">No encryption steps generated yet.</div>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Enter plain text above and run encryption to inspect the step-by-step mathematical transformation.
        </p>
      </div>
    );
  }

  const activeStep = filteredSteps[currentStepIndex] || filteredSteps[0];

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold text-cyan-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            TRANSFORMATION STEPS:
          </span>
          <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono text-[11px]">
            {filteredSteps.length} of {steps.length}
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-950/80 border border-slate-800">
          <button
            onClick={() => {
              sfx.playClick();
              setViewMode('grid');
            }}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
              viewMode === 'grid'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Step Cards
          </button>
          <button
            onClick={() => {
              sfx.playClick();
              setViewMode('debugger');
            }}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
              viewMode === 'debugger'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Interactive Debugger
          </button>
          <button
            onClick={() => {
              sfx.playClick();
              setViewMode('table');
            }}
            className={`px-2.5 py-1 rounded text-xs font-mono transition-all ${
              viewMode === 'table'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Audit Log
          </button>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search steps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 w-32 sm:w-40"
            />
          </div>

          <button
            onClick={() => {
              sfx.playClick();
              setFilterAlphaOnly(!filterAlphaOnly);
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${
              filterAlphaOnly
                ? 'bg-cyan-950/50 border-cyan-500/30 text-cyan-300'
                : 'bg-slate-950 border-slate-800 text-slate-500'
            }`}
            title="Filter out spaces and punctuation"
          >
            <Filter className="w-3 h-3" />
            <span className="hidden sm:inline">Letters Only</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: STEP CARDS (GRID VIEW) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[520px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-800">
          <AnimatePresence>
            {filteredSteps.map((step, idx) => (
              <motion.div
                key={`step-card-${step.index}-${idx}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15, delay: Math.min(idx * 0.02, 0.3) }}
                className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all hover:shadow-[0_0_15px_rgba(0,240,255,0.08)] group"
              >
                {/* Header: Step Index & Transformation Target */}
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800/60">
                  <span className="text-[10px] font-mono text-slate-500">
                    STEP #{step.index + 1}
                  </span>
                  {step.isAlpha ? (
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded border border-emerald-500/20">
                      TRANSFORMED
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-800/40 px-1.5 py-0.5 rounded">
                      BYPASS
                    </span>
                  )}
                </div>

                {/* Big Visual Transition: H → K */}
                <div className="flex items-center justify-center gap-3 py-2">
                  <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-700/80 flex items-center justify-center font-mono font-bold text-slate-100 text-lg shadow-inner">
                    {step.originalChar === ' ' ? '␣' : step.originalChar}
                  </div>

                  <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />

                  <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-cyan-300 text-lg shadow-[0_0_12px_rgba(0,240,255,0.2)]">
                    {step.transformedChar === ' ' ? '␣' : step.transformedChar}
                  </div>
                </div>

                {/* Math / Technical Formula or Detail */}
                <div className="mt-2 pt-2 border-t border-slate-800/50">
                  {step.meta?.formula ? (
                    <div className="text-[11px] font-mono text-cyan-300/90 bg-slate-950/60 p-1.5 rounded border border-cyan-500/20 text-center font-semibold">
                      {step.meta.formula}
                    </div>
                  ) : (
                    <div className="text-[11px] font-mono text-slate-400 text-center truncate">
                      {step.detail}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* VIEW MODE 2: INTERACTIVE STEP DEBUGGER */}
      {viewMode === 'debugger' && activeStep && (
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-cyan-500/30 space-y-6">
          {/* Debugger Playback Controls */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-slate-400">
                Step <strong className="text-cyan-300">{currentStepIndex + 1}</strong> of{' '}
                <strong className="text-slate-300">{filteredSteps.length}</strong>
              </span>

              <div className="flex items-center gap-1">
                <button
                  disabled={currentStepIndex <= 0}
                  onClick={() => {
                    sfx.playClick();
                    setCurrentStepIndex((prev) => Math.max(0, prev - 1));
                  }}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  disabled={currentStepIndex >= filteredSteps.length - 1}
                  onClick={() => {
                    sfx.playClick();
                    setCurrentStepIndex((prev) => Math.min(filteredSteps.length - 1, prev + 1));
                  }}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                sfx.playClick();
                setIsPlaying(!isPlaying);
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-mono transition-all"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              {isPlaying ? 'Pause Auto-Run' : 'Auto Step-Through'}
            </button>
          </div>

          {/* Active Step Large Showcase */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 py-4">
            <div className="text-center space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400">Input Character</div>
              <div className="w-20 h-20 rounded-2xl bg-slate-950 border-2 border-slate-700 flex items-center justify-center text-3xl font-mono font-bold text-slate-100 shadow-xl">
                {activeStep.originalChar === ' ' ? '␣' : activeStep.originalChar}
              </div>
              <div className="text-xs font-mono text-slate-500">
                ASCII {activeStep.originalChar.charCodeAt(0)}
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest">Cipher Operation</span>
              <ArrowRight className="w-8 h-8 text-cyan-400 animate-pulse" />
              {activeStep.meta?.shift !== undefined && (
                <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
                  Shift: +{activeStep.meta.shift}
                </span>
              )}
            </div>

            <div className="text-center space-y-2">
              <div className="text-xs font-mono uppercase tracking-wider text-cyan-400">Output Character</div>
              <div className="w-20 h-20 rounded-2xl bg-cyan-950/80 border-2 border-cyan-400 flex items-center justify-center text-3xl font-mono font-bold text-cyan-200 shadow-[0_0_25px_rgba(0,240,255,0.35)]">
                {activeStep.transformedChar === ' ' ? '␣' : activeStep.transformedChar}
              </div>
              <div className="text-xs font-mono text-cyan-500">
                ASCII {activeStep.transformedChar.charCodeAt(0)}
              </div>
            </div>
          </div>

          {/* Detailed Step Breakdown Card */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Execution Summary:</span>
            </div>
            <p className="text-xs font-mono text-slate-400 pl-6 leading-relaxed">
              {activeStep.detail}
            </p>
            {activeStep.meta?.formula && (
              <div className="pl-6 pt-1">
                <code className="text-xs font-mono font-bold text-cyan-300 bg-slate-900 px-2.5 py-1 rounded border border-cyan-500/30 inline-block">
                  {activeStep.meta.formula}
                </code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: AUDIT LOG (TABLE VIEW) */}
      {viewMode === 'table' && (
        <div className="overflow-x-auto max-h-[480px] rounded-xl border border-slate-800 bg-slate-950 scrollbar-thin scrollbar-thumb-slate-800">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider sticky top-0 border-b border-slate-800">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Plain</th>
                <th className="p-3">Op</th>
                <th className="p-3">Cipher</th>
                <th className="p-3">Formula / Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredSteps.map((step) => (
                <tr key={`row-${step.index}`} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-3 text-slate-500">{step.index + 1}</td>
                  <td className="p-3 font-bold text-slate-200">{step.originalChar === ' ' ? '␣' : step.originalChar}</td>
                  <td className="p-3 text-cyan-400">→</td>
                  <td className="p-3 font-bold text-cyan-300">{step.transformedChar === ' ' ? '␣' : step.transformedChar}</td>
                  <td className="p-3 text-slate-400">{step.meta?.formula || step.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
