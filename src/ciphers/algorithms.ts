import { CipherMode, CipherResult, CipherType, RailFenceGrid, StepItem } from '../types/cipher';

export const STANDARD_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Pre-defined memorable cyber keys for automatic generation
export const AUTO_VIGENERE_KEYS = ['KRYPTOS', 'CIPHER', 'SECURITY', 'QUANTUM', 'DEFENSE', 'SHADOW', 'VECTOR', 'ENIGMA'];

// Default substitution alphabet (shuffled A-Z)
export const DEFAULT_SUBSTITUTION_KEY = 'QWERTYUIOPASDFGHJKLZXCVBNM';

/**
 * Generates a random Caesar shift between 1 and 25
 */
export function generateRandomCaesarShift(): number {
  return Math.floor(Math.random() * 25) + 1;
}

/**
 * Picks a random auto-key for Vigenere
 */
export function generateRandomVigenereKey(): string {
  const randomIndex = Math.floor(Math.random() * AUTO_VIGENERE_KEYS.length);
  return AUTO_VIGENERE_KEYS[randomIndex];
}

/**
 * Generates a random substitution alphabet
 */
export function generateRandomSubstitutionKey(): string {
  const letters = STANDARD_ALPHABET.split('');
  for (let i = letters.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [letters[i], letters[j]] = [letters[j], letters[i]];
  }
  return letters.join('');
}

/**
 * Calculates Shannon Entropy of a string (useful for cryptanalysis)
 */
export function calculateEntropy(text: string): number {
  if (!text || text.length === 0) return 0;
  const freqs: Record<string, number> = {};
  for (const char of text) {
    freqs[char] = (freqs[char] || 0) + 1;
  }
  let entropy = 0;
  const len = text.length;
  for (const count of Object.values(freqs)) {
    const p = count / len;
    entropy -= p * Math.log2(p);
  }
  return parseFloat(entropy.toFixed(3));
}

// -------------------------------------------------------------
// CAESAR CIPHER
// -------------------------------------------------------------
export function processCaesar(
  text: string,
  mode: CipherMode,
  shift: number = 3
): CipherResult {
  const startTime = performance.now();
  const normalizedShift = ((shift % 26) + 26) % 26;
  const effectiveShift = mode === 'encrypt' ? normalizedShift : (26 - normalizedShift) % 26;
  
  // Shifted alphabet for visualization
  const shiftedAlphabet = STANDARD_ALPHABET.slice(normalizedShift) + STANDARD_ALPHABET.slice(0, normalizedShift);

  let output = '';
  const steps: StepItem[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const upperChar = char.toUpperCase();
    const isUpper = char === upperChar && char !== char.toLowerCase();
    const isLower = char === char.toLowerCase() && char !== upperChar;
    const isAlpha = isUpper || isLower;

    if (!isAlpha) {
      output += char;
      steps.push({
        index: i,
        originalChar: char,
        transformedChar: char,
        isAlpha: false,
        detail: `Non-alphabetic character passed through unchanged.`
      });
      continue;
    }

    const originalIdx = upperChar.charCodeAt(0) - 65;
    let transformedIdx: number;
    let formulaStr: string;

    if (mode === 'encrypt') {
      transformedIdx = (originalIdx + normalizedShift) % 26;
      formulaStr = `(${originalIdx} + ${normalizedShift}) mod 26 = ${transformedIdx}`;
    } else {
      transformedIdx = (originalIdx - normalizedShift + 26) % 26;
      formulaStr = `(${originalIdx} - ${normalizedShift} + 26) mod 26 = ${transformedIdx}`;
    }

    const transformedUpper = STANDARD_ALPHABET[transformedIdx];
    const finalChar = isLower ? transformedUpper.toLowerCase() : transformedUpper;

    output += finalChar;

    steps.push({
      index: i,
      originalChar: char,
      transformedChar: finalChar,
      isAlpha: true,
      detail: `${mode === 'encrypt' ? 'Shifted' : 'Unshifted'} by ${normalizedShift} positions: ${char} (${originalIdx}) → ${finalChar} (${transformedIdx})`,
      meta: {
        originalIndex: originalIdx,
        transformedIndex: transformedIdx,
        shift: normalizedShift,
        formula: formulaStr
      }
    });
  }

  const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));

  return {
    inputText: text,
    outputText: output,
    cipherType: 'caesar',
    mode,
    keyDisplay: `Shift: ${normalizedShift} (k = ${normalizedShift})`,
    parameters: { shift: normalizedShift, shiftedAlphabet },
    steps,
    caesarShift: normalizedShift,
    executionTimeMs
  };
}

