'use client';

import { useEffect, useState } from 'react';
import { css } from 'styled-system/css';
import { TeamMemberManageModalItem, type MemberRole } from './TeamMemberManageModalItem';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/TextField';
import { useCreateInvitationLink } from '@/hooks/mutations/useCreateInvitationLink';
import { useTaskMembers } from '@/hooks/queries/useTaskMembers';
import { useUpdateMemberRole } from '@/hooks/mutations/useUpdateMemberRole';
import { useMyInfo } from '@/hooks/queries/useMyInfo';

interface TeamMemberManageModalProps {
  taskId: number;
}

const roleFromApi = (role: 0 | 1): MemberRole => (role === 1 ? 'Owner' : 'Member');

export const TeamMemberManageModal = ({
  taskId,
}: TeamMemberManageModalProps) => {
  const [inviteCode, setInviteCode] = useState('');
  const { data: myInfo } = useMyInfo();
  const { data: membersData } = useTaskMembers(taskId);
  const { mutateAsync: createInvitation, isPending } =
    useCreateInvitationLink(taskId);
  const { mutate: updateRole } = useUpdateMemberRole(taskId);

  const members = membersData ?? [];
  const currentUserId = myInfo?.user?.id;
  const isCurrentUserOwner = members.some(
    (m) => m.role === 1 && m.memberId === currentUserId,
  );

  useEffect(() => {
    createInvitation()
      .then((data) => setInviteCode(data.invite_code))
      .catch(() => setInviteCode(''));
    // 모달 오픈 시 1회만 초대코드 생성
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  const handleCopy = () => {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode).catch(() => {});
  };

  const handleRoleChange = (memberId: number, newRole: MemberRole) => {
    updateRole({ memberId, role: newRole === 'Owner' ? 1 : 0 });
  };

  return (
    <div className={modalContentStyle}>
      <div className={modalContentItemStyle}>
        {members.length === 0 ? (
          <p className={css({ textStyle: 'body3.r', color: 'gray.500' })}>
            팀원 목록을 불러오는 중입니다.
          </p>
        ) : (
          members.map((member) => (
            <TeamMemberManageModalItem
              key={member.memberId}
              memberId={member.memberId}
              name={member.name}
              profileImage={member.profileImage}
              role={roleFromApi(member.role)}
              canChangeRole={isCurrentUserOwner}
              onRoleChange={handleRoleChange}
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
