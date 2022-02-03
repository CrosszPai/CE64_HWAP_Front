module.exports = {
  content: ["./app/**/*.{ts,tsx,js,jsx}"],
  mode: 'jit',
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('daisyui')
  ],
}
