import type { Metadata } from 'next';
import { AlarmListContainer } from '@/features/alarm/components/AlarmListContainer';

export const metadata: Metadata = {
  title: '알림',
};

export default function AlarmPage() {
  return (
    <div>
      <AlarmListContainer />
    </div>
  );
}
