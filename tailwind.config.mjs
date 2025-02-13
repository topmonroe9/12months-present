/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/content/gifts/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-400px)" },
          "100%": { transform: "translateY(-800px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "scale(0.9)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
    },
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
  plugins: [],
};
