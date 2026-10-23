/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#090d16",
        card: "#111827",
        border: "#1f2937",
        primary: "#3b82f6",
        secondary: "#10b981",
        accent: "#f59e0b",
        danger: "#ef4444",
      },
    },
  },
  plugins: [],
};
