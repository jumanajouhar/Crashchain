/** @type {import('tailwindcss').Config} */
export default {
  env: {
    "node": true
  },
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    "./index.html",
    "./src/*.{js,ts,jsx,tsx}",
    "./src/components/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
}

