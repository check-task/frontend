import { useState } from 'react';
import { css, cva } from 'styled-system/css';
import { stack, hstack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { Input } from '@/components/TextField';
import { useModalStore } from '@/stores/modal-store';
import { useJoinTask } from '@/hooks/mutations/useJoinTask';
import { FolderCheckMark } from '@/components/icons/FolderCheckMark';
import { FOLDER_COLORS, type FolderColor } from '@/types/folder';

export const JoinAssignmentModalContent = () => {
  const closeModal = useModalStore((state) => state.closeModal);
  const joinTask = useJoinTask();
  const [inviteCode, setInviteCode] = useState('');
  const [selectedColor, setSelectedColor] = useState<FolderColor | null>(null);

  const handleColorClick = (color: FolderColor) => {
    setSelectedColor((prev) => (prev === color ? null : color));
  };

  const handleJoin = () => {
    joinTask.mutate(inviteCode, {
      onSuccess: () => closeModal(),
    });
  };

  return (
    <>
      <div className={containerStyle}>
        {/* 폴더색 */}
        <div className={formFieldStyle}>
          <label className={labelStyle}>폴더색</label>
          <div className={colorRowStyle}>
            {FOLDER_COLORS.filter((color) => color !== 'null').map((color) => (
              <button
                key={color}
                type='button'
                className={colorButtonStyle({ color })}
                onClick={() => handleColorClick(color)}
              >
                {selectedColor === color && <FolderCheckMark />}
              </button>
            ))}
          </div>
        </div>

        {/* 초대코드 */}
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
      </div>

      <Button
        variant='fillBlue'
        size='xlarge'
        onClick={handleJoin}
        disabled={!inviteCode.trim() || joinTask.isPending}
        className={css({ marginTop: '2rem' })}
      >
        팀과제 참여
      </Button>
    </>
  );
};

const containerStyle = css(
  stack.raw({
    paddingTop: '1.75rem',
    gap: '1.25rem',
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

const colorRowStyle = css(
  hstack.raw({
    gap: '0.75rem',
  }),
);

const colorButtonStyle = cva({
  base: {
    width: '2.25rem',
    height: '2.25rem',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s ease',
  },
  variants: {
    color: {
      red: { bg: 'sub.01.100' },
      yellow: { bg: 'sub.02.100' },
      green: { bg: 'sub.03.100' },
      purple: { bg: 'sub.04.100' },
      black: { bg: 'sub.05.100' },
    },
  },
});
