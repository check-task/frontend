import { css } from 'styled-system/css';

interface CompletionProgressBarProps {
  progress: number; // 0-100 사이 값
}

export const CompletionProgressBar = ({
  progress,
}: CompletionProgressBarProps) => {
  // 0-100 사이로 제한
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <div className={containerStyle}>
      <div
        className={indicatorStyle}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};

const containerStyle = css({
  width: '100%',
  height: '0.5rem',
  bg: 'gray.100',
  borderRadius: '6.25rem',
  overflow: 'hidden',
});

const indicatorStyle = css({
  height: '100%',
  bg: 'blue.300',
  borderRadius: '6.25rem',
  transition: 'width 0.3s ease-out',
});
