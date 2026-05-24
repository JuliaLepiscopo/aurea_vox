/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        ink: 'var(--ink)',
        'ink-raised': 'var(--ink-raised)',
        gold: 'var(--gold)',
        'gold-soft': 'var(--gold-soft)',
        pearl: 'var(--pearl)',

        /* Aliases de compatibilidade — mesma paleta, nomes antigos */
        'nero-profundo': 'var(--ink)',
        'gunmetal': 'var(--ink-raised)',
        'antracite': 'var(--ink-raised)',
        'dourado': 'var(--gold)',
        'dourado-quente': 'var(--gold)',
        'bronze': 'var(--gold-soft)',
        'cobre': 'var(--gold-soft)',
        'ambar': 'var(--gold)',
        'borgonha': 'var(--ink-raised)',
        'rubi': 'var(--ink-raised)',
        'creme': 'var(--pearl)',
        'nogueira': 'var(--ink-raised)',
        'rochoso': 'var(--ink-raised)',
        'verde-tropical': 'var(--ink-raised)',
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Playfair Display', 'serif'],
        body: ['Manrope', 'Montserrat', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.18em',
        label: '0.24em',
      },
      borderRadius: {
        DEFAULT: '0',
        none: '0',
        sm: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
        full: '9999px',
      },
    },
  },
  plugins: [],
};
