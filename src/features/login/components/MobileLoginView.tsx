'use client';

import Image from 'next/image';
import { css } from 'styled-system/css';
import { DoubleChevronDownIcon } from '@/components/icons/DoubleChevronDownIcon';
import { PREVIEW_SLIDES } from '@/constants/previewSlides';

export const MobileLoginView = () => {
  return (
    <div className={containerStyle}>
      {/* 섹션 1 — 인트로 */}
      <section className={introSectionStyle}>
        <div className={logoWrapperStyle}>
          <Image src='/login-logo.svg' alt='채택 로고' width={260} height={48} />
        </div>
        <p className={introTitleStyle}>모바일 화면 준비 중이에요!</p>
        <div className={previewLinkStyle}>
          <span className={previewTextStyle}>채택 서비스 미리보기</span>
          <DoubleChevronDownIcon />
        </div>
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
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              style={{ objectFit: 'contain' }}
              priority={i === 0}
            />
          </div>
          {i === PREVIEW_SLIDES.length - 1 ? (
            <div className={footerStyle}>
              <p className={footerTextStyle}>대학생을 위한 경량 과제 관리 서비스 채택</p>
              <Image src='/login-logo.svg' alt='채택 로고' width={156} height={28.8} />
            </div>
          ) : (
            <div className={scrollHintStyle}>
              <DoubleChevronDownIcon />
            </div>
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
  justifyContent: 'center',
  gap: '1.5rem',
  background: 'linear-gradient(180deg, #081221 33.688%, #317ae4 201.94%)',
  overflow: 'hidden',
});

const logoWrapperStyle = css({
  mb: '0.5rem',
});

const introTitleStyle = css({
  textStyle: 'h4',
  color: 'blue.200',
  textAlign: 'center',
});

const previewLinkStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  mt: '6rem',
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
    'radial-gradient(ellipse at center, #325279 0%, #1f3858 50%, #0c1e37 100%)',
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
  color: 'white',
});

const slideDescStyle = css({
  textStyle: 'body3.r',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  gap: '0',
});

const slideImageAreaStyle = css({
  position: 'relative',
  width: '18.875rem',
  height: '21.125rem',
  mt: '1rem',
  flexShrink: 0,
});

const scrollHintStyle = css({
  position: 'absolute',
  bottom: '2.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const footerStyle = css({
  position: 'absolute',
  bottom: '2.5rem',
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
