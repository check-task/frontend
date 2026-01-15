'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/TextField';
import { FileUploadIcon } from '@/components/icons/FileUploadIcon';
import { URLUploadIcon } from '@/components/icons/URLUploadIcon';
import { AddAssignmentDataModalToggle } from './AddAssignmentDataModalToggle';
import { css } from 'styled-system/css';
import { AddURLDataButton } from './AddURLDataButton';

interface DataItem {
  id: number;
  type: 0 | 1;
  name: string;
  path: string;
}

interface AddAssignmentDataModalProps {
  onSave?: (items: DataItem[]) => void;
}

export const AddAssignmentDataModal = ({
  onSave,
}: AddAssignmentDataModalProps) => {
  const [selectedType, setSelectedType] = useState<0 | 1>(0);
  const [inputGroups, setInputGroups] = useState<
    Array<{ id: number; name: string; path: string }>
  >(() => [{ id: Date.now(), name: '', path: '' }]);

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

      {/* URL 업로드 입력창 */}
      {selectedType === 0 && (
        <div className={inputContainerStyle}>
          {inputGroups.map((group, index) => (
            <div key={group.id}>
              {index > 0 && <Divider mt='1.25rem' mb='1.25rem' />}
              <div className={inputGroupStyle}>
                <div className={inputWrapperStyle}>
                  <label className={labelStyle}>URL명</label>
                  <Input
                    size='modal'
                    placeholder='URL명을 입력하세요.'
                    value={group.name}
                    onChange={(e) =>
                      handleInputChange(group.id, 'name', e.target.value)
                    }
                  />
                </div>
                <div className={inputWrapperStyle}>
                  <label className={labelStyle}>URL경로</label>
                  <Input
                    size='modal'
                    placeholder='URL을 붙여넣으세요.'
                    value={group.path}
                    onChange={(e) =>
                      handleInputChange(group.id, 'path', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <AddURLDataButton
            toggleType={selectedType}
            onClick={handleAddInput}
          />
        </div>
      )}

      {/* 파일 업로드 입력창 */}
      {selectedType === 1 && (
        <div className={inputContainerStyle}>
          {inputGroups.map((group, index) => (
            <div key={group.id}>
              {index > 0 && <Divider mt='1.25rem' mb='1.25rem' />}
              <div className={inputGroupStyle}>
                <div className={inputWrapperStyle}>
                  <label className={labelStyle}>파일명</label>
                  <Input
                    size='modal'
                    placeholder='파일명을 입력하세요.'
                    value={group.name}
                    onChange={(e) =>
                      handleInputChange(group.id, 'name', e.target.value)
                    }
                  />
                </div>
                <div className={inputWrapperStyle}>
                  <label className={labelStyle}>파일경로</label>
                  <Input
                    size='modal'
                    placeholder='파일을 선택하세요.'
                    value={group.path}
                    onChange={(e) =>
                      handleInputChange(group.id, 'path', e.target.value)
                    }
                  />
                </div>
              </div>
            </div>
          ))}
          <AddURLDataButton
            toggleType={selectedType}
            onClick={handleAddInput}
          />
        </div>
      )}

      <Button variant='fillBlue' size='xlarge' onClick={handleSave}>
        저장
      </Button>
    </div>
  );
};

const containerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.75rem',
  width: '100%',
});

const inputContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
  width: '100%',
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
