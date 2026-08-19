import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Semantic color tokens from DESIGN.md (OKLCH → hex mapping)
        background: '#0f0f1a',
        surface: '#1a1a2e',
        elevated: '#24243e',
        text: '#f0f0f5',
        muted: '#8a8a9e',
        subtle: '#5a5a6e',
        border: '#303046',
        accent: '#14c8a8',
        success: '#22c55e',
        warning: '#eab308',
        danger: '#ef4444',
        info: '#3b82f6',
        // Social brand colors (hover states)
        facebook: '#1877F2',
        instagram: '#E4405F',
        whatsapp: '#25D366',
        github: '#FFFFFF',
      },
      fontFamily: {
        display: ['Syne', 'SF Pro Display', 'system-ui', 'sans-serif'],
        body: ['DM Sans', 'SF Pro Text', 'system-ui', 'sans-serif'],
        utility: ['JetBrains Mono', 'ui-monospace', 'SF Mono', 'Monaco', 'monospace'],
      },
      fontSize: {
        // Editorial scale with line heights
        'display-2xl': ['clamp(72px, 8vw, 96px)', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-xl': ['clamp(56px, 6vw, 72px)', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['clamp(48px, 5vw, 56px)', { lineHeight: '1.2', letterSpacing: '-0.015em', fontWeight: '600' }],
        'display-md': ['clamp(36px, 4vw, 42px)', { lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-sm': ['clamp(28px, 3vw, 32px)', { lineHeight: '1.3', fontWeight: '600' }],
        'heading-lg': ['clamp(24px, 2.5vw, 28px)', { lineHeight: '1.35', fontWeight: '600' }],
        'heading-md': ['clamp(20px, 2vw, 22px)', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-sm': ['clamp(18px, 1.5vw, 19px)', { lineHeight: '1.45', fontWeight: '600' }],
        'body-lg': ['clamp(18px, 1.2vw, 19px)', { lineHeight: '1.6', fontWeight: '400' }],
        'body': ['clamp(16px, 1vw, 17px)', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['clamp(14px, 0.9vw, 15px)', { lineHeight: '1.55', fontWeight: '400' }],
        'caption': ['clamp(12px, 0.8vw, 13px)', { lineHeight: '1.5', fontWeight: '400' }],
        'utility': ['clamp(14px, 0.9vw, 15px)', { lineHeight: '1.5', fontWeight: '500', fontVariantNumeric: 'tabular-nums' }],
      },
      spacing: {
        // 4px base rhythm from DESIGN.md
        '0': '0',
        '1': '2px',
        '2': '4px',
        '3': '8px',
        '4': '12px',
        '5': '16px',
        '6': '20px',
        '7': '24px',
        '8': '32px',
        '9': '40px',
        '10': '48px',
        '11': '64px',
        '12': '80px',
        '13': '96px',
        '14': '128px',
      },
      borderRadius: {
        none: '0',
        sm: '4px',
        md: '8px',
        lg: '12px',
        xl: '16px',
        '2xl': '24px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0 1px 2px 0 oklch(0 0 0 / 0.3)',
        DEFAULT: '0 4px 8px -2px oklch(0 0 0 / 0.4)',
        md: '0 12px 24px -4px oklch(0 0 0 / 0.45)',
        lg: '0 20px 40px -8px oklch(0 0 0 / 0.5)',
        xl: '0 32px 64px -12px oklch(0 0 0 / 0.55)',
      },
      zIndex: {
        base: '0',
        dropdown: '20',
        sticky: '30',
        fixed: '40',
        modalBackdrop: '45',
        modal: '50',
        popover: '60',
        tooltip: '60',
        toast: '70',
        skipLink: '80',
      },
      transitionDuration: {
        fast: '120ms',
        base: '300ms',
        emphasis: '500ms',
      },
      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'enter': 'enter 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'exit': 'exit 300ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down': 'slideDown 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 120ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up-sheet': 'slideUpSheet 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-down-sheet': 'slideDownSheet 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-out': 'fadeOut 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'count-up': 'countUp 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'spin': 'spin 1s linear infinite',
        'scale-in': 'scaleIn 200ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-out': 'scaleOut 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      keyframes: {
        enter: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        exit: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-8px)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-8px)' },
        },
        slideUpSheet: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDownSheet: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        countUp: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        scaleOut: {
          '0%': { opacity: '1', transform: 'scale(1)' },
          '100%': { opacity: '0', transform: 'scale(0.95)' },
        },
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [],
}

export default config