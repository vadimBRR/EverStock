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
        poppins_bold: ['LexendDeca-Bold', 'sans-serif'],
        poppins_light: ['LexendDeca-Light', 'sans-serif'],
        poppins_medium: ['LexendDeca-Medium', 'sans-serif'],
        poppins_regular: ['LexendDeca-Regular', 'sans-serif'],
        poppins_thin: ['LexendDeca-Thin', 'sans-serif'],
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
