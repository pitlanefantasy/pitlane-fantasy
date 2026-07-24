/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'pit-asphalt': '#1A1D23',
        'pit-asphalt-light': '#24282F',
        'pit-red': '#E4002B',
        'pit-yellow': '#FFC800',
        'pit-white': '#F5F6F7',
        'pit-grey': '#8B92A0',
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
