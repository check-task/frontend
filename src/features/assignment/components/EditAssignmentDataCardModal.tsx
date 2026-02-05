'use clinet';

import { Button } from '@/components/Button';
import { useState } from 'react';
import { css } from 'styled-system/css';
import { ReferenceFormData } from '../personal/components/PersonalEtc';
import { Input } from '@/components/TextField';

interface EditAssignmentDataModalProps {
  type: 0 | 1; // 0은 url, 1은 파일로 지정
  defaultValue: ReferenceFormData;
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
    pathPlaceholder: '파일명.확장자',
  },
} as const;

export const EditAssignmentDataCardModal = ({
  type, // 타입 전달
  defaultValue,
  onSave,
}: EditAssignmentDataModalProps) => {
  // 파일명이랑 경로 기본값으로 설정
  const [name, setName] = useState(defaultValue.name);
  const [path, setPath] = useState(defaultValue.path);

  const text = MODAL_TEXT[type];

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
          <Input
            size='modal'
            value={path}
            placeholder={text.pathPlaceholder}
            onChange={(e) => setPath(e.target.value)}
          />
        </div>
      </div>
      <Button
        variant='fillBlue'
        size='xlarge'
        onClick={() => onSave({ name, path })}
      >
        변경사항 저장
      </Button>
    </div>
  );
};

// ======== 스타일 정의 ========
// 모달 콘텐츠 스타일
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

const inputStyle = css({
  w: '24.125rem',
  p: '0.81rem 0.75rem',
  border: '1px solid',
  borderColor: 'gray.400',
  borderRadius: '0.25rem',
  color: 'gray.800', // 임시값
  _focus: {
    outline: 'none',
  },
  _placeholder: {
    color: 'gray.600',
  },
});
