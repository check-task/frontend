'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/TextField';
import { PlusButton } from '@/components/PlusButton';
import { useModalStore } from '@/stores/modal-store';
import { AddAssignmentDataModal } from '../../components/AddAssignmentDataModal';
import { css } from 'styled-system/css';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { EditAssignmentDataCardModal } from '../../components/EditAssignmentDataCardModal';
import { ConfirmDeleteAssignmentDataModal } from '../../components/ConfirmDeleteAssginmentDataModal';

interface DataItem {
  id: number;
  type: 0 | 1; // 0: URL, 1: 파일
  name: string;
  path: string;
}

interface ModifyAssignmentDataProps {
  initialItems?: DataItem[];
  taskId?: number;
}

export const ModifyAssignmentData = ({
  initialItems,
  taskId,
}: ModifyAssignmentDataProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);
  const [dataItems, setDataItems] = useState<DataItem[]>([]);
  const [initializedTaskId, setInitializedTaskId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    if (taskId == null || initialItems === undefined) return;
    if (initializedTaskId === taskId) return;
    setDataItems(initialItems);
    setInitializedTaskId(taskId);
  }, [initialItems, initializedTaskId, taskId]);

  // 자료 모음집 추가 모달 핸들러
  const handleAddData = () => {
    openModal({
      title: '자료 추가',
      content: (
        <AddAssignmentDataModal
          onSave={(items) => {
            setDataItems((prev) => [...prev, ...items]);
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
  const handleOpenEditModal = (item: DataItem) => {
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
  const handleOpenDeleteModal = (item: DataItem) => {
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
