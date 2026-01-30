import Image from 'next/image';
import { css } from 'styled-system/css';

// 사이드바 로고 버튼 스타일링
const sidebarLogoButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
  cursor: 'pointer',
  flexShrink: 0,
});

const imageWrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  w: '1.75rem',
  h: '1.75rem',
});

interface SidebarLogoButtonProps {
  onClick?: () => void;
}

export const SidebarLogoButton = ({ onClick }: SidebarLogoButtonProps) => {
  return (
    <button className={sidebarLogoButtonStyle} onClick={onClick}>
      <div className={imageWrapperStyle}>
        <Image
          src='/SidebarLogo.svg'
          alt='Sidebar Logo'
          width={28}
          height={28}
          style={{ flexShrink: 0 }}
        />
      </div>
    </button>
  );
};
