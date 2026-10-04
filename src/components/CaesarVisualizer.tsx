import React, { useState } from 'react';
import { CipherResult } from '../types/cipher';
import { STANDARD_ALPHABET } from '../ciphers/algorithms';
import { Shuffle, ArrowRight, Info, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { sfx } from '../utils/audio';

interface Props {
  result: CipherResult;
  onShiftChange?: (shift: number) => void;
  onRandomize?: () => void;
}

export const CaesarVisualizer: React.FC<Props> = ({ result, onShiftChange, onRandomize }) => {
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const shift = result.caesarShift ?? 3;
  const isEncrypt = result.mode === 'encrypt';

  const shiftedAlphabet = STANDARD_ALPHABET.slice(shift) + STANDARD_ALPHABET.slice(0, shift);

  return (
    <div className="space-y-6">
      {/* Parameter Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-cyan-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            AUTO SHIFT: <strong className="text-cyan-100 text-sm">k = {shift}</strong>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Each letter shifts {isEncrypt ? 'forward' : 'backward'} by {shift} modular positions
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onRandomize && (
            <button
              onClick={() => {
                sfx.playClick();
                onRandomize();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono transition-all hover:shadow-[0_0_12px_rgba(0,240,255,0.25)]"
              title="Generate a new random shift key"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Re-Roll Shift
            </button>
          )}

          {onShiftChange && (
            <div className="flex items-center gap-2 bg-slate-950/60 px-3 py-1 rounded-lg border border-slate-800">
              <span className="text-[11px] font-mono text-slate-400">Tweak Shift:</span>
              <input
                type="range"
                min="1"
                max="25"
                value={shift}
                onChange={(e) => {
                  sfx.playBeep(400 + Number(e.target.value) * 20, 'sine', 0.03, 0.02);
                  onShiftChange(Number(e.target.value));
                }}
                className="w-24 accent-cyan-400 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
              />
              <span className="font-mono text-xs text-cyan-400 font-bold w-5 text-right">{shift}</span>
            </div>
          )}
        </div>
      </div>

      {/* Visual Shifted Alphabet Strip */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Alphabet Shift Comparison Ribbon</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">A-Z Modular Mapping</span>
        </div>

        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
          <div className="min-w-[640px] space-y-1.5">
            {/* Plain Alphabet Row */}
            <div className="flex items-center gap-1">
              <span className="w-14 text-[10px] font-mono uppercase text-slate-400 tracking-wider">Plain:</span>
              <div className="flex gap-1 flex-1">
                {STANDARD_ALPHABET.split('').map((char, idx) => {
                  const isHighlighted = hoveredChar === char;
                  return (
                    <motion.div
                      key={`plain-${char}`}
                      whileHover={{ scale: 1.15 }}
                      onMouseEnter={() => setHoveredChar(char)}
                      onMouseLeave={() => setHoveredChar(null)}
                      className={`flex-1 aspect-square max-w-[28px] flex flex-col items-center justify-center rounded text-xs font-mono font-semibold transition-colors cursor-pointer ${
                        isHighlighted
                          ? 'bg-cyan-500 text-slate-950 shadow-[0_0_10px_#00f0ff]'
                          : 'bg-slate-800/70 text-slate-300 border border-slate-700/60 hover:border-cyan-500/50'
                      }`}
                    >
                      <span>{char}</span>
                      <span className="text-[8px] opacity-60 leading-none">{idx}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Shift Direction Arrow */}
            <div className="flex items-center pl-14 py-0.5">
              <div className="text-[10px] font-mono text-cyan-400/80 flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-cyan-400" />
                <span>Shift offset: +{shift} positions ({isEncrypt ? 'forward' : 'reverse'})</span>
              </div>
            </div>

            {/* Cipher Alphabet Row */}
            <div className="flex items-center gap-1">
              <span className="w-14 text-[10px] font-mono uppercase text-cyan-400 tracking-wider">Cipher:</span>
              <div className="flex gap-1 flex-1">
                {shiftedAlphabet.split('').map((char, idx) => {
                  const plainCharMatch = STANDARD_ALPHABET[idx];
                  const isHighlighted = hoveredChar === plainCharMatch;
                  return (
                    <div
                      key={`cipher-${idx}-${char}`}
                      className={`flex-1 aspect-square max-w-[28px] flex flex-col items-center justify-center rounded text-xs font-mono font-semibold transition-colors ${
                        isHighlighted
                          ? 'bg-emerald-400 text-slate-950 shadow-[0_0_10px_#10b981]'
                          : 'bg-cyan-950/40 text-cyan-300 border border-cyan-500/30'
                      }`}
                    >
                      <span>{char}</span>
                      <span className="text-[8px] opacity-60 leading-none">{(idx + shift) % 26}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Formula Badge */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-950/20 border border-cyan-500/20 text-xs font-mono text-cyan-300">
        <Info className="w-4 h-4 text-cyan-400 shrink-0" />
        <div>
          <span className="text-slate-400">Mathematical Transformation: </span>
          <code className="text-cyan-200 font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-500/30">
            {isEncrypt
              ? `C = (P + ${shift}) mod 26`
              : `P = (C - ${shift} + 26) mod 26`}
          </code>
        </div>
      </div>
    </div>
  );
};
