import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Cores semânticas
        primary: 'rgb(var(--primary) / <alpha-value>)',
        'primary-light': 'rgb(var(--primary-light) / <alpha-value>)',
        secondary: 'rgb(var(--secondary) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',
        info: 'rgb(var(--info) / <alpha-value>)',
        
        // Cores de texto
        foreground: 'rgb(var(--text-primary) / <alpha-value>)',
        'muted-foreground': 'rgb(var(--text-muted) / <alpha-value>)',
        
        // Cores de fundo
        background: {
          DEFAULT: 'rgb(var(--background-start-rgb) / <alpha-value>)',
          end: 'rgb(var(--background-end-rgb) / <alpha-value>)',
        },
        
        // Cores de cartão
        card: {
          DEFAULT: 'rgb(var(--card-bg) / <alpha-value>)',
          border: 'rgb(var(--card-border) / <alpha-value>)',
        },
        
        // Cores de estado
        state: {
          hover: 'rgb(var(--state-hover) / <alpha-value>)',
          active: 'rgb(var(--state-active) / <alpha-value>)',
          focus: 'rgb(var(--state-focus) / <alpha-value>)',
          disabled: 'rgb(var(--state-disabled) / <alpha-value>)',
        },
        
        // Cores de borda
        border: {
          DEFAULT: 'rgb(var(--border-primary) / <alpha-value>)',
          secondary: 'rgb(var(--border-secondary) / <alpha-value>)',
          muted: 'rgb(var(--border-muted) / <alpha-value>)',
        },

        // Cores específicas do tema musical
        'music-blue': {
          50: '#E6F6FF',
          100: '#BAE3FF',
          200: '#7CC4FA',
          300: '#47A3F3',
          400: '#2186EB',
          500: '#0967D2',
          600: '#0552B5',
          700: '#03449E',
          800: '#01337D',
          900: '#002159',
        },
        'stage-purple': {
          50: '#F6F0FF',
          100: '#E3D4FF',
          200: '#C3A9FA',
          300: '#A37DF3',
          400: '#8B5CF6',
          500: '#7C3AED',
          600: '#6D28D9',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#2E1065',
        },
        'sound-pink': {
          50: '#FDF2F8',
          100: '#FCE7F3',
          200: '#FBCFE8',
          300: '#F9A8D4',
          400: '#F472B6',
          500: '#EC4899',
          600: '#DB2777',
          700: '#BE185D',
          800: '#9D174D',
          900: '#831843',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-shine': 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 25%, rgba(255,255,255,0.1) 50%, transparent 50%, transparent 75%, rgba(255,255,255,0.1) 75%, rgba(255,255,255,0.1))',
      },
      animation: {
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 3s infinite',
      },
      keyframes: {
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.purple.400), 0 0 20px theme(colors.purple.600)',
        'neon-strong': '0 0 5px theme(colors.purple.400), 0 0 20px theme(colors.purple.600), 0 0 60px theme(colors.purple.800)',
        'inner-white': 'inset 0 2px 4px 0 rgba(255, 255, 255, 0.06)',
      },
    },
  },
  plugins: [],
}

export default config 