// -------------------------------------------------------------
// VIGENÈRE CIPHER
// -------------------------------------------------------------
export function processVigenere(
  text: string,
  mode: CipherMode,
  key: string = 'KRYPTOS'
): CipherResult {
  const startTime = performance.now();
  const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '') || 'CIPHER';
  
  let output = '';
  const steps: StepItem[] = [];
  const vigenereAlignment: { plainChar: string; keyChar: string; cipherChar: string; isAlpha: boolean }[] = [];
  
  let keyIndex = 0;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const upperChar = char.toUpperCase();
    const isUpper = char === upperChar && char !== char.toLowerCase();
    const isLower = char === char.toLowerCase() && char !== upperChar;
    const isAlpha = isUpper || isLower;

    if (!isAlpha) {
      output += char;
      steps.push({
        index: i,
        originalChar: char,
        transformedChar: char,
        isAlpha: false,
        detail: `Special character/whitespace preserved unchanged.`
      });
      vigenereAlignment.push({
        plainChar: char,
        keyChar: '-',
        cipherChar: char,
        isAlpha: false
      });
      continue;
    }

    const currentKeyChar = cleanKey[keyIndex % cleanKey.length];
    keyIndex++;

    const textIdx = upperChar.charCodeAt(0) - 65;
    const keyShift = currentKeyChar.charCodeAt(0) - 65;

    let transformedIdx: number;
    let formulaStr: string;

    if (mode === 'encrypt') {
      transformedIdx = (textIdx + keyShift) % 26;
      formulaStr = `(${textIdx} ['${upperChar}'] + ${keyShift} ['${currentKeyChar}']) mod 26 = ${transformedIdx}`;
    } else {
      transformedIdx = (textIdx - keyShift + 26) % 26;
      formulaStr = `(${textIdx} ['${upperChar}'] - ${keyShift} ['${currentKeyChar}'] + 26) mod 26 = ${transformedIdx}`;
    }

    const transformedUpper = STANDARD_ALPHABET[transformedIdx];
    const finalChar = isLower ? transformedUpper.toLowerCase() : transformedUpper;

    output += finalChar;

    steps.push({
      index: i,
      originalChar: char,
      transformedChar: finalChar,
      isAlpha: true,
      detail: `Key letter '${currentKeyChar}' (shift +${keyShift}): Tabula Recta coordinate (Row: ${currentKeyChar}, Col: ${upperChar})`,
      meta: {
        originalIndex: textIdx,
        transformedIndex: transformedIdx,
        keyChar: currentKeyChar,
        keyIndex: keyShift,
        formula: formulaStr
      }
    });

    vigenereAlignment.push({
      plainChar: char,
      keyChar: currentKeyChar,
      cipherChar: finalChar,
      isAlpha: true
    });
  }

  const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));

  return {
    inputText: text,
    outputText: output,
    cipherType: 'vigenere',
    mode,
    keyDisplay: `Auto Key: "${cleanKey}" (Length: ${cleanKey.length})`,
    parameters: { key: cleanKey },
    steps,
    vigenereAlignment,
    executionTimeMs
  };
}

