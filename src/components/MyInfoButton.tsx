import { cva } from 'styled-system/css';
import { MyInfoIcon } from './icons/MyInfoIcon';

// collapsed: 버튼 축소 여부
interface MyInfoButtonProps {
  collapsed?: boolean;
}

export const MyInfoButton = ({ collapsed = false }: MyInfoButtonProps) => {
  const myInfoButtonStyle = cva({
    base: {
      display: 'flex',
      alignItems: 'center',
      textStyle: 'body1.m',
      color: 'blue.600',
      gap: '0.75rem',
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
    <button className={myInfoButtonStyle({ collapsed })}>
      <MyInfoIcon />
      <span className={spanStyle({ collapsed })}>내 정보</span>
    </button>
  );
};
