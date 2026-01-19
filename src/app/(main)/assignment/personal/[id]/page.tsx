import { css } from 'styled-system/css';
import { PersonalLeftContainer } from '@/features/assignment/personal/components/PersonalLeftContainer';
import { PersonalRightContainer } from '@/features/assignment/personal/components/PersonalRightContainer';

export default function PersonalPage() {
  return (
    <div className={containerStyle}>
      <div className={contentGridStyle}>
        <PersonalLeftContainer />
        <PersonalRightContainer />
      </div>
    </div>
  );
}

// ======== 스타일 정의 ========
const containerStyle = css({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
  py: '3.38rem',
});

// 왼쪽과 오른쪽을 가로로 배치
const contentGridStyle = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  width: 'fit-content', // 각 컨테이너에서 길이 처리할 예정
});
