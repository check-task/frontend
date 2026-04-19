'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { css, cva, cx } from '../../../../../styled-system/css';
import { CheckMark } from '@/components/icons/CheckMark';

const checkboxControl = cva({
  base: {
    w: '1.375rem',
    h: '1.375rem',
    borderRadius: '0.125rem',
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
});

type SelectTeamProjectCheckboxProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
>;

export const SelectTeamProjectCheckbox = forwardRef<
  HTMLInputElement,
  SelectTeamProjectCheckboxProps
>((props, ref) => {
  return (
    <label>
      <input
        type='checkbox'
        className={cx('peer', hiddenInputStyle)}
        ref={ref}
        {...props}
      />
      <div className={checkboxControl()}>
        <CheckMark
          className={css({ w: '0.83331rem', h: '0.83331rem' })}
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
