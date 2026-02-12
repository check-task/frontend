'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/TextField';
import { FileUploadIcon } from '@/components/icons/FileUploadIcon';
import { URLUploadIcon } from '@/components/icons/URLUploadIcon';
import { AddAssignmentDataModalToggle } from './AddAssignmentDataModalToggle';
import { css } from 'styled-system/css';
import { AddURLDataButton } from '../create/components/AddURLDataButton';
import { useCreateReferenceData } from '@/hooks/mutations/useCreateReferenceData';
import type { ReferenceDataItem } from '@/types/api/reference';

interface DataItem {
  id: number;
  type: 0 | 1;
  name: string;
  path: string;
}

interface AddAssignmentDataModalProps {
  taskId?: number;
  onSave?: (items: DataItem[]) => void;
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

type InputGroup = { id: number; name: string; path: string; file?: File };

// API 응답 항목을 모달용 DataItem으로 변환
const refItemToDataItem = (item: ReferenceDataItem): DataItem => ({
  id: item.reference_id,
  type: item.file_url ? 1 : 0,
  name: item.name,
  path: item.url ?? item.file_url ?? '',
});

export const AddAssignmentDataModal = ({
  taskId,
  onSave,
}: AddAssignmentDataModalProps) => {
  const [selectedType, setSelectedType] = useState<0 | 1>(0);
  const [inputGroups, setInputGroups] = useState<InputGroup[]>(() => [
    { id: Date.now(), name: '', path: '' },
  ]);
  const { mutateAsync: createReference } = useCreateReferenceData(taskId ?? 0); // taskId 없으면 0으로 훅만 호출

  // 저장 버튼 활성화 조건
  // 모든 입력 그룹에 값이 있어야 가능
  const isSaveDisabled =
    inputGroups.length === 0 ||
    inputGroups.some((g) => {
      if (selectedType === 0) {
        return !g.name.trim() || !g.path.trim();
      }
      return !g.name.trim() || !g.file;
    });

  const handleAddInput = () => {
    setInputGroups((prev) => [...prev, { id: Date.now(), name: '', path: '' }]);
  };

  const handleInputChange = (
    id: number,
    field: 'name' | 'path',
    value: string,
  ) => {
    setInputGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, [field]: value } : g)),
    );
  };

  const handleFileChange = (id: number, file: File | null) => {
    setInputGroups((prev) =>
      prev.map((g) =>
        g.id === id
          ? { ...g, file: file ?? undefined, path: file?.name ?? '' }
          : g,
      ),
    );
  };

  const handleSave = async () => {
    const validGroups = inputGroups.filter((g) => {
      if (selectedType === 0) return g.name.trim() && g.path.trim();
      return g.name.trim() && g.file;
    });

    if (taskId != null) {
      // taskId 있으면 자료 생성 API 순차 호출 후 응답 목록으로 onSave
      let lastData: ReferenceDataItem[] = [];
      for (const group of validGroups) {
        const type = selectedType === 0 ? 'url' : 'file';
        const payload =
          type === 'url'
            ? { name: group.name, url: group.path }
            : { name: group.name, file: group.file };
        lastData = await createReference({ type, payload });
      }
      onSave?.(lastData.map(refItemToDataItem));
    } else {
      const items: DataItem[] = validGroups.map((g) => ({
        id: g.id,
        type: selectedType,
        name: g.name,
        path: g.path,
      }));
      onSave?.(items);
    }
  };

  const renderInputGroups = () => {
    const text = FORM_TEXT[selectedType];
    const isFile = selectedType === 1;

    return (
      <>
        {/* <div className={scrollableListStyle}> */}
        {inputGroups.map((group, index) => (
          <div key={group.id}>
            {index > 0 && <Divider mt='1.25rem' mb='1.25rem' />}

            <div className={inputGroupStyle}>
              <div className={inputWrapperStyle}>
                <label className={labelStyle}>{text.nameLabel}</label>
                <Input
                  size='modal'
                  placeholder={text.namePlaceholder}
                  value={group.name}
                  onChange={(e) =>
                    handleInputChange(group.id, 'name', e.target.value)
                  }
                />
              </div>

              <div className={inputWrapperStyle}>
                <label className={labelStyle}>{text.pathLabel}</label>
                {isFile ? (
                  <>
                    <input
                      type='file'
                      id={`file-${group.id}`}
                      className={hiddenFileInputStyle}
                      onChange={(e) =>
                        handleFileChange(group.id, e.target.files?.[0] ?? null)
                      }
                    />
                    <Input
                      size='modal'
                      placeholder={text.pathPlaceholder}
                      value={group.path}
                      readOnly
                      className={fileInputTriggerStyle}
                      onClick={() =>
                        document.getElementById(`file-${group.id}`)?.click()
                      }
                    />
                  </>
                ) : (
                  <Input
                    size='modal'
                    placeholder={text.pathPlaceholder}
                    value={group.path}
                    onChange={(e) =>
                      handleInputChange(group.id, 'path', e.target.value)
                    }
                  />
                )}
              </div>
            </div>
          </div>
        ))}
        {/* </div> */}

        <div className={css({ mt: '1rem', mb: '2.5rem' })}>
          <AddURLDataButton
            toggleType={selectedType}
            onClick={handleAddInput}
          />
        </div>
      </>
    );
  };

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
        onToggle={(index) => setSelectedType(index as 0 | 1)}
      />
      <div className={inputContainerStyle}>{renderInputGroups()}</div>
      <Button
        variant='fillBlue'
        size='xlarge'
        onClick={handleSave}
        disabled={isSaveDisabled}
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

// 파일명/파일경로 목록만 스크롤 — 3개 이상일 때 스크롤
// const scrollableListStyle = css({
//   display: 'flex',
//   flexDirection: 'column',
//   width: '100%',
//   maxHeight: '26rem', // 3개부터 스크롤
//   overflowY: 'auto',
// });

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

const hiddenFileInputStyle = css({
  display: 'none',
});

const fileInputTriggerStyle = css({
  cursor: 'pointer',
});
