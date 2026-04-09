'use client';

import { CommentIcon } from '@/components/icons/CommentIcon';
import { css, cx, cva } from 'styled-system/css';

interface CommentButtonProps {
  isOpen?: boolean;
  onClick?: () => void;
  commentCount?: number;
  muted?: boolean;
}

export const CommentButton = ({
  isOpen = false,
  onClick,
  commentCount = 0,
  muted = false,
}: CommentButtonProps) => {
  return (
    <button
      className={cx(commentButtonStyle({ muted }), isOpen && clickedStyle)}
      onClick={onClick}
    >
      <CommentIcon color={muted ? 'gray.400' : commentCount > 0 ? 'blue.500' : 'blue.300'} />
      <p className={css({ textStyle: 'body2.r', color: muted ? 'gray.400' : commentCount > 0 ? 'blue.500' : 'blue.300' })}>
        {commentCount}
      </p>
    </button>
  );
};

const commentButtonStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.25rem',
    pl: '0.75rem',
    pr: '1rem',
    py: '0.5rem',
    borderRadius: '2.5rem',
    cursor: 'pointer',
    transition: 'border-color 0.1s ease-out',
  },
  variants: {
    muted: {
      true: { bg: 'gray.0' },
      false: { bg: 'blue.50' },
    },
  },
  defaultVariants: { muted: false },
});

const clickedStyle = css({
  border: '0.0625rem solid',
  borderColor: 'blue.500',
});
