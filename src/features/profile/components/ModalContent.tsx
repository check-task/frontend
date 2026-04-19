import type { ComponentPropsWithoutRef } from 'react';
import { css, cva, cx } from 'styled-system/css';
import { hstack, stack } from 'styled-system/patterns';

// 모달 컨테이너
const containerStyle = cva({
  base: stack.raw({
    paddingTop: '1.75rem',
    maxWidth: '24.125rem',
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
const messageSectionStyle = css(
  stack.raw({
    gap: '0.5rem',
  }),
);

// 제목 텍스트
const titleStyle = css({
  textStyle: 'body2.m',
  color: 'gray.800',
});

// 제목 (인라인 요소 포함용)
const titleInlineStyle = css(
  hstack.raw({
    gap: '0.5rem',
    flexWrap: 'wrap',
    textStyle: 'body2.m',
    color: 'gray.800',
  }),
);

// 설명 텍스트
const descriptionStyle = css({
  textStyle: 'body3.m',
  color: 'gray.600',
});

// 버튼 섹션
const buttonSectionStyle = cva({
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
const formFieldStyle = cva({
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
const labelStyle = css({
  textStyle: 'body3.m',
  color: 'gray.800',
});

type ContainerProps = ComponentPropsWithoutRef<'div'> & {
  gap?: 'small' | 'medium' | 'large';
};

const Container = ({ className, gap, ...props }: ContainerProps) => (
  <div className={cx(containerStyle({ gap }), className)} {...props} />
);

const MessageSection = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'div'>) => (
  <div className={cx(messageSectionStyle, className)} {...props} />
);

const Title = ({ className, ...props }: ComponentPropsWithoutRef<'p'>) => (
  <p className={cx(titleStyle, className)} {...props} />
);

const TitleInline = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'p'>) => (
  <p className={cx(titleInlineStyle, className)} {...props} />
);

const Description = ({
  className,
  ...props
}: ComponentPropsWithoutRef<'p'>) => (
  <p className={cx(descriptionStyle, className)} {...props} />
);

type ButtonSectionProps = ComponentPropsWithoutRef<'div'> & {
  marginTop?: 'none' | 'small' | 'medium' | 'large';
};

const ButtonSection = ({
  className,
  marginTop,
  ...props
}: ButtonSectionProps) => (
  <div
    className={cx(buttonSectionStyle({ marginTop }), className)}
    {...props}
  />
);

type FormFieldProps = ComponentPropsWithoutRef<'div'> & {
  gap?: 'small' | 'medium';
};

const FormField = ({ className, gap, ...props }: FormFieldProps) => (
  <div className={cx(formFieldStyle({ gap }), className)} {...props} />
);

const Label = ({ className, ...props }: ComponentPropsWithoutRef<'label'>) => (
  <label className={cx(labelStyle, className)} {...props} />
);

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
