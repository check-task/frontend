'use client';

import { useState } from 'react';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/TextField';
import { AddURLDataButton } from '@/features/assignment/create/components/AddURLDataButton';
import { useCreateCommunication } from '@/hooks/mutations/useCreateCommunication';
import { css } from 'styled-system/css';

interface CommunicationItem {
  id: number;
  name: string;
  url: string;
}

interface TeamCommunicationModalProps {
  taskId: number;
  onSave?: (items: CommunicationItem[]) => void;
}

export const TeamCommunicationModal = ({
  taskId,
  onSave,
}: TeamCommunicationModalProps) => {
  const [inputGroups, setInputGroups] = useState<
    Array<{ id: number; name: string; url: string }>
  >(() => [{ id: Date.now(), name: '', url: '' }]);

  const { mutateAsync: createCommunication } = useCreateCommunication(taskId);

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

  const handleSave = async () => {
    const validGroups = inputGroups.filter(
      (group) => group.name.trim() && group.url.trim(),
    );

    let latest: CommunicationItem[] = [];

    for (const group of validGroups) {
      const data = await createCommunication({
        name: group.name.trim(),
        url: group.url.trim(),
      });
      latest = data.map((item) => ({
        id: item.communication_id,
        name: item.name,
        url: item.url,
      }));
    }

    onSave?.(latest);
  };

  return (
    <div className={containerStyle}>
      <div className={inputContainerStyle}>
        {/* <div className={scrollableListStyle}> */}
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
        {/* </div> */}
        <div className={css({ mt: '1rem', mb: '1.25rem' })}>
          <AddURLDataButton toggleType={0} onClick={handleAddInput} />
        </div>
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

// 커뮤니케이션 추가 모달에 스크롤 스타일 적용
const inputContainerStyle = css({
  display: 'flex',
  flexDirection: 'column',
  width: 'calc(100% + 1.25rem)',
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

// 입력 목록만 스크롤 — 3개 이상일 때 스크롤 (자료 모달과 동일)
// const scrollableListStyle = css({
//   display: 'flex',
//   flexDirection: 'column',
//   width: '100%',
//   maxHeight: '26rem',
//   overflowY: 'auto',
// });

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
