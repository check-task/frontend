'use client';

import { Input } from '@/components/TextField';
import { PlusButton } from '@/components/PlusButton';
import { useModalStore } from '@/stores/modal-store';
import { AddAssignmentDataModal } from '../../components/AddAssignmentDataModal';
import { css } from 'styled-system/css';

export interface DataItem {
  id: number;
  type: 0 | 1; // 0: URL, 1: 파일
  name: string;
  path: string;
}

interface AddAssignmentDataProps {
  dataItems: DataItem[];
  onDataItemsChange: (items: DataItem[]) => void;
  /** 있으면 모달에서 자료 생성 API 호출 */
  taskId?: number;
}

export const AddAssignmentData = ({
  dataItems,
  onDataItemsChange,
  taskId,
}: AddAssignmentDataProps) => {
  const openModal = useModalStore((state) => state.openModal);
  const closeModal = useModalStore((state) => state.closeModal);

  const handleAddData = () => {
    openModal({
      title: '자료 추가',
      content: (
        <AddAssignmentDataModal
          taskId={taskId}
          onSave={(items) => {
            onDataItemsChange([...dataItems, ...items]);
            closeModal();
          }}
        />
      ),
    });
  };

  const handleUpdatePath = (id: number, newPath: string) => {
    onDataItemsChange(
      dataItems.map((item) =>
        item.id === id ? { ...item, path: newPath } : item,
      ),
    );
  };

  return (
    <div className={taskDataItemStyle}>
      <p className={labelTextStyle}>자료</p>
      <div className={dataContainerStyle}>
        {dataItems.map((item) => (
          <div key={item.id} className={dataItemStyle}>
            <p className={dataNameStyle}>{item.name}</p>
            <Input
              size='basic'
              value={item.path}
              onChange={(e) => handleUpdatePath(item.id, e.target.value)}
            />
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

const buttonWrapperStyle = css({
  display: 'flex',
  width: 'fit-content',
  ml: '1rem',
});
