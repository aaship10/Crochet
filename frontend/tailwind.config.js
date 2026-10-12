/** @type {import('tailwindcss').Config} */
// Palette taken from the Threaded Things logo: navy, lavender and slate-blue on a soft lilac background.
// `orange` (accent) and `stone` (neutrals) are remapped so every existing class picks up the brand colours.
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#F1F5F9',
          100: '#E2EAF2',
          200: '#C9D7E4',
          300: '#A3B8CB',
          400: '#7C95AB',
          500: '#3A4A9F',
          600: '#2D3A8C',
          700: '#26327A',
          800: '#1D2762',
          900: '#141B48',
        },
        stone: {
          50: '#F8F9FB',
          100: '#EEF0F5',
          200: '#E0E4EC',
          300: '#C8CEDA',
          400: '#98A1B3',
          500: '#6B7587',
          600: '#4F5A6E',
          700: '#3A4458',
          800: '#262F45',
          900: '#1A2138',
        },
      },
    },
  },
  plugins: [],
}
