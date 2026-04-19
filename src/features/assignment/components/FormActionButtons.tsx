import { css, cva } from 'styled-system/css';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { SaveIcon } from '@/components/icons/SaveIcon';

interface FormActionButtonsProps {
  onSave: () => void;
  onCancel: () => void;
  isPending?: boolean;
  onDeleteAll?: () => void;
}

export const FormActionButtons = ({
  onSave,
  onCancel,
  isPending,
  onDeleteAll,
}: FormActionButtonsProps) => {
  return (
    <div className={buttonGroupStyle}>
      {onDeleteAll && (
        <button
          className={deleteAllButtonStyle}
          onClick={onDeleteAll}
          disabled={isPending}
        >
          전체 삭제
        </button>
      )}
      <button
        className={buttonStyle({ type: 'cancel' })}
        onClick={onCancel}
        disabled={isPending}
      >
        <div>
          <CloseIcon size={20} strokeWidth={1.5} color='gray.600' />
        </div>
        취소
      </button>
      <button
        className={buttonStyle({ type: 'save' })}
        onClick={onSave}
        disabled={isPending}
      >
        <div>
          <SaveIcon />
        </div>
        저장
      </button>
    </div>
  );
};

const buttonGroupStyle = css({
  display: 'flex',
  gap: '0.75rem',
});

const deleteAllButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  padding: '0.5rem 1rem',
  borderRadius: '2.5rem',
  textStyle: 'body3.m',
  cursor: 'pointer',
  border: '1px solid',
  borderColor: 'gray.400',
  color: 'gray.400',
});

const buttonStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    padding: '0.5rem 1rem 0.5rem 0.5rem',
    borderRadius: '2.5rem',
    textStyle: 'body3.m',
    cursor: 'pointer',
    border: '1px solid',
  },
  variants: {
    type: {
      save: {
        borderColor: 'blue.500',
        color: 'blue.500',
      },
      cancel: {
        borderColor: 'gray.600',
        color: 'gray.600',
      },
    },
  },
});
