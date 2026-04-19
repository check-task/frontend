'use client';

import Link from 'next/link';
import { css } from '../../styled-system/css';

interface SidebarHooksProps {
  collapsed?: boolean;
  isOpen?: boolean;
}

export const SidebarHooks = ({ collapsed, isOpen }: SidebarHooksProps) => {
  if (collapsed) {
    return null;
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateRows: isOpen ? '1fr' : '0fr',
        transition: 'grid-template-rows 400ms cubic-bezier(0, 0, 0.2, 1)',
      }}
    >
      <div style={{ overflow: 'hidden' }}>
        <div className={containerStyle}>
          <Link href='/assignment/create' className={itemWithBorderStyle}>
            과제 등록
          </Link>
          <Link
            href='/assignment?type=personal'
            className={itemWithBorderStyle}
          >
            개인과제
          </Link>
          <Link href='/assignment?type=team' className={itemStyle}>
            팀과제
          </Link>
        </div>
      </div>
    </div>
  );
};

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  pl: '2.5rem',
  pt: '1rem',
});

const itemStyle = css({
  display: 'flex',
  alignItems: 'center',
  textStyle: 'body2.r',
  color: 'blue.600',
  cursor: 'pointer',
  textDecoration: 'none',
  w: '9.875rem',
});

const itemWithBorderStyle = css({
  display: 'flex',
  alignItems: 'center',
  textStyle: 'body2.r',
  color: 'blue.600',
  cursor: 'pointer',
  textDecoration: 'none',
  pb: '0.5rem',
  w: '9.875rem',
  borderBottom: '0.0625rem solid',
  borderColor: 'blue.100',
});
