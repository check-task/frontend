'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { css } from 'styled-system/css';
import { center } from 'styled-system/patterns';
import { ModalCheckIcon } from '@/components/icons/ModalCheckIcon';
import { Divider } from '@/components/Divider';
import DatePicker from '@/components/DatePicker';
import { Textarea } from '@/components/TextField';
import { useCreateMeetingLog } from '@/hooks/mutations/useCreateMeetingLog';
import { useUpdateMeetingLog } from '@/hooks/mutations/useUpdateMeetingLog';

// Date → YYYY-MM-DD
function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

interface MinutesModalProps {
  open: boolean;
  onClose: () => void;
  taskId: number;
  /** 수정 모드일 때 전달 (상세 조회에 없을 수 있어 agenda/conclusion/discussion는 선택) */
  editLog?: {
    logId: number;
    date: string;
    agenda?: string;
    conclusion?: string;
    discussion?: string;
  };
  onSuccess?: () => void;
}

const overlayStyle = center({
  position: 'fixed',
  inset: 0,
  bg: 'rgba(0, 0, 0, 0.6)',
  zIndex: 'modal',
});

const modalContainerStyle = css({
  width: '45rem',
  height: '38.25rem',
  bg: 'bg',
  borderRadius: '0.75rem',
  padding: '2rem',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
});

const headerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: 'full',
  pb: '1rem',
});

const datePickerContainerStyle = css({
  display: 'flex',
  pt: '1.75rem',
  pb: '2.5rem',
});

const contentContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem',
});

const contentItemStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

const contentItemLabelStyle = css({
  textStyle: 'body2.r',
});

export const MinutesModal = ({
  open,
  onClose,
  taskId,
  editLog,
  onSuccess,
}: MinutesModalProps) => {
  const isEdit = !!editLog;
  const [dateStr, setDateStr] = useState(() =>
    editLog ? editLog.date : toDateString(new Date()),
  );
  const [agenda, setAgenda] = useState(editLog?.agenda ?? '');
  const [conclusion, setConclusion] = useState(editLog?.conclusion ?? '');
  const [discussion, setDiscussion] = useState(editLog?.discussion ?? '');

  const { mutateAsync: createLog, isPending: isCreating } =
    useCreateMeetingLog(taskId);
  const { mutateAsync: updateLog, isPending: isUpdating } =
    useUpdateMeetingLog(taskId);

  const handleOverlayClick = () => onClose();
  const handleBoxClick = (e: React.MouseEvent) => e.stopPropagation();

  const handleDateChange = (date: Date) => {
    setDateStr(toDateString(date));
  };

  const handleCheckClick = async () => {
    const payload = {
      date: dateStr,
      agenda: agenda.trim(),
      conclusion: conclusion.trim(),
      discussion: discussion.trim(),
    };
    if (!payload.agenda || !payload.conclusion || !payload.discussion) return;
    try {
      if (isEdit && editLog) {
        await updateLog({
          logId: editLog.logId,
          ...payload,
        });
      } else {
        await createLog(payload);
      }
      onSuccess?.();
      onClose();
    } catch {
      // 에러 시 모달 유지 (필요 시 토스트 등 추가)
    }
  };

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [open, onClose]);

  if (!open || typeof window === 'undefined') return null;

  const isPending = isCreating || isUpdating;

  return createPortal(
    <div className={overlayStyle} onClick={handleOverlayClick}>
      <div className={modalContainerStyle} onClick={handleBoxClick}>
        <header className={headerStyle}>
          <span>MM.DD 회의록</span>
          <button
            type='button'
            onClick={handleCheckClick}
            aria-label='저장'
            disabled={isPending}
          >
            <ModalCheckIcon />
          </button>
        </header>
        <Divider />

        <div className={datePickerContainerStyle}>
          <DatePicker value={dateStr} onChange={handleDateChange} />
        </div>

        <div className={contentContainerStyle}>
          <div className={contentItemStyle}>
            <label className={contentItemLabelStyle}>안건</label>
            <Textarea
              size='modal'
              placeholder='안건'
              value={agenda}
              onChange={(e) => setAgenda(e.target.value)}
            />
          </div>
          <div className={contentItemStyle}>
            <label className={contentItemLabelStyle}>결과</label>
            <Textarea
              size='modal'
              placeholder='결과'
              value={conclusion}
              onChange={(e) => setConclusion(e.target.value)}
            />
          </div>
          <div className={contentItemStyle}>
            <label className={contentItemLabelStyle}>논의</label>
            <Textarea
              size='modal'
              placeholder='논의'
              value={discussion}
              onChange={(e) => setDiscussion(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
