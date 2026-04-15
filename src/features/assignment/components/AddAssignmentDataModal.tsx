'use client';

import { useState, useRef, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Resolver } from 'react-hook-form';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/TextField';
import { FileUploadIcon } from '@/components/icons/FileUploadIcon';
import { URLUploadIcon } from '@/components/icons/URLUploadIcon';
import { AddAssignmentDataModalToggle } from './AddAssignmentDataModalToggle';
import { css } from 'styled-system/css';
import { AddURLDataButton } from '../create/components/AddURLDataButton';
import { useCreateReferenceData } from '@/hooks/mutations/useCreateReferenceData';

// ======== Zod 스키마 ========
const urlSchema = z.object({
  groups: z.array(
    z.object({
      name: z.string().min(1, 'URL명을 입력하세요.'),
      path: z.url('올바른 URL 형식이 아닙니다. (예: https://example.com)'),
    }),
  ),
});

const fileSchema = z.object({
  groups: z.array(
    z.object({
      name: z.string().min(1, '파일명을 입력하세요.'),
      path: z.string().min(1, '파일을 선택하세요.'),
    }),
  ),
});

type FormValues = { groups: { name: string; path: string }[] };

interface LocalDataItem {
  type: 0 | 1;
  name: string;
  path: string;
  file?: File;
}

interface AddAssignmentDataModalProps {
  taskId?: number;
  onSave?: () => void;
  onLocalSave?: (items: LocalDataItem[]) => void;
}

/* ===== type별 문구 ===== */
const FORM_TEXT = {
  0: {
    nameLabel: 'URL명',
    pathLabel: 'URL경로',
    namePlaceholder: 'URL명을 입력하세요.',
    pathPlaceholder: 'URL을 붙여넣으세요.',
  },
  1: {
    nameLabel: '파일명',
    pathLabel: '파일경로',
    namePlaceholder: '파일명을 입력하세요.',
    pathPlaceholder: '파일을 선택하세요.',
  },
} as const;

