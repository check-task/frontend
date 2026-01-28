'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/TextField';
import { AddURLDataButton } from '@/features/assignment/create/components/AddURLDataButton';
import { css } from 'styled-system/css';

interface CommunicationItem {
  id: number;
  name: string;
  url: string;
}

interface TeamCommunicationModalProps {
  onSave?: (items: CommunicationItem[]) => void;
}

export const TeamCommunicationModal = ({
  onSave,
}: TeamCommunicationModalProps) => {
  const [inputGroups, setInputGroups] = useState<
    Array<{ id: number; name: string; url: string }>
  >(() => [{ id: Date.now(), name: '', url: '' }]);

  const handleAddInput = () => {
    setInputGroups((prev) => [...prev, { id: Date.now(), name: '', url: '' }]);
  };

  const handleInputChange = (
    id: number,
    field: 'name' | 'url',
    value: string,
  ) => {
    setInputGroups((prev) =>
      prev.map((group) =>
        group.id === id ? { ...group, [field]: value } : group,
      ),
    );
  };

  const handleSave = () => {
    const items: CommunicationItem[] = inputGroups
      .filter((group) => group.name.trim() && group.url.trim())
      .map((group) => ({
        id: group.id,
        name: group.name,
        url: group.url,
      }));
    onSave?.(items);
  };

  return (
    <div className={containerStyle}>
      <div className={inputContainerStyle}>
        {inputGroups.map((group, index) => (
          <div key={group.id}>
            {index > 0 && <Divider mt='1.25rem' mb='1.25rem' />}
            <div className={inputGroupStyle}>
              <div className={inputWrapperStyle}>
                <label className={labelStyle}>커뮤니케이션명</label>
                <Input
                  size='modal'
                  placeholder='커뮤니케이션명을 입력하세요.'
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
                  value={group.url}
                  onChange={(e) =>
                    handleInputChange(group.id, 'url', e.target.value)
                  }
                />
              </div>
            </div>
          </div>
        ))}
        <AddURLDataButton toggleType={0} onClick={handleAddInput} />
      </div>

      <Button variant='fillBlue' size='xlarge' onClick={handleSave}>
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
