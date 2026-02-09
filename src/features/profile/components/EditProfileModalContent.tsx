'use client';

import { useRef, useState } from 'react';
import { styled } from 'styled-system/jsx';
import { css } from 'styled-system/css';
import { Button } from '@/components/Button';
import { Input } from '@/components/TextField';
import { CameraIcon } from '@/components/icons/CameraIcon';
import { Modal } from '@/features/profile/components/ModalContent';
import { useUpdateProfile } from '@/hooks/mutations/useUpdateProfile';
import { useModalStore } from '@/stores/modal-store';
import type { User } from '@/types/api/user';

interface EditProfileModalContentProps {
  user: User;
}

export const EditProfileModalContent = ({
  user,
}: EditProfileModalContentProps) => {
  const closeModal = useModalStore((state) => state.closeModal);
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [nickname, setNickname] = useState(user.nickname);
  const [phone, setPhone] = useState(user.phoneNum);
  const [email, setEmail] = useState(user.email);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.profileImage || null,
  );

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append('nickname', nickname);
    formData.append('phoneNum', phone);
    formData.append('email', email);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    updateProfile.mutate(formData, {
      onSuccess: () => closeModal(),
    });
  };

  return (
    <>
      <Modal.Container gap='large'>
        {/* 프로필 이미지 */}
        <ImageSection>
          <ImageWrapper onClick={handleImageClick}>
            {imagePreview ? (
              <ProfileImageActual src={imagePreview} alt={nickname} />
            ) : (
              <ProfileImage />
            )}
            <ImageOverlay>
              <CameraIcon />
            </ImageOverlay>
          </ImageWrapper>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </ImageSection>

        {/* 입력 필드들 */}
        <Modal.FormField gap='small'>
          <Modal.Label>닉네임</Modal.Label>
          <Input
            size='modal'
            type='text'
            placeholder='송월'
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </Modal.FormField>

        <Modal.FormField gap='small'>
          <Modal.Label>연락처</Modal.Label>
          <Input
            size='modal'
            type='tel'
            placeholder='010-1234-5678'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </Modal.FormField>

        <Modal.FormField gap='small'>
          <Modal.Label>이메일</Modal.Label>
          <Input
            size='modal'
            type='email'
            placeholder='checktask@ct.kr'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Modal.FormField>
      </Modal.Container>

      {/* 저장 버튼 */}
      <Button
        variant='fillBlue'
        size='xlarge'
        onClick={handleSave}
        disabled={
          !nickname.trim() ||
          !phone.trim() ||
          !email.trim() ||
          updateProfile.isPending
        }
        className={css({ marginTop: '2.125rem' })}
      >
        변경사항 저장
      </Button>
    </>
  );
};

const ImageSection = styled('div', {
  base: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
  },
});

const ImageWrapper = styled('div', {
  base: {
    position: 'relative',
    cursor: 'pointer',
  },
});

const ProfileImage = styled('div', {
  base: {
    width: '7.5rem',
    height: '7.5rem',
    borderRadius: '50%',
    bg: 'blue.100',
  },
});

const ProfileImageActual = styled('img', {
  base: {
    width: '7.5rem',
    height: '7.5rem',
    borderRadius: '50%',
    objectFit: 'cover',
  },
});

const ImageOverlay = styled('div', {
  base: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '7.5rem',
    height: '7.5rem',
    borderRadius: '50%',
    background:
      'linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%), var(--colors-blue-100)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0,
    transition: 'opacity 0.2s ease',
    _hover: {
      opacity: 1,
    },
  },
});
