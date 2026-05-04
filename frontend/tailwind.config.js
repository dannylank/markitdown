/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['"Bricolage Grotesque"', "sans-serif"],
                mono: ['"JetBrains Mono"', "monospace"],
            },
            animation: {
                "spin-slow": "spin 1s linear infinite",
            },
        },
    },
    plugins: [],
};
