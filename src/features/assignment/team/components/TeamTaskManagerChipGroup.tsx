'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import { css, cva } from 'styled-system/css';

export interface TeamTaskManagerChipMember {
  nickname: string;
  profileImage?: string;
}

interface TeamTaskManagerChipGroupProps {
  /** 표시할 담당자 목록 (표시 우선순위 순서). 빈 배열이면 "없음" 상태로 렌더링 */
  members: TeamTaskManagerChipMember[];
  isOpen: boolean;
  onClick: () => void;
}

const CHIP_GAP = 2;
const LABEL_GAP = 4;

// 화면에 표시 가능한 담당자 수를 계산하는 함수
const computeVisibleCount = (
  chipWidths: number[],
  overflowWidth: number,
  maxWidth: number,
): number => {
  const total = chipWidths.length;
  const sumAll =
    chipWidths.reduce((a, b) => a + b, 0) + CHIP_GAP * Math.max(total - 1, 0);
  if (sumAll <= maxWidth) return total;

  for (let k = total - 1; k >= 0; k--) {
    if (k === 0) return 0;
    const chipsWidth =
      chipWidths.slice(0, k).reduce((a, b) => a + b, 0) + CHIP_GAP * (k - 1);
    if (chipsWidth + LABEL_GAP + overflowWidth <= maxWidth) return k;
  }
  return 0;
};

export const TeamTaskManagerChipGroup = ({
  members,
  isOpen,
  onClick,
}: TeamTaskManagerChipGroupProps) => {
  // "담당:" 라벨을 제외한 실제 남는 폭은 사이드바 여부와 무관하게 고정이므로,
  // 마운트 시 한 번만 측정해서 그 값을 계속 사용하도록
  const [maxWidth, setMaxWidth] = useState(0);
  const containerRef = useRef<HTMLButtonElement | null>(null);
  const [visibleCount, setVisibleCount] = useState(members.length);
  // 각 담당자 chip의 폭을 측정하기 위한 ref
  const chipRefs = useRef<(HTMLSpanElement | null)[]>([]);
  // 외 N 라벨의 폭을 측정하기 위한 ref
  const overflowMeasureRef = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setMaxWidth(containerRef.current.offsetWidth);
    }
  }, []);

  useLayoutEffect(() => {
    if (members.length === 0 || maxWidth === 0) return;

    const widths = chipRefs.current
      .slice(0, members.length)
      .map((el) => el?.offsetWidth ?? 0);
    const overflowWidth = overflowMeasureRef.current?.offsetWidth ?? 0;

    setVisibleCount(computeVisibleCount(widths, overflowWidth, maxWidth));
  }, [members, maxWidth]);

  if (members.length === 0) {
    return (
      <button
        type='button'
        ref={containerRef}
        className={chipGroupWrapperStyle}
        onClick={onClick}
        aria-expanded={isOpen}
        aria-haspopup='listbox'
      >
        <span className={teamTaskManagerStyle({ empty: true })}>
          <span className={teamTaskManagerIconStyle({ empty: true })} />
          <span className={chipNameStyle({ empty: true })}>none</span>
        </span>
      </button>
    );
  }

  const visibleMembers = members.slice(0, visibleCount);
  const overflowCount = members.length - visibleCount;

  return (
    <button
      type='button'
      ref={containerRef}
      className={chipGroupWrapperStyle}
      onClick={onClick}
      aria-expanded={isOpen}
      aria-haspopup='listbox'
    >
      <span className={chipRowStyle}>
        {visibleMembers.map((m) => (
          <span key={m.nickname} className={teamTaskManagerStyle({ empty: false })}>
            <span
              className={teamTaskManagerIconStyle({ empty: false })}
              style={
                m.profileImage
                  ? {
                      backgroundImage: `url(${m.profileImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }
                  : undefined
              }
            />
            <span className={chipNameStyle({ empty: false })}>{m.nickname}</span>
          </span>
        ))}
      </span>
      {overflowCount > 0 && (
        <span className={overflowLabelStyle}>외 {overflowCount}</span>
      )}

      {/* 너비 측정 전용으로 숨겨진 DOM */}
      <span className={hiddenMeasureStyle} aria-hidden='true'>
        {members.map((m, index) => (
          <span
            key={m.nickname}
            ref={(el) => {
              chipRefs.current[index] = el;
            }}
            className={teamTaskManagerStyle({ empty: false })}
          >
            <span className={teamTaskManagerIconStyle({ empty: false })} />
            <span className={chipNameStyle({ empty: false })}>{m.nickname}</span>
          </span>
        ))}
        <span ref={overflowMeasureRef} className={overflowLabelStyle}>
          외 {members.length}
        </span>
      </span>
    </button>
  );
};

const chipGroupWrapperStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: `${LABEL_GAP}px`,
  width: '100%',
  border: 'none',
  background: 'none',
  padding: 0,
  cursor: 'pointer',
  outline: 'none',
  overflow: 'hidden',
});

const chipRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: `${CHIP_GAP}px`,
  minWidth: 0,
});

// 너비 측정 전용으로 숨겨진 DOM. 화면에 표시되지 않음
const hiddenMeasureStyle = css({
  position: 'absolute',
  top: '-9999px',
  left: '-9999px',
  visibility: 'hidden',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  gap: `${CHIP_GAP}px`,
  whiteSpace: 'nowrap',
});

const overflowLabelStyle = css({
  textStyle: 'body4.m',
  color: 'blue.200',
  whiteSpace: 'nowrap',
  flexShrink: 0,
});

export const teamTaskManagerStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.375rem',
    borderRadius: '2.5rem',
    pl: '0.5rem',
    pr: '0.75rem',
    py: '0.5rem',
    flexShrink: 0,
  },
  variants: {
    // 담당자가 있을 때랑 없을 때
    empty: {
      true: { bg: 'gray.100' },
      false: { bg: 'blue.50' },
    },
  },
  defaultVariants: { empty: false },
});

export const teamTaskManagerIconStyle = cva({
  base: {
    width: '1.375rem',
    height: '1.375rem',
    borderRadius: 'full',
    flexShrink: 0,
  },
  variants: {
    empty: {
      true: { bg: 'gray.200' },
      false: { bg: 'blue.200' },
    },
  },
  defaultVariants: { empty: false },
});

const chipNameStyle = cva({
  base: {
    textStyle: 'body2.r',
    whiteSpace: 'nowrap',
    maxWidth: '3.5rem',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  variants: {
    empty: {
      true: { color: 'gray.300' },
      false: { color: 'gray.800' },
    },
  },
  defaultVariants: { empty: false },
});
