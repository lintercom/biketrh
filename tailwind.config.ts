import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17201b",
        moss: "#E6AF00",
        leaf: "#E6AF00",
        clay: "#b75f32",
        fog: "#f5f7f2",
        line: "#dfe7df"
      },
      boxShadow: {
        soft: "0 16px 36px rgba(23, 32, 27, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
