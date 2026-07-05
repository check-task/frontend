'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { css, cva, cx } from '../../../../../styled-system/css';
import { CheckMark } from '@/components/icons/CheckMark';

const checkboxControl = cva({
  base: {
    borderWidth: '0.0725rem',
    borderColor: 'gray.600',
    bg: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',

    '& svg': {
      opacity: 0,
      transform: 'scale(0.5)',
      transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out',
    },

    _peerChecked: {
      borderColor: 'gray.600',
      '& svg': {
        opacity: 1,
        transform: 'scale(1)',
      },
      '& svg path': {
        stroke: 'gray.600',
      },
    },
  },
  variants: {
    size: {
      default: {
        w: '1.375rem',
        h: '1.375rem',
        borderRadius: '0.125rem',
      },
      compact: {
        w: '1rem',
        h: '1rem',
        borderRadius: '0.0625rem',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

const labelWrap = cva({
  base: {},
  variants: {
    size: {
      default: {},
      compact: {
        w: '1.5rem',
        h: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type SelectTeamProjectCheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> & {
  size?: 'default' | 'compact';
};

export const SelectTeamProjectCheckbox = forwardRef<
  HTMLInputElement,
  SelectTeamProjectCheckboxProps
>(({ size = 'default', ...props }, ref) => {
  return (
    <label className={labelWrap({ size })}>
      <input
        type='checkbox'
        className={cx('peer', hiddenInputStyle)}
        ref={ref}
        {...props}
      />
      <div className={checkboxControl({ size })}>
        <CheckMark
          className={css(
            size === 'compact'
              ? { w: '0.625rem', h: '0.625rem' }
              : { w: '0.83331rem', h: '0.83331rem' },
          )}
          variant='black'
        />
      </div>
    </label>
  );
});

SelectTeamProjectCheckbox.displayName = 'SelectTeamProjectCheckbox';

const hiddenInputStyle = css({
  srOnly: true,
});
