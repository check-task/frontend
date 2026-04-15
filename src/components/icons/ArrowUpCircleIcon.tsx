interface ArrowUpCircleIconProps {
  circleColor?: string;
  arrowColor?: string;
  size?: number;
}

export const ArrowUpCircleIcon = ({
  circleColor = '',
  arrowColor = '',
  size = 24,
}: ArrowUpCircleIconProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="12" fill={circleColor} />
    <path
      d="M12 7V17M7 12L12 7L17 12"
      stroke={arrowColor}
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
