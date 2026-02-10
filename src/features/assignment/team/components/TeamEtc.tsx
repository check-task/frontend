'use client';

import { useState } from 'react';
import { PlusButton } from '@/components/PlusButton';
import { css } from 'styled-system/css';
import { useModalStore } from '@/stores/modal-store';
import { TeamCommunicationModal } from './TeamCommunicationModal';
import { TeamCommunicationEditModal } from './TeamCommunicationEditModal';
import { AddAssignmentDataModal } from '@/features/assignment/components/AddAssignmentDataModal';
import { CommunicationEditIcon } from '@/components/icons/CommunicationEditIcon';
import { CommunicationDeleteIcon } from '@/components/icons/CommunicationDeleteIcon';
import { useDeleteCommunication } from '@/hooks/mutations/useDeleteCommunication';
import type {
  TaskReference,
  TaskCommunication,
  TaskMeetingLog,
} from '@/types/task';

interface DataItem {
  id: number;
  type: 0 | 1;
  name: string;
  path: string;
}

interface TeamEtcProps {
  taskId: number;
  references?: TaskReference[];
  communications?: TaskCommunication[];
  meetingLogs?: TaskMeetingLog[];
}

export const TeamEtc = ({
  taskId,
  references = [],
  communications = [],
  meetingLogs = [],
}: TeamEtcProps) => {
  const { openModal, closeModal } = useModalStore();
  const { mutate: deleteCommunication } = useDeleteCommunication(taskId);
  const [dataItems, setDataItems] = useState<DataItem[]>(() =>
    references.map((r, i) => ({
      id: i + 1,
      type: 0 as const,
      name: r.name,
      path: r.url,
    })),
  );

  const handleOpenCommunicationModal = () => {
    openModal({
      title: '커뮤니케이션 추가',
      content: (
        <TeamCommunicationModal
          taskId={taskId}
          onSave={() => {
            closeModal();
          }}
        />
      ),
    });
  };

  const handleOpenEditModal = (item: TaskCommunication) => {
    openModal({
      title: '커뮤니케이션 수정',
      content: (
        <TeamCommunicationEditModal
          taskId={taskId}
          communicationId={item.communicationId ?? 0}
          initialName={item.name}
          initialUrl={item.url}
          onSuccess={() => closeModal()}
        />
      ),
    });
  };

  const handleDeleteCommunication = (item: TaskCommunication) => {
    if (item.communicationId == null) return;
    deleteCommunication(item.communicationId);
  };

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
    <div className={etcContainerStyle}>
      <div className={etcTypeContainerStyle}>
        <div className={etcTypeTitleStyle}>
          <p className={etcTitleStyle}>커뮤니케이션</p>
          <PlusButton onClick={handleOpenCommunicationModal}>
            커뮤니케이션 추가
          </PlusButton>
        </div>

        <div className={etcCardContainerStyle}>
          {communications.map((item, index) => (
            <div
              key={`comm-${index}-${item.name}-${item.url}-${item.communicationId ?? ''}`}
              className={communicationCardStyle}
            >
              <div className={communicationHeaderStyle}>
                <p className={cardTitleStyle}>{item.name}</p>
                <div className={communicationIconGroupStyle} data-comm-icons>
                  <button
                    type='button'
                    className={communicationIconButtonStyle}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenEditModal(item);
                    }}
                    aria-label='커뮤니케이션 수정'
                  >
                    <CommunicationEditIcon />
                  </button>
                  <button
                    type='button'
                    className={communicationIconButtonStyle}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteCommunication(item);
                    }}
                    aria-label='커뮤니케이션 삭제'
                  >
                    <CommunicationDeleteIcon />
                  </button>
                </div>
              </div>
              <p className={cardContentStyle}>{item.url}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={etcTypeContainerStyle}>
        <div className={etcTypeTitleStyle}>
          <p className={etcTitleStyle}>회의록 모음집</p>
          <PlusButton>회의록 추가</PlusButton>
        </div>

        <div className={etcCardContainerStyle}>
          {meetingLogs.map((item, index) => (
            <div
              key={`log-${index}-${item.name ?? ''}-${item.url ?? ''}`}
              className={etcCardStyle}
            >
              {item.name != null && (
                <p className={cardTitleStyle}>{item.name}</p>
              )}
              {item.url != null && (
                <p className={cardContentStyle}>{item.url}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={etcTypeContainerStyle}>
        <div className={etcTypeTitleStyle}>
          <p className={etcTitleStyle}>자료 모음집</p>
          <PlusButton onClick={handleOpenDataModal}>자료 추가</PlusButton>
        </div>

        <div className={etcCardContainerStyle}>
          {dataItems.map((item) => (
            <div key={item.id} className={etcCardStyle}>
              <p className={cardTitleStyle}>{item.name}</p>
              <p className={cardContentStyle}>{item.path}</p>
            </div>
          ))}
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

// 커뮤니케이션 카드
const communicationIconGroupStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  opacity: 0,
  transition: 'opacity 0.2s ease',
});

const communicationCardStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  p: '1rem',
  bg: 'blue.50',
  borderRadius: '0.5rem',
  width: '100%',
  shadow: '0px 1px 4px 0px #00000029',
  _hover: {
    '& [data-comm-icons]': {
      opacity: 1,
    },
  },
});

const communicationHeaderStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
});

const communicationIconButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  padding: 0,
  border: 'none',
  background: 'transparent',
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
