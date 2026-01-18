'use client';

import { Button } from '@/components/Button';
import { css } from 'styled-system/css';
import { PersonalEtc } from './PersonalEtc';

// 페이지 기준 오른쪽 영역 (과제 수정버튼+자료 모음집)
export const PersonalRightContainer = () => {
  return (
    <div className={containerStyle}>
      {/* 추후 링크로 과제 수정 페이지 연결 */}
      <Button variant='strokeBlue' size='small'>
        과제수정
      </Button>
      <PersonalEtc />
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
