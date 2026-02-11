import { css } from 'styled-system/css';
import { TeamMemberDropdown } from './TeamDropdown';

export type MemberRole = 'Owner' | 'Member';

interface TeamMemberManageModalItemProps {
  memberId: number;
  name: string;
  profileImage?: string | null;
  role: MemberRole;
  /** Owner만 true — 역할 드롭다운 표시 및 변경 가능 */
  canChangeRole: boolean;
  onRoleChange?: (memberId: number, role: MemberRole) => void;
  onDeleteMember?: () => void;
}

export const TeamMemberManageModalItem = ({
  memberId,
  name,
  profileImage,
  role,
  canChangeRole,
  onRoleChange,
}: TeamMemberManageModalItemProps) => {
  return (
    <div className={modalContentItemStyle}>
      <div className={modalContentItemTitleStyle}>
        <div
          className={modalContentItemTitleIconStyle}
          style={
            profileImage
              ? {
                  backgroundImage: `url(${profileImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        >
          {!profileImage && (
            <span className={profilePlaceholderTextStyle}>
              {name.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <p>{name}</p>
      </div>

      <div className={modalContentItemMemberStyle}>
        {canChangeRole ? (
          <TeamMemberDropdown
            role={role}
            onRoleChange={(newRole) => onRoleChange?.(memberId, newRole)}
            disabled={false}
          />
        ) : (
          <p className={css({ textStyle: 'body3.r', color: 'gray.900' })}>
            {role}
          </p>
        )}
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
  minWidth: '1.5rem',
  borderRadius: 'full',
  bg: 'blue.100',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

const profilePlaceholderTextStyle = css({
  textStyle: 'body4.m',
  color: 'gray.600',
});

const modalContentItemMemberStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  textStyle: 'body3.r',
  color: 'gray.900',
});
