'use client';

import { useAlertStore } from '@/stores/alert-store';
import { Alert } from '@/components/Alert';
import { css } from 'styled-system/css';

export const AlertContainer = () => {
  const { alerts } = useAlertStore();

  if (alerts.length === 0) return null;

  return (
    <div className={containerStyle}>
      {alerts.map((alert) => (
        <Alert key={alert.id} message={alert.message} />
      ))}
    </div>
  );
};

const containerStyle = css({
  position: 'fixed',
  right: '7.5rem',
  top: '7.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '1rem',
  zIndex: 'toast',
});
