/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "purple-10": "#0C008C",
        "purple-9": "#1D0EBE",
        "purple-8": "#3525E6",
        "purple-7": "#4D3DF7",
        "purple-6": "#5D55FA",
        "purple-5": "#7069FA",
        "purple-4": "#8888FC",
        "purple-3": "#A2A5FC",
        "purple-2": "#C4C6FF",
        "purple-1": "#E6E6FF",
        "teal-10": "#014D40",
        "teal-9": "#0C6B58",
        "teal-8": "#147D64",
        "teal-7": "#199473",
        "teal-6": "#27AB83",
        "teal-5": "#3EBD93",
        "teal-4": "#65D6AD",
        "teal-3": "#8EEDC7",
        "teal-2": "#C6F7E2",
        "teal-1": "#EFFCF6"
      },
      fontFamily: {
        rubik: ['Rubik', 'sans-serif']
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}