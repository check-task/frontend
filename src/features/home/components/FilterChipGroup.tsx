'use client';

import { useMemo } from 'react';
import { cva, css } from 'styled-system/css';
import { hstack } from 'styled-system/patterns';
import { FolderColor } from '@/types/folder';

interface Assignment {
  folderId: number;
  folderName: string;
  folderColor: FolderColor;
  folderRank: number | null;
}

interface FilterChipGroupProps {
  assignments: Assignment[];
  selectedIds: number[];
  onSelectionChange?: (selectedIds: number[]) => void;
}

export const FilterChipGroup = ({
  assignments,
  selectedIds,
  onSelectionChange,
}: FilterChipGroupProps) => {
  // 중복 제거 + 폴더 순서 기준 정렬
  const folders = useMemo(() => {
    const seen = new Set<number>();
    return assignments
      .filter((a) => {
        if (seen.has(a.folderId)) return false;
        seen.add(a.folderId);
        return true;
      })
      .sort((a, b) => {
        const rankA = a.folderRank ?? Number.MAX_SAFE_INTEGER;
        const rankB = b.folderRank ?? Number.MAX_SAFE_INTEGER;

        if (rankA !== rankB) return rankA - rankB;
        return a.folderId - b.folderId;
      });
  }, [assignments]);

  // 폴더 선택/해제 토글
  const toggleFolder = (folderId: number) => {
    const next = selectedIds.includes(folderId)
      ? selectedIds.filter((id) => id !== folderId)
      : [...selectedIds, folderId];
    onSelectionChange?.(next);
  };

  return (
    <div className={containerStyle}>
      {folders.map((folder) => (
        <div
          key={folder.folderId}
          className={chipWrapperStyle({
            color: folder.folderColor,
            active: selectedIds.includes(folder.folderId),
          })}
          onClick={() => toggleFolder(folder.folderId)}
        >
          <div
            className={chipDotStyle({
              active: selectedIds.includes(folder.folderId),
            })}
          />
          <span
            className={chipTextStyle({
              active: selectedIds.includes(folder.folderId),
            })}
          >
            {folder.folderName}
          </span>
        </div>
      ))}
    </div>
  );
};

const containerStyle = css(
  hstack.raw({
    gap: '0.25rem',
    flexWrap: 'wrap',
  }),
);

const chipWrapperStyle = cva({
  base: hstack.raw({
    gap: '0.5rem',
    padding: '0.5rem 0.75rem',
    borderRadius: '6.25rem',
    border: '1px solid',
    cursor: 'pointer',
    maxWidth: '8.9875rem', // 캘린더 넓이 기준으로 5개 들어갈 수 있게
  }),
  variants: {
    color: {
      red: {
        '--chip-color-100': 'token(colors.sub.01.100)',
        '--chip-color-40': 'token(colors.sub.01.40)',
      },
      yellow: {
        '--chip-color-100': 'token(colors.sub.02.100)',
        '--chip-color-40': 'token(colors.sub.02.40)',
      },
      green: {
        '--chip-color-100': 'token(colors.sub.03.100)',
        '--chip-color-40': 'token(colors.sub.03.40)',
      },
      purple: {
        '--chip-color-100': 'token(colors.sub.04.100)',
        '--chip-color-40': 'token(colors.sub.04.40)',
      },
      black: {
        '--chip-color-100': 'token(colors.sub.05.100)',
        '--chip-color-40': 'token(colors.sub.05.40)',
      },
      null: {
        '--chip-color-100': 'token(colors.sub.null.100)',
        '--chip-color-40': 'token(colors.sub.null.40)',
      },
    },
    active: {
      true: { borderColor: 'var(--chip-color-100)' },
      false: { borderColor: 'var(--chip-color-40)' },
    },
  },
  defaultVariants: {
    active: false,
  },
});

const chipDotStyle = cva({
  base: {
    width: '1rem',
    height: '1rem',
    borderRadius: '50%',
    flexShrink: 0,
  },
  variants: {
    active: {
      true: { bg: 'var(--chip-color-100)' },
      false: { bg: 'var(--chip-color-40)' },
    },
  },
  defaultVariants: {
    active: false,
  },
});

const chipTextStyle = cva({
  base: {
    textStyle: 'body4.m',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  variants: {
    active: {
      true: { color: 'gray.900' },
      false: { color: 'gray.400' },
    },
  },
  defaultVariants: {
    active: false,
  },
});
