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
  /** 폴더 색상 토큰 (01~05). folderColorHex 없을 때 사용 */
  folderColor?: FolderColor;
  /** 폴더 색상 HEX (상세 조회 API foldercolor). 있으면 이걸로 표시 */
  folderColorHex?: string;
  title: string;
  daysLeft: string;
}

export const PersonalHeader = ({
  completionRate,
  folderColor = '01',
  folderColorHex,
  title,
  daysLeft,
}: HeaderProps) => {
  const useHex = !!folderColorHex;
  return (
    <div className={containerStyle}>
      <div className={titleStyle}>
        <div className={titleContentStyle}>
          {useHex ? (
            <div
              className={css({
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                flexShrink: 0,
                marginTop: '0.2rem',
              })}
              style={{ backgroundColor: folderColorHex }}
            />
          ) : (
            <div className={css({ flexShrink: 0, marginTop: '0.25rem' })}>
              <FolderClassification color={folderColor} />
            </div>
          )}
          <p className={titleTextStyle}>{title}</p>
        </div>

        <p
          className={css({
            textStyle: 'h4',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            marginTop: '0.4rem',
            ...(useHex ? {} : { color: colorMap[folderColor] }),
          })}
          style={useHex ? { color: folderColorHex } : undefined}
        >
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
  alignItems: 'flex-start',
  gap: '1rem',
});

// 폴더 색상+ 제목
const titleContentStyle = css({
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'flex-start',
  flex: 1,
  minWidth: 0,
});

// 제목 텍스트
const titleTextStyle = css({
  textStyle: 'h2',
  color: 'gray.900',
  wordBreak: 'break-word',
  flex: 1,
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
