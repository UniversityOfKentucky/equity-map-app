/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {},
  },
  important: true,
  variants: {
    extend: {
      overflow: ['hover'],
      textOverflow: ['hover'],
      whiteSpace: ['hover'],
    }
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.untruncate': {
          overflow: 'visible',
          textOverflow: 'clip',
          whiteSpace: 'normal',
        }
      }, ['hover']);
    }
  ]
}
