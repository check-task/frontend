'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import Image from 'next/image';
import { isAxiosError } from 'axios';
import { z } from 'zod';
import { css } from 'styled-system/css';
import { hstack, stack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { Input } from '@/components/TextField';
import { CheckMark } from '@/components/icons/CheckMark';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import {
  confirmPasswordReset,
  sendPasswordResetCode,
  verifyPasswordResetCode,
} from '@/services/auth';

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 20;
const PASSWORD_SPECIAL_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

const hasSpecialChar = (str: string) => PASSWORD_SPECIAL_REGEX.test(str);

type ResetStep = 'email' | 'code' | 'password' | 'confirm' | 'complete';
type RuleState = 'idle' | 'valid' | 'invalid';

const emailSchema = z.email('올바른 이메일 형식으로 입력해 주세요.');

const passwordResetCodeSchema = z.object({
  email: emailSchema,
  code: z.string().trim().length(6, '인증코드는 6자리입니다.'),
});

const passwordSchema = z
  .string()
  .min(PASSWORD_MIN, `비밀번호는 ${PASSWORD_MIN}자 이상이어야 합니다.`)
  .max(PASSWORD_MAX, `비밀번호는 ${PASSWORD_MAX}자 이하여야 합니다.`)
  .regex(PASSWORD_SPECIAL_REGEX, '비밀번호에 특수문자가 포함되어야 합니다.');

const passwordResetConfirmSchema = z
  .object({
    resetToken: z.string().min(1, '인증을 다시 진행해 주세요.'),
    password: passwordSchema,
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해 주세요.'),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 불일치합니다.',
  });

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!isAxiosError(error)) return fallback;

  const data = error.response?.data as
    | { reason?: string; message?: string; errorCode?: string }
    | undefined;

  return data?.reason ?? data?.message ?? fallback;
};

const getPasswordResetCodeErrorMessage = (error: unknown) => {
  if (!isAxiosError(error)) return '인증번호가 불일치합니다.';

  const data = error.response?.data as
    | { reason?: string; message?: string; errorCode?: string }
    | undefined;

  if (data?.errorCode === 'INVALID_CODE') {
    return '인증번호가 불일치합니다.';
  }

  return data?.reason ?? data?.message ?? '인증번호가 불일치합니다.';
};

interface PasswordResetModalContentProps {
  onBackToLogin: () => void;
}

