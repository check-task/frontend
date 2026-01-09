import { cva } from 'styled-system/css';
import { LogoutIcon } from './icons/LogoutIcon';

// collapsed: 버튼 축소 여부
interface LogoutButtonProps {
  collapsed?: boolean;
}

export const LogoutButton = ({ collapsed = false }: LogoutButtonProps) => {
  const logoutButtonStyle = cva({
    base: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem',
      textStyle: 'body3.r',
      color: 'gray.500',
      cursor: 'pointer',
    },
  });

  const spanStyle = cva({
    variants: {
      collapsed: {
        true: {
          opacity: 0,
          w: 0,
          display: 'none',
        },
        false: {
          opacity: 1,
          display: 'block',
        },
      },
    },
  });

  return (
    <button className={logoutButtonStyle({ collapsed })}>
      <LogoutIcon />
      <span className={spanStyle({ collapsed })}>로그아웃</span>
    </button>
  );
};
