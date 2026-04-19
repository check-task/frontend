import { defineSemanticTokens } from '@pandacss/dev';

export const blue = defineSemanticTokens.colors({
  '50': { value: { base: '#F3F6FC', _dark: '#293747' } },
  '100': { value: { base: '#E2ECFB', _dark: '#325279' } },
  '200': { value: { base: '#B7D0F6', _dark: '#317AE4' } },
  '300': { value: '#74A4ED' },
  '500': { value: { base: '#317AE4', _dark: '#B7D0F6' } },
  '600': { value: { base: '#325279', _dark: '#E2ECFB' } },
  '700': { value: { base: '#293747', _dark: '#F3F6FC' } },
});
