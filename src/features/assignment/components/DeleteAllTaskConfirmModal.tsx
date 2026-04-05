import { css } from 'styled-system/css';

interface DeleteAllTaskConfirmModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteAllTaskConfirmModal = ({
  onConfirm,
  onCancel,
}: DeleteAllTaskConfirmModalProps) => {
  return (
    <div className={containerStyle}>
      <div className={textGroupStyle}>
        <p className={css({ textStyle: 'body1.m', color: 'gray.900' })}>
          모든 세부 과제를 삭제하시겠습니까?
        </p>
        <p className={css({ textStyle: 'body3.m', color: 'gray.600' })}>
          삭제된 세부 과제는 영구 삭제되며, 복구할 수 없습니다.
        </p>
      </div>
      <div className={buttonGroupStyle}>
        <button type='button' onClick={onCancel} className={cancelButtonStyle}>
          취소
        </button>
        <button
          type='button'
          onClick={onConfirm}
          className={confirmButtonStyle}
        >
          삭제
        </button>
      </div>
    </div>
  );
};

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '2rem',
  w: '24.125rem',
  pt: '1rem',
});

const textGroupStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const buttonGroupStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

const cancelButtonStyle = css({
  w: '100%',
  h: '3.375rem',
  bg: 'gray.100',
  color: 'gray.600',
  textStyle: 'body2.m',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  _hover: { bg: '#E0E2E6', transition: 'background-color 0.3s ease-out' },
});

const confirmButtonStyle = css({
  w: '100%',
  h: '3.375rem',
  bg: 'blue.500',
  color: 'white',
  textStyle: 'body2.m',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  _hover: {
    bg: 'blue.600',
    transition: 'background-color 0.3s ease-out',
  },
});
