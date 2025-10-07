/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e0e7ff',
          500: '#4f46e5',
          600: '#4338ca',
          900: '#1e1b4b'
        }
      }
    }
  },
  plugins: []
};
