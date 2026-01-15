'use client';

import { styled } from 'styled-system/jsx';
import { stack } from 'styled-system/patterns';
import { css } from 'styled-system/css';
import { Button } from '@/components/Button';
import { Input } from '@/components/TextField';
import { CameraIcon } from '@/components/icons/CameraIcon';

interface EditProfileModalContentProps {
  onSave?: () => void;
}

export const EditProfileModalContent = ({
  onSave,
}: EditProfileModalContentProps) => {
  return (
    <>
      <Container>
        {/* 프로필 이미지 */}
        <ImageSection>
          <ImageWrapper>
            <ProfileImage />
            <ImageOverlay>
              <CameraIcon />
            </ImageOverlay>
          </ImageWrapper>
        </ImageSection>

        {/* 입력 필드들 */}
        <FormField>
          <Label>닉네임</Label>
          <Input size='modal' type='text' placeholder='송월' />
        </FormField>

        <FormField>
          <Label>연락처</Label>
          <Input size='modal' type='tel' placeholder='010-1234-5678' />
        </FormField>

        <FormField>
          <Label>이메일</Label>
          <Input size='modal' type='email' placeholder='checktask@ct.kr' />
        </FormField>
      </Container>

      {/* 저장 버튼 */}
      <Button
        variant='fillBlue'
        size='xlarge'
        onClick={onSave}
        className={css({ marginTop: '2.125rem' })}
      >
        변경사항 저장
      </Button>
    </>
  );
};

const Container = styled('div', {
  base: stack.raw({
    gap: '1.25rem',
    paddingTop: '1.75rem',
  }),
});

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

const FormField = styled('div', {
  base: stack.raw({
    gap: '0.5rem',
  }),
});

const Label = styled('label', {
  base: {
    textStyle: 'body3.m',
    color: 'gray.800',
  },
});
