import { css } from 'styled-system/css';
import { TeamMemberDropdown } from './TeamDropdown';

export type MemberRole = 'Owner' | 'Member';

interface TeamMemberManageModalItemProps {
  memberId: number;
  /** PATCH 경로에 쓸 ID (GET에서 taskMemberId 등으로 오면 전달) */
  patchMemberId?: number;
  userId?: number | null;
  name: string;
  profileImage?: string | null;
  role: MemberRole;
  /** 본인 행이면 true — "(you)" 표시, 드롭다운 비표시 */
  isCurrentUser?: boolean;
  /** Owner만 true — 다른 사람 역할을 드롭다운으로 변경 가능 */
  canChangeRole: boolean;
  onRoleChange?: (
    memberId: number,
    patchMemberId: number | undefined,
    userId: number | undefined,
    newRole: MemberRole,
    currentRole: MemberRole,
  ) => void;
  onDeleteMember?: () => void;
  onExpelMember?: () => void;
  onProfileClick?: () => void;
}

export const TeamMemberManageModalItem = ({
  memberId,
  patchMemberId,
  userId,
  name,
  profileImage,
  role,
  isCurrentUser = false,
  canChangeRole,
  onRoleChange,
  onExpelMember,
  onProfileClick,
}: TeamMemberManageModalItemProps) => {
  const roleLabel = isCurrentUser ? `${role}(you)` : role;
  const showDropdown = !isCurrentUser && canChangeRole;

  return (
    <div className={modalContentItemStyle}>
      <button
        type='button'
        onClick={onProfileClick}
        className={modalContentItemTitleStyle}
      >
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
        />
        <p>{name}</p>
      </button>

      <div className={modalContentItemMemberStyle}>
        {showDropdown ? (
          <TeamMemberDropdown
            role={role}
            onRoleChange={(newRole) =>
              onRoleChange?.(
                memberId,
                patchMemberId,
                userId ?? undefined,
                newRole,
                role,
              )
            }
            onExpelMember={onExpelMember}
            disabled={false}
          />
        ) : (
          <p className={css({ textStyle: 'body3.r', color: 'gray.900' })}>
            {roleLabel}
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
  width: '100%',
});

const modalContentItemTitleStyle = css({
  textStyle: 'body2.r',
  color: 'gray.900',
  gap: '0.75rem',
  display: 'flex',
  alignItems: 'center',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
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

const modalContentItemMemberStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  textStyle: 'body3.r',
  color: 'gray.900',
});
