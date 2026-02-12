'use client';

import { useMemo } from 'react';
import { styled } from 'styled-system/jsx';
import { hstack } from 'styled-system/patterns';
import { FolderColor } from '@/types/folder';

interface Assignment {
  folderId: number;
  folderName: string;
  folderColor: FolderColor;
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
  // 중복 제거 + folderId 기준 고정 순서 정렬
  const folders = useMemo(() => {
    const seen = new Set<number>();
    return assignments
      .filter((a) => {
        if (seen.has(a.folderId)) return false;
        seen.add(a.folderId);
        return true;
      })
      .sort((a, b) => a.folderId - b.folderId);
  }, [assignments]);

  // 폴더 선택/해제 토글
  const toggleFolder = (folderId: number) => {
    const next = selectedIds.includes(folderId)
      ? selectedIds.filter((id) => id !== folderId)
      : [...selectedIds, folderId];
    onSelectionChange?.(next);
  };

  return (
    <Container>
      {folders.map((folder) => (
        <FilterChip
          key={folder.folderId}
          color={folder.folderColor}
          active={selectedIds.includes(folder.folderId)}
          onClick={() => toggleFolder(folder.folderId)}
        >
          {folder.folderName}
        </FilterChip>
      ))}
    </Container>
  );
};

interface FilterChipProps {
  children: React.ReactNode;
  color: FolderColor;
  active?: boolean;
  onClick?: () => void;
}

const FilterChip = ({
  children,
  color,
  active = false,
  onClick,
}: FilterChipProps) => (
  <Chip.Wrapper active={active} color={color} onClick={onClick}>
    <Chip.Dot active={active} />
    <Chip.Text active={active}>{children}</Chip.Text>
  </Chip.Wrapper>
);

const Container = styled('div', {
  base: hstack.raw({
    gap: '0.25rem',
    flexWrap: 'wrap',
  }),
});

const Chip = {
  Wrapper: styled('div', {
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
      },
      active: {
        true: { borderColor: 'var(--chip-color-100)' },
        false: { borderColor: 'var(--chip-color-40)' },
      },
    },
    defaultVariants: {
      active: false,
    },
  }),
  Dot: styled('div', {
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
  }),
  Text: styled('span', {
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
  }),
};
