'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { css } from 'styled-system/css';
import { DoubleChevronDownIcon } from '@/components/icons/DoubleChevronDownIcon';
import { PREVIEW_SLIDES } from '@/constants/previewSlides';

export const MobileLoginView = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToNext = (currentIndex: number) => {
    const container = containerRef.current;
    if (!container) return;
    const sections = container.querySelectorAll('section');
    const next = sections[currentIndex + 1];
    if (next) next.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className={containerStyle}>
      {/* 섹션 1 — 인트로 */}
      <section className={introSectionStyle}>
        <div className={introCenterStyle}>
          <div className={logoWrapperStyle}>
            <Image
              src='/login-logo.svg'
              alt='채택 로고'
              width={260}
              height={48}
            />
          </div>
          <p className={introTitleStyle}>모바일 화면 준비 중이에요!</p>
        </div>
        <button className={scrollHintStyle} onClick={() => scrollToNext(0)}>
          <span className={previewTextStyle}>채택 서비스 미리보기</span>
          <DoubleChevronDownIcon />
        </button>
      </section>

      {/* 섹션 2–4 — 서비스 미리보기 */}
      {PREVIEW_SLIDES.map((slide, i) => (
        <section key={i} className={previewSectionStyle}>
          <div className={slideTextAreaStyle}>
            <p className={slideTitleStyle}>{slide.title}</p>
            <div className={slideDescStyle}>
              {slide.description.map((line, j) => (
                <p key={j}>{line}</p>
              ))}
            </div>
          </div>
          <div className={slideImageAreaStyle}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt={slide.title}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
          {i === PREVIEW_SLIDES.length - 1 ? (
            <div className={footerStyle}>
              <p className={footerTextStyle}>
                대학생을 위한 경량 과제 관리 서비스 채택
              </p>
              <Image
                src='/login-logo.svg'
                alt='채택 로고'
                width={156}
                height={28.8}
              />
            </div>
          ) : (
            <button
              className={scrollHintStyle}
              onClick={() => scrollToNext(i + 1)}
            >
              <DoubleChevronDownIcon />
            </button>
          )}
        </section>
      ))}
    </div>
  );
};

const containerStyle = css({
  height: '100dvh',
  overflowY: 'scroll',
  scrollSnapType: 'y mandatory',
});

const introSectionStyle = css({
  height: '100dvh',
  scrollSnapAlign: 'start',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  background: 'linear-gradient(180deg, #081221 33.688%, #317ae4 201.94%)',
  overflow: 'hidden',
});

const introCenterStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2.5rem',
  margin: 'auto',
});

const logoWrapperStyle = css({
  mb: '0.5rem',
});

const introTitleStyle = css({
  textStyle: 'h4',
  color: 'blue.200',
  textAlign: 'center',
});

const previewTextStyle = css({
  textStyle: 'body2.r',
  color: 'gray.200',
});

const previewSectionStyle = css({
  height: '100dvh',
  scrollSnapAlign: 'start',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'flex-start',
  position: 'relative',
  background:
    'radial-gradient(ellipse at center, #14315b 0%, #0e223e 50%, #081221 100%)',
  overflow: 'hidden',
});

const slideTextAreaStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem',
  pt: '7.5rem',
  px: '1.5rem',
  textAlign: 'center',
  zIndex: 1,
});

const slideTitleStyle = css({
  textStyle: 'h4',
  color: 'gray.0',
});

const slideDescStyle = css({
  textStyle: 'body3.r',
  color: 'gray.0',
  display: 'flex',
  flexDirection: 'column',
});

const slideImageAreaStyle = css({
  position: 'relative',
  width: '18.875rem',
  height: '21.125rem',
  mt: '1rem',
  flexShrink: 0,
});

const scrollHintStyle = css({
  mt: 'auto',
  mb: '7.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '1rem',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
});

const footerStyle = css({
  mt: 'auto',
  mb: '2.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem',
});

const footerTextStyle = css({
  textStyle: 'body4.r',
  color: 'blue.200',
  textAlign: 'center',
});
