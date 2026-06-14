import type { Metadata } from 'next';
import { NoticeListContainer } from '@/features/notice/components/NoticeListContainer';
import { css } from 'styled-system/css';
import { stack } from 'styled-system/patterns';


export const metadata: Metadata = {
  title: '공지사항',
};

export default function NoticePage() {
  return (
    <div className={pageStyle}>
      <NoticeListContainer />
    </div>
  );
}

const pageStyle = css(
  stack.raw({
    gap: '1.5rem',
    paddingX: '1.5rem',
    marginX: 'auto',
    marginTop: '2rem',
    marginBottom: '3.75rem',
  }),
);
