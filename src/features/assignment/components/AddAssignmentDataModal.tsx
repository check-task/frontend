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

interface DataItem {
  id: number;
  type: 0 | 1;
  name: string;
  path: string;
}

interface AddAssignmentDataModalProps {
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

export const AddAssignmentDataModal = ({
  onSave,
}: AddAssignmentDataModalProps) => {
  const [selectedType, setSelectedType] = useState<0 | 1>(0);
  const [inputGroups, setInputGroups] = useState<
    Array<{ id: number; name: string; path: string }>
  >(() => [{ id: Date.now(), name: '', path: '' }]);

  // 버튼 활성화 여부 (일단은 또는으로)
  const isSaveDisabled = !inputGroups.some(
    (group) => group.name.trim() || group.path.trim(),
  );

  const handleAddInput = () => {
    setInputGroups((prev) => [...prev, { id: Date.now(), name: '', path: '' }]);
  };

  const handleInputChange = (
    id: number,
    field: 'name' | 'path',
    value: string,
  ) => {
    setInputGroups((prev) =>
      prev.map((group) =>
        group.id === id ? { ...group, [field]: value } : group,
      ),
    );
  };

  const handleSave = () => {
    const items: DataItem[] = inputGroups
      .filter((group) => group.name.trim() && group.path.trim())
      .map((group) => ({
        id: group.id,
        type: selectedType,
        name: group.name,
        path: group.path,
      }));
    onSave?.(items);
  };

  // ===== 입력 그룹  =====
  // 컴포넌트로 분리해도 좋을 것 같습니다.
  const renderInputGroups = () => {
    const text = FORM_TEXT[selectedType];

    return (
      <div className={inputContainerStyle}>
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
                <Input
                  size='modal'
                  placeholder={text.pathPlaceholder}
                  value={group.path}
                  onChange={(e) =>
                    handleInputChange(group.id, 'path', e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        ))}

        <div className={css({ mt: '1rem', mb: '2.5rem' })}>
          <AddURLDataButton
            toggleType={selectedType}
            onClick={handleAddInput}
          />
        </div>
      </div>
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
      {renderInputGroups()}
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
  width: '100%',
  mt: '1.75rem',
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
