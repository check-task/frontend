'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/TextField';
import { useUpdateCommunication } from '@/hooks/mutations/useUpdateCommunication';
import { css } from 'styled-system/css';

function getErrorMessage(error: unknown): string {
  const res = (error as { response?: { data?: { message?: string; reason?: string } } })?.response?.data;
  return res?.message ?? res?.reason ?? '수정에 실패했습니다.';
}

interface TeamCommunicationEditModalProps {
  taskId: number;
  communicationId: number;
  initialName: string;
  initialUrl: string;
  onSuccess?: () => void;
}

export const TeamCommunicationEditModal = ({
  taskId,
  communicationId,
  initialName,
  initialUrl,
  onSuccess,
}: TeamCommunicationEditModalProps) => {
  const [name, setName] = useState(initialName);
  const [url, setUrl] = useState(initialUrl);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { mutateAsync: updateCommunication, isPending } =
    useUpdateCommunication(taskId);

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();
    setErrorMessage(null);
    if (!trimmedName || !trimmedUrl) {
      setErrorMessage('커뮤니케이션명과 URL경로를 입력해주세요.');
      return;
    }
    if (communicationId <= 0) {
      setErrorMessage('수정할 수 없습니다. (커뮤니케이션 ID 없음)');
      return;
    }
    try {
      await updateCommunication({
        communicationId,
        name: trimmedName,
        url: trimmedUrl,
      });
      onSuccess?.();
    } catch (err) {
      setErrorMessage(getErrorMessage(err));
    }
  };

  return (
    <div className={containerStyle}>
      <div className={inputContainerStyle}>
        <div className={inputWrapperStyle}>
          <label className={labelStyle}>커뮤니케이션명</label>
          <Input
            size="modal"
            placeholder="커뮤니케이션명을 입력하세요."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={inputWrapperStyle}>
          <label className={labelStyle}>URL경로</label>
          <Input
            size="modal"
            placeholder="URL을 붙여넣으세요."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      </div>

      {errorMessage && (
        <p className={errorMessageStyle}>{errorMessage}</p>
      )}

      <Button
        variant="fillBlue"
        size="xlarge"
        onClick={handleSubmit}
        disabled={isPending}
      >
        등록
      </Button>
    </div>
  );
};

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  width: '100%',
  pt: '1.75rem',
});

const inputContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  width: '100%',
  pb: '1rem',
});

const inputWrapperStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  width: '100%',
});

const labelStyle = css({
  textStyle: 'body3.m',
  color: 'gray.800',
});

const errorMessageStyle = css({
  textStyle: 'body3.r',
  color: 'red.500',
});
