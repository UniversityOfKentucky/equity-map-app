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
        // adds a utility class for 'untruncating' text
        '.untruncate': {
          overflow: 'visible',
          textOverflow: 'clip',
          whiteSpace: 'normal',
        },
        // adds a utility class for xxs font size
        '.text-xxs': {
          fontSize: '0.75rem',
        },
      }, ['hover']);
    }
  ]
}
