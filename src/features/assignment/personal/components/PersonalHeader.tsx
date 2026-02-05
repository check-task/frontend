'use client';

import { FolderClassification } from '@/features/assignment/components/FolderClassification';
import { CompletionProgressBar } from '@/features/assignment/components/CompletionProgressBar';
import { css } from 'styled-system/css';
import {
  colorMap,
  type FolderColor,
} from '@/features/assignment/components/FolderClassification';

interface HeaderProps {
  completionRate: number;
  // ============================
  // 폴더 색상은 백엔드 수정 후에 추후 반영 예정
  // 현재는 기본값 01로 설정
  // ============================
  folderColor?: FolderColor;
  title: string;
  daysLeft: string;
}

export const PersonalHeader = ({
  completionRate,
  folderColor = '01',
  title,
  daysLeft,
}: HeaderProps) => {
  return (
    <div className={containerStyle}>
      <div className={titleStyle}>
        <div className={titleContentStyle}>
          <FolderClassification color={folderColor} />
          <p className={css({ textStyle: 'h2', color: 'gray.900' })}>{title}</p>
        </div>

        <p className={css({ textStyle: 'h4', color: colorMap[folderColor] })}>
          {daysLeft}
        </p>
      </div>

      <div className={completionRateStyle}>
        <div className={completionRateContentStyle}>
          <p>완료율</p>
          <p>{completionRate}%</p>
        </div>
        <CompletionProgressBar progress={completionRate} />
      </div>
    </div>
  );
};

// ======== 스타일 정의 ========
const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.88rem', // 제목과 완료율 사이 간격(아니면 1.75)
  justifyContent: 'space-between',
  transition: 'all 0.3s ease-in-out',
  w: '100%',
});

// 폴더 색상 + 제목 + 디데이
const titleStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

// 폴더 색상+ 제목
const titleContentStyle = css({
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center',
});

const completionRateStyle = css({
  ml: '3.25rem', // 헤더에서 시작 위치가 들어가있음
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem', // 완료율과 바 사이 간격
});

const completionRateContentStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textStyle: 'body1.m',
  color: 'gray.700',
});
