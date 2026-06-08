import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#17201b",
        moss: "#0f6a4f",
        leaf: "#1fa475",
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