export const AddAssignmentDataModal = ({
  taskId,
  onSave,
  onLocalSave,
}: AddAssignmentDataModalProps) => {
  const [selectedType, setSelectedType] = useState<0 | 1>(0);
  const [files, setFiles] = useState<Record<number, File>>({});
  const selectedTypeRef = useRef<0 | 1>(0);

  const { mutateAsync: createReference, isPending } = useCreateReferenceData(
    taskId ?? 0,
  );

  // selectedType이 바뀌어도 form을 재생성하지 않고 ref로 현재 타입을 참조
  const resolver: Resolver<FormValues> = useCallback(
    async (values, context, options) => {
      const schema = selectedTypeRef.current === 0 ? urlSchema : fileSchema;
      return zodResolver(schema)(values, context, options);
    },
    [],
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver,
    defaultValues: { groups: [{ name: '', path: '' }] },
    mode: 'onChange',
  });

  const { fields, append } = useFieldArray({ control, name: 'groups' });

  const handleTypeChange = (index: number) => {
    const newType = index as 0 | 1;
    selectedTypeRef.current = newType;
    setSelectedType(newType);
    setFiles({});
    reset({ groups: [{ name: '', path: '' }] });
  };

  const handleFileChange = (fieldIndex: number, file: File | null) => {
    setFiles((prev) => {
      const next = { ...prev };
      if (file) {
        next[fieldIndex] = file;
      } else {
        delete next[fieldIndex];
      }
      return next;
    });
    setValue(`groups.${fieldIndex}.path`, file?.name ?? '', {
      shouldValidate: true,
    });
  };

  const handleSave = handleSubmit(async (data) => {
    if (!taskId) {
      onLocalSave?.(
        data.groups.map((g, i) => ({
          type: selectedType,
          name: g.name,
          path: g.path,
          file: selectedType === 1 ? files[i] : undefined,
        })),
      );
      onSave?.();
      return;
    }

    for (const [i, group] of data.groups.entries()) {
      const type = selectedType === 0 ? 'url' : 'file';
      const payload =
        type === 'url'
          ? { name: group.name, url: group.path }
          : { name: group.name, file: files[i] };
      await createReference({ type, payload });
    }
    onSave?.();
  });

  const text = FORM_TEXT[selectedType];
  const isFile = selectedType === 1;

  return (
    <div className={containerStyle}>
      <AddAssignmentDataModalToggle
        options={[
          {
            icon: (isActive) => (
              <URLUploadIcon variant={isActive ? 'black' : 'gray'} />
            ),
            label: 'URL 업로드',
          },
          {
            icon: (isActive) => (
              <FileUploadIcon variant={isActive ? 'black' : 'gray'} />
            ),
            label: '파일 업로드',
          },
        ]}
        onToggle={handleTypeChange}
      />
      <div className={inputContainerStyle}>
        {fields.map((field, index) => (
          <div key={field.id}>
            {index > 0 && <Divider mt='1.25rem' mb='1.25rem' />}

            <div className={inputGroupStyle}>
              <div className={inputWrapperStyle}>
                <label className={labelStyle}>{text.nameLabel}</label>
                <Input
                  size='modal'
                  placeholder={text.namePlaceholder}
                  {...register(`groups.${index}.name`)}
                />
                {errors.groups?.[index]?.name && (
                  <p className={errorStyle}>
                    {errors.groups[index].name?.message}
                  </p>
                )}
              </div>

              <div className={inputWrapperStyle}>
                <label className={labelStyle}>{text.pathLabel}</label>
                {isFile ? (
                  <>
                    <input
                      type='file'
                      id={`file-${field.id}`}
                      className={hiddenFileInputStyle}
                      onChange={(e) =>
                        handleFileChange(index, e.target.files?.[0] ?? null)
                      }
                    />
                    <Input
                      size='modal'
                      placeholder={text.pathPlaceholder}
                      {...register(`groups.${index}.path`)}
                      readOnly
                      className={fileInputTriggerStyle}
                      onClick={() =>
                        document.getElementById(`file-${field.id}`)?.click()
                      }
                    />
                    {errors.groups?.[index]?.path && (
                      <p className={errorStyle}>
                        {errors.groups[index].path?.message}
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <Input
                      size='modal'
                      placeholder={text.pathPlaceholder}
                      {...register(`groups.${index}.path`)}
                    />
                    {errors.groups?.[index]?.path && (
                      <p className={errorStyle}>
                        {errors.groups[index].path?.message}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        <div className={css({ mt: '1rem', mb: '2.5rem' })}>
          <AddURLDataButton
            toggleType={selectedType}
            onClick={() => append({ name: '', path: '' })}
          />
        </div>
      </div>
      <Button
        variant='fillBlue'
        size='xlarge'
        onClick={handleSave}
        disabled={!isValid || isPending}
      >
        저장
      </Button>
    </div>
  );
};

// ======== 스타일 정의 ========
// 모달 전체 컨테이너
const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  mt: '1.25rem', // 모달 헤더와 토글 사이 간격
});

// 모든 입력 그룹 컨테이너
const inputContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  width: 'calc(100% + 1.25rem)',
  mt: '1.75rem',
  maxH: '32rem',
  overflowY: 'auto',
  pr: '1rem',
  scrollbarGutter: 'stable',
  boxSizing: 'border-box',

  // 스크롤바 스타일 초기화 및 스타일 설정
  '&::-webkit-scrollbar': {
    width: '0.25rem',
  },
  '&::-webkit-scrollbar-button': {
    width: 0,
    height: 0,
    display: 'none !important',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'gray.200',
    borderRadius: '6.25rem',
  },
});

// 입력 그룹 한 묶음
const inputGroupStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  width: '100%',
});

// 라벨+input
const inputWrapperStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  width: '100%',
});

// 라벨 스타일
const labelStyle = css({
  textStyle: 'body3.m',
  color: 'gray.800',
});

const errorStyle = css({
  textStyle: 'body4.r',
  color: 'sub.01.100',
});

const hiddenFileInputStyle = css({
  display: 'none',
});

const fileInputTriggerStyle = css({
  cursor: 'pointer',
});
