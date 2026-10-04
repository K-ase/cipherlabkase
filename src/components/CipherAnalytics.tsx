import React, { useState } from 'react';
import { calculateEntropy } from '../ciphers/algorithms';
import { Activity, BarChart2, Binary, Hash, HelpCircle } from 'lucide-react';

interface Props {
  inputText: string;
  outputText: string;
}

export const CipherAnalytics: React.FC<Props> = ({ inputText, outputText }) => {
  const [activeFormat, setActiveFormat] = useState<'text' | 'hex' | 'binary'>('text');

  const inputLen = inputText.length;
  const outputLen = outputText.length;
  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  
  const inputEntropy = calculateEntropy(inputText);
  const outputEntropy = calculateEntropy(outputText);

  // Convert output to Hex and Binary
  const hexString = Array.from(outputText)
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0').toUpperCase())
    .join(' ');

  const binaryString = Array.from(outputText)
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, '0'))
    .join(' ');

  return (
    <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-4 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-mono font-bold text-slate-200">CRYPTOGRAPHIC TELEMETRY</span>
        </div>

        {/* Format Selector for Ciphertext */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-950 border border-slate-800">
          <button
            onClick={() => setActiveFormat('text')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
              activeFormat === 'text'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            ASCII
          </button>
          <button
            onClick={() => setActiveFormat('hex')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
              activeFormat === 'hex'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            HEX
          </button>
          <button
            onClick={() => setActiveFormat('binary')}
            className={`px-2 py-0.5 rounded text-[11px] font-mono transition-all ${
              activeFormat === 'binary'
                ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            BIN
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Length</div>
          <div className="text-base font-bold text-slate-200 mt-1">
            {outputLen} <span className="text-[11px] text-slate-500 font-normal">chars</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{wordCount} words</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Plain Entropy</span>
          </div>
          <div className="text-base font-bold text-slate-200 mt-1">
            {inputEntropy}{' '}
            <span className="text-[11px] text-slate-500 font-normal">bits</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Max ~4.70 bits</div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>Cipher Entropy</span>
          </div>
          <div className="text-base font-bold text-cyan-400 mt-1">
            {outputEntropy}{' '}
            <span className="text-[11px] text-cyan-600 font-normal">bits</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            {outputEntropy > inputEntropy ? '↑ Diffusion gained' : '= Preserved'}
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800/80">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider">Bits Encoded</div>
          <div className="text-base font-bold text-emerald-400 mt-1">
            {outputLen * 8}{' '}
            <span className="text-[11px] text-emerald-600 font-normal">bits</span>
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">{outputLen} bytes</div>
        </div>
      </div>

      {/* Alternative Format Display (Hex / Binary) */}
      {activeFormat !== 'text' && (
        <div className="space-y-1.5 p-3 rounded-lg bg-slate-950 border border-cyan-500/20">
          <div className="flex items-center justify-between text-[10px] font-mono text-cyan-400">
            <span>{activeFormat === 'hex' ? 'Raw Hexadecimal Byte Stream' : 'Raw 8-bit Binary Stream'}</span>
            <span>{outputLen} bytes</span>
          </div>
          <div className="font-mono text-xs text-cyan-300 break-all bg-slate-900/60 p-2.5 rounded border border-slate-800 max-h-24 overflow-y-auto">
            {activeFormat === 'hex' ? hexString || '00' : binaryString || '00000000'}
          </div>
        </div>
      )}
    </div>
  );
};
