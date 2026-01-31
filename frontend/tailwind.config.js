/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          bg: '#0F0F0F',
          secondary: '#1A1A1A',
          tertiary: '#252525',
        },
        accent: {
          DEFAULT: '#D97706',
          hover: '#F59E0B',
        },
        text: {
          primary: '#FAFAFA',
          secondary: '#A3A3A3',
          tertiary: '#737373',
        },
        border: '#2A2A2A',
      },
    },
  },
  plugins: [],
}
