'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { isAxiosError } from 'axios';
import { css } from 'styled-system/css';
import { center } from 'styled-system/patterns';
import { ModalCheckIcon } from '@/components/icons/ModalCheckIcon';
import { Divider } from '@/components/Divider';
import DatePicker from '@/components/DatePicker';
import { Textarea } from '@/components/TextField';
import { useCreateMeetingLog } from '@/hooks/mutations/useCreateMeetingLog';
import { useUpdateMeetingLog } from '@/hooks/mutations/useUpdateMeetingLog';
import { useAlertStore } from '@/stores/alert-store';

// Date → YYYY-MM-DD
function toDateString(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// YYYY-MM-DD → MM.DD (헤더 표시용)
function toMMDD(dateStr: string): string {
  if (!dateStr || dateStr.length < 10) return 'MM.DD';
  return `${dateStr.slice(5, 7)}.${dateStr.slice(8, 10)}`;
}

interface MinutesModalProps {
  open: boolean;
  onClose: () => void;
  taskId: number;
  /*  수정 모드일 때 전달 */
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
  color: 'gray.900',
  textStyle: 'body1.m',
});

const checkButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0.5rem',
  minWidth: '2.5rem',
  minHeight: '2.5rem',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  position: 'relative',
  zIndex: 1,
  _disabled: {
    cursor: 'not-allowed',
    opacity: 0.6,
  },
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
  color: 'gray.900',
});

const validationErrorStyle = css({
  textStyle: 'body3.r',
  color: 'red.500',
  mb: '0.5rem',
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
  const [validationError, setValidationError] = useState<string | null>(null);

  // 부모에서 key로 모달을 열 때마다 새로 마운트하므로 open/editLog 기준 초기 state만 사용

  const { mutateAsync: createLog, isPending: isCreating } =
    useCreateMeetingLog(taskId);
  const { mutateAsync: updateLog, isPending: isUpdating } =
    useUpdateMeetingLog(taskId);
  const showAlert = useAlertStore((state) => state.showAlert);

  const handleOverlayClick = () => onClose();
  const handleBoxClick = (e: React.MouseEvent) => e.stopPropagation();

  const handleDateChange = (date: Date) => {
    setDateStr(toDateString(date));
  };

  const handleCheckClick = async () => {
    setValidationError(null);
    const agendaVal = agenda.trim();
    const conclusionVal = conclusion.trim();
    const discussionVal = discussion.trim();
    if (!agendaVal || !conclusionVal) {
      showAlert('안건과 결과를 입력해주세요.');
      return;
    }
    // API는 대부분 YYYY-MM-DD 형식 사용 (dateStr이 이미 YYYY-MM-DD)
    const payload = {
      date: dateStr,
      agenda: agendaVal,
      conclusion: conclusionVal,
      discussion: discussionVal,
    };
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
    } catch (err) {
      let message = '저장에 실패했습니다. 다시 시도해주세요.';
      if (isAxiosError(err) && err.response?.data) {
        const d = err.response.data as { message?: string; msg?: string; error?: string };
        message = d.message ?? d.msg ?? d.error ?? message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setValidationError(message);
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
          <span>{toMMDD(dateStr)} 회의록</span>
          <button
            type='button'
            className={checkButtonStyle}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleCheckClick();
            }}
            onMouseDown={(e) => e.stopPropagation()}
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

        {validationError && (
          <p className={validationErrorStyle}>{validationError}</p>
        )}
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
