import { Checkbox } from '@/components/Checkbox';
import { css } from 'styled-system/css';
import { ClockToggle } from '../../components/ClockToggle';
import DatePicker from '@/components/DatePicker';

// Task 목록
export const PersonalTaskList = () => {
  return (
    <div className={teamTaskListContainerStyle}>
      <div className={teamTaskListStyle}>
        {dummyPersonalTasks.map((task) => (
          <div key={task.id} className={teamTaskItemContainerStyle}>
            {/* 왼쪽: 체크박스 + 제목 */}
            <div className={teamTaskItemLeftStyle}>
              <Checkbox />
              <p className={taskTextStyle}>{task.title}</p>
            </div>

            {/* 오른쪽: 달력 + 시계토글 */}
            <div className={teamTaskItemRightStyle}>
              <div className={rightContentWrapperStyle}>
                <DatePicker />
                {/* 시계 아이콘은 꺼짐으로 시작됨  */}
                <ClockToggle />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ======== 스타일 정의 ========
const teamTaskListContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  w: '100%',
  p: '1.5rem',
  borderRadius: '0.75rem',
  bg: 'bg',
  shadow: '0 1px 4px 0 rgba(0, 0, 0, 0.16)',
});

const teamTaskListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem', // 각 리스트 사이 간격
});

// 각 리스트를 왼쪽 오른쪽으로 구분할겨
const teamTaskItemContainerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

// 각 리스트에서 왼쪽 (체크박스+task내용)
const teamTaskItemLeftStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem', // 체크박스랑 task 제목 간격
  flex: 1, // 오른쪽 영역에 마진을 줄거라서 남은 부분 차지
});

const taskTextStyle = css({
  textStyle: 'body1.m',
  color: 'gray.900',
  whiteSpace: 'pre-wrap', // 공백과 줄바꿈 유지
  wordBreak: 'break-word', // 상자 크기 넘어가면 자동으로 줄 바꿈
});

// 각 리스트에서 오른쪽 영역
const teamTaskItemRightStyle = css({
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
  ml: '9rem', // 제목이 긴 경우를 고려해 넣었지만 몇으로 할지 정해야할 듯 합니다.
});

// 달력 왼쪽 시계 오른쪽으로 가도록
const rightContentWrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2.25rem',
  width: '12rem', // 직접 계산
});

// ======== 더미 데이터 ========
const dummyPersonalTasks = [
  { id: 1, title: '프로젝트 세팅' },
  { id: 2, title: '주제 정하기' },
  {
    id: 3,
    title: '프론트엔드 개발 \n프론트엔드 개발 프론트엔드 개발',
  },
  {
    id: 4,
    title:
      '프론트엔드개발프론트엔드개발프론트엔드개발프론트엔드개발프론트엔드개',
  },
];
