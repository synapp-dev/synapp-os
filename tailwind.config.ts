import type { Config } from "tailwindcss"

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      
      keyframes: {
        "collapsible-down": {
          from: { height: "0" },
          to: { height: "var(--radix-collapsible-content-height)" },
        },
        "collapsible-up": {
          from: { height: "var(--radix-collapsible-content-height)" },
          to: { height: "0" },
        },
        'gradient-animation': {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
            transform: 'rotate(0deg)',
          },
          '50%': {
            backgroundPosition: '100% 50%',
            transform: 'rotate(3deg)',
          },
        },
        "float-up": {
          "0%": {
            opacity: "1",
            transform: "translateY(0)",
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
        },
        'gavel-hit': {
          '0%, 100%': {
            transform: 'rotate(0deg)',
          },
          '50%': {
            transform: 'rotate(45deg)',
          },
        },
        'fade-in-out': {
          '0%, 100%': {
            opacity: '0',
          },
          '10%, 90%': {
            opacity: '1',
          },
        },
        gradient: {
          '0%, 100%': {
            backgroundPosition: '0% 50%',
          },
          '50%': {
            backgroundPosition: '100% 50%',
          },
        },
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'spin-slow': {
          '0%': {
            transform: 'rotate(0deg)',
          },
          '100%': {
            transform: 'rotate(360deg)',
          },
        },
        'caret-blink': {
          '0%,70%,100%': {
            opacity: '1',
          },
          '20%,50%': {
            opacity: '0',
          },
        },
        'slide-down-fade-in': {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        'slide-up-fade-in': {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        'slide-left-fade-in': {
          "0%": {
            opacity: "0",
            transform: "translateX(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        'slide-right-fade-in': {
          "0%": {
            opacity: "0",
            transform: "translateX(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateX(0)",
          },
        },
        'float-up-fade-out': {
          '0%': {
            opacity: '1',
            transform: 'translateY(0px)',
          },
          '100%': {
            opacity: '0',
            transform: 'translateY(-20px)',
          },
        },
      },
      animation: {
        "collapsible-down": "collapsible-down 0.2s ease-out",
        "collapsible-up": "collapsible-up 0.2s ease-out",
        'gradient-animation': 'gradient-animation 15s ease infinite',
        'gavel-hit': 'gavel-hit 0.75s ease-in-out infinite',
        'float-up-fade-out': 'float-up-fade-out 0.5s ease-out forwards',
        'float-up': 'float-up 0.5s ease-out forwards',
        'fade-in-out': 'fade-in-out 2s ease-in-out',
        gradient: 'gradient 15s ease infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'spin-slow': 'spin-slow 3s linear infinite',
        'caret-blink': 'caret-blink 1.25s ease-out infinite',
        'slide-down-fade-in': 'slide-down-fade-in 0.3s ease-out',
        'slide-up-fade-in': 'slide-up-fade-in 0.3s ease-out',
        'slide-left-fade-in': 'slide-left-fade-in 0.3s ease-out',
        'slide-right-fade-in': 'slide-right-fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config 