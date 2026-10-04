import React from 'react';
import { HistoryItem } from '../types/cipher';
import { X, Clock, Trash2, ArrowUpRight, Copy, Check, ShieldCheck } from 'lucide-react';
import { sfx } from '../utils/audio';

interface Props {
  isOpen: boolean;
  history: HistoryItem[];
  onClose: () => void;
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

export const HistoryDrawer: React.FC<Props> = ({
  isOpen,
  history,
  onClose,
  onSelect,
  onClear
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    sfx.playSuccess();
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md h-full bg-slate-950 border-l border-slate-800 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="font-mono text-sm font-bold text-slate-100">OPERATION LOGS</h3>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={() => {
                  sfx.playClick();
                  onClear();
                }}
                className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors"
                title="Wipe all encryption history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => {
                sfx.playClick();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-800">
          {history.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-2 text-slate-500 font-mono text-xs">
              <ShieldCheck className="w-10 h-10 text-slate-700 mb-1" />
              <div>No encrypted sessions recorded yet.</div>
              <p className="text-[11px] text-slate-600 max-w-xs">
                Every time you run an encryption or decryption, it is automatically archived locally in your browser storage.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    {item.cipherType} ({item.mode})
                  </span>
                  <span className="text-slate-500">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  <span className="text-slate-600">Key: </span>
                  <span className="text-slate-300">{item.keyDisplay}</span>
                </div>

                {/* Input & Output Snapshot */}
                <div className="space-y-1 font-mono text-xs">
                  <div className="p-1.5 rounded bg-slate-950/80 border border-slate-800/60 text-slate-400 truncate">
                    <span className="text-[10px] text-slate-600 block uppercase">Input</span>
                    {item.input}
                  </div>
                  <div className="p-1.5 rounded bg-cyan-950/20 border border-cyan-500/20 text-cyan-300 truncate">
                    <span className="text-[10px] text-cyan-600 block uppercase">Output</span>
                    {item.output}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-800/50">
                  <button
                    onClick={() => handleCopy(item.id, item.output)}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800/60 hover:bg-slate-800 text-[11px] font-mono text-slate-300 transition-colors"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-slate-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      sfx.playClick();
                      onSelect(item);
                    }}
                    className="flex items-center gap-1 px-2 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-[11px] font-mono text-cyan-300 border border-cyan-500/30 transition-colors"
                  >
                    <span>Load Session</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
