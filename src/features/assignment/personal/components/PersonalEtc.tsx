'use client';

import { useEffect, useState } from 'react';
import { PlusButton } from '@/components/PlusButton';
import { css } from 'styled-system/css';
import { useModalStore } from '@/stores/modal-store';
import { AddAssignmentDataModal } from '@/features/assignment/components/AddAssignmentDataModal';
import { AssignmentDataCard } from '@/features/assignment/components/AssignmentDataCard'; // 공용 컴포넌트 임포트
import { EditAssignmentDataCardModal } from '../../components/EditAssignmentDataCardModal';
import { ConfirmDeleteAssignmentDataModal } from '../../components/ConfirmDeleteAssginmentDataModal';
import type { ReferenceItem } from './PersonalRightContainer';

interface PersonalEtcProps {
  items: ReferenceItem[];
}

export const PersonalEtc = ({ items }: PersonalEtcProps) => {
  // close 저장 누를 때 닫으려면 필요
  const { openModal, closeModal } = useModalStore();
  const [dataItems, setDataItems] = useState<ReferenceItem[]>(items);

  useEffect(() => {
    setDataItems(items);
  }, [items]);

  // 자료 모음집 추가 모달 핸들러
  const handleOpenDataModal = () => {
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
  const handleEdit = (item: ReferenceItem) => {
    openModal({
      title: '자료 수정',
      content: (
        <EditAssignmentDataCardModal
          type={item.type} // 타입 전달 0,1 형태에 따라 문구 다르게
          defaultValue={{ name: item.name, path: item.path }} // 이미 작성되어 있던 기본값
          onSave={(updated) => {
            setDataItems((prev) =>
              prev.map((data) =>
                // 수정된 id이면 기존값은 그대로에 업데이트 된 내용만 덮어씀
                data.id === item.id ? { ...data, ...updated } : data,
              ),
            );
            closeModal();
          }}
        />
      ),
    });
  };

  // 자료 삭제 핸들러
  const handleDelete = (item: ReferenceItem) => {
    openModal({
      title: '자료 삭제',
      headerType: 'none',
      content: (
        <ConfirmDeleteAssignmentDataModal
          highlightText='자료명(파일명.확장자 or URL 경로)'
          onConfirm={() => {
            setDataItems((prev) => prev.filter((data) => data.id !== item.id));
            closeModal();
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  return (
    <div className={etcTypeContainerStyle}>
      <div className={etcTypeTitleStyle}>
        <p className={etcTitleStyle}>자료 모음집</p>
        <PlusButton onClick={handleOpenDataModal}>자료 추가</PlusButton>
      </div>

      <div className={etcCardContainerStyle}>
        {dataItems.map((item) => (
          <AssignmentDataCard
            key={item.id}
            name={item.name}
            path={item.path}
            onEdit={() => handleEdit(item)}
            onDelete={() => handleDelete(item)}
          />
        ))}
      </div>
    </div>
  );
};

// ======== 스타일 정의 ========
const etcTypeContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem', // 제목이랑 카드 컴포넌트 사이 간격
  width: '24.125rem', // 여기를 고정해야 카드가 맞게 들어감
});

const etcTypeTitleStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

// '자료 모음집' 제목
const etcTitleStyle = css({
  textStyle: 'h4',
  color: 'gray.900',
});

const etcCardContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
});
