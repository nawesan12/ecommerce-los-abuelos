import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Por si acaso hay componentes en la raíz
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0B1D4C",   
          secondary: "#F32947", 
        },
      },
      fontFamily: {
        sans: ["Inter", "Arial", "Helvetica", "sans-serif"],
      },
    },
  },
  plugins: [],
}

export default config