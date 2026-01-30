import { cva } from 'styled-system/css';

export const SidebarHooksIcon = () => {
  const pathStyle = cva({
    base: {
      fill: 'gray.500',
    },
  });
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      width='13'
      height='22'
      viewBox='0 0 13 22'
      fill='none'
    >
      <path
        d='M12.2857 21.125C12.5619 21.125 12.7857 20.9011 12.7857 20.625C12.7857 20.3489 12.5619 20.125 12.2857 20.125V20.625V21.125ZM0.5 0H0V11.754H0.5H1V0H0.5ZM0.5 11.754H0C0 15.7548 1.00071 18.16 2.77204 19.5313C4.51291 20.8791 6.87851 21.125 9.33929 21.125V20.625V20.125C6.88935 20.125 4.8353 19.864 3.38421 18.7406C1.96357 17.6407 1 15.6104 1 11.754H0.5ZM9.33929 20.625V21.125H12.2857V20.625V20.125H9.33929V20.625Z'
        className={pathStyle()}
      />
    </svg>
  );
};
