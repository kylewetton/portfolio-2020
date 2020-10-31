module.exports = {
  purge: ['**/*.html'],
  theme: {
    extend: {
      colors: {
        charcoal: {
          900: '#1C1E22',
        },
        gold: '#B6AA68',
      },
      height: {
        120: '120%',
      },
      width: {
        sidebar: '100px',
        double: '200%',
      },
      margin: {
        '1px': '1px'
      },
      letterSpacing: {
        'extra-wide': '0.33em',
      },
      screens: {
        '2xl' : '1600px',
      },
      inset: {
        '1rem' : '1rem'
      }
    },
  },
  variants: {},
  plugins: [],
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  experimental: {
    applyComplexClasses: true
  }
};

/**
 * Blue       #4299E1
 * Gold       #B6AA68
 * Charcoal   #1C1E22
 */
