'use client';

import { css } from 'styled-system/css';
import { PersonalEtc } from './PersonalEtc';

export interface ReferenceItem {
  id: number;
  type: 0 | 1; // 0은 url, 1은 파일로 지정
  name: string;
  path: string;
}

interface PersonalRightContainerProps {
  taskId: number;
  items: ReferenceItem[];
  isEditMode?: boolean;
}

// 페이지 기준 오른쪽 영역 (과제 수정버튼+자료 모음집)
export const PersonalRightContainer = ({
  taskId,
  items,
  isEditMode = false,
}: PersonalRightContainerProps) => {
  return (
    <div
      className={containerStyle}
      style={isEditMode ? { opacity: 0.4, pointerEvents: 'none' } : undefined}
    >
      <div style={{ marginTop: '9.6rem' }}>
        <PersonalEtc taskId={taskId} items={items} />
      </div>
    </div>
  );
};

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  w: '100%',
});
