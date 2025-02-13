/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    tailwindcss: {},
  },
  safelist: [
    {
      pattern:
        /^text-(5xl|2xl|3xl|lg|sm|gray-200|gray-300|gray-600|pink-300|pink-400)$/,
    },
    { pattern: /^font-(serif|semibold|medium)$/ },
    { pattern: /^(italic|text-center|mt-2|w-full|object-cover|rounded-lg)$/ },
    { pattern: /^(grid|grid-cols-1|grid-cols-2|grid-rows-2|gap-4)$/ },
    { pattern: /^(shadow-lg|shadow-xl)$/ },
  ],
};

export default config;
