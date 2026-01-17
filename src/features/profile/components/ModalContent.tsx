import { styled } from 'styled-system/jsx';
import { stack, hstack } from 'styled-system/patterns';

// 모달 컨테이너
const Container = styled('div', {
  base: stack.raw({
    paddingTop: '1.75rem',
  }),
  variants: {
    gap: {
      small: { gap: '0.5rem' },
      medium: { gap: '1.125rem' },
      large: { gap: '1.25rem' },
    },
  },
  defaultVariants: {
    gap: 'medium',
  },
});

// 메시지 섹션
const MessageSection = styled('div', {
  base: stack.raw({
    gap: '0.5rem',
  }),
});

// 제목 텍스트
const Title = styled('p', {
  base: {
    textStyle: 'body2.m',
    color: 'gray.800',
  },
});

// 제목 (인라인 요소 포함용)
const TitleInline = styled('p', {
  base: hstack.raw({
    gap: '0.5rem',
    flexWrap: 'wrap',
    textStyle: 'body2.m',
    color: 'gray.800',
  }),
});

// 설명 텍스트
const Description = styled('p', {
  base: {
    textStyle: 'body3.m',
    color: 'gray.600',
  },
});

// 버튼 섹션
const ButtonSection = styled('div', {
  base: stack.raw({
    gap: '1rem',
  }),
  variants: {
    marginTop: {
      none: { marginTop: 0 },
      small: { marginTop: '1rem' },
      medium: { marginTop: '1.125rem' },
      large: { marginTop: '2.5rem' },
    },
  },
  defaultVariants: {
    marginTop: 'none',
  },
});

// 폼 필드
const FormField = styled('div', {
  base: stack.raw({}),
  variants: {
    gap: {
      small: { gap: '0.5rem' },
      medium: { gap: '0.75rem' },
    },
  },
  defaultVariants: {
    gap: 'small',
  },
});

// 라벨
const Label = styled('label', {
  base: {
    textStyle: 'body3.m',
    color: 'gray.800',
  },
});

// Modal 네임스페이스로 export
export const Modal = {
  Container,
  MessageSection,
  Title,
  TitleInline,
  Description,
  ButtonSection,
  FormField,
  Label,
};
