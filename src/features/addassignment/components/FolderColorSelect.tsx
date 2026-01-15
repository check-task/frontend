'use client';

import { useState, useEffect } from 'react';
import { css, cx } from 'styled-system/css';
import { CheckMark } from '@/components/icons/CheckMark';

const colors = [
  { id: '01', token: 'sub.01.100' },
  { id: '02', token: 'sub.02.100' },
  { id: '03', token: 'sub.03.100' },
  { id: '04', token: 'sub.04.100' },
  { id: '05', token: 'sub.05.100' },
] as const;

interface FolderColorSelectProps {
  value?: string;
  onChange?: (color: string) => void;
}

export const FolderColorSelect = ({
  value,
  onChange,
}: FolderColorSelectProps) => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>(value);

  useEffect(() => {
    setSelectedColor(value);
  }, [value]);

  const handleColorClick = (colorToken: string) => {
    const newValue = selectedColor === colorToken ? undefined : colorToken;
    setSelectedColor(newValue);
    onChange?.(newValue || '');
  };

  return (
    <div className={containerStyle}>
      {colors.map((color) => {
        const isSelected = selectedColor === color.token;
        return (
          <label key={color.id} className={labelStyle}>
            <input
              type='checkbox'
              checked={isSelected}
              onChange={() => handleColorClick(color.token)}
              className={cx('peer', hiddenInputStyle)}
            />
            <div
              className={css({
                width: '2rem',
                height: '2rem',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                bg: color.token,
                transition: 'transform 0.2s ease',
                // 아이콘의 기본 상태 정의
                '& svg': {
                  opacity: 0,
                  transform: 'scale(0.5)',
                  transition: 'all 0.1s ease-in-out',
                },
                // 체크되었을 때 스타일
                _peerChecked: {
                  '& svg': {
                    opacity: 1,
                    transform: 'scale(1)',
                  },
                },
              })}
            >
              <CheckMark variant='gray' />
            </div>
          </label>
        );
      })}
    </div>
  );
};

const containerStyle = css({
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
});

const labelStyle = css({
  cursor: 'pointer',
  display: 'inline-block',
});

const hiddenInputStyle = css({
  srOnly: true,
});
