'use client';

import { Input } from '@/components/TextField';
import { PlusButton } from '@/components/PlusButton';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { useModalStore } from '@/stores/modal-store';
import { useAlertStore } from '@/stores/alert-store';
import { AddAssignmentDataModal } from '../../components/AddAssignmentDataModal';
import { css,cx } from 'styled-system/css';

export interface DataItem {
  id: number;
  type: 0 | 1; // 0: URL, 1: 파일
  name: string;
  path: string;
  file?: File;
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

  const handleLocalSave = (items: { type: 0 | 1; name: string; path: string; file?: File }[]) => {
    const newItems: DataItem[] = items.map((item) => ({
      id: Date.now() + Math.random(),
      type: item.type,
      name: item.name,
      path: item.path,
      file: item.file,
    }));
    onDataItemsChange([...dataItems, ...newItems]);
  };

  const handleAddData = () => {
    openModal({
      title: '자료 추가',
      content: (
        <AddAssignmentDataModal
          taskId={taskId}
          onSave={closeModal}
          onLocalSave={taskId ? undefined : handleLocalSave}
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

  const showAlert = useAlertStore((state) => state.showAlert);

  const handleRemoveData = (id: number) => {
    const item = dataItems.find((d) => d.id === id);
    onDataItemsChange(dataItems.filter((d) => d.id !== id));
    if (item) showAlert(`${item.name}가 삭제되었습니다`);
  };

  return (
    <div className={css({ display: 'flex', gap: '2rem', alignItems: dataItems.length > 0 ? 'flex-start' : 'center' })}>
      <p className={labelTextStyle}>자료</p>
      <div className={dataContainerStyle}>
        {dataItems.map((item) => (
          <div key={item.id} className={dataItemStyle}>
            <p className={dataNameStyle}>{item.name}</p>
            <div className={dataInputRowStyle}>
              <div className={css({ flex: 1 })}>
                <Input
                  size='basic'
                  value={item.path}
                  onChange={(e) => handleUpdatePath(item.id, e.target.value)}
                  className={css({ width: '100%' })}
                  readOnly
                />
              </div>
              <button
                type='button'
                onClick={() => handleRemoveData(item.id)}
                className={css({ cursor: 'pointer' })}
              >
                <CloseIcon size='2rem' color='gray.600' />
              </button>
            </div>
          </div>
        ))}
        <div className={cx(buttonWrapperStyle, css({ mt: dataItems.length > 0 ? '0.25rem' : '0' }))}>
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

const dataContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  flex: 1,
});

const dataItemStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  width: '100%',
  pl: '1rem',
});

const dataNameStyle = css({
  textStyle: 'body1.r',
  color: 'gray.800',
});

const buttonWrapperStyle = css({
  display: 'flex',
  width: 'fit-content',
  pl: '1rem',
});

const dataInputRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
});

