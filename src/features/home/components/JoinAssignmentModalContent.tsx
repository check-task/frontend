import { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/TextField';
import { useModalStore } from '@/stores/modal-store';
import { styled } from 'styled-system/jsx';
import { stack } from 'styled-system/patterns';

export const JoinAssignmentModalContent = () => {
  const closeModal = useModalStore((state) => state.closeModal);
  const [inviteCode, setInviteCode] = useState('');

  const handleJoin = () => {
    closeModal();
  };

  return (
    <Container>
      <FormField>
        <Label>초대코드</Label>
        <Input
          size='modal'
          type='text'
          placeholder='공유받은 코드를 붙여 넣으세요.'
          value={inviteCode}
          onChange={(e) => setInviteCode(e.target.value)}
        />
      </FormField>

      <Button
        variant='fillBlue'
        size='large'
        onClick={handleJoin}
        disabled={!inviteCode.trim()}
      >
        팀과제 참여
      </Button>
    </Container>
  );
};

const Container = styled('div', {
  base: stack.raw({
    paddingTop: '1.75rem',
    gap: '2.5rem',
  }),
});

const FormField = styled('div', {
  base: stack.raw({
    gap: '0.75rem',
  }),
});

const Label = styled('label', {
  base: {
    textStyle: 'body3.m',
    color: 'gray.800',
  },
});
