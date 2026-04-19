import { blue } from '@/theme/colors/blue';
import { sub } from '@/theme/colors/sub';
import { gray } from '@/theme/colors/gray';
import { animationStyles } from '@/theme/animation-styles';
import { zIndex } from '@/theme/tokens/z-index';
import { durations } from '@/theme/tokens/durations';
import { colors } from '@/theme/tokens/colors';
import { textStyles } from '@/theme/text-styles';
import { layerStyles } from '@/theme/layer-styles';
import { keyframes } from '@/theme/keyframes';
import { globalCss } from '@/theme/global-css';
import { conditions } from '@/theme/conditions';
import { defineConfig } from '@pandacss/dev';

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ['./src/**/*.{ts,tsx,js,jsx}'],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      animationStyles: animationStyles,
      keyframes: keyframes,
      layerStyles: layerStyles,
      textStyles: textStyles,

      tokens: {
        colors: colors,
        durations: durations,
        zIndex: zIndex,
      },

      semanticTokens: {
        colors: {
          bg: {
            value: { base: '#FCFCFD', _dark: '#081221' },
          },
          primary: {
            value: '#317AE4',
          },
          'primary-button-text': {
            value: '#FFFFFF',
          },

          fg: {
            default: {
              value: { base: '{colors.gray.900}', _dark: '{colors.gray.100}' },
            },
            muted: {
              value: { base: '{colors.gray.600}', _dark: '{colors.gray.400}' },
            },
            subtle: {
              value: '{colors.gray.500}',
            },
          },

          border: {
            value: { base: '{colors.gray.200}', _dark: '{colors.gray.700}' },
          },

          blue: blue,
          sub: sub,
          gray: gray,
        },

        radii: {
          l1: { value: '{radii.xs}' },
          l2: { value: '{radii.sm}' },
          l3: { value: '{radii.md}' },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: 'styled-system',

  // The jsx framework you are using
  jsxFramework: 'react',

  plugins: [
    {
      name: 'Remove Panda Preset Colors',
      hooks: {
        'preset:resolved': ({ utils, preset, name }) =>
          name === '@pandacss/preset-panda'
            ? utils.omit(preset, [
                'theme.tokens.colors',
                'theme.semanticTokens.colors',
              ])
            : preset,
      },
    },
  ],

  globalCss: globalCss,
  conditions: conditions,
});
