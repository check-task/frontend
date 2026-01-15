import { css, cx } from 'styled-system/css';

interface DividerProps {
  mt?: string;
  mb?: string;
  className?: string;
}

export const Divider = ({ mt, mb, className }: DividerProps) => {
  return (
    <div
      className={cx(
        dividerBaseStyle,
        css({
          mt: mt,
          mb: mb,
        }),
        className,
      )}
    />
  );
};

const dividerBaseStyle = css({
  border: '0.0625rem solid',
  borderColor: 'gray.200',
  width: 'full',
});
