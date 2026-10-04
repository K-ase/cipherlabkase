export type CipherType = 'caesar' | 'vigenere' | 'atbash' | 'railfence' | 'substitution';
export type CipherMode = 'encrypt' | 'decrypt';

export interface StepItem {
  index: number;
  originalChar: string;
  transformedChar: string;
  isAlpha: boolean;
  detail: string;
  meta?: {
    originalIndex?: number;
    transformedIndex?: number;
    shift?: number;
    keyChar?: string;
    keyIndex?: number;
    railIndex?: number;
    railCol?: number;
    substitutedWith?: string;
    formula?: string;
  };
}

export interface RailFenceGrid {
  rails: number;
  matrix: (string | null)[][];
  sequence: { row: number; col: number; char: string }[];
}

export interface CipherResult {
  inputText: string;
  outputText: string;
  cipherType: CipherType;
  mode: CipherMode;
  keyDisplay: string;
  parameters: Record<string, any>;
  steps: StepItem[];
  executionTimeMs: number;
  railGrid?: RailFenceGrid;
  caesarShift?: number;
  substitutionMap?: Record<string, string>;
  vigenereAlignment?: { plainChar: string; keyChar: string; cipherChar: string; isAlpha: boolean }[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  cipherType: CipherType;
  mode: CipherMode;
  input: string;
  output: string;
  keyDisplay: string;
}

export interface VivaQuestion {
  question: string;
  answer: string;
}

export interface CipherMetadata {
  id: CipherType;
  name: string;
  tagline: string;
  category: 'Monoalphabetic' | 'Polyalphabetic' | 'Transposition' | 'Reciprocal / Mirror';
  inventor: string;
  era: string;
  badgeColor: string;
  formula: {
    encrypt: string;
    decrypt: string;
  };
  keySpace: string;
  howItWorks: string[];
  strengths: string[];
  weaknesses: string[];
  vivaQuestions: VivaQuestion[];
}
