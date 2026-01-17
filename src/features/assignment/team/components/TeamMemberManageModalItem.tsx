import { css } from 'styled-system/css';
import { TeamMemberDropdown } from './TeamDropdown';

interface TeamMemberManageModalItemProps {
  nickname: string;
  role: string;
  onSetLeader?: () => void;
  onDeleteMember?: () => void;
}

export const TeamMemberManageModalItem = ({
  nickname,
  role,
  onSetLeader,
  onDeleteMember,
}: TeamMemberManageModalItemProps) => {
  return (
    <div className={modalContentItemStyle}>
      <div className={modalContentItemTitleStyle}>
        <div className={modalContentItemTitleIconStyle} />
        <p>{nickname}</p>
      </div>

      <div className={modalContentItemMemberStyle}>
        <p>{role}</p>
        <TeamMemberDropdown
          onSetLeader={onSetLeader}
          onDeleteMember={onDeleteMember}
        />
      </div>
    </div>
  );
};

const modalContentItemStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '27.25rem',
});

const modalContentItemTitleStyle = css({
  textStyle: 'body2.r',
  color: 'gray.900',
  gap: '0.75rem',
  display: 'flex',
  alignItems: 'center',
});

const modalContentItemTitleIconStyle = css({
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: 'full',
  bg: 'blue.100',
});

const modalContentItemMemberStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  textStyle: 'body3.r',
  color: 'gray.900',
});