// -------------------------------------------------------------
// ATBASH CIPHER
// -------------------------------------------------------------
export function processAtbash(
  text: string,
  mode: CipherMode
): CipherResult {
  const startTime = performance.now();
  let output = '';
  const steps: StepItem[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const upperChar = char.toUpperCase();
    const isUpper = char === upperChar && char !== char.toLowerCase();
    const isLower = char === char.toLowerCase() && char !== upperChar;
    const isAlpha = isUpper || isLower;

    if (!isAlpha) {
      output += char;
      steps.push({
        index: i,
        originalChar: char,
        transformedChar: char,
        isAlpha: false,
        detail: `Non-alphabetic character retained unchanged.`
      });
      continue;
    }

    const originalIdx = upperChar.charCodeAt(0) - 65; // 0 for A, 25 for Z
    const transformedIdx = 25 - originalIdx;           // 25 for A -> Z, 0 for Z -> A
    const transformedUpper = STANDARD_ALPHABET[transformedIdx];
    const finalChar = isLower ? transformedUpper.toLowerCase() : transformedUpper;

    output += finalChar;

    const formulaStr = `25 - ${originalIdx} = ${transformedIdx} (${upperChar} ↔ ${transformedUpper})`;

    steps.push({
      index: i,
      originalChar: char,
      transformedChar: finalChar,
      isAlpha: true,
      detail: `Mirrored across alphabet midpoint (Position ${originalIdx} ↔ ${transformedIdx}): ${char} ↔ ${finalChar}`,
      meta: {
        originalIndex: originalIdx,
        transformedIndex: transformedIdx,
        formula: formulaStr
      }
    });
  }

  const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));

  return {
    inputText: text,
    outputText: output,
    cipherType: 'atbash',
    mode,
    keyDisplay: `Affine Reciprocal: f(x) = (25 - x) mod 26 (Self-Inverting)`,
    parameters: { symmetric: true },
    steps,
    executionTimeMs
  };
}

// -------------------------------------------------------------
// RAIL FENCE CIPHER (ZIGZAG)
// -------------------------------------------------------------
export function processRailFence(
  text: string,
  mode: CipherMode,
  rails: number = 3
): CipherResult {
  const startTime = performance.now();
  const numRails = Math.max(2, Math.min(rails, Math.max(2, text.length)));

  if (text.length <= 1 || numRails <= 1) {
    return {
      inputText: text,
      outputText: text,
      cipherType: 'railfence',
      mode,
      keyDisplay: `Rails: ${numRails}`,
      parameters: { rails: numRails },
      steps: [],
      executionTimeMs: 0
    };
  }

  const steps: StepItem[] = [];
  const matrix: (string | null)[][] = Array.from({ length: numRails }, () =>
    Array(text.length).fill(null)
  );
  const sequence: { row: number; col: number; char: string }[] = [];

  let output = '';

  if (mode === 'encrypt') {
    // Determine zigzag coordinates for each character
    let row = 0;
    let directionDown = false;

    for (let col = 0; col < text.length; col++) {
      if (row === 0 || row === numRails - 1) {
        directionDown = !directionDown;
      }
      matrix[row][col] = text[col];
      sequence.push({ row, col, char: text[col] });
      row += directionDown ? 1 : -1;
    }

    // Read row by row to form ciphertext
    for (let r = 0; r < numRails; r++) {
      for (let c = 0; c < text.length; c++) {
        if (matrix[r][c] !== null) {
          const char = matrix[r][c]!;
          output += char;
          steps.push({
            index: output.length - 1,
            originalChar: char,
            transformedChar: char,
            isAlpha: true,
            detail: `Extracted from Rail #${r + 1} at matrix coordinate [Row ${r + 1}, Column ${c + 1}]`,
            meta: {
              railIndex: r,
              railCol: c
            }
          });
        }
      }
    }
  } else {
    // Decryption
    // First, mark the zigzag pattern positions
    let row = 0;
    let directionDown = false;
    for (let col = 0; col < text.length; col++) {
      if (row === 0 || row === numRails - 1) {
        directionDown = !directionDown;
      }
      matrix[row][col] = '*'; // placeholder
      row += directionDown ? 1 : -1;
    }

    // Fill placeholders with ciphertext characters row-by-row
    let textIndex = 0;
    for (let r = 0; r < numRails; r++) {
      for (let c = 0; c < text.length; c++) {
        if (matrix[r][c] === '*' && textIndex < text.length) {
          matrix[r][c] = text[textIndex++];
        }
      }
    }

    // Read back in zigzag order
    row = 0;
    directionDown = false;
    for (let col = 0; col < text.length; col++) {
      if (row === 0 || row === numRails - 1) {
        directionDown = !directionDown;
      }
      const char = matrix[row][col] || '';
      output += char;
      sequence.push({ row, col, char });
      steps.push({
        index: col,
        originalChar: char,
        transformedChar: char,
        isAlpha: true,
        detail: `Reconstructed zigzag order from Rail #${row + 1}, Col ${col + 1}: '${char}'`,
        meta: {
          railIndex: row,
          railCol: col
        }
      });
      row += directionDown ? 1 : -1;
    }
  }

  const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));

  const railGrid: RailFenceGrid = {
    rails: numRails,
    matrix,
    sequence
  };

  return {
    inputText: text,
    outputText: output,
    cipherType: 'railfence',
    mode,
    keyDisplay: `Auto Rails: ${numRails} (Period: ${2 * (numRails - 1)})`,
    parameters: { rails: numRails },
    steps,
    railGrid,
    executionTimeMs
  };
}

