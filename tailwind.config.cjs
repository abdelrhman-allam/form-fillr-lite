module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf9',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490'
        }
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.06)',
      }
    }
  },
  plugins: [require('tailwindcss-rtl')]
}