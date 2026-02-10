'use client';

import {
  FolderClassification,
  colorMap,
} from '@/features/assignment/components/FolderClassification';
import { CompletionProgressBar } from '@/features/assignment/components/CompletionProgressBar';
import { css } from 'styled-system/css';

interface HeaderProps {
  completionRate: number;
  folderColor?: '01' | '02' | '03' | '04' | '05';
  title?: string;
  daysLeft?: string;
}

export const Header = ({
  completionRate,
  folderColor = '01',
  title = '프로그래밍 1차 과제',
  daysLeft = 'D-43',
}: HeaderProps) => {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        width: '43.25rem',
        gap: '1.75rem',
        justifyContent: 'space-between',
        transition:
          'max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      })}
    >
      <div className={titleStyle}>
        <div className={titleContentStyle}>
          <FolderClassification color={folderColor} />
          <p className={css({ textStyle: 'h2', color: 'gray.900' })}>{title}</p>
        </div>

        <p
          className={css({
            textStyle: 'h4',
            color: colorMap[folderColor],
          })}
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

const titleStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '0.75rem',
});

const titleContentStyle = css({
  display: 'flex',
  gap: '0.75rem',
  alignItems: 'center',
});

const completionRateStyle = css({
  ml: '3.25rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

const completionRateContentStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  textStyle: 'body1.m',
  color: 'gray.700',
});
