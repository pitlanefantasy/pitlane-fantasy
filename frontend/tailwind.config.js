/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'pit-bg': '#F2F3F5',
        'pit-ink': '#12141A',
        'pit-muted': '#6B7280',
        'pit-red': '#E4472B',
        'pit-up': '#1D9E75',
        'pit-up-bg': '#E1F5EE',
        'pit-down': '#A32D2D',
        'pit-down-bg': '#FAECE7',
        'pit-best': '#7B5CE0',
        'pit-best-bg': '#EEEDFE',
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
};
