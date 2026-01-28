'use client';

import { CommentIcon } from '@/components/icons/CommentIcon';
import { css, cx } from 'styled-system/css';

interface CommentButtonProps {
  isOpen?: boolean;
  onClick?: () => void;
  commentCount?: number;
}

export const CommentButton = ({
  isOpen = false,
  onClick,
  commentCount = 0,
}: CommentButtonProps) => {
  return (
    <button
      className={cx(commentButtonStyle, isOpen && clickedStyle)}
      onClick={onClick}
    >
      <CommentIcon />
      <p className={css({ textStyle: 'body2.r', color: 'blue.500' })}>
        {commentCount}
      </p>
    </button>
  );
};

const commentButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.25rem',
  width: '4.25rem',
  height: '2.25rem',
  bg: 'blue.50',
  borderRadius: '2.5rem',
  cursor: 'pointer',
  transition: 'border-color 0.1s ease-out',
});

const clickedStyle = css({
  border: '0.0625rem solid',
  borderColor: 'blue.500',
});
