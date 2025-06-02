/** @type {import('tailwindcss').Config} */

const withMT = require('@material-tailwind/react/utils/withMT');

module.exports = withMT({
  mode: 'jit',
  content: ['./src/**/*.{js,jsx,ts,tsx}', './node_modules/flowbite/**/*.js'],
  theme: {
    extend: {
      screens: {
        custom: '1201px',
      },
    },
  },
  plugins: [
    require('flowbite/plugin')({
      charts: true,
    }),
  ],
});
