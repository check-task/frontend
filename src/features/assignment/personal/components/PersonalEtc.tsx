'use client';

import { useState } from 'react';
import { PlusButton } from '@/components/PlusButton';
import { css } from 'styled-system/css';
import { useModalStore } from '@/stores/modal-store';
import { AddAssignmentDataModal } from '@/features/assignment/components/AddAssignmentDataModal';
import { AssignmentDataCard } from '@/features/assignment/components/AssignmentDataCard'; // 공용 컴포넌트 임포트

interface DataItem {
  id: number;
  type: 0 | 1;
  name: string;
  path: string;
}

export const PersonalEtc = () => {
  // close 저장 누를 때 닫으려면 필요
  const { openModal, closeModal } = useModalStore();
  // 더미데이터로 초기 상태 세팅
  const [dataItems, setDataItems] = useState<DataItem[]>(DUMMY_DATA);

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

  return (
    <div className={etcTypeContainerStyle}>
      <div className={etcTypeTitleStyle}>
        <p className={etcTitleStyle}>자료 모음집</p>
        <PlusButton onClick={handleOpenDataModal}>자료 추가</PlusButton>
      </div>

      <div className={etcCardContainerStyle}>
        {dataItems.map((item) => (
          <AssignmentDataCard key={item.id} name={item.name} path={item.path} />
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

// ======== 더미 데이터 ========
const DUMMY_DATA: DataItem[] = [
  { id: 1, type: 0, name: '이클래스', path: 'https://class.tukorea.ac.kr/' },
  { id: 2, type: 1, name: '과제 공지 자료', path: '프로그래밍 제1차 과제.pdf' },
  { id: 3, type: 1, name: '선행연구', path: 'FIFO알고리즘의효과에대하여.pdf' },
];
