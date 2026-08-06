import { css, cx } from 'styled-system/css';

interface DragIconProps {
  size?: number | string;
  color?: string;
  className?: string;
}

export const DragIcon = ({
  size = 14,
  color = 'gray.500',
  className,
}: DragIconProps) => {
  const iconClassName = cx(css({ color }), className);

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      viewBox='0 0 14 14'
      fill='none'
      className={iconClassName}
      aria-hidden
    >
      <circle
        cx='1'
        cy='1'
        r='1'
        transform='matrix(1 0 0 -1 4 12)'
        fill='currentColor'
      />
      <circle
        cx='1'
        cy='1'
        r='1'
        transform='matrix(1 0 0 -1 8 12)'
        fill='currentColor'
      />
      <circle
        cx='1'
        cy='1'
        r='1'
        transform='matrix(1 0 0 -1 4 8)'
        fill='currentColor'
      />
      <circle
        cx='1'
        cy='1'
        r='1'
        transform='matrix(1 0 0 -1 8 8)'
        fill='currentColor'
      />
      <circle
        cx='1'
        cy='1'
        r='1'
        transform='matrix(1 0 0 -1 4 4)'
        fill='currentColor'
      />
      <circle
        cx='1'
        cy='1'
        r='1'
        transform='matrix(1 0 0 -1 8 4)'
        fill='currentColor'
      />
    </svg>
  );
};
