'use client';

import { useState } from 'react';
import { css, cva } from 'styled-system/css';
import { token } from 'styled-system/tokens';
import { AssignmentIcon } from '@/components/icons/AssignmentIcon';
import { FilterIcon } from '@/components/icons/FilterIcon';
import { CheckCircleIcon } from '@/components/icons/CheckCircleIcon';
import { DUMMY_FOLDERS } from '@/constants/folders';
import type { Folder } from '@/types/folder';
import { folderColorToHex } from '@/lib/folder-color';
import { useClickOutside } from '@/hooks/useClickOutside';

interface FolderFilterDropdownProps {
  folders?: Folder[];
  onSelectionChange?: (selectedIds: number[] | null) => void;
}

export const FolderFilterDropdown = ({
  folders = DUMMY_FOLDERS,
  onSelectionChange,
}: FolderFilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false));
  // null = 전체 선택 (folders 로드 시점과 무관하게 항상 "전체"를 의미)
  const [selectedIds, setSelectedIds] = useState<Set<number> | null>(null);
  const isAllSelected = selectedIds === null;
  const isFolderSelected = (folderId: number) =>
    isAllSelected || selectedIds.has(folderId);
  const triggerFolder = isAllSelected
    ? null
    : (folders.find((f) => selectedIds.has(f.id)) ?? null);

  const applySelection = (next: Set<number>) => {
    const finalSet = next.size === 0 || next.size === folders.length ? null : next;
    setSelectedIds(finalSet);
    onSelectionChange?.(finalSet ? Array.from(finalSet) : null);
  };

  const handleSelectAll = () => {
    applySelection(new Set(folders.map((f) => f.id)));
  };

  const handleToggleFolder = (folderId: number) => {
    const next = new Set(
      selectedIds ?? folders.map((f) => f.id),
    );
    if (next.has(folderId)) {
      next.delete(folderId);
    } else {
      next.add(folderId);
    }
    applySelection(next);
  };

  return (
    <div ref={containerRef} className={containerStyle}>
      <button
        type='button'
        className={triggerStyle}
        onClick={() => setIsOpen((v) => !v)}
      >
        <div className={triggerLeftStyle}>
          {triggerFolder ? (
            <div
              className={dotStyle}
              style={{ backgroundColor: folderColorToHex(triggerFolder.color) }}
            />
          ) : (
            <AssignmentIcon size={20} color={token('colors.gray.800')} />
          )}
          <span className={triggerTextStyle}>
            {triggerFolder ? `${triggerFolder.name} 외` : '모든 과제'}
          </span>
        </div>
        <FilterIcon />
      </button>

      {/* 드롭다운 부분 */}
      <div className={dropdownWrapperStyle({ open: isOpen })}>
        <button
          type='button'
          className={itemStyle({ position: 'first', selected: isAllSelected })}
          onClick={handleSelectAll}
        >
          <div className={itemLeftStyle}>
            <AssignmentIcon size={16} color={token('colors.gray.800')} />
            <span className={itemTextStyle}>모든 과제</span>
          </div>
          {isAllSelected && <CheckCircleIcon size={20} style={{ marginLeft: '0.25rem' }} />}
        </button>

        {folders.map((folder, index) => {
          const isSelected = isFolderSelected(folder.id);
          return (
            <button
              key={folder.id}
              type='button'
              className={itemStyle({
                position: index === folders.length - 1 ? 'last' : 'middle',
                selected: isSelected,
              })}
              onClick={() => handleToggleFolder(folder.id)}
            >
              <div className={itemLeftStyle}>
                <div
                  className={dotStyle}
                  style={{ backgroundColor: folderColorToHex(folder.color) }}
                />
                <span className={itemTextStyle}>{folder.name}</span>
              </div>
              {isSelected && <CheckCircleIcon size={20} style={{ marginLeft: '0.25rem' }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const containerStyle = css({
  position: 'relative',
  display: 'inline-block',
  textAlign: 'center',
});

const triggerStyle = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-end',
  gap: '0.875rem',
  padding: '0.5rem 0.75rem',
  borderRadius: '6.25rem',
  background: 'gray.0',
  boxShadow: '0px 1px 4px 0px rgba(9, 10, 11, 0.08)',
  cursor: 'pointer',
  border: 'none',
});

const triggerLeftStyle = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.25rem',
});

const triggerTextStyle = css({
  textStyle: 'body2.r',
  color: 'gray.800',
  whiteSpace: 'nowrap',
});

const dropdownWrapperStyle = cva({
  base: {
    position: 'absolute',
    top: 'calc(100% + 0.5rem)',
    right: '0',
    width: '7.875rem',
    background: 'gray.0',
    borderRadius: '0.75rem',
    boxShadow: '0px 2px 12px 0px rgba(0, 0, 0, 0.12)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    zIndex: 10,
    transition: 'opacity 0.3s ease-out',
    pointerEvents: 'none',
    opacity: 0,
  },
  variants: {
    open: {
      true: {
        opacity: 1,
        pointerEvents: 'auto',
      },
    },
  },
});

const itemStyle = cva({
  base: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0.5rem',
    width: '100%',
    height: '2.125rem',
    background: 'gray.0',
    border: 'none',
    cursor: 'pointer',
    textAlign: 'left',
  },
  variants: {
    position: {
      first: {
        borderRadius: '0.75rem 0.75rem 0 0',
        borderBottom: '1px solid',
        borderBottomColor: 'gray.100',
      },
      middle: {
        borderRadius: '0',
      },
      last: {
        borderRadius: '0 0 0.75rem 0.75rem',
      },
    },
    selected: {
      true: {
        justifyContent: 'space-between',
      },
    },
  },
});

const itemLeftStyle = css({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '0.25rem',
  minWidth: 0,
});

const dotStyle = css({
  width: '1rem',
  height: '1rem',
  borderRadius: '50%',
  flexShrink: 0,
});

const itemTextStyle = css({
  textStyle: 'body4.r',
  color: 'gray.700',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});
