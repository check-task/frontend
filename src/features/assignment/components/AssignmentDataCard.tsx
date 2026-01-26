import { css } from 'styled-system/css';

interface AssignmentDataCardProps {
  name: string;
  path: string;
}

// 자료 모음집 카드 컴포넌트
export const AssignmentDataCard = ({ name, path }: AssignmentDataCardProps) => {
  return (
    <div className={cardStyle}>
      <p className={cardTitleStyle}>{name}</p>
      <p className={cardContentStyle}>{path}</p>
    </div>
  );
};

// ======== 스타일 정의 ========
const cardStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  p: '1.25rem 1rem', //상하 좌우
  bg: 'blue.50',
  borderRadius: '0.5rem',
  width: '100%', // 제목+버튼 w 길이에 맞출거임
  shadow: '0 1px 4px 0 rgba(0, 0, 0, 0.16)',
});

// 파일명
const cardTitleStyle = css({
  textStyle: 'body2.r',
  color: 'gray.900',
});

// 파일 URL
const cardContentStyle = css({
  textStyle: 'body3.r',
  color: 'gray.600',
  textDecoration: 'underline',
  wordBreak: 'break-all', // 긴 링크나 파일명 방어
});
