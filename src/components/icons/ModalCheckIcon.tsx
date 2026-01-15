import { cva } from 'styled-system/css';
import { circle } from 'styled-system/patterns';

export const ModalCheckIcon = () => {
  const pathRecipe = cva({
    base: {
      // 공용 스타일
      stroke: 'gray.900',
      strokeWidth: '1.16667',
    },
    variants: {
      type: {
        path: {
          strokeLinecap: 'round',
        },
        circle: {},
      },
    },
    defaultVariants: {
      type: 'circle',
    },
  });

  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='28'
      height='28'
      viewBox='0 0 28 28'
      fill='none'
    >
      <circle
        cx='14'
        cy='14'
        r='9.91667'
        className={pathRecipe({ type: 'circle' })}
      />
      <path
        d='M9.33301 14.0007L11.9588 17.9393C12.1897 18.2856 12.6986 18.2856 12.9295 17.9393L18.6663 9.33398'
        className={pathRecipe({ type: 'path' })}
      />
    </svg>
  );
};
