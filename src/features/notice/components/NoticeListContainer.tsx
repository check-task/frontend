'use client';

import { css, cva } from '../../../../styled-system/css';
import { NOTICES } from '@/constants/notices';
import { useUIStore } from '@/stores/ui-store';

export const NoticeListContainer = () => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <div className={containerStyle({ collapsed: !!isSidebarCollapsed })}>
      <h1 className={titleStyle}>공지사항</h1>
      <div className={listStyle}>
        {NOTICES.map((notice) => (
          <div key={notice.id} className={itemStyle}>
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              })}
            >
              <p className={itemTitleStyle}>{notice.title}</p>
              <ul className={bulletListStyle}>
                {notice.bulletItems.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div
              className={css({
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
              })}
            >
              <p className={descriptionStyle}>{notice.description}</p>
              <p className={dateStyle}>{notice.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const containerStyle = cva({
  base: {
    display: 'flex',
    flexDirection: 'column',
    marginX: 'auto',
    transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  variants: {
    collapsed: {
      true: {
        width: '49.625rem',
      },
      false: {
        width: '43.25rem',
      },
    },
  },
  defaultVariants: {
    collapsed: false,
  },
});

const titleStyle = css({
  textStyle: 'h3',
  color: 'gray.900',
  mt: '3.25rem',
});

const listStyle = css({
  display: 'flex',
  flexDirection: 'column',
  w: '100%',
});

const itemStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  px: '1rem',
  py: '2.5rem',
  borderBottom: '0.0625rem solid',
  borderBottomColor: 'gray.200',
});

const itemTitleStyle = css({
  textStyle: 'body1.m',
  color: 'gray.900',
});

const bulletListStyle = css({
  pl: '1.5rem',
  listStyleType: 'disc',
  textStyle: 'body2.m',
  color: 'gray.600',
});

const descriptionStyle = css({
  textStyle: 'body3.r',
  color: 'gray.600',
});

const dateStyle = css({
  textStyle: 'body4.m',
  color: 'gray.400',
});
