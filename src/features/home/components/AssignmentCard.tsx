'use client';

import { styled } from 'styled-system/jsx';
import { hstack, stack } from 'styled-system/patterns';
import { FolderColor } from '@/types/folder';
import { useUIStore } from '@/stores/ui-store';

export type ColorBrightness = 'high' | 'medium' | 'low';

interface AssignmentCardProps {
  folderName: string;
  folderColor: FolderColor;
  dDay: string;
  assignmentName: string;
  assignmentType: string;
  progress: number;
  index?: number;
}

// index에 따라 명도 결정
const getBrightness = (index: number): ColorBrightness => {
  if (index < 3) return 'high'; // 1~3번째: 100
  if (index < 6) return 'medium'; // 4~6번째: 60
  return 'low'; // 7번째 이후: 40
};

export const AssignmentCard = ({
  folderName,
  folderColor,
  dDay,
  assignmentName,
  assignmentType,
  progress,
  index = 0,
}: AssignmentCardProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const brightness = getBrightness(index);

  return (
    <Card.Wrapper
      color={folderColor}
      brightness={brightness}
      css={{ width: isSidebarCollapsed ? '27.375rem' : '22.75rem' }}
    >
      <Card.AccentBar />
      <Card.Content
        css={{ paddingX: isSidebarCollapsed ? '1.5rem' : '1.25rem' }}
      >
        <Card.Left
          css={{ width: isSidebarCollapsed ? '7.125rem' : '4.375rem' }}
        >
          <Card.FolderName>{folderName}</Card.FolderName>
          <Card.DDay>{dDay}</Card.DDay>
        </Card.Left>
        <Card.Right
          css={{ width: isSidebarCollapsed ? '15.75rem' : '14.375rem' }}
        >
          <Card.AssignmentInfo>
            <Card.AssignmentHeader>
              <Card.AssignmentDot />
              <Card.AssignmentName>{assignmentName}</Card.AssignmentName>
            </Card.AssignmentHeader>
            <Card.AssignmentType>{assignmentType}</Card.AssignmentType>
          </Card.AssignmentInfo>
          <Card.ProgressSection>
            <Card.ProgressText>{progress}%</Card.ProgressText>
            <Card.ProgressBar>
              <Card.ProgressFill style={{ width: `${progress}%` }} />
            </Card.ProgressBar>
          </Card.ProgressSection>
        </Card.Right>
      </Card.Content>
    </Card.Wrapper>
  );
};

const Card = {
  Wrapper: styled('div', {
    base: hstack.raw({
      gap: 0,
      bg: 'gray.0',
      borderRadius: '0.75rem',
      boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.16)',
      cursor: 'pointer',
      transition: 'width 0.3s ease',
    }),
    variants: {
      color: {
        red: {
          '--card-color-100': 'token(colors.sub.01.100)',
          '--card-color-60': 'token(colors.sub.01.60)',
          '--card-color-40': 'token(colors.sub.01.40)',
        },
        yellow: {
          '--card-color-100': 'token(colors.sub.02.100)',
          '--card-color-60': 'token(colors.sub.02.60)',
          '--card-color-40': 'token(colors.sub.02.40)',
        },
        green: {
          '--card-color-100': 'token(colors.sub.03.100)',
          '--card-color-60': 'token(colors.sub.03.60)',
          '--card-color-40': 'token(colors.sub.03.40)',
        },
        purple: {
          '--card-color-100': 'token(colors.sub.04.100)',
          '--card-color-60': 'token(colors.sub.04.60)',
          '--card-color-40': 'token(colors.sub.04.40)',
        },
        black: {
          '--card-color-100': 'token(colors.sub.05.100)',
          '--card-color-60': 'token(colors.sub.05.60)',
          '--card-color-40': 'token(colors.sub.05.40)',
        },
      },
      brightness: {
        high: { '--card-color': 'var(--card-color-100)' },
        medium: { '--card-color': 'var(--card-color-60)' },
        low: { '--card-color': 'var(--card-color-40)' },
      },
    },
    defaultVariants: {
      brightness: 'high',
    },
  }),
  AccentBar: styled('div', {
    base: {
      width: '0.25rem',
      height: '7.125rem',
      marginLeft: '-0.125rem',
      bg: 'var(--card-color)',
    },
  }),
  Content: styled('div', {
    base: hstack.raw({
      paddingY: '1.5rem',
      flex: 1,
      alignItems: 'flex-start',
      transition: 'gap 0.3s ease',
      gap: '1.25rem',
    }),
  }),
  Left: styled('div', {
    base: stack.raw({
      gap: '3rem',
      transition: 'width 0.3s ease',
    }),
  }),
  Right: styled('div', {
    base: stack.raw({
      gap: '0.75rem',
      transition: 'width 0.3s ease',
    }),
  }),
  FolderName: styled('span', {
    base: {
      textStyle: 'body3.m',
      color: 'var(--card-color)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  }),
  DDay: styled('div', {
    base: {
      padding: '0.25rem 0.75rem',
      borderRadius: '0.25rem',
      textStyle: 'btn',
      color: 'primary-button-text',
      bg: 'var(--card-color)',
      width: '4.3125rem',
    },
  }),
  AssignmentInfo: styled('div', {
    base: stack.raw({
      gap: '0.25rem',
    }),
  }),
  AssignmentHeader: styled('div', {
    base: hstack.raw({
      gap: '0.75rem',
      alignItems: 'center',
    }),
  }),
  AssignmentDot: styled('div', {
    base: {
      width: '1.5rem',
      height: '1.5rem',
      borderRadius: '50%',
      bg: 'var(--card-color)',
      flexShrink: 0,
    },
  }),
  AssignmentName: styled('span', {
    base: {
      textStyle: 'body1.m',
      color: 'gray.900',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  }),
  AssignmentType: styled('span', {
    base: {
      textStyle: 'body4.r',
      color: 'gray.400',
      paddingLeft: '2.25rem',
    },
  }),
  ProgressSection: styled('div', {
    base: stack.raw({
      gap: '0.375rem',
      width: '100%',
      paddingLeft: '2.25rem',
    }),
  }),
  ProgressText: styled('span', {
    base: {
      textStyle: 'body4.r',
      color: 'gray.900',
    },
  }),
  ProgressBar: styled('div', {
    base: {
      width: '100%',
      height: '0.375rem',
      bg: 'gray.100',
      borderRadius: '0.625rem',
      overflow: 'hidden',
    },
  }),
  ProgressFill: styled('div', {
    base: {
      height: '100%',
      borderRadius: '0.625rem',
      bg: 'var(--card-color)',
    },
  }),
};
