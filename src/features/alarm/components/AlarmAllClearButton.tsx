'use client';

import { useModalStore } from '@/stores/modal-store';
import { css } from 'styled-system/css';
import { AlarmAllClearContent } from './AlarmAllClearContent';

interface AlarmAllClearButtonProps {
  onClearAll: () => void;
}

export const AlarmAllClearButton = ({
  onClearAll,
}: AlarmAllClearButtonProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  // 삭제 눌렀을 때
  const handleConfirm = () => {
    onClearAll();
    closeModal();
  };

  // 취소 눌렀을 때
  const handleCancel = () => {
    closeModal();
  };

  const handleOpen = () => {
    openModal({
      title: '알림삭제',
      content: (
        <AlarmAllClearContent
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      ),
      headerType: 'none',
    });
  };

  return (
    <button onClick={handleOpen} className={deleteAllButtonStyle}>
      모두 지우기
    </button>
  );
};

// ======== 스타일 정의 ========
// 모두 지우기 버튼 스타일
const deleteAllButtonStyle = css({
  textStyle: 'body2.m',
  color: 'gray.400',
  textDecoration: 'underline',
  // 지정값으로 주면 너무 붙어보여서 좀 늘렸습니다
  textUnderlineOffset: '0.5rem',
  cursor: 'pointer',
  transition: 'color 0.3s',
});
