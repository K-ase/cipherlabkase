import React from 'react';
import { Shield, Volume2, VolumeX, History, GraduationCap, Sparkles, Terminal } from 'lucide-react';
import { sfx } from '../utils/audio';

interface Props {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory: () => void;
  onOpenViva: () => void;
  onSelectPreset: (text: string, cipher: any) => void;
  historyCount: number;
}

const PRESETS = [
  {
    name: 'College Viva Showcase',
    text: 'CRYPTOGRAPHY PROVIDES CONFIDENTIALITY INTEGRITY AND AUTHENTICATION',
    cipher: 'caesar',
    desc: 'Classic cybersecurity lecture textbook phrase'
  },
  {
    name: 'CTF Challenge Flag',
    text: 'FLAG{7h3_qu1ck_br0wn_f0x_jump5_0v3r_1337_h4ck3r}',
    cipher: 'vigenere',
    desc: 'Capture-the-flag format with mixed alphanumeric'
  },
  {
    name: 'Julius Caesar Dispatch',
    text: 'ATTACK AT DAWN ON THE NORTHERN FLANK WITH THE TENTH LEGION',
    cipher: 'caesar',
    desc: 'Historical Roman military communication'
  },
  {
    name: 'Top Secret Transmission',
    text: 'DEFEND THE PERIMETER MATRIX WITH QUANTUM RESISTANT CIPHERS',
    cipher: 'railfence',
    desc: 'Zigzag transposition sample'
  }
];

export const Header: React.FC<Props> = ({
  soundEnabled,
  onToggleSound,
  onOpenHistory,
  onOpenViva,
  onSelectPreset,
  historyCount
}) => {
  const [showPresetsMenu, setShowPresetsMenu] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-[#05070d]/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="relative group">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-400/40 flex items-center justify-center shadow-[0_0_20px_rgba(0,240,255,0.3)] group-hover:border-cyan-300 transition-all">
              <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#05070d] rounded-full animate-ping" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-400 border-2 border-[#05070d] rounded-full" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-bold tracking-tight text-white flex items-center">
                CIPHER<span className="text-cyan-400">LAB</span>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 hidden sm:inline-block">
                CYBERSECURITY VIVA SUITE
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-500 hidden sm:flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>INTERACTIVE CRYPTOGRAPHIC ENGINE</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Preset Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                sfx.playClick();
                setShowPresetsMenu(!showPresetsMenu);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs font-mono transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden md:inline">Load Sample</span>
              <span className="md:hidden">Presets</span>
            </button>

            {showPresetsMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-cyan-500/30 p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 font-mono">
                <div className="px-2 py-1 text-[10px] uppercase tracking-wider text-slate-500 border-b border-slate-800 mb-1">
                  Ready-To-Encrypt Presets
                </div>
                {PRESETS.map((p, idx) => (
                  <button
                    key={`preset-${idx}`}
                    onClick={() => {
                      sfx.playClick();
                      onSelectPreset(p.text, p.cipher);
                      setShowPresetsMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 transition-colors group"
                  >
                    <div className="text-xs font-semibold text-slate-200 group-hover:text-cyan-300">
                      {p.name}
                    </div>
                    <div className="text-[10px] text-slate-500 truncate mt-0.5">{p.desc}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* College Viva Guide Button */}
          <button
            onClick={() => {
              sfx.playClick();
              onOpenViva();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono transition-all shadow-[0_0_12px_rgba(16,185,129,0.15)]"
          >
            <GraduationCap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Viva Prep</span>
          </button>

          {/* Audio Mute/Unmute */}
          <button
            onClick={() => {
              onToggleSound();
              sfx.playClick();
            }}
            className={`p-2 rounded-lg border text-xs font-mono transition-all ${
              soundEnabled
                ? 'bg-slate-900 border-slate-700 text-cyan-400'
                : 'bg-slate-950 border-slate-800 text-slate-600'
            }`}
            title={soundEnabled ? 'Mute terminal audio' : 'Unmute terminal audio'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* History Drawer Trigger */}
          <button
            onClick={() => {
              sfx.playClick();
              onOpenHistory();
            }}
            className="relative flex items-center gap-1.5 p-2 sm:px-3 sm:py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs font-mono transition-all"
            title="View encryption history"
          >
            <History className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-cyan-500 text-slate-950 text-[10px] font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
