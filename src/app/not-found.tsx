'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { css } from 'styled-system/css';
import { Button } from '@/components/Button';

const img404 = '/404.png';
const imgEllipse1 = '/404-ellipse-1.svg';
const imgEllipse2 = '/404-ellipse-2.svg';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className={pageStyle}>
      <div className={ellipse1OuterStyle}>
        <div className={rotateMinus30Style}>
          <div className={ellipse1InnerStyle}>
            <img
              alt=""
              src={imgEllipse1}
              className={css({
                position: 'absolute',
                top: '-14.29%',
                bottom: '-14.29%',
                left: '-22.69%',
                right: '-22.69%',
                display: 'block',
                maxW: 'none',
                w: 'full',
                h: 'full',
              })}
            />
          </div>
        </div>
      </div>

      <div className={ellipse2OuterStyle}>
        <div className={rotateMinus30Style}>
          <div className={ellipse2InnerStyle}>
            <img
              alt=""
              src={imgEllipse2}
              className={css({
                position: 'absolute',
                top: '-10.2%',
                bottom: '-10.2%',
                left: '-16.21%',
                right: '-16.21%',
                display: 'block',
                maxW: 'none',
                w: 'full',
                h: 'full',
              })}
            />
          </div>
        </div>
      </div>

      <div className={contentStyle}>
        <div className={upperGroupStyle}>
          <Image
            alt="404"
            src={img404}
            width={440}
            height={172}
            className={css({
              w: '27.5rem',
              h: '10.75rem',
              objectFit: 'cover',
              flexShrink: 0,
              position: 'relative',
            })}
          />
          <div className={textBlockStyle}>
            <p className={titleStyle}>정보를 불러올 수 없습니다.</p>
            <div className={descGroupStyle}>
              <p className={subtitleStyle}>길을 잃으셨나요? 걱정 마세요. 기록은 안전합니다.</p>
              <div className={descStyle}>
                <p className={css({ mb: '0', lineHeight: 'normal', whiteSpace: 'pre' })}>
                  {` 요청하신 페이지를 찾을 수 없지만, 과제들은 잘 보관되어 있어요. `}
                </p>
                <p className={css({ lineHeight: 'normal', whiteSpace: 'pre' })}>
                  다시 홈으로 가서 남은 일정을 관리해 볼까요?
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button onClick={() => router.push('/')}>홈으로 가기</Button>
      </div>
    </div>
  );
}

const pageStyle = css({
  position: 'relative',
  minH: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  bg: 'blue.50',
  overflow: 'hidden',
});

const rotateMinus30Style = css({
  transform: 'rotate(-30deg)',
  flexShrink: 0,
});

const ellipse1OuterStyle = css({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  h: '1653.072px',
  w: '1463.205px',
  left: 'calc(41.67% - 1px)',
  top: '-546px',
});

const ellipse1InnerStyle = css({
  h: '1400px',
  w: '881.273px',
  position: 'relative',
});

const ellipse2OuterStyle = css({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  h: '2082.995px',
  w: '1843.748px',
  left: '-654px',
  top: '-342px',
});

const ellipse2InnerStyle = css({
  h: '1764.105px',
  w: '1110.47px',
  position: 'relative',
});

const contentStyle = css({
  position: 'relative',
  display: 'flex',
  flexDir: 'column',
  alignItems: 'center',
  gap: '7.5rem',
  zIndex: 1,
});

const upperGroupStyle = css({
  display: 'flex',
  flexDir: 'column',
  alignItems: 'center',
  gap: '2.5rem',
  flexShrink: 0,
});

const textBlockStyle = css({
  display: 'flex',
  flexDir: 'column',
  alignItems: 'center',
  gap: '1.25rem',
  fontWeight: 'medium',
});

const titleStyle = css({
  fontSize: '2.75rem',
  fontWeight: 'medium',
  lineHeight: 'normal',
  letterSpacing: '-0.01em',
  color: 'blue.700',
  whiteSpace: 'nowrap',
});

const descGroupStyle = css({
  display: 'flex',
  flexDir: 'column',
  alignItems: 'center',
  gap: '0.5rem',
  color: 'blue.600',
  textAlign: 'center',
});

const subtitleStyle = css({
  textStyle: 'h3',
  whiteSpace: 'nowrap',
});

const descStyle = css({
  textStyle: 'h4',
});
