'use client';

import { Button } from '@/components/Button';
import { css } from 'styled-system/css';
import { PersonalEtc } from './PersonalEtc';
import Link from 'next/link';

export interface ReferenceItem {
  id: number;
  type: 0 | 1; // 0은 url, 1은 파일로 지정
  name: string;
  path: string;
}

interface PersonalRightContainerProps {
  taskId: number;
  items: ReferenceItem[];
  headerHeight?: number;
}

// 페이지 기준 오른쪽 영역 (과제 수정버튼+자료 모음집)
export const PersonalRightContainer = ({
  taskId,
  items,
  headerHeight = 0,
}: PersonalRightContainerProps) => {
  return (
    <div className={containerStyle}>
      {/* 과제 수정에서 해당 과제를 조회하기 위해 taskId 전달 */}
      <Link href={`/assignment/modify?taskId=${taskId}`}>
        <Button variant='strokeBlue' size='small'>
          과제수정
        </Button>
      </Link>
      <div
        style={{
          marginTop: headerHeight ? `calc(${headerHeight}px - 0.8rem)` : '0',
        }}
      >
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
