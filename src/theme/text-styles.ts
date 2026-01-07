import { defineTextStyles } from '@pandacss/dev';

export const textStyles = defineTextStyles({
  // HEADING
  h1: {
    value: {
      fontSize: '2.5rem',
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '-0.015em',
    },
  },
  h2: {
    value: {
      fontSize: '2rem',
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '-0.015em',
    },
  },
  h3: {
    value: {
      fontSize: '1.75rem',
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '-0.015em',
    },
  },
  h4: {
    value: {
      fontSize: '1.5rem',
      fontWeight: '500',
      lineHeight: '1.5',
      letterSpacing: '-0.015em',
    },
  },

  // BODY
  body1: {
    m: {
      value: {
        fontSize: '1.25rem',
        fontWeight: '500',
        lineHeight: '1.5',
        letterSpacing: '-0.02em',
      },
    },
    r: {
      value: {
        fontSize: '1.25rem',
        fontWeight: '400',
        lineHeight: '1.5',
        letterSpacing: '-0.02em',
      },
    },
  },
  body2: {
    m: {
      value: {
        fontSize: '1.125rem',
        fontWeight: '500',
        lineHeight: '1.45',
        letterSpacing: '-0.02em',
      },
    },
    r: {
      value: {
        fontSize: '1.125rem',
        fontWeight: '400',
        lineHeight: '1.45',
        letterSpacing: '-0.02em',
      },
    },
  },
  body3: {
    m: {
      value: {
        fontSize: '1rem',
        fontWeight: '500',
        lineHeight: '1.4',
        letterSpacing: '-0.02em',
      },
    },
    r: {
      value: {
        fontSize: '1rem',
        fontWeight: '400',
        lineHeight: '1.4',
        letterSpacing: '-0.02em',
      },
    },
  },
  body4: {
    m: {
      value: {
        fontSize: '0.875rem',
        fontWeight: '500',
        lineHeight: '1.4',
        letterSpacing: '-0.02em',
      },
    },
    r: {
      value: {
        fontSize: '0.875rem',
        fontWeight: '400',
        lineHeight: '1.4',
        letterSpacing: '-0.02em',
      },
    },
  },

  // ETC
  btn: {
    value: {
      fontSize: '1.125rem',
      fontWeight: '600',
      lineHeight: '1.36',
      letterSpacing: '-0.01em',
    },
  },
  chip: {
    value: {
      fontSize: '0.875rem',
      fontWeight: '600',
      lineHeight: '1.4',
      letterSpacing: '-0.02em',
    },
  },
});
