import { CipherMetadata, CipherType } from '../types/cipher';

export const CIPHER_METADATA: Record<CipherType, CipherMetadata> = {
  caesar: {
    id: 'caesar',
    name: 'Caesar Cipher',
    tagline: 'The classic monoalphabetic shift cipher used by Julius Caesar to protect military orders.',
    category: 'Monoalphabetic',
    inventor: 'Julius Caesar (Rome)',
    era: 'circa 58 BC',
    badgeColor: 'border-cyan-500/40 text-cyan-400 bg-cyan-950/40',
    formula: {
      encrypt: 'E(x) = (x + k) mod 26',
      decrypt: 'D(x) = (x - k + 26) mod 26'
    },
    keySpace: '25 possible keys (trivial to brute-force)',
    howItWorks: [
      'Each character in the plaintext is shifted down the alphabet by an offset of k positions.',
      'When the shift extends beyond Z, it wraps around to the beginning of the alphabet (modular arithmetic mod 26).',
      'Case sensitivity is preserved; spaces, numbers, and symbols pass through without shifting.'
    ],
    strengths: [
      'Extremely fast computational performance (O(n) time and O(1) auxiliary space).',
      'Simple mental execution for historical battlefield couriers who could not carry physical cipher apparatus.',
      'Serves as the foundation for the Caesar-shift family (e.g. ROT13, ROT47).'
    ],
    weaknesses: [
      'Extremely small key space of only 25 valid keys, meaning an adversary can test all combinations in milliseconds.',
      'Completely preserves letter frequency distributions (e.g., E, T, A remain the most frequent letters in ciphertext).'
    ],
    vivaQuestions: [
      {
        question: 'Why is the Caesar Cipher vulnerable to Frequency Analysis?',
        answer: 'Because it is a monoalphabetic cipher. A given plaintext letter always maps to the same ciphertext letter. In standard English, letters like "E", "T", "A", and "O" have unique frequencies that remain plainly visible in the ciphertext histogram.'
      },
      {
        question: 'What is ROT13 and why is it symmetrical?',
        answer: 'ROT13 is a Caesar cipher with a shift of 13. Since the Latin alphabet has 26 letters and 13 is exactly half (26 / 2 = 13), running ROT13 twice restores the original text: (x + 13 + 13) mod 26 = x mod 26.'
      },
      {
        question: 'How do you calculate the key space for Caesar Cipher?',
        answer: 'There are 26 letters in the alphabet. A shift of 0 (or 26) leaves the text unchanged, leaving exactly 25 effective non-trivial keys.'
      }
    ]
  },
  vigenere: {
    id: 'vigenere',
    name: 'Vigenère Cipher',
    tagline: 'The legendary "le chiffre indéchiffrable" that defeated cryptanalysts for three centuries using polyalphabetic substitution.',
    category: 'Polyalphabetic',
    inventor: 'Giovan Battista Bellaso / Blaise de Vigenère',
    era: '1553 - 1586 AD',
    badgeColor: 'border-emerald-500/40 text-emerald-400 bg-emerald-950/40',
    formula: {
      encrypt: 'C[i] = (P[i] + K[i mod m]) mod 26',
      decrypt: 'P[i] = (C[i] - K[i mod m] + 26) mod 26'
    },
    keySpace: '26^m (where m is key length; e.g. a 7-letter key provides ~8 billion combinations)',
    howItWorks: [
      'A secret keyword (e.g., "KRYPTOS") is repeated continuously to match the length of the plaintext.',
      'Each character is encrypted using a different Caesar shift determined by the corresponding key character.',
      'Historically performed using the Tabula Recta (a 26x26 matrix of alphabets).'
    ],
    strengths: [
      'Flattens single-letter frequency distribution spikes because the same plaintext character maps to multiple different ciphertext characters depending on its position.',
      'Resistant to naive brute-force attacks when the keyword is sufficiently long and unpredictable.'
    ],
    weaknesses: [
      'Repeating key leaks the keyword length via Kasiski Examination (finding repeating n-grams) and Friedman Test (Index of Coincidence).',
      'Once key length m is discovered, the cipher degenerates into m interleaved Caesar ciphers, each easily broken with frequency analysis.'
    ],
    vivaQuestions: [
      {
        question: 'What makes Vigenère different from monoalphabetic ciphers?',
        answer: 'It is polyalphabetic. In monoalphabetic ciphers, a plaintext letter always transforms into the exact same cipher letter. In Vigenère, the character "E" might become "M" at index 0 and "R" at index 3.'
      },
      {
        question: 'How was Vigenère eventually broken by Charles Babbage and Friedrich Kasiski?',
        answer: 'By observing repeating ciphertext strings. The distance between identical patterns usually shares common factors representing multiples of the keyword length. Once the key length is deduced, each column is solved using standard letter frequency.'
      },
      {
        question: 'What happens if the Vigenère key is truly random, never reused, and equal to message length?',
        answer: 'It becomes a One-Time Pad (Vernam cipher), which Claude Shannon mathematically proved to provide Information-Theoretic Security (unbreakable even with infinite computing power).'
      }
    ]
  },
  atbash: {
    id: 'atbash',
    name: 'Atbash Cipher',
    tagline: 'An ancient biblical reciprocal monoalphabetic cipher that reverses the alphabet.',
    category: 'Reciprocal / Mirror',
    inventor: 'Hebrew Scribes (Kabbalistic tradition)',
    era: 'circa 500 BC',
    badgeColor: 'border-amber-500/40 text-amber-400 bg-amber-950/40',
    formula: {
      encrypt: 'E(x) = 25 - x',
      decrypt: 'D(x) = 25 - x  (Self-inverting reciprocal)'
    },
    keySpace: '1 fixed key (Deterministic reciprocal permutation)',
    howItWorks: [
      'The alphabet is mirrored along its median: A maps to Z, B maps to Y, C maps to X, and vice versa.',
      'Because it is an involution (its own inverse), the encryption and decryption procedures are identical.',
      'Used famously in the biblical Book of Jeremiah to disguise the name "Babel" (Babylon) as "Sheshach".'
    ],
    strengths: [
      'Zero key management required: sender and receiver need no shared pre-shared secret key.',
      'Symmetric execution: the exact same hardware circuit or function encrypts and decrypts.'
    ],
    weaknesses: [
      'No security through obscurity: an adversary knowing the cipher can instantly read the entire message.',
      'Vulnerable to immediate frequency analysis and reverse letter counting.'
    ],
    vivaQuestions: [
      {
        question: 'Why does Atbash not require a secret key?',
        answer: 'Atbash relies entirely on a fixed substitution rule (A↔Z, B↔Y). It violates Kerckhoffs\'s principle, which states that a cryptographic system must remain secure even if everything about the system except the key is public knowledge.'
      },
      {
        question: 'How is Atbash expressed in modern modular arithmetic?',
        answer: 'As an Affine cipher where a = 25 and b = 25: f(x) = (25x + 25) mod 26. Since 25 ≡ -1 mod 26, this reduces directly to (-x - 1) mod 26 = (25 - x) mod 26.'
      }
    ]
  },
  railfence: {
    id: 'railfence',
    name: 'Rail Fence Cipher',
    tagline: 'A classic transposition cipher that scrambles text by writing it in a zigzag wave across invisible rails.',
    category: 'Transposition',
    inventor: 'Classical military strategists (notably American Civil War)',
    era: 'Classical antiquity / 1860s',
    badgeColor: 'border-purple-500/40 text-purple-400 bg-purple-950/40',
    formula: {
      encrypt: 'Write text in bouncing wave over r rails; concatenate rows',
      decrypt: 'Mark zigzag coordinates; populate row-by-row; read wave'
    },
    keySpace: 'r ∈ [2, n-1] (Finite rail depths, easily enumerated)',
    howItWorks: [
      'The characters are written diagonally down and up across a preset number of horizontal rails like a fence.',
      'Once all text is written in the zigzag pattern, the message is read off row by row from top to bottom.',
      'The letters themselves are never altered, only their spatial positions are scrambled (transposition).'
    ],
    strengths: [
      'Preserves original character set and maintains exact letter frequency, confusing analysts looking for substitution patterns.',
      'Can be combined with a substitution cipher to create product ciphers exhibiting both Confusion and Diffusion (Claude Shannon\'s core tenets).'
    ],
    weaknesses: [
      'Because all original letters are intact, an attacker knowing the plaintext language can reassemble the message using anagramming and n-gram scoring.',
      'The number of practical rails is constrained by message length, making exhaustive search quick.'
    ],
    vivaQuestions: [
      {
        question: 'What is the fundamental difference between Substitution and Transposition ciphers?',
        answer: 'Substitution ciphers change the identity of characters while maintaining their positions (introducing Confusion). Transposition ciphers keep the characters unchanged but scramble their positions (introducing Diffusion).'
      },
      {
        question: 'What is the period of a Rail Fence cipher with r rails?',
        answer: 'The wave cycle repeats every 2 * (r - 1) characters. For 3 rails, the cycle length is 2 * (3 - 1) = 4 characters.'
      },
      {
        question: 'Why are modern ciphers (like AES) built by chaining substitution and transposition?',
        answer: 'Shannon\'s theorem proves that iterating rounds of Substitution (Confusion) and Permutation/Transposition (Diffusion) creates a strong cryptographic product cipher resistant to differential and linear cryptanalysis.'
      }
    ]
  },
  substitution: {
    id: 'substitution',
    name: 'Simple Substitution Cipher',
    tagline: 'A monoalphabetic cipher where each letter of the alphabet is replaced by a fixed arbitrary substitute letter.',
    category: 'Monoalphabetic',
    inventor: 'Ancient Arabic cryptographers (Al-Kindi)',
    era: 'circa 850 AD',
    badgeColor: 'border-rose-500/40 text-rose-400 bg-rose-950/40',
    formula: {
      encrypt: 'C = KeyAlphabet[Index(P)]',
      decrypt: 'P = StandardAlphabet[IndexInKey(C)]'
    },
    keySpace: '26! ≈ 4.03 × 10^26 possible keys (effectively immune to brute-force)',
    howItWorks: [
      'A permutation of all 26 letters of the alphabet is established as the key mapping.',
      'Every time a character appears in the plaintext, it is mapped to its predetermined replacement symbol.',
      'The mapping remains 1-to-1 throughout the entirety of the message.'
    ],
    strengths: [
      'Huge key space of 26 factorial (~403 septillion combinations), making exhaustive key search computationally impossible for manual attackers.',
      'Straightforward table lookup implementation.'
    ],
    weaknesses: [
      'Utterly vulnerable to Frequency Analysis: letter frequencies, digrams (TH, HE, IN), trigrams (THE, AND), and single-letter words (A, I) directly reveal the key.',
      'First thoroughly dismantled in the 9th century by polymath Al-Kindi in "A Manuscript on Deciphering Cryptographic Messages".'
    ],
    vivaQuestions: [
      {
        question: 'If the key space is 26! (huge), why is Monoalphabetic Substitution considered insecure?',
        answer: 'Because cryptanalysts do NOT need to brute-force all 26! keys. Frequency analysis bypasses the massive key space by exploiting the statistical properties of the natural language.'
      },
      {
        question: 'Who was Al-Kindi and what was his contribution to cryptography?',
        answer: 'Al-Kindi was a 9th-century Arab mathematician who invented frequency analysis. He showed that by counting how often letters appear in a long ciphertext and comparing with known language frequencies, any monoalphabetic cipher can be cracked.'
      }
    ]
  }
};
