'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { css } from 'styled-system/css';
import { center, hstack, stack } from 'styled-system/patterns';
import Image from 'next/image';
import { LeftIcon } from '@/components/icons/LeftIcon';
import { RightIcon } from '@/components/icons/RightIcon';

// 슬라이드 데이터
const SLIDES = [
  {
    index: '1/3',
    image: '/login-slide-1.png',
    title: '명도차이로 확인하는\n과제 마감 우선순위',
    description:
      '홈화면의 달력으로 이달의 전체 일정을 한 눈에 확인해요.\n또, 과제 마감의 우선순위를 직관적으로 알려줘요.',
  },
  {
    index: '2/3',
    image: '/login-slide-2.png',
    title: '한 눈에 확인하는\n과제 진척도',
    description:
      '과제별로 세부 TASK와 필요한 자료를 등록해요.\nTASK 완료에 따라 과제 진척도를 확인할 수 있어요.',
  },
  {
    index: '3/3',
    image: '/login-slide-3.png',
    title: '세부 과제별로\n팀원들과 소통하기',
    description:
      '코드 공유로 팀원을 초대하고 팀프로젝트를 진행해요.\nTASK별로 담당자 설정과 의사소통이 가능해요.',
  },
];

export const LoginCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 4000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
    startTimer();
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    startTimer();
  };

  return (
    <div className={mainStyle}>
      {/* 좌측 패널 */}
      <div className={leftPanelStyle}>
        {SLIDES.map((s, i) => (
          <div
            key={s.index}
            className={imageLayerStyle}
            style={{ opacity: currentSlide === i ? 1 : 0 }}
          >
            <Image
              src={s.image}
              alt={`슬라이드 ${s.index}`}
              fill
              style={{ objectFit: 'contain', padding: '60px' }}
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* 우측 패널 */}
      <div className={rightContentStyle}>
        <div className={textAreaStyle}>
          {SLIDES.map((s, i) => (
            <div
              key={s.index}
              className={textLayerStyle}
              style={{
                opacity: currentSlide === i ? 1 : 0,
                position: i === 0 ? 'relative' : 'absolute',
              }}
            >
              <span className={slideIndexStyle}>{s.index}</span>
              <div className={slideTextStyle}>
                <h1 className={slideTitleStyle}>{s.title}</h1>
                <p className={slideDescriptionStyle}>{s.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 좌우 화살표 */}
        <div className={navButtonsStyle}>
          <button
            className={navButtonStyle}
            onClick={handlePrev}
            aria-label='이전 슬라이드'
          >
            <LeftIcon stroke='login' />
          </button>
          <button
            className={navButtonStyle}
            onClick={handleNext}
            aria-label='다음 슬라이드'
          >
            <RightIcon stroke='login' />
          </button>
        </div>
      </div>
    </div>
  );
};

// 네비게이션 버튼
const navButtonStyle = css(
  center.raw({
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    border: '1px solid',
    borderColor: 'gray.400',
    cursor: 'pointer',
    color: 'gray.400',
    transition: 'border-color 0.3s ease-in-out',
    '& path': {
      transition: 'stroke 0.3s ease-in-out',
    },
    _hover: {
      borderColor: 'gray.600',
      '& path': {
        stroke: 'token(colors.gray.600)',
      },
    },
  }),
);

const mainStyle = css(
  hstack.raw({
    flex: 1,
    gap: 0,
    alignItems: 'stretch',
  }),
);

const leftPanelStyle = css({
  position: 'relative',
  width: '55.56%', // 800/1440
  bg: 'blue.50',
});

const imageLayerStyle = css({
  position: 'absolute',
  inset: 0,
  transition: 'opacity 500ms ease-out',
});

const rightContentStyle = css(
  stack.raw({
    flex: 1,
    justifyContent: 'center',
    paddingLeft: '5rem',
    gap: '2.25rem',
  }),
);

const textAreaStyle = css({
  position: 'relative',
  minHeight: '8rem',
});

const textLayerStyle = css(
  stack.raw({
    position: 'absolute',
    inset: 0,
    gap: '0.25rem',
    transition: 'opacity 500ms ease-out',
  }),
);

const slideTextStyle = css(
  stack.raw({
    gap: '0.75rem',
  }),
);

const navButtonsStyle = css(
  hstack.raw({
    gap: '1.25rem',
  }),
);

const slideIndexStyle = css({
  fontStyle: 'body1.r',
  color: 'gray.900',
});

const slideTitleStyle = css({
  textStyle: 'h1',
  color: 'gray.900',
  whiteSpace: 'pre-line',
});

const slideDescriptionStyle = css({
  textStyle: 'body1.r',
  color: 'gray.900',
  whiteSpace: 'pre-line',
});
