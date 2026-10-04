import React, { useState, useEffect, useRef } from 'react';
import {
  CipherMode,
  CipherResult,
  CipherType,
  HistoryItem
} from './types/cipher';
import {
  executeCipher,
  generateRandomCaesarShift,
  generateRandomVigenereKey,
  generateRandomSubstitutionKey
} from './ciphers/algorithms';
import { CIPHER_METADATA } from './ciphers/metadata';
import { Header } from './components/Header';
import { CaesarVisualizer } from './components/CaesarVisualizer';
import { VigenereVisualizer } from './components/VigenereVisualizer';
import { AtbashVisualizer } from './components/AtbashVisualizer';
import { RailFenceVisualizer } from './components/RailFenceVisualizer';
import { SubstitutionVisualizer } from './components/SubstitutionVisualizer';
import { StepsInspector } from './components/StepsInspector';
import { CipherAnalytics } from './components/CipherAnalytics';
import { HistoryDrawer } from './components/HistoryDrawer';
import { AlgorithmInfoModal } from './components/AlgorithmInfoModal';
import { sfx } from './utils/audio';
import confetti from 'canvas-confetti';
import {
  Lock,
  Unlock,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Layers,
  ArrowRight,
  Info,
  Clock,
  Eye,
  EyeOff,
  Zap,
  KeyRound,
  Shield,
  Shuffle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CIPHER_LIST: { id: CipherType; name: string; category: string; badgeColor: string }[] = [
  { id: 'caesar', name: 'Caesar Cipher', category: 'Monoalphabetic', badgeColor: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/40' },
  { id: 'vigenere', name: 'Vigenère Cipher', category: 'Polyalphabetic', badgeColor: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40' },
  { id: 'atbash', name: 'Atbash Cipher', category: 'Reciprocal Mirror', badgeColor: 'text-amber-400 border-amber-500/40 bg-amber-950/40' },
  { id: 'railfence', name: 'Rail Fence', category: 'Transposition', badgeColor: 'text-purple-400 border-purple-500/40 bg-purple-950/40' },
  { id: 'substitution', name: 'Substitution', category: 'Random Mono', badgeColor: 'text-rose-400 border-rose-500/40 bg-rose-950/40' }
];

export function App() {
  // Application State
  const [inputText, setInputText] = useState<string>('HELLOWORLD');
  const [cipherType, setCipherType] = useState<CipherType>('caesar');
  const [mode, setMode] = useState<CipherMode>('encrypt');
  const [showSteps, setShowSteps] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [isEncryptingAnimation, setIsEncryptingAnimation] = useState<boolean>(false);

  // Auto-generated parameters (No manual entry required!)
  const [caesarShift, setCaesarShift] = useState<number>(3);
  const [vigenereKey, setVigenereKey] = useState<string>('KRYPTOS');
  const [railFenceCount, setRailFenceCount] = useState<number>(3);
  const [substitutionKey, setSubstitutionKey] = useState<string>('QWERTYUIOPASDFGHJKLZXCVBNM');

  // Modals & Panels
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('cipherlab_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current calculation result
  const [result, setResult] = useState<CipherResult>(() =>
    executeCipher('caesar', 'HELLOWORLD', 'encrypt', { shift: 3 })
  );

  const stepsRef = useRef<HTMLDivElement>(null);

  // Sync audio mute state
  useEffect(() => {
    sfx.enabled = soundEnabled;
  }, [soundEnabled]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('cipherlab_history', JSON.stringify(history));
    } catch {
      // Ignore
    }
  }, [history]);

  // Re-run cipher computation when text, algorithm, mode, or parameters update
  const runCipher = (
    text = inputText,
    type = cipherType,
    currentMode = mode,
    params = {
      shift: caesarShift,
      vigenereKey,
      rails: railFenceCount,
      substitutionKey
    }
  ) => {
    const res = executeCipher(type, text, currentMode, params);
    setResult(res);
    return res;
  };

  // Triggered on user "Encrypt" or "Decrypt" button click
  const handleExecute = () => {
    sfx.playEncrypt();
    setIsEncryptingAnimation(true);

    setTimeout(() => {
      const res = runCipher();
      setIsEncryptingAnimation(false);

      if (inputText.trim().length > 0) {
        // Record into history
        const historyItem: HistoryItem = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: Date.now(),
          cipherType,
          mode,
          input: inputText,
          output: res.outputText,
          keyDisplay: res.keyDisplay
        };
        setHistory((prev) => [historyItem, ...prev.slice(0, 49)]);

        // Subtle confetti on encryption triumph
        if (mode === 'encrypt') {
          try {
            confetti({
              particleCount: 25,
              spread: 60,
              origin: { y: 0.7 },
              colors: ['#00f0ff', '#10b981', '#a855f7']
            });
          } catch {
            // Ignore
          }
        }
      }
    }, 280);
  };

  // Immediate live computation when editing text or switching algorithms
  useEffect(() => {
    runCipher();
  }, [inputText, cipherType, mode, caesarShift, vigenereKey, railFenceCount, substitutionKey]);

  // Copy to clipboard
  const handleCopy = () => {
    if (!result.outputText) return;
    navigator.clipboard.writeText(result.outputText);
    sfx.playSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Clear all text
  const handleClear = () => {
    sfx.playClick();
    setInputText('');
  };

  // Swap output back to input (useful for decrypting what was just encrypted)
  const handleSwap = () => {
    sfx.playClick();
    const prevOutput = result.outputText;
    setInputText(prevOutput);
    setMode((prev) => (prev === 'encrypt' ? 'decrypt' : 'encrypt'));
  };

  // Reroll parameters automatically
  const handleRerollCaesar = () => {
    const newShift = generateRandomCaesarShift();
    setCaesarShift(newShift);
  };

  const handleRerollVigenere = () => {
    const newKey = generateRandomVigenereKey();
    setVigenereKey(newKey);
  };

  const handleRerollSubstitution = () => {
    const newAlphabet = generateRandomSubstitutionKey();
    setSubstitutionKey(newAlphabet);
  };

  const scrollToSteps = () => {
    setShowSteps(true);
    setTimeout(() => {
      stepsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const activeMeta = CIPHER_METADATA[cipherType];

  return (
    <div className="min-h-screen bg-[#04060c] text-slate-100 flex flex-col font-sans relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Cyber Grid & Glow Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff08_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff08_1px,transparent_1px)] bg-[size:36px_36px]" />
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
      </div>

      {/* Navigation Header */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenViva={() => setIsInfoModalOpen(true)}
        onSelectPreset={(text, cipher) => {
          setInputText(text);
          setCipherType(cipher);
          setMode('encrypt');
        }}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        {/* Cipher Selection Bar (5 Algorithms) */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="uppercase tracking-wider flex items-center gap-1.5 text-cyan-400">
              <Zap className="w-3.5 h-3.5" />
              SELECT ENCRYPTION ALGORITHM
            </span>
            <button
              onClick={() => {
                sfx.playClick();
                setIsInfoModalOpen(true);
              }}
              className="text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              <span>How it works & Viva Guide</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {CIPHER_LIST.map((item) => {
              const isSelected = cipherType === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    sfx.playClick();
                    setCipherType(item.id);
                  }}
                  className={`relative p-3.5 rounded-xl border text-left font-mono transition-all overflow-hidden ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.25)] ring-1 ring-cyan-400/50'
                      : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900/60'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-0 right-0 w-12 h-12 bg-cyan-400/10 rounded-bl-full pointer-events-none" />
                  )}
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border uppercase font-semibold ${item.badgeColor}`}>
                      {item.category}
                    </span>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-slate-100 truncate">
                    {item.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Algorithm Header Banner */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900/70 border border-slate-800 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-slate-950 border border-cyan-500/30 text-cyan-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-bold text-slate-100 font-mono flex items-center gap-2">
                <span>{activeMeta.name}</span>
                <span className="text-xs text-slate-500 font-normal">({activeMeta.era})</span>
              </h1>
              <p className="text-xs text-slate-400 font-mono line-clamp-1">{activeMeta.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto Key Indicator Badge */}
            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 flex items-center gap-2">
              <KeyRound className="w-3.5 h-3.5 text-cyan-400" />
              <span>{result.keyDisplay}</span>
            </div>

            <button
              onClick={() => {
                sfx.playClick();
                setIsInfoModalOpen(true);
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
              title="View full cipher details and viva prep"
            >
              <Info className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Core Workspace: Input | Controls | Output */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* PANEL 1: PLAIN TEXT INPUT */}
          <div className="rounded-2xl bg-slate-900/60 border border-slate-800/90 p-5 flex flex-col justify-between backdrop-blur-xl shadow-xl space-y-4">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/70">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                    {mode === 'encrypt' ? 'INPUT PLAIN TEXT' : 'INPUT CIPHER TEXT'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-500">
                    {inputText.length} chars
                  </span>
                  {inputText && (
                    <button
                      onClick={handleClear}
                      className="text-[11px] font-mono text-slate-500 hover:text-rose-400 transition-colors flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Textarea */}
              <div className="mt-3 relative">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={
                    mode === 'encrypt'
                      ? 'Type or paste plaintext message to encrypt...'
                      : 'Type or paste encrypted ciphertext to decrypt...'
                  }
                  rows={6}
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800/80 p-4 font-mono text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all resize-y scrollbar-thin scrollbar-thumb-slate-800"
                />
              </div>
            </div>

            {/* Mode Toggle & Primary Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60">
              {/* Encrypt / Decrypt Switcher */}
              <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800">
                <button
                  onClick={() => {
                    sfx.playClick();
                    setMode('encrypt');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    mode === 'encrypt'
                      ? 'bg-cyan-500 text-slate-950 shadow-[0_0_12px_rgba(0,240,255,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  ENCRYPT
                </button>
                <button
                  onClick={() => {
                    sfx.playClick();
                    setMode('decrypt');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                    mode === 'decrypt'
                      ? 'bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Unlock className="w-3.5 h-3.5" />
                  DECRYPT
                </button>
              </div>

              {/* Action Button: Encrypt / Decrypt */}
              <button
                onClick={handleExecute}
                disabled={isEncryptingAnimation}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-mono font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(0,240,255,0.35)] transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{mode === 'encrypt' ? 'EXECUTE ENCRYPT' : 'EXECUTE DECRYPT'}</span>
              </button>
            </div>
          </div>

          {/* PANEL 2: CIPHER TEXT OUTPUT */}
          <div className="rounded-2xl bg-slate-900/60 border border-cyan-500/20 p-5 flex flex-col justify-between backdrop-blur-xl shadow-xl space-y-4">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-800/70">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
                  <span className="text-xs font-mono font-bold tracking-wider text-slate-300 uppercase">
                    {mode === 'encrypt' ? 'GENERATED CIPHER TEXT' : 'DECRYPTED PLAIN TEXT'}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-emerald-400">
                    {result.executionTimeMs} ms
                  </span>
                  <button
                    onClick={handleCopy}
                    disabled={!result.outputText}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-900/40 text-xs font-mono transition-all disabled:opacity-40"
                    title="Copy output text"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Output Display Box */}
              <div className="mt-3 relative">
                <div className="w-full min-h-[148px] max-h-[220px] rounded-xl bg-slate-950 border border-cyan-500/30 p-4 font-mono text-sm text-cyan-300 break-all overflow-y-auto shadow-inner scrollbar-thin scrollbar-thumb-cyan-900">
                  {result.outputText ? (
                    <span className="tracking-wider">{result.outputText}</span>
                  ) : (
                    <span className="text-slate-600 font-mono text-xs italic">
                      Output will appear here after encryption...
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Output Controls */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/60">
              <button
                onClick={handleSwap}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 transition-colors"
                title="Swap output text into input and flip mode"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>Swap to Input & Flip Mode</span>
              </button>

              {/* Show Steps Button requested by user */}
              <button
                onClick={() => {
                  sfx.playClick();
                  setShowSteps(!showSteps);
                  if (!showSteps) scrollToSteps();
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                  showSteps
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300'
                }`}
              >
                {showSteps ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4 text-cyan-400" />}
                <span>{showSteps ? 'HIDE ENCRYPTION STEPS' : 'SHOW ENCRYPTION STEPS'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Algorithm Specific Interactive Visualization (Shift Strip, Tabula Recta, Zigzag Wave Grid, etc.) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 pb-1">
            <span className="uppercase tracking-wider flex items-center gap-1.5 text-slate-200">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              ALGORITHM VISUALIZER ENGINE
            </span>
            <span className="text-[11px] text-slate-500">
              Parameters are generated automatically
            </span>
          </div>

          {cipherType === 'caesar' && (
            <CaesarVisualizer
              result={result}
              onShiftChange={(s) => setCaesarShift(s)}
              onRandomize={handleRerollCaesar}
            />
          )}

          {cipherType === 'vigenere' && (
            <VigenereVisualizer
              result={result}
              onRandomizeKey={handleRerollVigenere}
            />
          )}

          {cipherType === 'atbash' && (
            <AtbashVisualizer result={result} />
          )}

          {cipherType === 'railfence' && (
            <RailFenceVisualizer
              result={result}
              onRailsChange={(r) => setRailFenceCount(r)}
            />
          )}

          {cipherType === 'substitution' && (
            <SubstitutionVisualizer
              result={result}
              onRandomizeKey={handleRerollSubstitution}
            />
          )}
        </div>

        {/* Cryptographic Telemetry, Shannon Entropy & Hex/Binary */}
        <CipherAnalytics
          inputText={inputText}
          outputText={result.outputText}
        />

        {/* Step-by-Step Mathematical Walkthrough (When "Show Steps" is active) */}
        <div ref={stepsRef} className="space-y-4">
          <AnimatePresence>
            {showSteps && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-1 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff]" />
                    <span className="uppercase tracking-wider font-bold text-slate-200">
                      STEP-BY-STEP ENCRYPTION TRACE ({result.steps.length} CHARACTERS)
                    </span>
                  </div>
                  <span className="text-slate-500 text-[11px]">
                    Detailed letter-by-letter mathematical audit
                  </span>
                </div>

                <StepsInspector result={result} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-[#030408] py-6 px-4 text-center font-mono text-xs text-slate-500 relative z-10 space-y-2">
        <div className="flex items-center justify-center gap-3">
          <span className="text-slate-400 font-bold">CipherLab v2.4</span>
          <span>•</span>
          <span>Interactive Cryptography Suite</span>
          <span>•</span>
          <span className="text-cyan-400">Cybersecurity College Assignment Ready</span>
        </div>
        <div className="text-[11px] text-slate-600">
          Built with React, TypeScript, Tailwind CSS, Framer Motion & Lucide Icons
        </div>
      </footer>

      {/* Slide-out History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onSelect={(item) => {
          setInputText(item.input);
          setCipherType(item.cipherType);
          setMode(item.mode);
          setIsHistoryOpen(false);
          sfx.playSuccess();
        }}
        onClear={() => {
          setHistory([]);
          localStorage.removeItem('cipherlab_history');
        }}
      />

      {/* College Viva Guide & Algorithm Details Modal */}
      <AlgorithmInfoModal
        cipherType={cipherType}
        isOpen={isInfoModalOpen}
        onClose={() => setIsInfoModalOpen(false)}
      />
    </div>
  );
}

export default App;
