/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}", // Include all JS, JSX, TS, and TSX files in the app folder
    "./src/components/**/*.{js,jsx,ts,tsx}", // Include all JS, JSX, TS, and TSX files in the components folder]
    // "./src./app/(tabs)/meditate.tsx",
  ],
  theme: {
    extend: {
      fontFamily: {
        lexend_regular: ['LexendDeca-Regular', 'sans-serif'],
        lexend_semibold: ['LexendDeca-SemiBold', 'sans-serif'],
        lexend_light: ['LexendDeca-Light', 'sans-serif'],
        lexend_extralight: ['LexendDeca-ExtraLight', 'sans-serif'],
        rmono: ["Roboto-Mono", "sans-serif"],
      },
      colors: {
        'main_light': '#6495ED',
        // 'black_light': '#6E6A7C',
        'gray': '#B6B6B6',
        'dark_gray': '#858585'
      }
    },
  },
  plugins: [],
}
