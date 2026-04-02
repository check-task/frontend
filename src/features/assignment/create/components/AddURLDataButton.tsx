import { PlusIcon } from '@/components/icons/PlusIcon';
import { css } from 'styled-system/css';

interface AddURLDataButtonProps {
  toggleType: 0 | 1; // 0: URL 업로드, 1: 파일 업로드
  onClick?: () => void;
}

export const AddURLDataButton = ({
  toggleType,
  onClick,
}: AddURLDataButtonProps) => {
  const label = toggleType === 0 ? 'URL 추가' : '파일 추가';

  return (
    <button className={buttonStyle} onClick={onClick}>
      <PlusIcon />
      <span>{label}</span>
    </button>
  );
};

const buttonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.25rem', // 갭 수정
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  textStyle: 'body3.r',
  color: 'gray.400',
  paddingX: '0.75rem',
  paddingY: '0.5rem',
  width: 'fit-content',
});
