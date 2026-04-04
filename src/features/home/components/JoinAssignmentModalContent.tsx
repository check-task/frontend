import { useState } from 'react';
import { css } from 'styled-system/css';
import { stack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { Input } from '@/components/TextField';
import { useModalStore } from '@/stores/modal-store';
import { useJoinTask } from '@/hooks/mutations/useJoinTask';

export const JoinAssignmentModalContent = () => {
  const closeModal = useModalStore((state) => state.closeModal);
  const joinTask = useJoinTask();
  const [inviteCode, setInviteCode] = useState('');

  const handleJoin = () => {
    joinTask.mutate(inviteCode, {
      onSuccess: () => closeModal(),
    });
  };

  return (
    <div className={containerStyle}>
      <div className={formFieldStyle}>
        <label className={labelStyle}>초대코드</label>
        <Input
          size='modal'
          type='text'
          placeholder='공유받은 코드를 붙여 넣으세요.'
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
      </div>

      <Button
        variant='fillBlue'
        size='large'
        onClick={handleJoin}
        disabled={!inviteCode.trim() || joinTask.isPending}
      >
        팀과제 참여
      </Button>
    </div>
  );
};

const containerStyle = css(
  stack.raw({
    paddingTop: '1.75rem',
    gap: '2.5rem',
  }),
);

const formFieldStyle = css(
  stack.raw({
    gap: '0.75rem',
  }),
);

const labelStyle = css({
  textStyle: 'body3.m',
  color: 'gray.800',
});
