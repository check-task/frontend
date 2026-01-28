import { AlarmListContainer } from '@/features/alarm/components/AlarmListContainer';
import { DUMMY_ALARMS } from '@/constants/AlarmMock';

export default function AlarmPage() {
  return (
    <div>
      <AlarmListContainer alarmList={DUMMY_ALARMS} />
    </div>
  );
}
