'use client';

import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { css } from 'styled-system/css';
import { Button } from '@/components/Button';
import { Input } from '@/components/TextField';
import { CameraIcon } from '@/components/icons/CameraIcon';
import { Modal } from '@/features/profile/components/ModalContent';
import { useUpdateProfile } from '@/hooks/mutations/useUpdateProfile';
import { useModalStore } from '@/stores/modal-store';
import type { User } from '@/types/api/user';

const schema = z.object({
  nickname: z
    .string()
    .min(1, '닉네임을 입력해주세요')
    .max(30, '닉네임은 30글자 이하여야 합니다.'),
  phone: z
    .string()
    .refine(
      (val) => val === '' || /^01[0-9]-\d{3,4}-\d{4}$/.test(val),
      '올바른 연락처 형식으로 입력해주세요 (예: 010-1234-5678)',
    ),
  email: z
    .email('올바른 이메일 형식으로 입력해주세요')
    .max(50, '이메일은 50글자 이하여야 합니다.'),
});

type FormValues = z.infer<typeof schema>;

interface EditProfileModalContentProps {
  user: User;
}

export const EditProfileModalContent = ({
  user,
}: EditProfileModalContentProps) => {
  const closeModal = useModalStore((state) => state.closeModal);
  const updateProfile = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user.profileImage || null,
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nickname: user.nickname,
      phone:
        !user.phoneNum || user.phoneNum === '전화번호를 입력해 주세요.'
          ? ''
          : user.phoneNum,
      email: user.email,
    },
    mode: 'onChange',
  });

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

  const onSubmit = (data: FormValues) => {
    const formData = new FormData();
    formData.append('nickname', data.nickname);
    formData.append('phoneNum', data.phone);
    formData.append('email', data.email);
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
        <div className={imageSectionStyle}>
          <div className={imageWrapperStyle} onClick={handleImageClick}>
            {imagePreview ? (
              <img
                className={profileImageActualStyle}
                src={imagePreview}
                alt={user.nickname}
              />
            ) : (
              <div className={profileImageStyle} />
            )}
            <div className={imageOverlayStyle}>
              <CameraIcon />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* 입력 필드들 */}
        <Modal.FormField gap='small'>
          <Modal.Label>닉네임</Modal.Label>
          <Input
            size='modal'
            type='text'
            placeholder='닉네임'
            {...register('nickname')}
          />
          {errors.nickname && (
            <p className={errorStyle}>{errors.nickname.message}</p>
          )}
        </Modal.FormField>

        <Modal.FormField gap='small'>
          <Modal.Label>연락처</Modal.Label>
          <Input
            size='modal'
            type='tel'
            placeholder='010-1234-5678'
            {...register('phone')}
          />
          {errors.phone && <p className={errorStyle}>{errors.phone.message}</p>}
        </Modal.FormField>

        <Modal.FormField gap='small'>
          <Modal.Label>이메일</Modal.Label>
          <Input
            size='modal'
            type='email'
            placeholder='checktask@ct.kr'
            {...register('email')}
          />
          {errors.email && <p className={errorStyle}>{errors.email.message}</p>}
        </Modal.FormField>
      </Modal.Container>

      {/* 저장 버튼 */}
      <Button
        variant='fillBlue'
        size='xlarge'
        onClick={handleSubmit(onSubmit)}
        disabled={!isValid || updateProfile.isPending}
        className={css({ marginTop: '2.125rem' })}
      >
        변경사항 저장
      </Button>
    </>
  );
};

const imageSectionStyle = css({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
});

const imageWrapperStyle = css({
  position: 'relative',
  cursor: 'pointer',
});

const profileImageStyle = css({
  width: '7.5rem',
  height: '7.5rem',
  borderRadius: '50%',
  bg: 'blue.100',
});

const profileImageActualStyle = css({
  width: '7.5rem',
  height: '7.5rem',
  borderRadius: '50%',
  objectFit: 'cover',
});

const imageOverlayStyle = css({
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
});

const errorStyle = css({
  textStyle: 'body4.r',
  color: 'sub.01.100',
});
