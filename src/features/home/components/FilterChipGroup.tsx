'use client';

import { useState } from 'react';
import { styled } from 'styled-system/jsx';
import { hstack } from 'styled-system/patterns';
import { FolderColor } from '@/types/folder';

export interface FolderItem {
  id: string;
  name: string;
  color: FolderColor;
}

interface FilterChipGroupProps {
  folders: FolderItem[];
  defaultSelected?: string[];
  onSelectionChange?: (selectedIds: string[]) => void;
}

export const FilterChipGroup = ({
  folders,
  defaultSelected = [],
  onSelectionChange,
}: FilterChipGroupProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelected);

  // 폴더 선택/해제 토글
  const toggleFolder = (folderId: string) => {
    const next = selectedIds.includes(folderId)
      ? selectedIds.filter((id) => id !== folderId)
      : [...selectedIds, folderId];
    setSelectedIds(next);
    onSelectionChange?.(next);
  };

  return (
    <Container>
      {folders.map((folder) => (
        <FilterChip
          key={folder.id}
          color={folder.color}
          active={selectedIds.includes(folder.id)}
          onClick={() => toggleFolder(folder.id)}
        >
          {folder.name}
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
