import { InputHTMLAttributes, forwardRef } from 'react';
import { css, cva, cx } from '../../styled-system/css';
import { CheckMark } from './icons/CheckMark';

const checkboxControl = cva({
  base: {
    w: '1.375rem',
    h: '1.375rem',
    borderRadius: '0.125rem',
    borderWidth: '0.0725rem',
    bg: 'transparent',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',

    // 아이콘의 기본 상태 정의
    '& svg': {
      opacity: 0,
      transform: 'scale(0.5)',
      transition: 'opacity 0.2s ease-in-out, transform 0.2s ease-in-out', // 체크 시에만 애니메이션
    },

    _peerChecked: {
      '& svg': {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
  },

  variants: {
    variant: {
      gray: { borderColor: 'gray.600' },
      black: { borderColor: 'gray.900' },
    },
    checkedVariant: {
      gray400: {
        _peerChecked: {
          borderColor: 'gray.400',
          '& svg path': {
            stroke: 'gray.400',
          },
        },
      },
      black: {
        _peerChecked: {
          borderColor: 'gray.900',
          '& svg path': {
            stroke: 'gray.900',
          },
        },
      },
    },
  },

  defaultVariants: {
    variant: 'black',
    checkedVariant: 'gray400',
  },
});

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  variant?: 'gray' | 'black';
  checkedVariant?: 'gray400' | 'black';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ variant, checkedVariant, ...props }, ref) => {
    return (
      <label>
        <input
          type='checkbox'
          className={cx('peer', hiddenInputStyle)}
          ref={ref}
          {...props}
        />

        {/* 체크마크 UI */}
        <div className={checkboxControl({ variant, checkedVariant })}>
          <CheckMark
            className={css({ w: '0.83331rem', h: '0.83331rem' })}
            variant={variant}
          />
        </div>
      </label>
    );
  },
);

Checkbox.displayName = 'Checkbox';

// --- 스타일 정의 ---

// 접근성을 위한 숨김 처리
const hiddenInputStyle = css({
  srOnly: true,
});
