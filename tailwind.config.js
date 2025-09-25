module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts,scss}'],
  theme: {
    extend: {
      colors: {
        day: {
          50: '#f5f9ff',
          100: '#e4f1ff',
          200: '#c6e0ff',
          300: '#a0ccff',
          400: '#78b3ff',
          500: '#4f9aff',
          600: '#2b7fe8',
          700: '#1f63be',
          800: '#174c94',
          900: '#12396e',
          950: '#0c274c',
        },
        night: {
          50: '#f5f7ff',
          100: '#e3e7ff',
          200: '#c4c9ff',
          300: '#9ba6ff',
          400: '#6e7dfc',
          500: '#4c5bda',
          600: '#3846b3',
          700: '#253184',
          800: '#151b4f',
          900: '#0b102f',
          950: '#050818',
        },
        aurora: {
          100: '#fdf2d2',
          200: '#fde2a8',
          300: '#fbc47c',
          400: '#f49b4d',
          500: '#ea7a26',
          600: '#d15e14',
        },
        mist: {
          100: '#eef5ff',
          200: '#ddeafd',
          300: '#c8dcfb',
          400: '#b2cefa',
        },
      },
      boxShadow: {
        'card-day': '0 25px 45px -20px rgba(33, 115, 180, 0.35)',
        'card-night': '0 25px 45px -20px rgba(15, 23, 42, 0.55)',
      },
      backgroundImage: {
        'day-sky': 'linear-gradient(160deg, #e4f1ff 0%, #a0ccff 40%, #78b3ff 100%)',
        'night-sky': 'linear-gradient(160deg, #0b102f 0%, #253184 45%, #3846b3 100%)',
      },
      keyframes: {
        'slide-fade-in': {
          '0%': { opacity: '0', transform: 'translateY(-6px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-fade-out': {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-6px)' },
        },
      },
      animation: {
        'slide-fade': 'slide-fade-in 0.2s ease-out forwards',
        'slide-fade-reverse': 'slide-fade-out 0.15s ease-in forwards',
      },
    },
  },
  plugins: [],
};
