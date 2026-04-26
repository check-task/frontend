import type { Metadata } from 'next';
import { NoticeListContainer } from '@/features/notice/components/NoticeListContainer';

export const metadata: Metadata = {
  title: '공지사항',
};

export default function NoticePage() {
  return (
    <div>
      <NoticeListContainer />
    </div>
  );
}
