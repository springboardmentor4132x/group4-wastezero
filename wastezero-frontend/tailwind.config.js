// module.exports = {
//   darkMode: 'class',
//   content: [
//     "./src/**/*.{html,ts}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }





/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'gray-950': '#0a0f0a',
        'green-950': '#071a07',
      }
    },
  },
  plugins: [],
}