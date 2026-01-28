'use client';

import Link from 'next/link';
import { css } from '../../styled-system/css';
import { SidebarHooksIcon } from './icons/SidebarHooksIcon';

interface SidebarHooksProps {
  collapsed?: boolean;
}

export const SidebarHooks = ({ collapsed }: SidebarHooksProps) => {
  if (collapsed) {
    return null;
  }

  return (
    <div className={containerStyle}>
      <div className={iconsColumnStyle}>
        <SidebarHooksIcon />
        <div className={hookGroupStyle1}>
          <p className={lineStyle1} />
          <SidebarHooksIcon />
        </div>
        <div className={hookGroupStyle2}>
          <p className={lineStyle2} />
          <SidebarHooksIcon />
        </div>
      </div>

      <div className={labelsColumnStyle}>
        <Link href='/assignment/create' className={labelStyle}>
          과제 등록
        </Link>
        <Link href='/assignment?type=personal' className={labelStyle}>
          개인과제
        </Link>
        <Link href='/assignment?type=team' className={labelStyle}>
          팀과제
        </Link>
      </div>
    </div>
  );
};

// 컨테이너 스타일
const containerStyle = css({
  display: 'flex',
  gap: '0.875rem',
  ml: '0.825rem',
  mt: '0.5rem',
});

// 아이콘 컬럼 스타일
const iconsColumnStyle = css({
  display: 'flex',
  flexDirection: 'column',
  transform: 'translateY(-0.5rem)',
  mb: '-2rem',
});

// 훅 그룹 스타일
const hookGroupStyle1 = css({
  display: 'flex',
  flexDirection: 'column',
  transform: 'translateY(-0.6rem)',
});

const hookGroupStyle2 = css({
  display: 'flex',
  flexDirection: 'column',
  transform: 'translateY(-1.4rem)',
});

// 연결선 스타일
const lineStyle1 = css({
  h: '2rem',
  w: '0.0625rem',
  bg: 'gray.500',
});

const lineStyle2 = css({
  h: '2.2rem',
  w: '0.0625rem',
  bg: 'gray.500',
});

// 라벨 컬럼 스타일
const labelsColumnStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.125rem',
});

// 라벨 텍스트 스타일
const labelStyle = css({
  textStyle: 'body2.r',
  color: 'gray.500',
  cursor: 'pointer',
  textDecoration: 'none',
});
