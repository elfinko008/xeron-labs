import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#0a0a14',
          secondary: '#12121f',
          tertiary: '#1a1a2e',
        },
        accent: {
          red: '#e94560',
          cyan: '#00d4ff',
        },
        text: {
          primary: '#ffffff',
          secondary: '#a0a0b8',
          muted: '#606078',
        },
        border: '#2a2a3e',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

export default config
