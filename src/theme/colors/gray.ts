import { defineSemanticTokens } from '@pandacss/dev';

export const gray = defineSemanticTokens.colors({
  '0': { value: { base: '#FFFFFF', _dark: '#1F2935' } },
  '100': { value: { base: '#EEEFF1', _dark: '#212327' } },
  '200': { value: { base: '#D3D6D9', _dark: '#383C42' } },
  '300': { value: { base: '#B7BCC2', _dark: '#50555E' } },
  '400': { value: { base: '#9CA2AB', _dark: '#808893' } },
  '500': { value: { base: '#808893', _dark: '#9CA2AB' } },
  '600': { value: { base: '#50555E', _dark: '#B7BCC2' } },
  '700': { value: { base: '#383C42', _dark: '#D3D6D9' } },
  '800': { value: { base: '#212327', _dark: '#EEEFF1' } },
  '900': { value: { base: '#090A0B', _dark: '#FFFFFF' } },
});
