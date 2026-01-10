import { css } from 'styled-system/css';
import { NotificationIcon } from './icons/NotificationIcon';

export const NotificationButton = () => {
  const notificationButtonStyle = css({
    color: 'blue.600',
    cursor: 'pointer',
  });

  return (
    <button className={notificationButtonStyle}>
      <NotificationIcon />
    </button>
  );
};