export const PasswordResetModalContent = ({
  onBackToLogin,
}: PasswordResetModalContentProps) => {
  const [step, setStep] = useState<ResetStep>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [codeStatus, setCodeStatus] = useState<'idle' | 'valid' | 'invalid'>(
    'idle',
  );
  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [passwordResetError, setPasswordResetError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isPasswordLengthValid =
    password.length >= PASSWORD_MIN && password.length <= PASSWORD_MAX;
  const isPasswordSpecialValid = hasSpecialChar(password);
  const isPasswordValid = isPasswordLengthValid && isPasswordSpecialValid;
  const isPasswordConfirmValid =
    passwordConfirm.length > 0 && password === passwordConfirm;
  const isPasswordConfirmInvalid =
    passwordConfirm.length > 0 && password !== passwordConfirm;

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    setCode('');
    setResetToken('');
    setCodeStatus('idle');
    setEmailError('');
    setCodeError('');
    setPasswordResetError('');
  };

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
    setCodeStatus('idle');
    setCodeError('');
    setPasswordResetError('');
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    setPasswordResetError('');
  };

  const handlePasswordConfirmChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordConfirm(event.target.value);
    setPasswordResetError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (step === 'email') {
      const parsed = emailSchema.safeParse(email.trim());

      if (!parsed.success) {
        setEmailError(
          parsed.error.issues[0]?.message ?? '이메일을 확인해 주세요.',
        );
        return;
      }

      setIsSubmitting(true);
      setEmailError('');
      setCode('');
      setResetToken('');
      setCodeStatus('idle');

      try {
        await sendPasswordResetCode({ email: parsed.data });
        setStep('code');
      } catch (error) {
        setEmailError(
          getApiErrorMessage(error, '인증코드 발송에 실패했습니다.'),
        );
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (step === 'code') {
      const parsed = passwordResetCodeSchema.safeParse({
        email: email.trim(),
        code: code.trim(),
      });

      if (!parsed.success) {
        setCodeStatus('invalid');
        setCodeError(
          parsed.error.issues[0]?.message ?? '인증코드를 확인해 주세요.',
        );
        return;
      }

      setIsSubmitting(true);
      setCodeError('');
      setCodeStatus('idle');

      try {
        const { resetToken } = await verifyPasswordResetCode({
          email: parsed.data.email,
          code: parsed.data.code,
        });
        setResetToken(resetToken);
        setCodeStatus('valid');
        setStep('password');
      } catch (error) {
        setResetToken('');
        setCodeStatus('invalid');
        setCodeError(getPasswordResetCodeErrorMessage(error));
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (step === 'password') {
      const parsed = passwordSchema.safeParse(password);

      if (!parsed.success) {
        setPasswordResetError(
          parsed.error.issues[0]?.message ?? '비밀번호를 확인해 주세요.',
        );
        return;
      }

      setStep('confirm');
      return;
    }

    if (step === 'confirm') {
      const parsed = passwordResetConfirmSchema.safeParse({
        resetToken,
        password,
        passwordConfirm,
      });

      if (!parsed.success) {
        setPasswordResetError(
          parsed.error.issues[0]?.message ?? '비밀번호를 확인해 주세요.',
        );
        return;
      }

      setIsSubmitting(true);
      setPasswordResetError('');

      try {
        await confirmPasswordReset({
          resetToken: parsed.data.resetToken,
          newPassword: parsed.data.password,
        });
        setStep('complete');
      } catch (error) {
        setPasswordResetError(
          getApiErrorMessage(error, '비밀번호 재설정에 실패했습니다.'),
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form
      className={step === 'complete' ? completeContainerStyle : containerStyle}
      onSubmit={handleSubmit}
      noValidate
    >
      <Header />

      {step === 'email' && (
        <ResetPanel
          title='이메일 입력'
          description='가입하신 이메일을 입력하세요.'
          buttonDisabled={!email.trim() || isSubmitting}
          buttonLabel={isSubmitting ? '발송중' : '다음'}
        >
          <div className={fieldWithMessageStyle}>
            <Input
              type='email'
              size='basic'
              value={email}
              placeholder='이메일'
              onChange={handleEmailChange}
              className={inputStyle}
            />
            {emailError && <p className={errorStyle}>{emailError}</p>}
          </div>
        </ResetPanel>
      )}

      {step === 'code' && (
        <ResetPanel
          title='인증코드 입력'
          description='이메일로 전송된 인증코드를 입력하세요.'
          buttonDisabled={code.trim().length !== 6 || isSubmitting}
          buttonLabel={isSubmitting ? '확인중' : '다음'}
        >
          <div className={fieldWithMessageStyle}>
            <Input
              type='text'
              inputMode='numeric'
              size='basic'
              value={code}
              placeholder='인증코드'
              onChange={handleCodeChange}
              className={inputStyle}
            />
            {codeStatus !== 'idle' && (
              <p
                className={
                  codeStatus === 'valid' ? successMessageStyle : errorStyle
                }
              >
                {codeStatus === 'valid'
                  ? '인증번호가 일치합니다.'
                  : codeError || '인증번호가 불일치합니다.'}
              </p>
            )}
          </div>
        </ResetPanel>
      )}

      {step === 'password' && (
        <ResetPanel
          title='비밀번호 설정'
          description='사용하실 새로운 비밀번호를 입력하세요.'
          buttonDisabled={!isPasswordValid || isSubmitting}
        >
          <div className={passwordFieldGroupStyle}>
            <PasswordField
              value={password}
              placeholder='비밀번호'
              showPassword={showPassword}
              onToggleShow={() => setShowPassword((prev) => !prev)}
              onChange={handlePasswordChange}
            />
            <PasswordRules
              lengthState={getRuleState(password, isPasswordLengthValid)}
              specialState={getRuleState(password, isPasswordSpecialValid)}
            />
            {passwordResetError && (
              <p className={errorStyle}>{passwordResetError}</p>
            )}
          </div>
        </ResetPanel>
      )}

      {step === 'confirm' && (
        <ResetPanel
          title='비밀번호 확인'
          description='사용하실 새로운 비밀번호를 다시 입력하세요.'
          buttonDisabled={!isPasswordConfirmValid || isSubmitting}
          buttonLabel={isSubmitting ? '변경중' : '다음'}
        >
          <div className={fieldWithMessageStyle}>
            <PasswordField
              value={passwordConfirm}
              placeholder='비밀번호'
              showPassword={showPasswordConfirm}
              onToggleShow={() => setShowPasswordConfirm((prev) => !prev)}
              onChange={handlePasswordConfirmChange}
            />
            {isPasswordConfirmInvalid && (
              <p className={errorStyle}>비밀번호가 불일치합니다.</p>
            )}
            {isPasswordConfirmValid && (
              <p className={successMessageStyle}>비밀번호가 일치합니다.</p>
            )}
            {passwordResetError && (
              <p className={errorStyle}>{passwordResetError}</p>
            )}
          </div>
        </ResetPanel>
      )}

      {step === 'complete' && (
        <div className={completePanelStyle}>
          <div className={copyGroupStyle}>
            <h2 className={sectionTitleStyle}>비밀번호 재설정 완료</h2>
            <p className={sectionDescriptionStyle}>
              비밀번호 재설정이 완료되었습니다. 다시 로그인하세요.
            </p>
          </div>
          <Button
            type='button'
            variant='fillBlue'
            size='xlarge'
            className={completeButtonStyle}
            onClick={onBackToLogin}
          >
            로그인하기
          </Button>
        </div>
      )}
    </form>
  );
};

const Header = () => {
  return (
    <header className={headerStyle}>
      <Image
        src='/login-logo.svg'
        alt='채택 로고'
        width={156}
        height={29}
        priority
      />
      <h1 className={titleStyle}>비밀번호 찾기</h1>
    </header>
  );
};

const ResetPanel = ({
  title,
  description,
  buttonDisabled,
  buttonLabel = '다음',
  children,
}: {
  title: string;
  description: string;
  buttonDisabled: boolean;
  buttonLabel?: string;
  children: React.ReactNode;
}) => {
  return (
    <div className={panelStyle}>
      <div className={inputGroupStyle}>
        <div className={copyGroupStyle}>
          <h2 className={sectionTitleStyle}>{title}</h2>
          <p className={sectionDescriptionStyle}>{description}</p>
        </div>
        {children}
      </div>

      <Button
        type='submit'
        variant='strokeBlue'
        size='tiny'
        className={nextButtonStyle}
        disabled={buttonDisabled}
      >
        {buttonLabel}
      </Button>
    </div>
  );
};

const PasswordField = ({
  value,
  placeholder,
  showPassword,
  onToggleShow,
  onChange,
}: {
  value: string;
  placeholder: string;
  showPassword: boolean;
  onToggleShow: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className={passwordFieldStyle}>
      <Input
        type={showPassword ? 'text' : 'password'}
        size='basic'
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className={passwordInputStyle}
      />
      <button
        type='button'
        className={eyeButtonStyle}
        aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
        onClick={onToggleShow}
      >
        {showPassword ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  );
};

const PasswordRules = ({
  lengthState,
  specialState,
}: {
  lengthState: RuleState;
  specialState: RuleState;
}) => {
  return (
    <div className={passwordRuleListStyle}>
      <PasswordRule label='8자 이상, 20자 이하' state={lengthState} />
      <PasswordRule label='특수문자' state={specialState} />
    </div>
  );
};

const PasswordRule = ({
  label,
  state,
}: {
  label: string;
  state: RuleState;
}) => {
  return (
    <span
      className={
        state === 'valid'
          ? passwordRuleValidStyle
          : state === 'invalid'
            ? passwordRuleInvalidStyle
            : passwordRuleIdleStyle
      }
    >
      {label}
      <span className={passwordRuleIconStyle} aria-hidden='true'>
        {state === 'invalid' ? (
          <CloseIcon size='1.25rem' color='sub.01.100' strokeWidth={1.25} />
        ) : (
          <CheckMark
            variant={state === 'valid' ? 'blue' : 'gray400'}
            size={10}
          />
        )}
      </span>
    </span>
  );
};

const getRuleState = (value: string, isValid: boolean): RuleState => {
  if (!value) return 'idle';
  return isValid ? 'valid' : 'invalid';
};

const containerStyle = css(
  stack.raw({
    width: '32.625rem',
    alignItems: 'center',
    gap: '3rem',
    pt: '1.75rem',
    pb: '1.75rem',
  }),
);

const completeContainerStyle = css(
  stack.raw({
    width: '32.625rem',
    alignItems: 'center',
    gap: '3rem',
    pt: '1.75rem',
    pb: '0.25rem',
  }),
);

const headerStyle = css(
  hstack.raw({
    justifyContent: 'space-between',
    width: '24.125rem',
    height: '1.8125rem',
  }),
);

const titleStyle = css({
  textStyle: 'h4',
  color: 'gray.600',
});

const panelStyle = css(
  stack.raw({
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '1.5rem',
    width: '24.125rem',
  }),
);

const inputGroupStyle = css(
  stack.raw({
    alignItems: 'flex-start',
    justifyContent: 'center',
    gap: '0.75rem',
    width: 'full',
  }),
);

const copyGroupStyle = css(
  stack.raw({
    alignItems: 'flex-start',
    gap: '0.25rem',
  }),
);

const sectionTitleStyle = css({
  textStyle: 'body1.m',
  color: 'gray.800',
});

const sectionDescriptionStyle = css({
  textStyle: 'body2.r',
  color: 'gray.800',
});

const inputStyle = css({
  width: '24.125rem',
  height: '3rem',
  borderColor: 'gray.200',
  color: 'gray.600',
});

const passwordFieldStyle = css({
  position: 'relative',
  width: '24.125rem',
});

const passwordFieldGroupStyle = css(
  stack.raw({
    alignItems: 'flex-start',
    gap: '0.5rem',
    width: 'full',
  }),
);

const passwordInputStyle = css({
  width: '24.125rem',
  height: '3rem',
  pr: '3rem',
  borderColor: 'gray.200',
  color: 'gray.600',
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

const nextButtonStyle = css({
  width: '6rem',
  height: '2.875rem',
});

const fieldWithMessageStyle = css(
  stack.raw({
    width: 'full',
    gap: '0.5rem',
  }),
);

const errorStyle = css({
  textStyle: 'body3.r',
  color: 'sub.01.100',
});

const successMessageStyle = css({
  textStyle: 'body3.r',
  color: 'primary',
});

const passwordRuleListStyle = css(
  hstack.raw({
    gap: '0.25rem',
  }),
);

const passwordRuleBaseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  textStyle: 'body3.r',
};

const passwordRuleIdleStyle = css({
  ...passwordRuleBaseStyle,
  color: 'gray.400',
});

const passwordRuleValidStyle = css({
  ...passwordRuleBaseStyle,
  color: 'primary',
});

const passwordRuleInvalidStyle = css({
  ...passwordRuleBaseStyle,
  color: 'sub.01.100',
});

const passwordRuleIconStyle = css({
  width: '1.25rem',
  height: '1.25rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const completePanelStyle = css(
  stack.raw({
    width: '24.125rem',
    alignItems: 'flex-start',
    gap: '2.5rem',
  }),
);

const completeButtonStyle = css({
  width: '24.125rem',
});
