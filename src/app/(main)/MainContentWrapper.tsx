import { css } from '../../../styled-system/css';

interface MainContentWrapperProps {
  children: React.ReactNode;
}

export const MainContentWrapper = ({ children }: MainContentWrapperProps) => {
  return (
    <div
      className={css({
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'safe center',
        pt: '5.25rem',
        width: '100%',
        px: '1.5rem',
        boxSizing: 'border-box',
        overflowX: 'auto',
      })}
    >
      {children}
    </div>
  );
};
