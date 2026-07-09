'use client';

import { css, cva } from 'styled-system/css';
import { hstack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { useModalStore } from '@/stores/modal-store';
import { FolderColor } from '@/types/folder';
import { Modal } from '@/features/profile/components/ModalContent';
import { useDeleteFolder } from '@/hooks/mutations/useDeleteFolder';
import { useAlertStore } from '@/stores/alert-store';

interface DeleteFolderModalContentProps {
  folderId: number;
  folderName: string;
  folderColor: FolderColor;
}

export const DeleteFolderModalContent = ({
  folderId,
  folderName,
  folderColor,
}: DeleteFolderModalContentProps) => {
  const { closeModal } = useModalStore();
  const deleteFolder = useDeleteFolder();
  const { showAlert } = useAlertStore();

  const handleDelete = () => {
    deleteFolder.mutate(
      { folderId, moveTasks: true },
      {
        onSuccess: () => closeModal(),
        onError: (error) => {
          const code = (
            error as { response?: { data?: { errorCode?: string } } }
          )?.response?.data?.errorCode;
          if (code === 'FOLDER_NOT_EMPTY') {
            closeModal();
            showAlert('폴더 내부에 과제가 존재해서 삭제할 수 없습니다.', 'x');
          }
        },
      },
    );
  };

  return (
    <>
      <Modal.Container gap='small'>
        <Modal.MessageSection>
          <Modal.TitleInline>
            <span>폴더명</span>
            <span className={folderBadgeStyle}>
              <span className={folderDotStyle({ color: folderColor })} />
              <span className={folderNameStyle({ color: folderColor })}>
                {folderName}
              </span>
            </span>
            <span>을(를) 삭제하시겠습니까?</span>
          </Modal.TitleInline>

          <div className={descriptionStyle}>
            <Modal.Description className={descriptionTextStyle}>
              삭제된 폴더는 복구할 수 없으며, 폴더 내부에 존재하는 과제는
            </Modal.Description>
            <Modal.Description className={moveDescriptionStyle}>
              <span className={defaultFolderBadgeStyle}>
                <span className={defaultFolderDotStyle} />
                <span>지정안함</span>
              </span>
              <span>폴더로 이동됩니다.</span>
            </Modal.Description>
          </div>
        </Modal.MessageSection>
      </Modal.Container>

      <Modal.ButtonSection marginTop='large' className={buttonSectionStyle}>
        <Button variant='fillGray' size='xlarge' onClick={closeModal}>
          취소
        </Button>
        <Button
          variant='fillBlue'
          size='xlarge'
          onClick={handleDelete}
          disabled={deleteFolder.isPending}
        >
          삭제
        </Button>
      </Modal.ButtonSection>
    </>
  );
};

const folderBadgeStyle = css(
  hstack.raw({
    gap: '0.25rem',
    display: 'inline-flex',
    alignItems: 'center',
  }),
);

const folderNameStyle = cva({
  base: {
    textStyle: 'body1.m',
  },
  variants: {
    color: {
      red: { color: 'sub.01.100' },
      yellow: { color: 'sub.02.100' },
      green: { color: 'sub.03.100' },
      purple: { color: 'sub.04.100' },
      black: { color: 'sub.05.100' },
      null: { color: 'sub.null.100' },
    },
  },
});

const folderDotStyle = cva({
  base: {
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '50%',
    display: 'inline-block',
  },
  variants: {
    color: {
      red: { bg: 'sub.01.100' },
      yellow: { bg: 'sub.02.100' },
      green: { bg: 'sub.03.100' },
      purple: { bg: 'sub.04.100' },
      black: { bg: 'sub.05.100' },
      null: { bg: 'sub.null.100' },
    },
  },
});

const descriptionStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});

const descriptionTextStyle = css({
  textStyle: 'body3.m',
  color: 'gray.600',
});

const moveDescriptionStyle = css(
  hstack.raw({
    gap: '0.25rem',
    alignItems: 'center',
  }),
);

const defaultFolderBadgeStyle = css(
  hstack.raw({
    gap: '0.125rem',
    alignItems: 'center',
    py: '0.125rem',
    px: '0.25rem',
    borderRadius: '0.125rem',
    bg: 'gray.100',
    color: 'sub.null.100',
  }),
);

const defaultFolderDotStyle = css({
  width: '1rem',
  height: '1rem',
  borderRadius: '50%',
  bg: 'sub.null.100',
});

const buttonSectionStyle = css({
  gap: '0.75rem',
});