// -------------------------------------------------------------
// SUBSTITUTION CIPHER (MONOALPHABETIC RANDOM MAPPING)
// -------------------------------------------------------------
export function processSubstitution(
  text: string,
  mode: CipherMode,
  keyAlphabet: string = DEFAULT_SUBSTITUTION_KEY
): CipherResult {
  const startTime = performance.now();
  const cleanKey = (keyAlphabet.toUpperCase().replace(/[^A-Z]/g, '') + STANDARD_ALPHABET).slice(0, 26);
  
  // Build lookup maps
  const encMap: Record<string, string> = {};
  const decMap: Record<string, string> = {};

  for (let i = 0; i < 26; i++) {
    const plainChar = STANDARD_ALPHABET[i];
    const cipherChar = cleanKey[i];
    encMap[plainChar] = cipherChar;
    decMap[cipherChar] = plainChar;
  }

  let output = '';
  const steps: StepItem[] = [];

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const upperChar = char.toUpperCase();
    const isUpper = char === upperChar && char !== char.toLowerCase();
    const isLower = char === char.toLowerCase() && char !== upperChar;
    const isAlpha = isUpper || isLower;

    if (!isAlpha) {
      output += char;
      steps.push({
        index: i,
        originalChar: char,
        transformedChar: char,
        isAlpha: false,
        detail: `Symbol/digit '${char}' not mapped in standard 26-char substitution table.`
      });
      continue;
    }

    let targetCharUpper: string;
    let detailMsg: string;

    if (mode === 'encrypt') {
      targetCharUpper = encMap[upperChar] || upperChar;
      detailMsg = `Alphabet substitution: '${upperChar}' maps to cipher symbol '${targetCharUpper}'`;
    } else {
      targetCharUpper = decMap[upperChar] || upperChar;
      detailMsg = `Reverse key lookup: Cipher symbol '${upperChar}' decodes back to original '${targetCharUpper}'`;
    }

    const finalChar = isLower ? targetCharUpper.toLowerCase() : targetCharUpper;
    output += finalChar;

    steps.push({
      index: i,
      originalChar: char,
      transformedChar: finalChar,
      isAlpha: true,
      detail: detailMsg,
      meta: {
        substitutedWith: finalChar,
        formula: `${char} → ${finalChar}`
      }
    });
  }

  const executionTimeMs = parseFloat((performance.now() - startTime).toFixed(2));

  return {
    inputText: text,
    outputText: output,
    cipherType: 'substitution',
    mode,
    keyDisplay: `Auto Key Alphabet: "${cleanKey.slice(0, 10)}..." (26 Permutations)`,
    parameters: { keyAlphabet: cleanKey },
    steps,
    substitutionMap: encMap,
    executionTimeMs
  };
}

/**
 * Main dispatcher to execute any cipher
 */
export function executeCipher(
  cipherType: CipherType,
  text: string,
  mode: CipherMode,
  params?: {
    shift?: number;
    vigenereKey?: string;
    rails?: number;
    substitutionKey?: string;
  }
): CipherResult {
  switch (cipherType) {
    case 'caesar':
      return processCaesar(text, mode, params?.shift ?? 3);
    case 'vigenere':
      return processVigenere(text, mode, params?.vigenereKey ?? 'KRYPTOS');
    case 'atbash':
      return processAtbash(text, mode);
    case 'railfence':
      return processRailFence(text, mode, params?.rails ?? 3);
    case 'substitution':
      return processSubstitution(text, mode, params?.substitutionKey ?? DEFAULT_SUBSTITUTION_KEY);
    default:
      return processCaesar(text, mode, 3);
  }
}
