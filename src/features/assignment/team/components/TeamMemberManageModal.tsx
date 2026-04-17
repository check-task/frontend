'use client';

import { useEffect, useState } from 'react';
import { css } from 'styled-system/css';
import {
  TeamMemberManageModalItem,
  type MemberRole,
} from './TeamMemberManageModalItem';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/TextField';
import { useCreateInvitationLink } from '@/hooks/mutations/useCreateInvitationLink';
import { useExpelTaskMember } from '@/hooks/mutations/useExpelTaskMember';
import { useTaskMembers } from '@/hooks/queries/useTaskMembers';
import { useUpdateMemberRole } from '@/hooks/mutations/useUpdateMemberRole';
import { useMyInfo } from '@/hooks/queries/useMyInfo';
import { useAlertStore } from '@/stores/alert-store';

interface TeamMemberManageModalProps {
  taskId: number;
}

const roleFromApi = (role: 0 | 1): MemberRole =>
  role === 0 ? 'Owner' : 'Member';

const getRoleUpdateErrorMessage = (err: unknown): string => {
  const ax = err as {
    response?: {
      data?: { reason?: string; message?: string; error?: string };
      status?: number;
    };
  };
  if (ax.response?.data?.reason) return ax.response.data.reason;
  if (ax.response?.data?.message) return ax.response.data.message;
  if (ax.response?.data?.error) return ax.response.data.error;
  if (ax.response?.status === 403) return '역할 수정 권한이 없습니다.';
  if (ax.response?.status === 404) return '해당 멤버를 찾을 수 없습니다.';
  return '역할 수정에 실패했습니다.';
};

const getExpelErrorMessage = (err: unknown): string => {
  const ax = err as {
    response?: {
      data?: { error?: string; message?: string };
      status?: number;
    };
  };
  if (ax.response?.data?.error) return ax.response.data.error;
  if (ax.response?.data?.message) return ax.response.data.message;
  if (ax.response?.status === 403)
    return '권한이 없습니다. 팀장만 추방할 수 있습니다.';
  if (ax.response?.status === 404) return '멤버를 찾을 수 없습니다.';
  return '팀원 추방에 실패했습니다.';
};

export const TeamMemberManageModal = ({
  taskId,
}: TeamMemberManageModalProps) => {
  const [inviteCode, setInviteCode] = useState('');
  const [roleError, setRoleError] = useState<string | null>(null);
  const { data: myInfo } = useMyInfo();
const { showAlert } = useAlertStore();
  const { data: membersData } = useTaskMembers(taskId);
  const { mutateAsync: createInvitation, isPending } =
    useCreateInvitationLink(taskId);
  const { mutate: updateRole } = useUpdateMemberRole(taskId);
  const { mutate: expelMember } = useExpelTaskMember(taskId);

  const members = membersData ?? [];
  const currentUserId = myInfo?.user?.id;
  const myNickname = myInfo?.user?.nickname;
  // API가 user_id를 주면 숫자 비교(문자열 응답 대비 Number() 사용), 없으면 닉네임으로 현재 사용자 행 보완
  const isCurrentUserOwner = members.some(
    (m) =>
      m.role === 0 &&
      (Number(m.userId) === Number(currentUserId) ||
        (m.userId == null && myNickname != null && m.name === myNickname)),
  );
  const isCurrentUser = (m: (typeof members)[number]) =>
    Number(m.userId) === Number(currentUserId) ||
    (m.userId == null && myNickname != null && m.name === myNickname);

  useEffect(() => {
    createInvitation()
      .then((data) => setInviteCode(data.invite_code))
      .catch(() => setInviteCode(''));
    // 모달 오픈 시 1회만 초대코드 생성
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const handleCopy = () => {
    if (!inviteCode) return;
    navigator.clipboard
      .writeText(inviteCode)
      .then(() => showAlert('초대코드를 복사했습니다.'))
      .catch(() => showAlert('초대코드 복사에 실패했습니다.'));
  };

  const handleRoleChange = (
    memberId: number,
    _patchMemberId: number | undefined,
    userId: number | undefined,
    newRole: MemberRole,
    currentRole: MemberRole,
  ) => {
    if (newRole === currentRole) return;
    setRoleError(null);
    // API는 path/body 모두 userId 사용 (GET 팀원 목록의 id가 user id)
    const id = userId ?? memberId;
    if (id == null || id === 0) {
      setRoleError('팀원 정보에 사용자 ID가 없어 역할을 수정할 수 없습니다.');
      return;
    }
    updateRole(
      {
        userId: id,
        role: newRole === 'Owner' ? 0 : 1,
      },
      {
        onError: (err) => setRoleError(getRoleUpdateErrorMessage(err)),
      },
    );
  };

  const handleExpelMember = (memberId: number, memberName: string) => {
    const confirmed = window.confirm(`${memberName}을(를) 팀에서 삭제하시겠습니까?`);
    if (!confirmed) return;
    setRoleError(null);
    if (memberId == null || memberId === 0) {
      setRoleError('팀원 정보에 사용자 ID가 없어 추방할 수 없습니다.');
      return;
    }
    expelMember(memberId, {
      onError: (err) => setRoleError(getExpelErrorMessage(err)),
    });
  };

  return (
    <div className={modalContentStyle}>
      <div className={modalContentItemStyle}>
        {roleError && (
          <p className={css({ textStyle: 'body3.r', color: 'red.500' })}>
            {roleError}
          </p>
        )}
        {members.length === 0 ? (
          <p className={css({ textStyle: 'body3.r', color: 'gray.500' })}>
            팀원 목록을 불러오는 중입니다.
          </p>
        ) : (
          members.map((member, index) => (
            <TeamMemberManageModalItem
              key={`member-${member.memberId}-${index}`}
              memberId={member.memberId}
              patchMemberId={member.patchMemberId}
              userId={member.userId}
              name={member.name}
              profileImage={member.profileImage}
              role={roleFromApi(member.role)}
              isCurrentUser={isCurrentUser(member)}
              canChangeRole={isCurrentUserOwner}
              onRoleChange={handleRoleChange}
              onExpelMember={() =>
                handleExpelMember(member.memberId, member.name)
              }
            />
          ))
        )}
      </div>

      <Divider />

      <div className={inviteCodeStyle}>
        <p className={inviteCodeTitleStyle}>팀 과제 초대</p>
        <div className={inviteCodeItemStyle}>
          <Input
            size='modal'
            placeholder={isPending ? '초대코드 생성 중...' : '초대코드'}
            width='100%'
            value={inviteCode}
            readOnly
          />
          <button
            type='button'
            className={copyButtonStyle}
            onClick={handleCopy}
            disabled={!inviteCode || isPending}
          >
            복사
          </button>
        </div>
      </div>
    </div>
  );
};

const modalContentStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem',
});

const modalContentItemStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  mt: '1.75rem',
});

const inviteCodeStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

const inviteCodeItemStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  justifyContent: 'space-between',
});

const inviteCodeTitleStyle = css({
  textStyle: 'body3.m',
  color: 'gray.900',
});

const copyButtonStyle = css({
  textStyle: 'body3.m',
  color: 'primary-button-text',
  bg: 'primary',
  width: '4.375rem',
  height: '2.875rem',
  borderRadius: '0.25rem',
  textAlign: 'center',
  cursor: 'pointer',
  _disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  _hover: {
    bg: '#1D6BDD',
  },
});
