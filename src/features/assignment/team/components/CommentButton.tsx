'use client';

import { useState } from 'react';
import { CommentIcon } from '@/components/icons/CommentIcon';
import { css, cx } from 'styled-system/css';

export const CommentButton = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <button
      className={cx(commentButtonStyle, isClicked && clickedStyle)}
      onClick={handleClick}
    >
      <CommentIcon />
      <p className={css({ textStyle: 'body2.r', color: 'blue.500' })}>1</p>
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
