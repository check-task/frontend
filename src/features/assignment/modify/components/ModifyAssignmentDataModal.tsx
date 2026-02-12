'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/TextField';
import { FileUploadIcon } from '@/components/icons/FileUploadIcon';
import { URLUploadIcon } from '@/components/icons/URLUploadIcon';
import { AddAssignmentDataModalToggle } from '../../components/AddAssignmentDataModalToggle';
import { css } from 'styled-system/css';
import { AddURLDataButton } from '../../create/components/AddURLDataButton';

interface DataItem {
  id: number;
  type: 0 | 1;
  name: string;
  path: string;
  file?: File;
}

interface ModifyAssignmentDataModalProps {
  onSave?: (items: DataItem[]) => void;
}

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

export const ModifyAssignmentDataModal = ({
  onSave,
}: ModifyAssignmentDataModalProps) => {
  const [selectedType, setSelectedType] = useState<0 | 1>(0);
  const [inputGroups, setInputGroups] = useState<InputGroup[]>(() => [
    { id: Date.now(), name: '', path: '' },
  ]);

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

  const handleSave = () => {
    const validGroups = inputGroups.filter((g) => {
      if (selectedType === 0) return g.name.trim() && g.path.trim();
      return g.name.trim() && g.file;
    });

    const items: DataItem[] = validGroups.map((g) => ({
      id: -Date.now() - g.id,
      type: selectedType,
      name: g.name,
      path: g.path,
      file: g.file,
    }));

    onSave?.(items);
  };

  const renderInputGroups = () => {
    const text = FORM_TEXT[selectedType];
    const isFile = selectedType === 1;

    return (
      <>
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

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  mt: '1.25rem',
});

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

const inputGroupStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  width: '100%',
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

const hiddenFileInputStyle = css({
  display: 'none',
});

const fileInputTriggerStyle = css({
  cursor: 'pointer',
});
