/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#081CDD',
          200: '#394FFB',
          300: '#071BDA',
          400: '#2739F1',
          500: '#000099'
        },
        secondary: {
          100: '#D8D6D9'
        }
      },
      borderRadius: {
        'sm': '5rem',
        'ksm': '10px'
      },
      left: {
        'm': '22rem'
      },
      fontFamily: {
        'ms': 'Merriweather Sans'
      }
    },
  },
  plugins: [],
}

