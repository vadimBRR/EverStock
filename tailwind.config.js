/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,jsx,ts,tsx}", 
    "./src/components/**/*.{js,jsx,ts,tsx}", 
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
        'main_light': '#D93621',
        // 'black_light': '#6E6A7C',
        'gray': '#B6B6B6',
        'dark_gray': '#5B5B5B',
        'black-800': '#242121',
        'black-700': '#323232',
        'black-600': '#2A2A2A',
        'black-400': '#24252C',
        'bg': '#1C1A1A',

      }
    },
  },
  plugins: [],
}
