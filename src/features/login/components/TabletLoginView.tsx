'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from 'styled-system/jsx';
import { center, hstack, stack } from 'styled-system/patterns';
import Image from 'next/image';
import { DoubleChevronDownIcon } from '@/components/icons/DoubleChevronDownIcon';
import { PREVIEW_SLIDES } from '@/constants/previewSlides';
import { LeftIcon } from '@/components/icons/LeftIcon';
import { RightIcon } from '@/components/icons/RightIcon';

const TOTAL = PREVIEW_SLIDES.length + 1; // 인트로 슬라이드 + 미리보기 3개

const TABLET_TITLES = [
  '명도차이로 확인하는\n과제 마감 우선순위',
  '한 눈에 확인하는\n과제 진척도',
  '세부 과제별로\n팀원들과 소통하기',
];

const PREVIEW_START = 1;
const PREVIEW_END = TOTAL - 1;

export const TabletLoginView = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startPreviewTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) =>
        prev >= PREVIEW_END ? PREVIEW_START : prev + 1,
      );
    }, 4000);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleEnterPreview = () => {
    setCurrentSlide(PREVIEW_START);
    startPreviewTimer();
  };

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev <= PREVIEW_START ? PREVIEW_END : prev - 1));
    startPreviewTimer();
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev >= PREVIEW_END ? PREVIEW_START : prev + 1));
    startPreviewTimer();
  };

  return (
    <Container.Main
      style={{
        background:
          currentSlide === 0
            ? 'linear-gradient(180deg, #081221 33.688%, #317ae4 201.94%)'
            : 'radial-gradient(ellipse at center, #14315b 0%, #0e223e 50%, #081221 100%)',
      }}
    >
      {/* 슬라이드 0: 인트로 */}
      <Container.IntroSlide style={{ opacity: currentSlide === 0 ? 1 : 0 }}>
        <Container.LogoWrapper>
          <Image
            src='/login-logo.svg'
            alt='채택 로고'
            width={320}
            height={59}
          />
        </Container.LogoWrapper>
        <Text.IntroTitle>모바일 화면 준비 중이에요!</Text.IntroTitle>
        <Container.PreviewLink>
          <Text.PreviewText>채택 서비스 미리보기</Text.PreviewText>
          <button
            onClick={handleEnterPreview}
            style={{
              background: 'none',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
            }}
          >
            <DoubleChevronDownIcon
              size='md'
              style={{ transform: 'rotate(-90deg)' }}
            />
          </button>
        </Container.PreviewLink>
      </Container.IntroSlide>

      {/* 슬라이드 1–3: 서비스 미리보기 */}
      {PREVIEW_SLIDES.map((slide, i) => (
        <Container.PreviewSlide
          key={i}
          style={{
            opacity: currentSlide === i + 1 ? 1 : 0,
            pointerEvents: currentSlide === i + 1 ? 'auto' : 'none',
          }}
        >
          {/* 좌: 앱 목업 이미지 */}
          <Container.ImagePanel>
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              style={{
                objectFit: 'contain',
                padding: '30px',
                paddingRight: '0px',
              }}
              priority={i === 0}
            />
          </Container.ImagePanel>

          {/* 우: 텍스트 + 네비게이션 */}
          <Container.TextPanel>
            <Container.SlideText>
              <Text.SlideTitle>{TABLET_TITLES[i]}</Text.SlideTitle>
              <Container.SlideDesc>
                {slide.description.map((line, j) => (
                  <Text.SlideDescription key={j}>{line}</Text.SlideDescription>
                ))}
              </Container.SlideDesc>
            </Container.SlideText>
            <Container.NavButtons>
              <NavButton onClick={handlePrev} aria-label='이전 슬라이드'>
                <LeftIcon stroke='tablet' />
              </NavButton>
              <NavButton onClick={handleNext} aria-label='다음 슬라이드'>
                <RightIcon stroke='tablet' />
              </NavButton>
            </Container.NavButtons>
          </Container.TextPanel>
        </Container.PreviewSlide>
      ))}
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
    borderColor: 'gray.100',
    cursor: 'pointer',
    color: 'gray.100',
    transition: 'border-color 0.3s ease-in-out',
    '& path': {
      transition: 'stroke 0.3s ease-in-out',
    },
    _hover: {
      borderColor: 'gray.300',
      '& path': {
        stroke: 'token(colors.gray.300)',
      },
    },
  }),
});

// Container 관련 스타일
const Container = {
  Main: styled('div', {
    base: {
      position: 'relative',
      width: '100%',
      height: '100dvh',
      overflow: 'hidden',
    },
  }),
  IntroSlide: styled('div', {
    base: stack.raw({
      position: 'absolute',
      inset: 0,
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 500ms ease-out',
      background: 'linear-gradient(180deg, #081221 33.688%, #317ae4 201.94%)',
    }),
  }),
  LogoWrapper: styled('div', {
    base: {
      mt: '2rem',
      mb: '1.5rem',
    },
  }),
  PreviewLink: styled('div', {
    base: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      mt: '13rem',
      background: 'none',
      border: 'none',
      padding: 0,
    },
  }),
  PreviewSlide: styled('div', {
    base: hstack.raw({
      position: 'absolute',
      inset: 0,
      gap: 0,
      alignItems: 'stretch',
      transition: 'opacity 500ms ease-out',
      background:
        'radial-gradient(ellipse at center, #14315b 0%, #0e223e 50%, #081221 100%)',
    }),
  }),
  ImagePanel: styled('div', {
    base: {
      position: 'relative',
      width: '50%',
      flexShrink: 0,
    },
  }),
  TextPanel: styled('div', {
    base: stack.raw({
      flex: 1,
      justifyContent: 'center',
      paddingLeft: '2.5rem',
      gap: '2rem',
    }),
  }),
  SlideText: styled('div', {
    base: stack.raw({
      gap: '0.75rem',
    }),
  }),
  SlideDesc: styled('div', {
    base: stack.raw({
      gap: 0,
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
  IntroTitle: styled('p', {
    base: {
      textStyle: 'h2',
      color: 'blue.200',
    },
  }),
  PreviewText: styled('span', {
    base: {
      textStyle: 'h4',
      color: 'gray.200',
    },
  }),
  SlideTitle: styled('h2', {
    base: {
      textStyle: 'h2',
      color: 'white',
      whiteSpace: 'pre-line',
    },
  }),
  SlideDescription: styled('p', {
    base: {
      textStyle: 'body2.r',
      color: 'white',
    },
  }),
};
