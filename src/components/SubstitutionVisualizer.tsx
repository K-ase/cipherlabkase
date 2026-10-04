import React, { useState } from 'react';
import { CipherResult } from '../types/cipher';
import { STANDARD_ALPHABET } from '../ciphers/algorithms';
import { Shuffle, Sparkles, KeyRound } from 'lucide-react';
import { sfx } from '../utils/audio';

interface Props {
  result: CipherResult;
  onRandomizeKey?: () => void;
}

export const SubstitutionVisualizer: React.FC<Props> = ({ result, onRandomizeKey }) => {
  const [hoveredLetter, setHoveredLetter] = useState<string | null>(null);

  const subMap = result.substitutionMap || {};
  const isEncrypt = result.mode === 'encrypt';

  return (
    <div className="space-y-6">
      {/* Parameter Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-rose-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center gap-2">
            <KeyRound className="w-3.5 h-3.5 text-rose-400" />
            AUTO SUBSTITUTION KEY: <strong className="text-rose-100 text-sm">26! Permutation</strong>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Theoretical Key Space: 4.03 × 10²⁶ unique alphabet mappings
          </span>
        </div>

        {onRandomizeKey && (
          <button
            onClick={() => {
              sfx.playClick();
              onRandomizeKey();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-mono transition-all hover:shadow-[0_0_12px_rgba(244,63,94,0.25)]"
            title="Generate a brand new random substitution key"
          >
            <Shuffle className="w-3.5 h-3.5" />
            Re-Scramble Alphabet
          </button>
        )}
      </div>

      {/* 26-Letter Substitution Mapping Grid */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>Monoalphabetic Substitution Key Table (A-Z)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {isEncrypt ? 'Plain → Cipher' : 'Cipher → Plain'}
          </span>
        </div>

        <div className="grid grid-cols-6 sm:grid-cols-13 gap-1.5 font-mono">
          {STANDARD_ALPHABET.split('').map((letter) => {
            const mappedLetter = subMap[letter] || letter;
            const isHovered = hoveredLetter === letter || hoveredLetter === mappedLetter;

            return (
              <div
                key={`sub-${letter}`}
                onMouseEnter={() => setHoveredLetter(letter)}
                onMouseLeave={() => setHoveredLetter(null)}
                className={`p-2 rounded-lg text-center border transition-all cursor-pointer ${
                  isHovered
                    ? 'bg-rose-500/20 border-rose-400 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.4)] scale-105'
                    : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-rose-500/40'
                }`}
              >
                <div className="text-[10px] text-slate-400 font-bold">{letter}</div>
                <div className="text-[10px] text-rose-400 font-bold my-0.5">↓</div>
                <div className="text-xs font-bold text-rose-300">{mappedLetter}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
