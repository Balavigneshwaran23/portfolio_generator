/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {

      // Custom Colors
      colors: {
        orange1: '#FF7E00',
        dimorange: '#F97316',
        gray1: '#613F00',
        orange: {
          500: '#ff6a00',
        },
      },

      // Custom Font Families
      fontFamily: {
        logofont: ['"Great Vibes"', 'cursive'],
        boldfont: ['"Black Ops One"', 'sans-serif'],
        classicfont: ['"Cantata One"', 'serif'],
        displayfont: ['"DM Serif Display"', 'serif'],
        textfont: ['"DM Serif Text"', 'serif'],
        modernfont: ['"Do Hyeon"', 'sans-serif'],
        sportyfont: ['"Racing Sans One"', 'sans-serif'],
      }
    },
  },
  plugins: [
    require('autoprefixer'),
    require('tailwindcss'),
  ],
};
