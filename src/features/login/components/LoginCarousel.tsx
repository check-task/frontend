'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-system/jsx';
import { center, hstack, stack } from 'styled-system/patterns';
import Image from 'next/image';
import { LeftIcon } from '@/components/icons/LeftIcon';
import { RightIcon } from '@/components/icons/RightIcon';

// 슬라이드 데이터
const SLIDES = [
  {
    index: '1/3',
    image: '/login-slide-1.svg',
    title: '명도차이로 확인하는\n과제 마감 우선순위',
    description:
      '홈화면의 달력으로 이달의 전체 일정을 한 눈에 확인해요.\n또, 과제 마감의 우선순위를 직관적으로 알려줘요.',
  },
  {
    index: '2/3',
    image: '/login-slide-2.svg',
    title: '한 눈에 확인하는\n과제 진척도',
    description:
      '과제별로 세부 TASK와 필요한 자료를 등록해요.\nTASK 완료에 따라 과제 진척도를 확인할 수 있어요.',
  },
  {
    index: '3/3',
    image: '/login-slide-3.svg',
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
    <Container.Main>
      {/* 좌측 패널 - 이미지 영역 */}
      <Container.LeftPanel>
        {SLIDES.map((s, i) => (
          <Container.ImageLayer
            key={s.index}
            style={{ opacity: currentSlide === i ? 1 : 0 }}
          >
            <Image
              src={s.image}
              alt={`슬라이드 ${s.index}`}
              fill
              style={{ objectFit: 'contain', padding: '60px' }}
              priority={i === 0}
            />
          </Container.ImageLayer>
        ))}
      </Container.LeftPanel>

      {/* 우측 컨텐츠 - 텍스트 + 네비게이션 */}
      <Container.RightContent>
        <Container.TextArea>
          {SLIDES.map((s, i) => (
            <Container.TextLayer
              key={s.index}
              style={{
                opacity: currentSlide === i ? 1 : 0,
                position: i === 0 ? 'relative' : 'absolute',
              }}
            >
              <Text.SlideIndex>{s.index}</Text.SlideIndex>
              <Container.SlideText>
                <Text.SlideTitle>{s.title}</Text.SlideTitle>
                <Text.SlideDescription>{s.description}</Text.SlideDescription>
              </Container.SlideText>
            </Container.TextLayer>
          ))}
        </Container.TextArea>

        {/* 좌우 화살표 */}
        <Container.NavButtons>
          <NavButton onClick={handlePrev} aria-label='이전 슬라이드'>
            <LeftIcon stroke='login' />
          </NavButton>
          <NavButton onClick={handleNext} aria-label='다음 슬라이드'>
            <RightIcon stroke='login' />
          </NavButton>
        </Container.NavButtons>
      </Container.RightContent>
    </Container.Main>
  );
};

// 네비게이션 버튼
const NavButton = styled('button', {
  base: center.raw({
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
});

// Container 관련 스타일
const Container = {
  Main: styled('div', {
    base: hstack.raw({
      flex: 1,
      gap: 0,
      alignItems: 'stretch',
    }),
  }),
  LeftPanel: styled('div', {
    base: {
      position: 'relative',
      width: '55.56%', // 800/1440
      bg: 'blue.50',
    },
  }),
  ImageLayer: styled('div', {
    base: {
      position: 'absolute',
      inset: 0,
      transition: 'opacity 500ms ease-out',
    },
  }),
  RightContent: styled('div', {
    base: stack.raw({
      flex: 1,
      justifyContent: 'center',
      paddingLeft: '5rem',
      gap: '2.25rem',
    }),
  }),
  TextArea: styled('div', {
    base: {
      position: 'relative',
      minHeight: '8rem',
    },
  }),
  TextLayer: styled('div', {
    base: stack.raw({
      position: 'absolute',
      inset: 0,
      gap: '0.25rem',
      transition: 'opacity 500ms ease-out',
    }),
  }),
  SlideText: styled('div', {
    base: stack.raw({
      gap: '0.75rem',
    }),
  }),
  NavButtons: styled('div', {
    base: hstack.raw({
      gap: '1.25rem',
    }),
  }),
};

// 텍스트 스타일
const Text = {
  SlideIndex: styled('span', {
    base: {
      fontStyle: 'body1.r',
      color: 'gray.900',
    },
  }),
  SlideTitle: styled('h1', {
    base: {
      textStyle: 'h1',
      color: 'gray.900',
      whiteSpace: 'pre-line',
    },
  }),
  SlideDescription: styled('p', {
    base: {
      textStyle: 'body1.r',
      color: 'gray.900',
      whiteSpace: 'pre-line',
    },
  }),
};
