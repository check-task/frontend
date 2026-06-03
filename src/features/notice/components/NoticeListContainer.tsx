'use client';

import { css, cva } from '../../../../styled-system/css';
import { NOTICES } from '@/constants/notices';
import { useUIStore } from '@/stores/ui-store';

const INSTAGRAM_HANDLE = '@checktask_';
const INSTAGRAM_URL = 'https://www.instagram.com/checktask_/';

const renderNoticeText = (text: string) => {
  const parts = text.split(INSTAGRAM_HANDLE);

  if (parts.length === 1) {
    return text;
  }

  return parts.flatMap((part, index) => [
    part,
    index < parts.length - 1 ? (
      <a
        key={`instagram-link-${index}`}
        href={INSTAGRAM_URL}
        className={instagramLinkStyle}
      >
        {INSTAGRAM_HANDLE}
      </a>
    ) : null,
  ]);
};

export const NoticeListContainer = () => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);

  return (
    <div className={containerStyle({ collapsed: !!isSidebarCollapsed })}>
      <h1 className={titleStyle}>공지사항</h1>
      <div className={listStyle}>
        {NOTICES.map((notice) => (
          <div key={notice.id} className={itemStyle}>
            {/* 본문 */}
            <div className={contentStyle}>
              <p className={itemTitleStyle}>{notice.title}</p>
              <p className={introStyle}>{notice.intro}</p>
              {notice.sections.map((section, idx) => (
                <div key={idx} className={sectionStyle}>
                  <p className={sectionHeadingStyle}>{section.heading}</p>
                  {section.items && (
                    <ul className={bulletListStyle}>
                      {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.subSections?.map((subSection, subIdx) => (
                    <div key={subIdx} className={subSectionStyle}>
                      <p className={subSectionHeadingStyle}>
                        {subSection.heading}
                      </p>
                      <ul className={bulletListStyle}>
                        {subSection.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  {section.text && (
                    <p className={sectionTextStyle}>
                      {renderNoticeText(section.text)}
                    </p>
                  )}
                </div>
              ))}
            </div>
            {/* 푸터 */}
            <div className={footerStyle}>
              {notice.footer && (
                <p className={footerTextStyle}>{notice.footer}</p>
              )}
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
      true: { width: '49.625rem' },
      false: { width: '43.25rem' },
    },
  },
  defaultVariants: { collapsed: false },
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

const contentStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

const itemTitleStyle = css({
  textStyle: 'body1.m',
  color: 'gray.900',
});

const introStyle = css({
  textStyle: 'body2.r',
  color: 'gray.700',
  whiteSpace: 'pre-line',
});

const sectionStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

const sectionHeadingStyle = css({
  textStyle: 'body2.m',
  color: 'gray.800',
});

const subSectionStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
  mt: '0.5rem',
});

const subSectionHeadingStyle = css({
  textStyle: 'body2.m',
  color: 'gray.800',
});

const bulletListStyle = css({
  pl: '1.5rem',
  listStyleType: 'disc',
  textStyle: 'body2.r',
  color: 'gray.600',
});

const sectionTextStyle = css({
  textStyle: 'body2.r',
  color: 'gray.600',
  whiteSpace: 'pre-line',
});

const instagramLinkStyle = css({
  color: 'blue.500',
  textDecoration: 'underline',
});

const footerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const footerTextStyle = css({
  textStyle: 'body3.r',
  color: 'gray.600',
  whiteSpace: 'pre-line',
});

const dateStyle = css({
  textStyle: 'body4.m',
  color: 'gray.400',
});
