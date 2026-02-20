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
import { useDeleteMeetingLog } from '@/hooks/mutations/useDeleteMeetingLog';
import { MinutesModal } from './MinutesModal';
import { ReferenceEditModal } from './ReferenceEditModal';
import { useDeleteReferenceData } from '@/hooks/mutations/useDeleteReferenceData';
import { ConfirmDeleteAssignmentDataModal } from '@/features/assignment/components/ConfirmDeleteAssginmentDataModal';
import type {
  TaskReference,
  TaskCommunication,
  TaskMeetingLog,
} from '@/types/task';

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

  const toMMDD = (dateStr: string) =>
    dateStr && dateStr.length >= 10
      ? `${dateStr.slice(5, 7)}.${dateStr.slice(8, 10)}`
      : '';
  const { mutate: deleteCommunication } = useDeleteCommunication(taskId);
  const { mutate: deleteReference } = useDeleteReferenceData(taskId);
  const { mutate: deleteMeetingLog } = useDeleteMeetingLog(taskId);
  const [minutesModalOpen, setMinutesModalOpen] = useState(false);
  const [editingMeetingLog, setEditingMeetingLog] =
    useState<TaskMeetingLog | null>(null);

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
    openModal({
      title: '커뮤니케이션 삭제',
      headerType: 'none',
      content: (
        <ConfirmDeleteAssignmentDataModal
          highlightText={item.name}
          onConfirm={() => {
            deleteCommunication(item.communicationId!);
            closeModal();
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  const handleOpenReferenceEditModal = (ref: TaskReference) => {
    const referenceId = ref.referenceId ?? 0;
    openModal({
      title: '자료 수정',
      content: (
        <ReferenceEditModal
          taskId={taskId}
          referenceId={referenceId}
          initialName={ref.name}
          initialUrl={ref.url ?? ref.file_url ?? ''}
          onSuccess={() => closeModal()}
        />
      ),
    });
  };

  const handleDeleteReference = (ref: TaskReference) => {
    if (ref.referenceId == null) return;
    openModal({
      title: '자료 삭제',
      headerType: 'none',
      content: (
        <ConfirmDeleteAssignmentDataModal
          highlightText={ref.name}
          onConfirm={() => {
            deleteReference(ref.referenceId!);
            closeModal();
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  const getMeetingLogCardTitle = (item: TaskMeetingLog, index: number) =>
    toMMDD(item.date)
      ? `${toMMDD(item.date)} 회의록`
      : `${index + 1}주차 회의록`;

  const handleDeleteMeetingLog = (item: TaskMeetingLog, index: number) => {
    openModal({
      title: '회의록 삭제',
      headerType: 'none',
      content: (
        <ConfirmDeleteAssignmentDataModal
          highlightText={getMeetingLogCardTitle(item, index)}
          onConfirm={() => {
            deleteMeetingLog(item.logId);
            closeModal();
          }}
          onCancel={closeModal}
        />
      ),
    });
  };

  const handleOpenDataModal = () => {
    openModal({
      title: '자료 추가',
      content: (
        <AddAssignmentDataModal
          taskId={taskId}
          onSave={() => {
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
              {item.url ? (
                <a
                  href={
                    item.url.startsWith('http')
                      ? item.url
                      : `https://${item.url}`
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                  className={cardContentStyle}
                >
                  {item.url}
                </a>
              ) : (
                <p className={cardContentStyle}>{item.url}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className={etcTypeContainerStyle}>
        <div className={etcTypeTitleStyle}>
          <p className={etcTitleStyle}>회의록 모음집</p>
          <PlusButton
            onClick={() => {
              setEditingMeetingLog(null);
              setMinutesModalOpen(true);
            }}
          >
            회의록 추가
          </PlusButton>
        </div>

        <div className={etcCardContainerStyle}>
          {meetingLogs.map((item, index) => (
            <div
              key={`log-${item.logId}-${item.date}-${index}`}
              className={meetingLogCardStyle}
            >
              <div className={communicationHeaderStyle}>
                <p className={cardTitleStyle}>
                  {toMMDD(item.date)
                    ? `${toMMDD(item.date)} 회의록`
                    : `${index + 1}주차 회의록`}
                </p>
                <div
                  className={meetingLogIconGroupStyle}
                  data-meeting-log-icons
                >
                  <button
                    type='button'
                    className={communicationIconButtonStyle}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setEditingMeetingLog(item);
                      setMinutesModalOpen(true);
                    }}
                    aria-label='회의록 수정'
                  >
                    <CommunicationEditIcon />
                  </button>
                  <button
                    type='button'
                    className={communicationIconButtonStyle}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteMeetingLog(item, index);
                    }}
                    aria-label='회의록 삭제'
                  >
                    <CommunicationDeleteIcon />
                  </button>
                </div>
              </div>
              <button
                type='button'
                className={meetingLogDetailLinkStyle}
                onClick={() => {
                  setEditingMeetingLog(item);
                  setMinutesModalOpen(true);
                }}
              >
                자세히보기
              </button>
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
          {references.map((ref, index) => (
            <div
              key={`ref-${index}-${ref.name}-${ref.url ?? ref.file_url}`}
              className={referenceCardStyle}
            >
              <div className={communicationHeaderStyle}>
                <p className={cardTitleStyle}>{ref.name}</p>
                <div className={referenceIconGroupStyle} data-ref-icons>
                  <button
                    type='button'
                    className={communicationIconButtonStyle}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleOpenReferenceEditModal(ref);
                    }}
                    aria-label='자료 수정'
                  >
                    <CommunicationEditIcon />
                  </button>
                  <button
                    type='button'
                    className={communicationIconButtonStyle}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleDeleteReference(ref);
                    }}
                    aria-label='자료 삭제'
                  >
                    <CommunicationDeleteIcon />
                  </button>
                </div>
              </div>
              {(ref.url ?? ref.file_url) ? (
                <a
                  href={
                    (ref.url ?? ref.file_url)!.startsWith('http')
                      ? (ref.url ?? ref.file_url)!
                      : `https://${ref.url ?? ref.file_url}`
                  }
                  target='_blank'
                  rel='noopener noreferrer'
                  className={cardContentStyle}
                >
                  {ref.url ?? ref.file_url ?? ''}
                </a>
              ) : (
                <p className={cardContentStyle}>
                  {ref.url ?? ref.file_url ?? ''}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <MinutesModal
        key={minutesModalOpen ? (editingMeetingLog?.logId ?? 'new') : 'closed'}
        open={minutesModalOpen}
        onClose={() => {
          setMinutesModalOpen(false);
          setEditingMeetingLog(null);
        }}
        taskId={taskId}
        editLog={
          editingMeetingLog
            ? {
                logId: editingMeetingLog.logId,
                date: editingMeetingLog.date,
                agenda: editingMeetingLog.agenda ?? '',
                conclusion: editingMeetingLog.conclusion ?? '',
                discussion: editingMeetingLog.discussion ?? '',
              }
            : undefined
        }
        onSuccess={() => setMinutesModalOpen(false)}
      />
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

const meetingLogIconGroupStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  opacity: 0,
  transition: 'opacity 0.2s ease',
});

const meetingLogCardStyle = css({
  display: 'flex',
  flexDirection: 'column',
  // 간격 수정했습니다- 예원
  gap: '0.25rem',
  px: '1rem',
  py: '1.25rem',
  // 여기까지
  bg: 'blue.50',
  borderRadius: '0.5rem',
  width: '100%',
  shadow: '0px 1px 4px 0px #00000029',
  _hover: {
    '& [data-meeting-log-icons]': {
      opacity: 1,
    },
  },
});

// 커뮤니케이션 카드
const communicationIconGroupStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  opacity: 0,
  transition: 'opacity 0.2s ease',
});

const referenceIconGroupStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  opacity: 0,
  transition: 'opacity 0.2s ease',
});

const communicationCardStyle = css({
  display: 'flex',
  flexDirection: 'column',
  // 간격 수정했습니다- 예원
  gap: '0.25rem',
  px: '1rem',
  py: '1.25rem',
  // 여기까지
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

const referenceCardStyle = css({
  display: 'flex',
  flexDirection: 'column',
  // 간격 수정했습니다- 예원
  gap: '0.25rem',
  px: '1rem',
  py: '1.25rem',
  // 여기까지
  bg: 'blue.50',
  borderRadius: '0.5rem',
  width: '100%',
  shadow: '0px 1px 4px 0px #00000029',
  _hover: {
    '& [data-ref-icons]': {
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

const meetingLogDetailLinkStyle = css({
  textStyle: 'body3.r',
  color: 'gray.700',
  textDecoration: 'underline',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  textAlign: 'left',
});

const etcTitleStyle = css({
  textStyle: 'h4',
  color: 'gray.900',
});
