'use client';

import { Button } from '@/components/Button';
import { useState } from 'react';
import { css } from 'styled-system/css';
import { Input } from '@/components/TextField';

export type ReferenceFormData = {
  name: string;
  path: string;
  file?: File;
};

interface EditAssignmentDataModalProps {
  type: 0 | 1; // 0은 url, 1은 파일
  defaultValue: { name: string; path: string };
  onSave: (value: ReferenceFormData) => void;
}

const MODAL_TEXT = {
  0: {
    nameLabel: 'URL명',
    pathLabel: 'URL 경로',
    namePlaceholder: 'URL 명',
    pathPlaceholder: 'URL 경로',
  },
  1: {
    nameLabel: '파일명',
    pathLabel: '파일',
    namePlaceholder: '파일명',
    pathPlaceholder: '파일을 선택하세요.',
  },
} as const;

export const EditAssignmentDataCardModal = ({
  type,
  defaultValue,
  onSave,
}: EditAssignmentDataModalProps) => {
  const [name, setName] = useState(defaultValue.name);
  const [path, setPath] = useState(defaultValue.path);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const isDirty =
    type === 1
      ? name !== defaultValue.name || selectedFile != null
      : name !== defaultValue.name || path !== defaultValue.path;

  const text = MODAL_TEXT[type];

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setPath(file?.name ?? defaultValue.path);
  };

  return (
    <div className={css({ marginTop: '1.75rem' })}>
      <div className={contentWrapperStyle}>
        <div className={fieldStyle}>
          <label className={labelStyle}>{text.nameLabel}</label>
          <Input
            size='modal'
            value={name}
            placeholder={text.namePlaceholder}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className={fieldStyle}>
          <label className={labelStyle}>{text.pathLabel}</label>
          {type === 1 ? (
            <>
              <input
                type='file'
                id='edit-reference-file'
                className={css({ display: 'none' })}
                onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
              />
              <Input
                size='modal'
                value={path}
                placeholder={text.pathPlaceholder}
                readOnly
                className={fileInputTriggerStyle}
                onClick={() =>
                  document.getElementById('edit-reference-file')?.click()
                }
              />
            </>
          ) : (
            <Input
              size='modal'
              value={path}
              placeholder={text.pathPlaceholder}
              onChange={(e) => setPath(e.target.value)}
            />
          )}
        </div>
      </div>
      <Button
        variant='fillBlue'
        size='xlarge'
        onClick={() => onSave({ name, path, file: selectedFile ?? undefined })}
        disabled={!isDirty}
      >
        변경사항 저장
      </Button>
    </div>
  );
};

// ======== 스타일 정의 ========
const contentWrapperStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  marginBottom: '2.5rem',
});

const fieldStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
});

const labelStyle = css({
  textStyle: 'body3.m',
  color: 'gray.800',
});

const fileInputTriggerStyle = css({
  cursor: 'pointer',
});
