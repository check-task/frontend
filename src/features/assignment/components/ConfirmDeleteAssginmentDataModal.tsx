import { Button } from '@/components/Button';
import { css } from 'styled-system/css';

interface ConfirmDeleteModalProps {
  highlightText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDeleteAssignmentDataModal = ({
  highlightText,
  onConfirm,
  onCancel,
}: ConfirmDeleteModalProps) => {
  return (
    <div className={css({ marginTop: '1.75rem' })}>
      <div className={contentWrapperStyle}>
        <p className={mainTextStyle}>
          <span className={highlightStyle}>{highlightText}</span> 을(를)
          삭제하시겠습니까?
        </p>
        <p className={subTextStyle}>
          삭제된 자료는 영구 삭제되며, 복구할 수 없습니다.
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
  w: '24.125rem',
  gap: '0.5rem',
  marginBottom: '2.5rem',
});

const mainTextStyle = css({
  textStyle: 'body2.m',
  color: 'gray.800',
});

const highlightStyle = css({
  textStyle: 'body1.m',
  color: 'primary',
});

const subTextStyle = css({
  textStyle: 'body3.m',
  color: 'gray.600',
});
