import type { Config } from "tailwindcss";

export default {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                backgrounddarker: "var(--background-darker)",
                foreground: "var(--foreground)",
                accent: "var(--accent)",
            },
        },
    },
    plugins: [],
} satisfies Config;
