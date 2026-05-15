'use client';

import { FormEvent, useState } from 'react';
import Image from 'next/image';
import { css, cx } from 'styled-system/css';
import { hstack, stack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { Input } from '@/components/TextField';
import { KakaoLoginButton } from '@/features/login/components/KakaoLoginButton';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';

export const LoginModalContent = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const canSubmit = email.trim().length > 0 && password.length > 0;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className={containerStyle} onSubmit={handleSubmit}>
      <div className={introStyle}>
        <Image
          src='/login-logo.svg'
          alt='채택 로고'
          width={208}
          height={38.4}
          priority
        />
        <div className={introTextStyle}>
          <h2 className={titleStyle}>경량 과제 관리 서비스, 채택</h2>
          <p className={descriptionStyle}>
            이메일이나 SNS 간편 로그인으로 사용할 수 있어요
          </p>
        </div>
      </div>

      <div className={formAreaStyle}>
        <div className={inputGroupStyle}>
          <Input
            className={emailInputStyle}
            type='email'
            size='basic'
            value={email}
            placeholder='이메일을 입력하세요.'
            onChange={(event) => setEmail(event.target.value)}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
          <div className={passwordFieldStyle}>
            <Input
              className={cx(
                passwordInputStyle,
                emailFocused && css({ borderTopColor: 'gray.400!' }),
              )}
              type={showPassword ? 'text' : 'password'}
              size='basic'
              value={password}
              placeholder='비밀번호를 입력하세요.'
              onChange={(event) => setPassword(event.target.value)}
            />
            {password.length > 0 && (
              <button
                type='button'
                className={eyeButtonStyle}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            )}
          </div>
        </div>

        <div className={linkRowStyle}>
          <button type='button' className={subLinkStyle}>
            회원가입
          </button>
          <div className={findLinkGroupStyle}>
            <button type='button' className={subLinkStyle}>
              이메일 찾기
            </button>
            <span className={verticalDividerStyle} />
            <button type='button' className={subLinkStyle}>
              비밀번호 찾기
            </button>
          </div>
        </div>
      </div>

      <Button
        type='submit'
        variant='fillBlue'
        size='xlarge'
        disabled={!canSubmit}
      >
        로그인
      </Button>

      <div className={dividerRowStyle}>
        <span className={horizontalDividerStyle} />
        <span className={orTextStyle}>OR</span>
        <span className={horizontalDividerStyle} />
      </div>

      <KakaoLoginButton />

      <p className={consentStyle}>
        로그인 시 이용약관 및 개인정보 처리방침에 동의한 것으로 간주됩니다.
      </p>
    </form>
  );
};

const containerStyle = css(
  stack.raw({
    width: '32.625rem',
    alignItems: 'center',
    overflow: 'hidden',
    pt: '3rem',
    pb: '2.5rem',
  }),
);

const introStyle = css(
  stack.raw({
    alignItems: 'center',
    gap: '0.75rem',
  }),
);

const introTextStyle = css(
  stack.raw({
    alignItems: 'center',
    gap: '0.5rem',
    textAlign: 'center',
  }),
);

const titleStyle = css({
  textStyle: 'h3',
  color: 'blue.700',
});

const descriptionStyle = css({
  textStyle: 'body3.r',
  color: 'gray.600',
});

const formAreaStyle = css(
  stack.raw({
    width: '24.125rem',
    gap: '0.75rem',
    mt: '2.375rem',
  }),
);

const inputGroupStyle = css(
  stack.raw({
    gap: 0,
  }),
);

const inputBaseStyle = {
  width: 'full',
  height: '3rem',
  borderColor: 'gray.200!',
  _focus: {
    borderColor: 'gray.400!',
  },
} as const;

const emailInputStyle = css({
  ...inputBaseStyle,
  borderWidth: '1px',
  borderStyle: 'solid',
  borderBottomWidth: 0,
  borderRadius: 0,
  borderTopRadius: '0.25rem',
});

const passwordFieldStyle = css({
  position: 'relative',
  width: 'full',
});

const passwordInputStyle = css({
  ...inputBaseStyle,
  pr: '3rem',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderRadius: 0,
  borderBottomRadius: '0.25rem',
});

const eyeButtonStyle = css({
  position: 'absolute',
  top: '50%',
  right: '0.75rem',
  transform: 'translateY(-50%)',
  width: '1.5rem',
  height: '1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'gray.600',
  cursor: 'pointer',
});

const linkRowStyle = css(
  hstack.raw({
    justifyContent: 'space-between',
    width: 'full',
    mb: '1.25rem',
  }),
);

const findLinkGroupStyle = css(
  hstack.raw({
    gap: '0.25rem',
  }),
);

const subLinkStyle = css({
  textStyle: 'body4.r',
  color: 'gray.400',
  cursor: 'pointer',
});

const verticalDividerStyle = css({
  width: '0.0625rem',
  height: '0.875rem',
  bg: 'gray.400',
});

const dividerRowStyle = css(
  hstack.raw({
    gap: '0.5rem',
    width: '24.125rem',
    my: '0.75rem',
  }),
);

const horizontalDividerStyle = css({
  flex: 1,
  height: '0.0625rem',
  bg: 'gray.200',
});

const orTextStyle = css({
  textStyle: 'body3.r',
  color: 'gray.400',
});

const consentStyle = css({
  mt: '2rem',
  textStyle: 'body4.r',
  color: 'gray.500',
});
