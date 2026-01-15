import { cva, cx } from 'styled-system/css';

const button = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease-out',
    textStyle: 'btn',
    _disabled: {
      bg: 'gray.200',
      color: 'gray.400',
      cursor: 'not-allowed',
      border: 'none',
    },
  },
  variants: {
    variant: {
      fillBlue: {
        bg: 'primary',
        color: 'primary-button-text',
        _hover: { bg: '#1D6BDD' },
      },
      fillGray: {
        bg: 'gray.100',
        color: 'gray.600',
        _hover: { bg: '#E0E2E6' },
      },
      strokeBlue: {
        bg: 'transparent',
        border: '0.0625rem solid',
        borderColor: 'blue.500',
        color: 'blue.500',
        _hover: { bg: 'blue.50' },
      },
    },
    size: {
      xlarge: {
        height: '3.375rem',
        width: '24.125rem',
        padding: '0.9375rem 0px',
      },
      large: { height: '3rem', width: '20.75rem', padding: '0.75rem 0px' },
      medium: {
        height: '3.375rem',
        width: '17.8125rem',
        padding: '0.9375rem 0px',
      },
      small: { height: '3rem', width: '11.5rem', padding: '0.75rem 0px' },
      tiny: { height: '3rem', width: '6rem', padding: '0.75rem 0px' },
    },
  },
  // 기본값 (이게 제일 많이 보여서 ..)
  defaultVariants: {
    variant: 'fillBlue',
    size: 'xlarge',
  },
});

// Figma 디자인 위계에 있는 것만 허용
type FillButtonProps = {
  variant?: 'fillBlue' | 'fillGray';
  size?: 'xlarge' | 'large' | 'medium' | 'small' | 'tiny';
};

type StrokeButtonProps = {
  variant?: 'strokeBlue';
  size?: 'small' | 'tiny';
};

type ButtonVariants = FillButtonProps | StrokeButtonProps;

// HTML 버튼 태그의 속성을 사용하기 위해 (예 : onClick)
interface ButtonBaseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

type ButtonProps = ButtonBaseProps & ButtonVariants;

export const Button = ({
  variant,
  size,
  children,
  className,
  // HTML 버튼 태그의 속성을 props로 전달 (예 : onClick)
  ...props
}: ButtonProps) => {
  return (
    <button className={cx(button({ variant, size }), className)} {...props}>
      {children}
    </button>
  );
};
