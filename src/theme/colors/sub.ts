import { defineSemanticTokens } from '@pandacss/dev';

export const sub = defineSemanticTokens.colors({
  '01': {
    '100': { value: '#F55757' },
    '60': { value: 'rgba(245, 87, 87, 0.6)' },
    '40': { value: 'rgba(245, 87, 87, 0.4)' },
  },

  '02': {
    '100': { value: '#FFC93F' },
    '60': { value: 'rgba(255, 201, 63, 0.6)' },
    '40': { value: 'rgba(255, 201, 63, 0.4)' },
  },

  '03': {
    '100': { value: '#6EC77B' },
    '60': { value: 'rgba(110, 199, 123, 0.6)' },
    '40': { value: 'rgba(110, 199, 123, 0.4)' },
  },

  '04': {
    '100': { value: '#A177E2' },
    '60': { value: 'rgba(161, 119, 226, 0.6)' },
    '40': { value: 'rgba(161, 119, 226, 0.4)' },
  },

  '05': {
    '100': { value: { base: '#081221', _dark: '#B5BAC4' } },
    '60': {
      value: {
        base: 'rgba(8, 18, 33, 0.6)',
        _dark: 'rgba(181, 186, 196, 0.6)',
      },
    },
    '40': {
      value: {
        base: 'rgba(8, 18, 33, 0.4)',
        _dark: 'rgba(181, 186, 196, 0.4)',
      },
    },
  },

  null: {
    '100': { value: '#818892' },
    '60': { value: 'rgba(129, 136, 146, 0.6)' },
    '40': { value: 'rgba(129, 136, 146, 0.4)' },
  },
});
