import React, { useState } from 'react';
import { CipherResult } from '../types/cipher';
import { STANDARD_ALPHABET } from '../ciphers/algorithms';
import { ArrowLeftRight, Sparkles, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  result: CipherResult;
}

export const AtbashVisualizer: React.FC<Props> = ({ result }) => {
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const reversedAlphabet = STANDARD_ALPHABET.split('').reverse().join('');

  return (
    <div className="space-y-6">
      {/* Parameter Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-amber-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            SELF-INVERTING RECIPROCAL: <strong className="text-amber-100 text-sm">E(x) = D(x) = 25 - x</strong>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Encrypt and Decrypt run the exact same inverse involution
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-amber-400/90 px-3 py-1 rounded-lg bg-slate-950/60 border border-slate-800">
          <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
          <span>Symmetric Keyless Cipher</span>
        </div>
      </div>

      {/* Mirrored Alphabet Strip */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Alphabet Midpoint Mirror (Hover any letter to trace reflection)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">13 Complementary Pairs</span>
        </div>

        <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-amber-900 scrollbar-track-transparent">
          <div className="min-w-[640px] space-y-2">
            {/* Standard Alphabet (0 to 25) */}
            <div className="flex items-center gap-1">
              <span className="w-14 text-[10px] font-mono uppercase text-slate-400 tracking-wider">Normal:</span>
              <div className="flex gap-1 flex-1">
                {STANDARD_ALPHABET.split('').map((char, idx) => {
                  const mirrorChar = reversedAlphabet[idx];
                  const isHighlighted = hoveredChar === char || hoveredChar === mirrorChar;
                  return (
                    <motion.div
                      key={`norm-${char}`}
                      whileHover={{ scale: 1.15 }}
                      onMouseEnter={() => setHoveredChar(char)}
                      onMouseLeave={() => setHoveredChar(null)}
                      className={`flex-1 aspect-square max-w-[28px] flex flex-col items-center justify-center rounded text-xs font-mono font-semibold transition-all cursor-pointer ${
                        isHighlighted
                          ? 'bg-amber-400 text-slate-950 font-bold shadow-[0_0_12px_#f59e0b]'
                          : 'bg-slate-800/70 text-slate-300 border border-slate-700/60 hover:border-amber-400'
                      }`}
                    >
                      <span>{char}</span>
                      <span className="text-[8px] opacity-60 leading-none">{idx}</span>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Reciprocal Indicator Arrows */}
            <div className="flex items-center pl-14 py-0.5">
              <div className="w-full flex justify-between px-2 text-[10px] font-mono text-amber-400/60">
                <span>A ↔ Z</span>
                <span>M ↔ N (Midpoint Fold)</span>
                <span>Z ↔ A</span>
              </div>
            </div>

            {/* Inverted Alphabet (25 down to 0) */}
            <div className="flex items-center gap-1">
              <span className="w-14 text-[10px] font-mono uppercase text-amber-400 tracking-wider">Mirror:</span>
              <div className="flex gap-1 flex-1">
                {reversedAlphabet.split('').map((char, idx) => {
                  const normalChar = STANDARD_ALPHABET[idx];
                  const isHighlighted = hoveredChar === char || hoveredChar === normalChar;
                  return (
                    <div
                      key={`rev-${idx}-${char}`}
                      className={`flex-1 aspect-square max-w-[28px] flex flex-col items-center justify-center rounded text-xs font-mono font-semibold transition-all ${
                        isHighlighted
                          ? 'bg-amber-300 text-slate-950 font-bold shadow-[0_0_12px_#f59e0b]'
                          : 'bg-amber-950/40 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      <span>{char}</span>
                      <span className="text-[8px] opacity-60 leading-none">{25 - idx}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Symmetrical Pairs Grid */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
        <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
          <span>Complementary Alphabet Pairs:</span>
          <span className="text-amber-400/80">Sum of Indices = 25</span>
        </div>
        <div className="grid grid-cols-6 sm:grid-cols-13 gap-1.5 font-mono text-xs">
          {STANDARD_ALPHABET.slice(0, 13).split('').map((char, idx) => {
            const pairChar = STANDARD_ALPHABET[25 - idx];
            const isPairHovered = hoveredChar === char || hoveredChar === pairChar;
            return (
              <div
                key={`pair-${char}`}
                onMouseEnter={() => setHoveredChar(char)}
                onMouseLeave={() => setHoveredChar(null)}
                className={`p-1.5 rounded text-center border transition-all cursor-pointer ${
                  isPairHovered
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200 shadow-[0_0_8px_rgba(245,158,11,0.3)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-amber-500/40'
                }`}
              >
                <div className="font-bold">{char} <span className="text-amber-400">↔</span> {pairChar}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
