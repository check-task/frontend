'use client';

import { useState } from 'react';
import { PlusButton } from '@/components/PlusButton';
import { css } from 'styled-system/css';
import { useModalStore } from '@/stores/modal-store';
import { TeamCommunicationModal } from './TeamCommunicationModal';

interface CommunicationItem {
  id: number;
  name: string;
  url: string;
}

export const TeamEtc = () => {
  const { openModal, closeModal } = useModalStore();
  const [communications, setCommunications] = useState<CommunicationItem[]>([]);

  const handleOpenCommunicationModal = () => {
    openModal({
      title: '커뮤니케이션 추가',
      content: (
        <TeamCommunicationModal
          onSave={(items) => {
            setCommunications((prev) => [...prev, ...items]);
            closeModal();
          }}
        />
      ),
    });
  };

  return (
    <div className={etcContainerStyle}>
      <div className={etcTypeContainerStyle}>
        <div className={etcTypeTitleStyle}>
          <p className={etcTitleStyle}>커뮤니케이션</p>
          <PlusButton onClick={handleOpenCommunicationModal}>
            커뮤니케이션 추가
          </PlusButton>
        </div>

        <div className={etcCardContainerStyle}>
          {communications.length > 0 ? (
            communications.map((item) => (
              <div key={item.id} className={etcCardStyle}>
                <p className={cardTitleStyle}>{item.name}</p>
                <p className={cardContentStyle}>{item.url}</p>
              </div>
            ))
          ) : (
            <div className={etcCardStyle}>
              <p className={cardTitleStyle}>웬투밋 추가</p>
              <p className={cardContentStyle}>내용내용내용</p>
            </div>
          )}
        </div>
      </div>

      <div className={etcTypeContainerStyle}>
        <div className={etcTypeTitleStyle}>
          <p className={etcTitleStyle}>회의록 모음집</p>
          <PlusButton>회의록 추가</PlusButton>
        </div>

        <div className={etcCardContainerStyle}>
          <div className={etcCardStyle}>
            <p className={cardTitleStyle}>웬투밋 추가</p>
            <p className={cardContentStyle}>내용내용내용</p>
          </div>
        </div>
      </div>

      <div className={etcTypeContainerStyle}>
        <div className={etcTypeTitleStyle}>
          <p className={etcTitleStyle}>자료 모음집</p>
          <PlusButton>자료 추가</PlusButton>
        </div>

        <div className={etcCardContainerStyle}>
          <div className={etcCardStyle}>
            <p className={cardTitleStyle}>웬투밋 추가</p>
            <p className={cardContentStyle}>내용내용내용</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const etcContainerStyle = css({
  display: 'flex',
  flex: '3',
  gap: '1.25rem',
  width: '100%',
});

const etcTypeContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  width: '100%',
});

const etcTypeTitleStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
});

const etcCardContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
});

const etcCardStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  p: '1rem',
  bg: 'blue.50',
  borderRadius: '0.5rem',
  width: '100%',
  shadow: '0px 1px 4px 0px #00000029',
});

const cardTitleStyle = css({
  textStyle: 'body2.r',
  color: 'gray.900',
});

const cardContentStyle = css({
  textStyle: 'body3.r',
  color: 'gray.600',
  textDecoration: 'underline',
});

const etcTitleStyle = css({
  textStyle: 'h4',
  color: 'gray.900',
});
