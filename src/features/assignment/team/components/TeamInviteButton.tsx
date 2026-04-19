import { InviteIcon } from '@/components/icons/InviteIcon';
import { css } from 'styled-system/css';

export const TeamInviteButton = () => {
  return (
    <button className={InviteButtonStyle}>
      <InviteIcon />
      <p>팀원 초대</p>
    </button>
  );
};

const InviteButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  paddingX: '0.5rem',
  height: '1.875rem',
  bg: 'blue.50',
  fontSize: '1rem',
  color: 'blue.600',
  borderRadius: '0.25rem',
  cursor: 'pointer',
});
