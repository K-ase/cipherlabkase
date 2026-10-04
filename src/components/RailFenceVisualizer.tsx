import React, { useState, useEffect } from 'react';
import { CipherResult } from '../types/cipher';
import { Layers, Play, Pause, RotateCcw, Sparkles } from 'lucide-react';
import { sfx } from '../utils/audio';

interface Props {
  result: CipherResult;
  onRailsChange?: (rails: number) => void;
}

export const RailFenceVisualizer: React.FC<Props> = ({ result, onRailsChange }) => {
  const [activeColIndex, setActiveColIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const rails = result.railGrid?.rails || result.parameters.rails || 3;
  const matrix = result.railGrid?.matrix || [];
  const sequence = result.railGrid?.sequence || [];
  const textLen = result.inputText.length;

  // Auto-play animation through the zigzag path
  useEffect(() => {
    let interval: any;
    if (isPlaying && textLen > 0) {
      interval = setInterval(() => {
        setActiveColIndex(prev => {
          const next = prev === null || prev >= textLen - 1 ? 0 : prev + 1;
          sfx.playBeep(350 + next * 15, 'triangle', 0.03, 0.015);
          return next;
        });
      }, 350);
    }
    return () => clearInterval(interval);
  }, [isPlaying, textLen]);

  // Group characters by rail to show row-by-row readout
  const railGroups: { railIndex: number; chars: string[] }[] = [];
  for (let r = 0; r < rails; r++) {
    const charsInRail: string[] = [];
    if (matrix[r]) {
      for (let c = 0; c < textLen; c++) {
        if (matrix[r][c] !== null && matrix[r][c] !== undefined) {
          charsInRail.push(matrix[r][c]!);
        }
      }
    }
    railGroups.push({ railIndex: r, chars: charsInRail });
  }

  return (
    <div className="space-y-6">
      {/* Parameter Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-purple-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/40 text-purple-300 font-mono text-xs flex items-center gap-2">
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            AUTO RAILS: <strong className="text-purple-100 text-sm">r = {rails}</strong>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Wave Period: {2 * (rails - 1)} characters per full oscillation
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Animation Controls */}
          <button
            onClick={() => {
              sfx.playClick();
              setIsPlaying(!isPlaying);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono transition-all"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isPlaying ? 'Pause Wave' : 'Simulate Zigzag'}
          </button>

          <button
            onClick={() => {
              sfx.playClick();
              setIsPlaying(false);
              setActiveColIndex(null);
            }}
            className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-400 hover:text-purple-300"
            title="Reset simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {onRailsChange && (
            <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1 rounded-lg border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400">Rails:</span>
              <input
                type="range"
                min="2"
                max={Math.min(6, Math.max(2, textLen))}
                value={rails}
                onChange={(e) => {
                  sfx.playClick();
                  onRailsChange(Number(e.target.value));
                }}
                className="w-20 accent-purple-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="font-mono text-xs text-purple-400 font-bold w-4 text-right">{rails}</span>
            </div>
          )}
        </div>
      </div>

      {/* 2D Zigzag Wave Matrix Visualizer */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>2D Transposition Wave Grid (Bouncing Rail Pattern)</span>
          </div>
          <span className="text-[11px] font-mono text-purple-400">
            {textLen} characters across {rails} rails
          </span>
        </div>

        {textLen === 0 ? (
          <div className="py-8 text-center text-xs text-slate-500 font-mono">
            Enter plaintext above to view the Rail Fence zigzag matrix...
          </div>
        ) : (
          <div className="overflow-x-auto pb-3 scrollbar-thin scrollbar-thumb-purple-900 scrollbar-track-transparent">
            <div className="min-w-max space-y-2 py-2">
              {Array.from({ length: rails }).map((_, rIdx) => (
                <div key={`rail-row-${rIdx}`} className="flex items-center gap-2">
                  {/* Rail Header Badge */}
                  <div className="w-20 shrink-0 px-2 py-1.5 rounded bg-slate-950 border border-purple-500/30 text-purple-300 font-mono text-[11px] font-semibold flex items-center justify-between">
                    <span>RAIL #{rIdx + 1}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                  </div>

                  {/* Rail Cells */}
                  <div className="flex gap-1.5">
                    {Array.from({ length: textLen }).map((_, cIdx) => {
                      const char = matrix[rIdx] ? matrix[rIdx][cIdx] : null;
                      const hasChar = char !== null && char !== undefined;
                      const isColActive = activeColIndex === cIdx;

                      return (
                        <div
                          key={`cell-${rIdx}-${cIdx}`}
                          onClick={() => {
                            sfx.playClick();
                            setActiveColIndex(cIdx);
                          }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all cursor-pointer ${
                            hasChar
                              ? isColActive
                                ? 'bg-purple-500 text-slate-950 ring-2 ring-purple-300 shadow-[0_0_15px_#a855f7] scale-110'
                                : 'bg-purple-950/50 border border-purple-500/40 text-purple-200 hover:border-purple-400 hover:scale-105'
                              : isColActive
                              ? 'bg-slate-800/40 border border-slate-700/60'
                              : 'bg-slate-950/30 border border-slate-900/60'
                          }`}
                        >
                          {hasChar ? (
                            <span>{char === ' ' ? '␣' : char}</span>
                          ) : (
                            <span className="text-[10px] text-slate-700 font-normal">·</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Row-by-Row Readout Extraction Breakdown */}
      <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-mono text-slate-400">Row-by-Row Ciphertext Extraction:</span>
          <span className="text-[11px] font-mono text-purple-400/80">Read Rail 1 → Rail 2 → Rail 3</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {railGroups.map((group) => (
            <div
              key={`group-${group.railIndex}`}
              className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 space-y-1.5 font-mono text-xs"
            >
              <div className="flex items-center justify-between text-[11px] text-purple-300 font-semibold">
                <span>Rail #{group.railIndex + 1} Strings</span>
                <span className="text-[10px] text-slate-500">{group.chars.length} chars</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-purple-500/20 text-purple-200 tracking-widest break-all font-bold">
                {group.chars.join('') || <span className="text-slate-600 font-normal">Empty</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
