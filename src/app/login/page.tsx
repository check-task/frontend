import { css } from 'styled-system/css';
import { center, stack, hstack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { Input } from '@/components/TextField';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div
      className={center({
        flexDirection: 'column',
        justifyContent: 'flex-start',
        gap: '5rem',
        marginTop: '12.5rem',
      })}
    >
      {/* 로고 */}
      <Image src='/logo.svg' alt='logo' width={260} height={48} />

      {/* 로그인 컨테이너 */}
      <div
        className={hstack({
          gap: '2.5rem',
          alignItems: 'flex-start',
          marginTop: '1.25rem',
          height: '19.125rem',
        })}
      >
        {/* 이메일 로그인 섹션 */}
        <div className={stack({ gap: '1.5rem', height: '100%' })}>
          <h2
            className={css({
              textStyle: 'h2',
              color: 'gray.900',
            })}
          >
            이메일로 로그인하기
          </h2>

          <div
            className={stack({
              gap: '0.75rem',
            })}
          >
            {/* 입력 폼 */}
            {/* Input 컴포넌트 2개를 붙이기 위해 css 조정 */}
            <div>
              <Input
                type='email'
                placeholder='가입하신 이메일을 입력하세요.'
                width='24.125rem'
                className={css({
                  borderBottomLeftRadius: '0',
                  borderBottomRightRadius: '0',
                  position: 'relative',
                  _focus: {
                    zIndex: 1,
                  },
                })}
              />
              <Input
                type='password'
                placeholder='비밀번호를 입력하세요.'
                width='24.125rem'
                className={css({
                  borderTopLeftRadius: '0',
                  borderTopRightRadius: '0',
                  marginTop: '-2px',
                  position: 'relative',
                  _focus: {
                    zIndex: 1,
                  },
                })}
              />
            </div>

            {/* 링크들 */}
            <div
              className={hstack({
                justifyContent: 'space-between',
                color: 'gray.500',
              })}
            >
              <span
                className={css({
                  textStyle: 'body4.r',
                  cursor: 'pointer',
                })}
              >
                회원가입
              </span>
              <div className={hstack({ gap: '0.5rem' })}>
                <span
                  className={css({
                    textStyle: 'body4.r',
                    cursor: 'pointer',
                  })}
                >
                  이메일 찾기
                </span>
                <span
                  className={css({
                    width: '0.0625rem',
                    height: '0.875rem',
                    bg: 'gray.500',
                  })}
                />
                <span
                  className={css({
                    textStyle: 'body4.r',
                    cursor: 'pointer',
                  })}
                >
                  비밀번호 찾기
                </span>
              </div>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <Button
            variant='fillBlue'
            size='xlarge'
            className={css({ marginTop: 'auto' })}
          >
            로그인
          </Button>
        </div>

        {/* 세로 구분선 */}
        <div
          className={css({
            width: '0.0625rem',
            height: '19.125rem',
            bg: 'gray.200',
          })}
        />

        {/* 카카오 로그인 섹션 */}
        <div className={stack({ gap: '1.5rem', height: '100%' })}>
          <h2
            className={css({
              textStyle: 'h2',
              color: 'gray.900',
            })}
          >
            카카오로 간편로그인하기
          </h2>

          <p
            className={css({
              textStyle: 'body2.m',
              color: 'gray.600',
            })}
          >
            아이디와 비밀번호 입력하기 귀찮으시죠?
            <br />
            1초 회원가입으로 입력없이 간편하게 로그인 하세요.
          </p>

          {/* 카카오 로그인 버튼 */}
          {/* 디자인 위계에 없는 스타일이기 때문에 따로 정의 */}
          <button
            className={hstack({
              marginTop: 'auto',
              paddingY: '0.9375rem',
              justifyContent: 'center',
              gap: '0.5rem',
              width: '24.125rem',
              height: '3.375rem',
              bg: '#FEE500',
              borderRadius: '0.5rem',
              cursor: 'pointer',
            })}
          >
            <Image
              src='/kakao-icon.svg'
              alt='kakaoicon'
              width={24}
              height={27}
            />
            <span
              className={css({
                textStyle: 'btn',
                color: 'rgba(0, 0, 0, 0.85)',
              })}
            >
              카카오 로그인
            </span>
          </button>
        </div>
      </div>

      {/* 하단 안내 텍스트 */}
      <p
        className={css({
          textStyle: 'body3.r',
          color: 'gray.500',
        })}
      >
        계속 진행하면 이용약관 및 개인정보처리방침을 이해하고 동의하는 것으로
        간주됩니다.
      </p>
    </div>
  );
}
