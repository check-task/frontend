import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react';
import { cva, cx, css } from '../../styled-system/css';

// 공통 스타일 (Input, Textarea 둘 다 적용)
const baseStyles = {
  display: 'block',
  p: '0.75rem',
  borderRadius: '0.25rem',
  borderWidth: '0.125rem',
  borderColor: 'gray.400',
  color: 'gray.600',
  bg: 'bg',
  outline: 'none',

  _placeholder: {
    color: 'gray.400',
  },

  _focus: {
    borderColor: 'gray.600',
  },
};

// Input
const inputRecipe = cva({
  base: {
    ...baseStyles,
  },
  variants: {
    size: {
      basic: {
        textStyle: 'body2.r',
      },
      modal: {
        textStyle: 'body3.r',
      },
    },
  },
  defaultVariants: {
    size: 'basic',
  },
});

interface InputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  size?: 'basic' | 'modal';
  width?: string | number;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, width, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cx(
          inputRecipe({ size }),
          width !== undefined && css({ w: width }),
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

// Textarea
const textareaRecipe = cva({
  base: {
    ...baseStyles,
    p: '0.75rem',
    resize: 'none', // 리사이징 금지
  },
  variants: {
    size: {
      basic: {
        textStyle: 'body2.r',
      },
      modal: {
        textStyle: 'body3.r',
      },
    },
  },
  defaultVariants: {
    size: 'basic',
  },
});

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: 'basic' | 'modal';
  width?: string | number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, width, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cx(
          textareaRecipe({ size }),
          width !== undefined && css({ w: width }),
          className,
        )}
        {...props}
      />
    );
  },
);
Textarea.displayName = 'Textarea';
