/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {
      // Explicitly set color function to rgb to avoid oklch/oklab issues with html2canvas
      colorFunction: 'rgb',
    },
    autoprefixer: {},
  },
};

export default config;
