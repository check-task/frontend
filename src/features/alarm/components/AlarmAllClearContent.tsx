'use client';

import { Button } from '@/components/Button';
import { css } from 'styled-system/css';

interface AlarmAllClearContentProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const AlarmAllClearContent = ({
  onConfirm,
  onCancel,
}: AlarmAllClearContentProps) => {
  return (
    <div className={css({ marginTop: '1.75rem' })}>
      <div className={contentWrapperStyle}>
        <p className={css({ textStyle: 'body1.m', color: 'gray.900' })}>
          모든 알림을 삭제하시겠습니까?
        </p>
        <p className={css({ textStyle: 'body3.m', color: 'gray.600' })}>
          삭제된 알림은 영구 삭제되며, 복구할 수 없습니다.
        </p>
      </div>

      <Button
        variant='fillGray'
        size='xlarge'
        className={css({ marginBottom: '1rem' })}
        onClick={onCancel}
      >
        취소
      </Button>

      <Button variant='fillBlue' size='xlarge' onClick={onConfirm}>
        삭제
      </Button>
    </div>
  );
};

// ======== 스타일 정의 ========
// 모달 콘텐츠 스타일
const contentWrapperStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.5rem',
  marginBottom: '2.5rem',
});
