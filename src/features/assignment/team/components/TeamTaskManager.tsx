import { css } from 'styled-system/css';

interface TeamTaskManagerProps {
  manager?: string;
}

export const TeamTaskManager = ({ manager }: TeamTaskManagerProps) => {
  const hasManager = !!manager && manager !== 'none';
  const isEmpty = !manager || manager === 'none';

  return (
    <div
      className={
        isEmpty ? teamTaskManagerEmptyContainerStyle : teamTaskManagerStyle
      }
    >
      <p
        className={
          isEmpty ? teamTaskManagerIconEmptyStyle : teamTaskManagerIconStyle
        }
      />
      <p className={css({ textStyle: 'body2.r', color: 'gray.800' })}>
        {hasManager ? manager : 'none'}
      </p>
    </div>
  );
};

const teamTaskManagerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  height: '2.625rem',
  bg: 'blue.50',
  borderRadius: '2.5rem',
  px: '0.75rem',
});

const teamTaskManagerEmptyContainerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  height: '2.625rem',
  bg: 'gray.100',
  borderRadius: '2.5rem',
  px: '0.75rem',
});

const teamTaskManagerIconStyle = css({
  width: '1.375rem',
  height: '1.375rem',
  borderRadius: 'full',
  bg: 'blue.200',
});

const teamTaskManagerIconEmptyStyle = css({
  width: '1.375rem',
  height: '1.375rem',
  borderRadius: 'full',
  bg: 'gray.200',
});
