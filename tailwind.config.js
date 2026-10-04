/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#040508",
          dark: "#080c14",
          panel: "#0b101d",
          steel: "#161f33",
          border: "#1e293b",
          cyan: "#00f0ff",
          blue: "#0088ff",
          violet: "#a855f7",
          purple: "#7928ca",
          pink: "#ff007f",
          crimson: "#ff1744",
          acid: "#00ff66",
          silver: "#cbd5e1",
          muted: "#64748b"
        }
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Space Mono"', '"SF Mono"', 'Menlo', 'monospace'],
        display: ['"Syncopate"', '"Cabinet Grotesk"', '"Syne"', 'sans-serif'],
        technical: ['"Share Tech Mono"', '"Fira Code"', 'monospace']
      },
      animation: {
        'scan': 'scan 8s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'glitch': 'glitch 1s infinite linear alternate-reverse',
        'ticker': 'ticker 25s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.4))' },
          '50%': { opacity: '0.9', filter: 'drop-shadow(0 0 18px rgba(0, 240, 255, 0.8))' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1deg)' }
        }
      }
    },
  },
  plugins: [],
}
