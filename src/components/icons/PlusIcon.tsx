interface PlusIconProps {
  className?: string;
}

export const PlusIcon = ({ className }: PlusIconProps) => {
  return (
    <svg
      className={className}
      xmlns='http://www.w3.org/2000/svg'
      width='20'
      height='20'
      viewBox='0 0 20 20'
      fill='none'
    >
      <path
        d='M3.3335 10H16.6668'
        stroke='currentColor'
        strokeWidth='0.833333'
        strokeLinecap='round'
      />
      <path
        d='M10 3.33334V16.6667'
        stroke='currentColor'
        strokeWidth='0.833333'
        strokeLinecap='round'
      />
    </svg>
  );
};
