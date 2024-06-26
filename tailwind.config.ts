import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1400px',
      'xsm': '320px', // Added 'xsm' screen size with appropriate width
    },
    container: {
      center: true,
      padding: "2rem",
    },
    extend: {
      colors: {
        facebook: {
          primary: '#1877f2', // Facebook blue
          secondary: '#e9ebee', // Facebook gray background
        },
        instagram: {
          primary: '#f56040', // Instagram orange
          secondary: '#1e1e1e', // Instagram dark background
        },
      },
      keyframes: {
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' },
        },
        blinkCaret: {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: 'black' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(100)', opacity: '1' },
          '100%': { transform: 'translateY(-100%)', opacity: '0' },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        typing: 'typing 4s steps(40, end)',
        blinkCaret: 'blinkCaret .75s step-end infinite',
        slideDown: 'slideDown 0.5s ease-in-out',
        slideUp: 'slideUp 0.5s ease-in-out',
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    // Add other plugins as needed
  ],
};

export default config;
