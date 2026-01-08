import { InputHTMLAttributes, forwardRef } from 'react';
import { css, cva, cx } from '../../styled-system/css';
import { CheckMark } from './icons/CheckMark';

const checkboxControl = cva({
  base: {
    w: '1.375rem',
    h: '1.375rem',
    borderRadius: '0.125rem',
    borderWidth: '0.0725rem',
    bg: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s', // 테두리 색상 변경 시 부드럽게

    // 아이콘의 기본 상태 정의
    '& svg': {
      opacity: 0,
      transform: 'scale(0.5)',
      transition: 'all 0.1s ease-in-out', // 나타나는 모션
    },

    //  체크되었을 때 스타일
    _peerChecked: {
      '& svg': {
        opacity: 1,
        transform: 'scale(1)',
      },
    },
  },

  // 체크박스 색상 변경
  variants: {
    variant: {
      gray: { borderColor: 'gray.600' },
      black: { borderColor: 'gray.900' },
    },
  },

  // 기본 색상
  defaultVariants: {
    variant: 'black',
  },
});

interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  variant?: 'gray' | 'black';
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ variant, ...props }, ref) => {
    return (
      <label>
        <input
          type='checkbox'
          className={cx('peer', hiddenInputStyle)}
          ref={ref}
          {...props}
        />

        {/* 체크마크 UI */}
        <div className={checkboxControl({ variant })}>
          <CheckMark variant={variant} />
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
