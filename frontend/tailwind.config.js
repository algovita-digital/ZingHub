/** ZingHub brand tokens, taken from the logo: orange #FF5C1F, ink #12141A, white. */
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#FF5C1F', dark: '#E8480B', light: '#FF8052', soft: '#FFF1EB' },
        ink: { DEFAULT: '#12141A', 2: '#1B1E27', 3: '#2A2E3A' },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 20px 60px -15px rgba(255, 92, 31, 0.55)',
      },
      keyframes: {
        floaty: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        pop: { '0%': { opacity: 0, transform: 'scale(.95) translateY(10px)' }, '100%': { opacity: 1, transform: 'scale(1) translateY(0)' } },
      },
      animation: { floaty: 'floaty 5s ease-in-out infinite', pop: 'pop .25s ease-out' },
    },
  },
  plugins: [],
};
