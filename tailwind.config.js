/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pinterest: {
          red: '#E60023',
          darkRed: '#ad081b',
          hoverRed: '#b60000',
          lightRed: '#fef2f2',
          gray: '#efefef',
          darkGray: '#767676',
          text: '#111827',
          navy: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen-Sans', 'Ubuntu', 'Cantarell', '"Fira Sans"', '"Droid Sans"', '"Helvetica Neue"', 'Helvetica', '"ヒラギノ角ゴ Pro W3"', '"Hiragino Kaku Gothic Pro"', 'Meriyo', 'Meiryo', '"ＭＳ Ｐゴシック"', '"MS PGothic"', 'sans-serif'],
      },
      boxShadow: {
        'pin': '0 1px 20px 0 rgba(0,0,0,0.1)',
        'pin-hover': '0 8px 30px rgba(0,0,0,0.15)',
        'card': '0 2px 10px rgba(0,0,0,0.05)',
      }
    },
  },
  plugins: [],
}
