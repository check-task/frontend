'use client';

import { useEffect, useState } from 'react';
import { css } from 'styled-system/css';
import { TeamMemberManageModalItem } from './TeamMemberManageModalItem';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/TextField';
import { useCreateInvitationLink } from '@/hooks/mutations/useCreateInvitationLink';

interface TeamMemberManageModalProps {
  taskId: number;
}

export const TeamMemberManageModal = ({
  taskId,
}: TeamMemberManageModalProps) => {
  const [inviteCode, setInviteCode] = useState('');
  const { mutateAsync: createInvitation, isPending } =
    useCreateInvitationLink(taskId);

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

  return (
    <div className={modalContentStyle}>
      <div className={modalContentItemStyle}>
        {/* TODO: 팀원 초대 버튼 모달 타이틀에 추가 */}
        <TeamMemberManageModalItem
          nickname='멤버 닉네임'
          role='Owner'
          onSetLeader={() => console.log('팀장으로 설정')}
          onDeleteMember={() => console.log('팀원 삭제')}
        />

        <TeamMemberManageModalItem
          nickname='멤버 닉네임'
          role='Member'
          onSetLeader={() => console.log('팀장으로 설정')}
          onDeleteMember={() => console.log('팀원 삭제')}
        />

        <TeamMemberManageModalItem
          nickname='멤버 닉네임'
          role='Member'
          onSetLeader={() => console.log('팀장으로 설정')}
          onDeleteMember={() => console.log('팀원 삭제')}
        />
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
