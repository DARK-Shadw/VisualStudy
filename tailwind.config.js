/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4338ca',
        secondary: '#7c3aed',
        accent: '#06b6d4',
        success: '#10b981',
        warning: '#f59e0b',
        background: '#ffffff',
        surface: '#f9fafb',
        text: '#111827',
        'text-muted': '#6b7280',
      },
    },
  },
  plugins: [],
}
