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
}

// 페이지 기준 오른쪽 영역 (과제 수정버튼+자료 모음집)
export const PersonalRightContainer = ({
  taskId,
  items,
}: PersonalRightContainerProps) => {
  return (
    <div className={containerStyle}>
      {/* 과제 수정에서 해당 과제를 조회하기 위해 taskId 전달 */}
      <Link href={`/assignment/modify?taskId=${taskId}`}>
        <Button variant='strokeBlue' size='small'>
          과제수정
        </Button>
      </Link>
      <PersonalEtc items={items} />
    </div>
  );
};

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '7.15rem', // 직접 왼쪽이랑 정렬되도록 넣음...
  w: '100%',
});
