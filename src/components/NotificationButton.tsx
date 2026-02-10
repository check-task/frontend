'use client';

import { css } from 'styled-system/css';
import { NotificationIcon } from './icons/NotificationIcon';
import { NotificationIconActive } from './icons/NotificationIconActive';
import { useUnreadAlarmCount } from '@/hooks/queries/useUnreadAlarmCount';

export const NotificationButton = () => {
  const { data } = useUnreadAlarmCount();
  const hasUnread = data?.hasUnread ?? false;

  const notificationButtonStyle = css({
    color: 'blue.600',
    cursor: 'pointer',
  });

  return (
    <button className={notificationButtonStyle}>
      {hasUnread ? <NotificationIconActive /> : <NotificationIcon />}
    </button>
  );
};
