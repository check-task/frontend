import { useEffect, useRef, useState } from 'react';
import { Checkbox } from '@/components/Checkbox';
import { css, cva } from 'styled-system/css';
import { ClockToggle } from '../../components/ClockToggle';
import DatePicker from '@/components/DatePicker';
import { dummyPersonalTasks } from '@/constants/PersonalTaskMock';

// Task 목록
export const PersonalTaskList = () => {
  return (
    <div className={PersonalTaskListContainerStyle}>
      <div className={PersonalTaskListStyle}>
        {dummyPersonalTasks.map((task) => {
          const isLongTitle = task.title.length >= 23;

          return (
            <div key={task.id} className={PersonalTaskItemContainerStyle}>
              {/* 왼쪽: 체크박스 + 제목 */}
              <div
                className={PersonalTaskItemLeftStyle({
                  align: isLongTitle ? 'top' : 'center',
                })}
              >
                <div
                  className={checkboxWrapperStyle({
                    align: isLongTitle ? 'top' : 'center',
                  })}
                >
                  <Checkbox />
                </div>
                <p className={taskTextStyle}>{task.title}</p>
              </div>

              {/* 오른쪽: 달력 + 시계토글 */}
              <div
                className={teamTaskItemRightStyle({
                  align: isLongTitle ? 'top' : 'center',
                })}
              >
                <div className={rightContentWrapperStyle}>
                  <DatePicker />
                  {/* 시계 아이콘은 꺼짐으로 시작됨  */}
                  <ClockToggle />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ======== 스타일 정의 ========
// 리스트 전체를 감싸는 container
const PersonalTaskListContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  w: '100%',
  p: '1.5rem',
  borderRadius: '0.75rem',
  bg: 'bg',
  shadow: '0 1px 4px 0 rgba(0, 0, 0, 0.16)',
});

// 각 리스트 사이 간격을 위해 한번 더 감쌈
const PersonalTaskListStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem', // 각 리스트 사이 간격
});

// 각 리스트를 왼쪽 오른쪽으로 구분
const PersonalTaskItemContainerStyle = css({
  display: 'flex',
  // alignItems: 'center',
  justifyContent: 'space-between',
});

// 각 리스트에서 왼쪽 (체크박스+ 과제명)
const PersonalTaskItemLeftStyle = cva({
  base: {
    display: 'flex',
    gap: '0.75rem', // 체크박스랑 task 제목 간격
    flex: 1, // 오른쪽 영역에 마진을 줄거라서 남은 부분 차지
    maxWidth: '27rem', // 줄 바꿈이 되기 직전 너비를 주면 됩니다
  },

  variants: {
    align: {
      center: {
        alignItems: 'center',
      },
      top: {
        alignItems: 'flex-start',
      },
    },
  },

  defaultVariants: {
    align: 'center',
  },
});

const taskTextStyle = css({
  textStyle: 'body1.m',
  color: 'gray.900',
  wordBreak: 'break-word', // 상자 크기 넘어가면 자동으로 줄 바꿈
});

// 체크 박스
const checkboxWrapperStyle = cva({
  base: {
    display: 'flex',
  },

  variants: {
    align: {
      center: {
        marginTop: '-0.1rem',
      },
      top: {
        marginTop: '0.35rem',
      },
    },
  },

  defaultVariants: {
    align: 'center',
  },
});

// 각 리스트에서 오른쪽 영역
const teamTaskItemRightStyle = cva({
  base: {
    display: 'flex',
    ml: '0.75rem',
  },

  variants: {
    align: {
      center: {
        alignItems: 'center',
      },
      top: {
        alignItems: 'flex-start',
      },
    },
  },

  defaultVariants: {
    align: 'center',
  },
});

// 달력 왼쪽 시계 오른쪽으로 가도록
const rightContentWrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '2.25rem',
  width: '12rem', // 직접 계산
});
