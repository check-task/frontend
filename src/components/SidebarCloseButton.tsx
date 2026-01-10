import { SlideIcon } from './icons/SlideIcon';
import { css } from 'styled-system/css';

// 사이드바 클로즈 버튼 스타일링
const sidebarCloseButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

interface SidebarCloseButtonProps {
  onClick?: () => void;
}

export const SidebarCloseButton = ({ onClick }: SidebarCloseButtonProps) => {
  return (
    <button className={sidebarCloseButtonStyle} onClick={onClick}>
      <SlideIcon />
    </button>
  );
};
