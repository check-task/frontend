'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { Button } from '@/components/Button';
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

const urlSchema = z.object({
  name: z.string().min(1, 'URL명을 입력하세요.'),
  path: z.url('올바른 URL 형식이 아닙니다. (예: https://example.com)'),
});

const fileSchema = z.object({
  name: z.string().min(1, '파일명을 입력하세요.'),
  path: z.string().min(1, '파일을 선택하세요.'),
});

type FormValues = { name: string; path: string };

export const EditAssignmentDataCardModal = ({
  type,
  defaultValue,
  onSave,
}: EditAssignmentDataModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(type === 0 ? urlSchema : fileSchema),
    defaultValues: { name: defaultValue.name, path: defaultValue.path },
    mode: 'onChange',
  });

  const text = MODAL_TEXT[type];

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setValue('path', file?.name ?? defaultValue.path, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleSave = handleSubmit((data) => {
    onSave({
      name: data.name,
      path: data.path,
      file: selectedFile ?? undefined,
    });
  });

  return (
    <div className={css({ marginTop: '1.75rem' })}>
      <div className={contentWrapperStyle}>
        <div className={fieldStyle}>
          <label className={labelStyle}>{text.nameLabel}</label>
          <Input
            size='modal'
            placeholder={text.namePlaceholder}
            {...register('name')}
          />
          {errors.name && <p className={errorStyle}>{errors.name.message}</p>}
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
                placeholder={text.pathPlaceholder}
                {...register('path')}
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
              placeholder={text.pathPlaceholder}
              {...register('path')}
            />
          )}
          {errors.path && <p className={errorStyle}>{errors.path.message}</p>}
        </div>
      </div>
      <Button
        variant='fillBlue'
        size='xlarge'
        onClick={handleSave}
        disabled={!isDirty || !isValid}
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

const errorStyle = css({
  textStyle: 'body4.r',
  color: 'sub.01.100',
});

const fileInputTriggerStyle = css({
  cursor: 'pointer',
});
