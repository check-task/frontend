'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/Button';
import { Divider } from '@/components/Divider';
import { Input } from '@/components/TextField';
import { AddURLDataButton } from '@/features/assignment/create/components/AddURLDataButton';
import { useCreateCommunication } from '@/hooks/mutations/useCreateCommunication';
import { css } from 'styled-system/css';

// ======== Zod 스키마 ========
const schema = z.object({
  groups: z.array(
    z.object({
      name: z.string().min(1, '커뮤니케이션명을 입력하세요.'),
      url: z.url('올바른 URL 형식이 아닙니다. (예: https://example.com)'),
    }),
  ),
});

type FormValues = { groups: { name: string; url: string }[] };

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
  const { mutateAsync: createCommunication, isPending } =
    useCreateCommunication(taskId);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { groups: [{ name: '', url: '' }] },
    mode: 'onChange',
  });

  const { fields, append } = useFieldArray({ control, name: 'groups' });

  const handleSave = handleSubmit(async (data) => {
    let latest: CommunicationItem[] = [];

    for (const group of data.groups) {
      const res = await createCommunication({
        name: group.name.trim(),
        url: group.url.trim(),
      });
      const list = Array.isArray(res) ? res : [];
      latest = list.map(
        (item: { communication_id?: number; name: string; url: string }) => ({
          id: item.communication_id ?? 0,
          name: item.name,
          url: item.url,
        }),
      );
    }

    onSave?.(latest);
  });

  return (
    <div className={containerStyle}>
      <div className={inputContainerStyle}>
        {/* <div className={scrollableListStyle}> */}
        {fields.map((field, index) => (
          <div key={field.id}>
            {index > 0 && <Divider mt='1.25rem' mb='1.25rem' />}
            <div className={inputGroupStyle}>
              <div className={inputWrapperStyle}>
                <label className={labelStyle}>커뮤니케이션명</label>
                <Input
                  size='modal'
                  placeholder='커뮤니케이션명을 입력하세요.'
                  {...register(`groups.${index}.name`)}
                />
                {errors.groups?.[index]?.name && (
                  <p className={errorStyle}>
                    {errors.groups[index].name?.message}
                  </p>
                )}
              </div>
              <div className={inputWrapperStyle}>
                <label className={labelStyle}>URL경로</label>
                <Input
                  size='modal'
                  placeholder='URL을 붙여넣으세요.'
                  {...register(`groups.${index}.url`)}
                />
                {errors.groups?.[index]?.url && (
                  <p className={errorStyle}>
                    {errors.groups[index].url?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
        {/* </div> */}
        <div className={css({ mt: '1rem', mb: '1.25rem' })}>
          <AddURLDataButton
            toggleType={0}
            onClick={() => append({ name: '', url: '' })}
          />
        </div>
      </div>

      <Button
        variant='fillBlue'
        size='xlarge'
        onClick={handleSave}
        disabled={!isValid || isPending}
      >
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

const errorStyle = css({
  textStyle: 'body4.r',
  color: 'sub.01.100',
});
