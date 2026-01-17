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
  progressColor: FolderColor;
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
  progressColor,
  index = 0,
}: AssignmentCardProps) => {
  const isSidebarCollapsed = useUIStore((state) => state.isSidebarCollapsed);
  const brightness = getBrightness(index);

  return (
    <Card.Wrapper
      css={{ width: isSidebarCollapsed ? '27.375rem' : '22.75rem' }}
    >
      <Card.AccentBar color={folderColor} brightness={brightness} />
      <Card.Content css={{ gap: isSidebarCollapsed ? '3.875rem' : '0.625rem' }}>
        <Card.Left>
          <Card.FolderName color={folderColor} brightness={brightness}>
            {folderName}
          </Card.FolderName>
          <Card.DDay color={folderColor} brightness={brightness}>
            {dDay}
          </Card.DDay>
        </Card.Left>
        <Card.Right>
          <Card.AssignmentInfo>
            <Card.AssignmentHeader>
              <Card.AssignmentDot color={folderColor} brightness={brightness} />
              <Card.AssignmentName>{assignmentName}</Card.AssignmentName>
            </Card.AssignmentHeader>
            <Card.AssignmentType>{assignmentType}</Card.AssignmentType>
          </Card.AssignmentInfo>
          <Card.ProgressSection>
            <Card.ProgressText>{progress}%</Card.ProgressText>
            <Card.ProgressBar>
              <Card.ProgressFill
                color={progressColor}
                brightness={brightness}
                style={{ width: `${progress}%` }}
              />
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
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }),
  }),
  AccentBar: styled('div', {
    base: {
      width: '0.25rem',
      height: '7.125rem',
      marginLeft: '-0.125rem',
    },
    variants: {
      color: {
        red: {},
        yellow: {},
        green: {},
        purple: {},
        black: {},
      },
      brightness: {
        high: {},
        medium: {},
        low: {},
      },
    },
    compoundVariants: [
      { color: 'red', brightness: 'high', css: { bg: 'sub.01.100' } },
      { color: 'red', brightness: 'medium', css: { bg: 'sub.01.60' } },
      { color: 'red', brightness: 'low', css: { bg: 'sub.01.40' } },
      { color: 'yellow', brightness: 'high', css: { bg: 'sub.02.100' } },
      { color: 'yellow', brightness: 'medium', css: { bg: 'sub.02.60' } },
      { color: 'yellow', brightness: 'low', css: { bg: 'sub.02.40' } },
      { color: 'green', brightness: 'high', css: { bg: 'sub.03.100' } },
      { color: 'green', brightness: 'medium', css: { bg: 'sub.03.60' } },
      { color: 'green', brightness: 'low', css: { bg: 'sub.03.40' } },
      { color: 'purple', brightness: 'high', css: { bg: 'sub.04.100' } },
      { color: 'purple', brightness: 'medium', css: { bg: 'sub.04.60' } },
      { color: 'purple', brightness: 'low', css: { bg: 'sub.04.40' } },
      { color: 'black', brightness: 'high', css: { bg: 'sub.05.100' } },
      { color: 'black', brightness: 'medium', css: { bg: 'sub.05.60' } },
      { color: 'black', brightness: 'low', css: { bg: 'sub.05.40' } },
    ],
    defaultVariants: {
      brightness: 'high',
    },
  }),
  Content: styled('div', {
    base: hstack.raw({
      paddingY: '1.5rem',
      paddingLeft: '1.5rem',
      flex: 1,
      alignItems: 'flex-start',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }),
  }),
  Left: styled('div', {
    base: stack.raw({
      gap: '3rem',
    }),
  }),
  Right: styled('div', {
    base: stack.raw({
      gap: '0.75rem',
      flex: 1,
    }),
  }),
  FolderName: styled('span', {
    base: {
      textStyle: 'body3.m',
    },
    variants: {
      color: {
        red: {},
        yellow: {},
        green: {},
        purple: {},
        black: {},
      },
      brightness: {
        high: {},
        medium: {},
        low: {},
      },
    },
    compoundVariants: [
      { color: 'red', brightness: 'high', css: { color: 'sub.01.100' } },
      { color: 'red', brightness: 'medium', css: { color: 'sub.01.60' } },
      { color: 'red', brightness: 'low', css: { color: 'sub.01.40' } },
      { color: 'yellow', brightness: 'high', css: { color: 'sub.02.100' } },
      { color: 'yellow', brightness: 'medium', css: { color: 'sub.02.60' } },
      { color: 'yellow', brightness: 'low', css: { color: 'sub.02.40' } },
      { color: 'green', brightness: 'high', css: { color: 'sub.03.100' } },
      { color: 'green', brightness: 'medium', css: { color: 'sub.03.60' } },
      { color: 'green', brightness: 'low', css: { color: 'sub.03.40' } },
      { color: 'purple', brightness: 'high', css: { color: 'sub.04.100' } },
      { color: 'purple', brightness: 'medium', css: { color: 'sub.04.60' } },
      { color: 'purple', brightness: 'low', css: { color: 'sub.04.40' } },
      { color: 'black', brightness: 'high', css: { color: 'sub.05.100' } },
      { color: 'black', brightness: 'medium', css: { color: 'sub.05.60' } },
      { color: 'black', brightness: 'low', css: { color: 'sub.05.40' } },
    ],
    defaultVariants: {
      brightness: 'high',
    },
  }),
  DDay: styled('div', {
    base: {
      padding: '0.25rem 0.75rem',
      borderRadius: '0.25rem',
      textStyle: 'btn',
      color: 'primary-button-text',
    },
    variants: {
      color: {
        red: {},
        yellow: {},
        green: {},
        purple: {},
        black: {},
      },
      brightness: {
        high: {},
        medium: {},
        low: {},
      },
    },
    compoundVariants: [
      { color: 'red', brightness: 'high', css: { bg: 'sub.01.100' } },
      { color: 'red', brightness: 'medium', css: { bg: 'sub.01.60' } },
      { color: 'red', brightness: 'low', css: { bg: 'sub.01.40' } },
      { color: 'yellow', brightness: 'high', css: { bg: 'sub.02.100' } },
      { color: 'yellow', brightness: 'medium', css: { bg: 'sub.02.60' } },
      { color: 'yellow', brightness: 'low', css: { bg: 'sub.02.40' } },
      { color: 'green', brightness: 'high', css: { bg: 'sub.03.100' } },
      { color: 'green', brightness: 'medium', css: { bg: 'sub.03.60' } },
      { color: 'green', brightness: 'low', css: { bg: 'sub.03.40' } },
      { color: 'purple', brightness: 'high', css: { bg: 'sub.04.100' } },
      { color: 'purple', brightness: 'medium', css: { bg: 'sub.04.60' } },
      { color: 'purple', brightness: 'low', css: { bg: 'sub.04.40' } },
      { color: 'black', brightness: 'high', css: { bg: 'sub.05.100' } },
      { color: 'black', brightness: 'medium', css: { bg: 'sub.05.60' } },
      { color: 'black', brightness: 'low', css: { bg: 'sub.05.40' } },
    ],
    defaultVariants: {
      brightness: 'high',
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
    },
    variants: {
      color: {
        red: {},
        yellow: {},
        green: {},
        purple: {},
        black: {},
      },
      brightness: {
        high: {},
        medium: {},
        low: {},
      },
    },
    compoundVariants: [
      { color: 'red', brightness: 'high', css: { bg: 'sub.01.100' } },
      { color: 'red', brightness: 'medium', css: { bg: 'sub.01.60' } },
      { color: 'red', brightness: 'low', css: { bg: 'sub.01.40' } },
      { color: 'yellow', brightness: 'high', css: { bg: 'sub.02.100' } },
      { color: 'yellow', brightness: 'medium', css: { bg: 'sub.02.60' } },
      { color: 'yellow', brightness: 'low', css: { bg: 'sub.02.40' } },
      { color: 'green', brightness: 'high', css: { bg: 'sub.03.100' } },
      { color: 'green', brightness: 'medium', css: { bg: 'sub.03.60' } },
      { color: 'green', brightness: 'low', css: { bg: 'sub.03.40' } },
      { color: 'purple', brightness: 'high', css: { bg: 'sub.04.100' } },
      { color: 'purple', brightness: 'medium', css: { bg: 'sub.04.60' } },
      { color: 'purple', brightness: 'low', css: { bg: 'sub.04.40' } },
      { color: 'black', brightness: 'high', css: { bg: 'sub.05.100' } },
      { color: 'black', brightness: 'medium', css: { bg: 'sub.05.60' } },
      { color: 'black', brightness: 'low', css: { bg: 'sub.05.40' } },
    ],
    defaultVariants: {
      brightness: 'high',
    },
  }),
  AssignmentName: styled('span', {
    base: {
      textStyle: 'body1.m',
      color: 'gray.900',
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
    },
    variants: {
      color: {
        red: {},
        yellow: {},
        green: {},
        purple: {},
        black: {},
      },
      brightness: {
        high: {},
        medium: {},
        low: {},
      },
    },
    compoundVariants: [
      { color: 'red', brightness: 'high', css: { bg: 'sub.01.100' } },
      { color: 'red', brightness: 'medium', css: { bg: 'sub.01.60' } },
      { color: 'red', brightness: 'low', css: { bg: 'sub.01.40' } },
      { color: 'yellow', brightness: 'high', css: { bg: 'sub.02.100' } },
      { color: 'yellow', brightness: 'medium', css: { bg: 'sub.02.60' } },
      { color: 'yellow', brightness: 'low', css: { bg: 'sub.02.40' } },
      { color: 'green', brightness: 'high', css: { bg: 'sub.03.100' } },
      { color: 'green', brightness: 'medium', css: { bg: 'sub.03.60' } },
      { color: 'green', brightness: 'low', css: { bg: 'sub.03.40' } },
      { color: 'purple', brightness: 'high', css: { bg: 'sub.04.100' } },
      { color: 'purple', brightness: 'medium', css: { bg: 'sub.04.60' } },
      { color: 'purple', brightness: 'low', css: { bg: 'sub.04.40' } },
      { color: 'black', brightness: 'high', css: { bg: 'sub.05.100' } },
      { color: 'black', brightness: 'medium', css: { bg: 'sub.05.60' } },
      { color: 'black', brightness: 'low', css: { bg: 'sub.05.40' } },
    ],
    defaultVariants: {
      brightness: 'high',
    },
  }),
};
