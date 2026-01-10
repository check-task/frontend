import Image from 'next/image';
import { css } from 'styled-system/css';

// 사이드바 오픈 버튼 스타일링
const sidebarOpenButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  pl: '0.125rem',
  justifyContent: 'flex-start',
  cursor: 'pointer',
});

export const SidebarOpenButton = () => {
  return (
    <button className={sidebarOpenButtonStyle}>
      <Image src='/SidebarLogo.svg' alt='Sidebar Logo' width={28} height={28} />
    </button>
  );
};
