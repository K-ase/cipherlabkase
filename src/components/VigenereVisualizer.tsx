import React, { useState } from 'react';
import { CipherResult } from '../types/cipher';
import { Shuffle, Table, Sparkles, Grid, Eye } from 'lucide-react';
import { STANDARD_ALPHABET } from '../ciphers/algorithms';
import { sfx } from '../utils/audio';

interface Props {
  result: CipherResult;
  onRandomizeKey?: () => void;
  onKeyChange?: (key: string) => void;
}

export const VigenereVisualizer: React.FC<Props> = ({ result, onRandomizeKey, onKeyChange }) => {
  const [selectedCharIndex, setSelectedCharIndex] = useState<number | null>(null);
  const [showMiniTable, setShowMiniTable] = useState<boolean>(false);

  const key = result.parameters.key || 'KRYPTOS';
  const alignment = result.vigenereAlignment || [];

  const activeStep = selectedCharIndex !== null && alignment[selectedCharIndex]
    ? alignment[selectedCharIndex]
    : alignment.find(a => a.isAlpha) || null;

  return (
    <div className="space-y-6">
      {/* Parameter Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/80 border border-emerald-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-mono text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            AUTO KEY: <strong className="text-emerald-100 text-sm tracking-wider">"{key}"</strong>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Key repeats cyclically across all alphabetic characters
          </span>
        </div>

        <div className="flex items-center gap-3">
          {onRandomizeKey && (
            <button
              onClick={() => {
                sfx.playClick();
                onRandomizeKey();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-mono transition-all hover:shadow-[0_0_12px_rgba(16,185,129,0.25)]"
              title="Pick a new auto-generated cyber keyword"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Re-Roll Key
            </button>
          )}

          <button
            onClick={() => {
              sfx.playClick();
              setShowMiniTable(!showMiniTable);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
              showMiniTable
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-emerald-300 hover:border-emerald-500/40'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            {showMiniTable ? 'Hide Tabula Recta' : 'View Tabula Recta'}
          </button>
        </div>
      </div>

      {/* Alignment Tape (Plain vs Key vs Cipher) */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Cyclic Key Alignment Tape (Click any letter to inspect coordinate)</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            {alignment.filter(a => a.isAlpha).length} Alphabetic Shifts
          </span>
        </div>

        {alignment.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500 font-mono">
            Enter plaintext above to view cyclic key alignment...
          </div>
        ) : (
          <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-emerald-900 scrollbar-track-transparent">
            <div className="flex gap-1.5 min-w-max">
              {alignment.map((item, idx) => {
                const isSelected = selectedCharIndex === idx;
                return (
                  <button
                    key={`align-${idx}`}
                    onClick={() => {
                      sfx.playClick();
                      setSelectedCharIndex(idx);
                    }}
                    className={`flex flex-col items-center p-2 rounded-lg font-mono transition-all text-xs border ${
                      isSelected
                        ? 'bg-emerald-500/20 border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.4)] scale-105'
                        : item.isAlpha
                        ? 'bg-slate-950/60 border-slate-800/80 hover:border-emerald-500/40 hover:bg-slate-900'
                        : 'bg-slate-950/30 border-dashed border-slate-800/40 opacity-40'
                    }`}
                  >
                    <span className="text-[10px] text-slate-500 font-bold mb-1">#{idx + 1}</span>
                    <div className="space-y-1 w-full text-center">
                      <div className="text-slate-200 font-bold px-1.5 py-0.5 rounded bg-slate-800/80">
                        {item.plainChar === ' ' ? '␣' : item.plainChar}
                      </div>
                      <div className="text-emerald-400 font-bold text-[11px] px-1.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-500/30">
                        {item.keyChar}
                      </div>
                      <div className="text-cyan-300 font-bold px-1.5 py-0.5 rounded bg-cyan-950/40 border border-cyan-500/30">
                        {item.cipherChar === ' ' ? '␣' : item.cipherChar}
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-500 mt-1 uppercase">
                      {item.isAlpha ? 'shift' : 'skip'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Coordinate & Tabula Recta Inspector */}
      {activeStep && activeStep.isAlpha && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-emerald-500/30 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center font-mono font-bold text-emerald-300 text-lg">
              {activeStep.keyChar}
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Tabula Row (Key)</div>
              <div className="text-xs font-mono text-emerald-300">
                Letter '{activeStep.keyChar}' (Shift +{activeStep.keyChar.charCodeAt(0) - 65})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center font-mono font-bold text-slate-200 text-lg">
              {activeStep.plainChar.toUpperCase()}
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Tabula Col (Plaintext)</div>
              <div className="text-xs font-mono text-slate-300">
                Letter '{activeStep.plainChar.toUpperCase()}' (Index {activeStep.plainChar.toUpperCase().charCodeAt(0) - 65})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 md:border-l md:border-slate-800 md:pl-4">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center font-mono font-bold text-cyan-300 text-lg">
              {activeStep.cipherChar.toUpperCase()}
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-400 tracking-wider">Coordinate Intersection</div>
              <div className="text-xs font-mono text-cyan-300">
                Cipher Output: '{activeStep.cipherChar}'
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabula Recta Matrix (Collapsible) */}
      {showMiniTable && (
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-300 font-mono">
              <Table className="w-4 h-4 text-emerald-400" />
              <span>Tabula Recta (Vigenère Square 26x26)</span>
            </div>
            <span className="text-[11px] text-slate-500 font-mono">Row: Key Letter | Col: Plain Letter</span>
          </div>

          <div className="overflow-x-auto max-h-72 overflow-y-auto border border-slate-800 rounded-lg p-2 bg-slate-950 scrollbar-thin scrollbar-thumb-emerald-900">
            <table className="w-full text-center border-collapse font-mono text-[10px]">
              <thead>
                <tr>
                  <th className="p-1 bg-slate-900 text-emerald-400 sticky top-0 left-0 z-20 border border-slate-800">Key\P</th>
                  {STANDARD_ALPHABET.split('').map(c => (
                    <th
                      key={`th-${c}`}
                      className={`p-1 sticky top-0 z-10 border border-slate-800 ${
                        activeStep && activeStep.plainChar.toUpperCase() === c
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-900 text-slate-400'
                      }`}
                    >
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {STANDARD_ALPHABET.split('').map((rowChar, rowIdx) => {
                  const isKeyRow = activeStep && activeStep.keyChar === rowChar;
                  return (
                    <tr key={`tr-${rowChar}`}>
                      <th
                        className={`p-1 sticky left-0 z-10 border border-slate-800 ${
                          isKeyRow ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
                        }`}
                      >
                        {rowChar}
                      </th>
                      {STANDARD_ALPHABET.split('').map((_, colIdx) => {
                        const cellChar = STANDARD_ALPHABET[(rowIdx + colIdx) % 26];
                        const isPlainCol = activeStep && activeStep.plainChar.toUpperCase() === STANDARD_ALPHABET[colIdx];
                        const isMatch = isKeyRow && isPlainCol;

                        return (
                          <td
                            key={`td-${rowIdx}-${colIdx}`}
                            className={`p-1 border border-slate-900/60 transition-colors ${
                              isMatch
                                ? 'bg-emerald-400 text-slate-950 font-bold shadow-[0_0_10px_#10b981]'
                                : isKeyRow
                                ? 'bg-emerald-950/40 text-emerald-200'
                                : isPlainCol
                                ? 'bg-cyan-950/40 text-cyan-200'
                                : 'text-slate-500 hover:bg-slate-800'
                            }`}
                          >
                            {cellChar}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
