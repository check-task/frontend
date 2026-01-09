import { css, cx } from 'styled-system/css';
import { PlusIcon } from './icons/PlusIcon';
import { center } from 'styled-system/patterns';

const plusButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  paddingLeft: '0.5rem',
  paddingRight: '1rem',
  paddingY: '0.5rem',
  borderRadius: '2.5rem',
  border: '0.0625rem solid',
  borderColor: 'blue.200',
  bg: 'transparent',
  cursor: 'pointer',
  transition: 'all 0.3s ease-out',
  color: 'blue.300',
  _hover: {
    bg: 'blue.50',
    color: 'blue.500',
  },
});

const iconStyle = center({
  width: '1.25rem',
  height: '1.25rem',
});

interface PlusButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PlusButton = ({
  children,
  className,
  // 여기선 onClick으로 모달 열리게 하면 될 것 같음
  ...props
}: PlusButtonProps) => {
  return (
    <button className={cx(plusButtonStyle, className)} {...props}>
      <PlusIcon className={iconStyle} />
      <span className={css({ textStyle: 'body3.m' })}>{children}</span>
    </button>
  );
};
