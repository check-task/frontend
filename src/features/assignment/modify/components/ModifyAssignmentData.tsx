'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/TextField';
import { PlusButton } from '@/components/PlusButton';
import { useModalStore } from '@/stores/modal-store';
import { ModifyAssignmentDataModal } from './ModifyAssignmentDataModal';
import { css } from 'styled-system/css';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { EditAssignmentDataCardModal } from '../../components/EditAssignmentDataCardModal';
import { ConfirmDeleteAssignmentDataModal } from '../../components/ConfirmDeleteAssginmentDataModal';

export interface ModifyDataItem {
  id: number;
  type: 0 | 1; // 0: URL, 1: 파일
  name: string;
  path: string;
  file?: File;
}

interface ModifyAssignmentDataProps {
  initialItems?: ModifyDataItem[];
  taskId?: number;
  onItemsChange?: (items: ModifyDataItem[]) => void;
}

export const ModifyAssignmentData = ({
  initialItems,
  taskId,
  onItemsChange,
}: ModifyAssignmentDataProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const [dataItems, setDataItems] = useState<ModifyDataItem[]>([]);
  const tempIdRef = useRef(0);
  const lastSyncKeyRef = useRef<string | null>(null);

  const ensureUniqueIds = (items: ModifyDataItem[]) => {
    const used = new Set<number>();
    const nextTempId = () => {
      tempIdRef.current += 1;
      return -tempIdRef.current;
    };
    return items.map((item) => {
      const incomingId = Number.isFinite(item.id) ? item.id : nextTempId();
      const safeId = used.has(incomingId) ? nextTempId() : incomingId;
      used.add(safeId);
      return { ...item, id: safeId };
    });
  };

  const normalizeItems = (items: ModifyDataItem[]) => {
    const byKey = new Map<string, ModifyDataItem>();

    const normalizeText = (value: string) => value.trim().toLowerCase();
    const normalizePath = (value: string) => normalizeText(value);

    items.forEach((item) => {
      const hasValidId = Number.isFinite(item.id) && item.id > 0;
      const nameKey = normalizeText(item.name);
      const pathKey = normalizePath(item.path);
      const preferredKey =
        item.type === 0 && pathKey
          ? `url:${pathKey}`
          : item.type === 1 && (nameKey || pathKey)
            ? `file:${nameKey}:${pathKey}`
            : hasValidId
              ? `id:${item.id}`
              : `sig:${item.type}:${nameKey}:${pathKey}`;

      const existing = byKey.get(preferredKey);
      if (!existing) {
        byKey.set(preferredKey, item);
        return;
      }

      const existingId = Number.isFinite(existing.id) ? existing.id : -1;
      const nextId = Number.isFinite(item.id) ? item.id : -1;
      const pick = nextId > 0 && existingId <= 0 ? item : existing;
      byKey.set(preferredKey, pick);
    });

    const usedIds = new Set<number>();
    const getTempId = () => {
      tempIdRef.current += 1;
      return -tempIdRef.current;
    };

    return Array.from(byKey.values()).map((item) => {
      const hasValidId = Number.isFinite(item.id) && item.id > 0;
      const incomingId = hasValidId
        ? item.id
        : Number.isFinite(item.id) && item.id < 0
          ? item.id
          : getTempId();
      const safeId = usedIds.has(incomingId) ? getTempId() : incomingId;
      usedIds.add(safeId);
      return { ...item, id: safeId };
    });
  };

  useEffect(() => {
    if (taskId == null || initialItems === undefined) return;
    const localItems = dataItems.filter((item) => item.id < 0);
    const nextItems = normalizeItems([...initialItems, ...localItems]);
    const nextKey = nextItems
      .map((item) => `${item.id}|${item.type}|${item.name}|${item.path}`)
      .join('||');
    if (lastSyncKeyRef.current === nextKey) return;
    lastSyncKeyRef.current = nextKey;
    setDataItems(nextItems);
  }, [initialItems, taskId]);

  useEffect(() => {
    onItemsChange?.(dataItems);
  }, [dataItems, onItemsChange]);

  // 자료 모음집 추가 모달 핸들러
  const handleAddData = () => {
    openModal({
      title: '자료 추가',
      content: (
        <ModifyAssignmentDataModal
          onSave={(items) => {
            setDataItems((prev) =>
              normalizeItems(ensureUniqueIds([...prev, ...items])),
            );
            closeModal();
          }}
        />
      ),
    });
  };

  // 자료 수정 핸들러
  const handleUpdateData = (
    id: number,
    updated: { name: string; path: string },
  ) => {
    setDataItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item)),
    );
  };

  // 자료 수정 모달 열림 핸들러
  const handleOpenEditModal = (item: ModifyDataItem) => {
    openModal({
      title: '자료 수정',
      content: (
        <EditAssignmentDataCardModal
          type={item.type} // 0,1 형태에 따라 파일 url 문구 다르게
          defaultValue={{ name: item.name, path: item.path }}
          onSave={(updated) => {
            handleUpdateData(item.id, updated); // 수정된 내용 반영
            closeModal();
          }}
        />
      ),
    });
  };

  // 자료 삭제 핸들러
  const handleRemoveData = (id: number) => {
    setDataItems((prev) => prev.filter((item) => item.id !== id));
  };

  // 자료 삭제 모달 열림 핸들러
  const handleOpenDeleteModal = (item: ModifyDataItem) => {
    openModal({
      title: '자료 삭제',
      headerType: 'none',
      content: (
        <ConfirmDeleteAssignmentDataModal
          highlightText={item.name || item.path}
          onConfirm={() => {
            handleRemoveData(item.id);
            closeModal();
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  return (
    <div className={taskDataItemStyle}>
      <p className={labelTextStyle}>자료</p>
      <div className={dataContainerStyle}>
        {dataItems.map((item) => (
          <div key={item.id} className={dataItemStyle}>
            <p className={dataNameStyle}>{item.name}</p>
            <div
              className={css({
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.5rem',
              })}
            >
              <Input
                size='basic'
                className={css({ flex: 1, cursor: 'pointer' })}
                value={item.path}
                readOnly
                onClick={() => handleOpenEditModal(item)}
              />
              <button
                type='button'
                className={removeButtonStyle}
                onClick={() => handleOpenDeleteModal(item)}
                aria-label='자료 삭제'
              >
                <CloseIcon size='2rem' color='gray.600' />
              </button>
            </div>
          </div>
        ))}
        <div className={buttonWrapperStyle}>
          <PlusButton onClick={handleAddData}>자료 추가하기</PlusButton>
        </div>
      </div>
    </div>
  );
};

const labelTextStyle = css({
  textStyle: 'body1.m',
  color: 'gray.900',
});

const taskDataItemStyle = css({
  display: 'flex',
  gap: '2rem',
  alignItems: 'flex-start',
});

const dataContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  flex: 1,
});

const dataItemStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  width: '100%',
  ml: '1rem',
});

const dataNameStyle = css({
  textStyle: 'body1.r',
  color: 'gray.800',
});

// 자료 삭제 버튼 스타일 추가
const removeButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  _hover: {
    cursor: 'pointer',
  },
});

const buttonWrapperStyle = css({
  display: 'flex',
  width: 'fit-content',
  ml: '1rem',
});
