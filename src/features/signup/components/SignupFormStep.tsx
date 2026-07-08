'use client';

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
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
import { ProfileChangeIcon } from '@/components/icons/ProfileChangeIcon';
import {
  checkEmailDuplicate,
  resendSignupEmailCode,
  sendSignupEmailCode,
  signup,
  verifySignupEmailCode,
} from '@/services/auth';

const NICKNAME_MAX = 30;
const PASSWORD_MIN = 8;
const PASSWORD_MAX = 20;
const EMAIL_CODE_TTL_SECONDS = 120;
const EMAIL_CODE_URGENT_SECONDS = 30;
const PASSWORD_SPECIAL_REGEX = /[!@#$%^&*(),.?":{}|<>]/;
const PHONE_REGEX = /^01[0-9]-\d{3,4}-\d{4}$/;

const hasSpecialChar = (str: string) => PASSWORD_SPECIAL_REGEX.test(str);

const formatRemainingTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(restSeconds).padStart(2, '0')}`;
};

const emailSchema = z.email('올바른 이메일 형식으로 입력해 주세요.');

const emailCodeSchema = z.object({
  email: emailSchema,
  code: z.string().trim().length(6, '인증코드는 6자리입니다.'),
});

const signupSchema = z
  .object({
    email: emailSchema,
    password: z
      .string()
      .min(PASSWORD_MIN, `비밀번호는 ${PASSWORD_MIN}자 이상이어야 합니다.`)
      .max(PASSWORD_MAX, `비밀번호는 ${PASSWORD_MAX}자 이하여야 합니다.`)
      .regex(
        PASSWORD_SPECIAL_REGEX,
        '비밀번호에 특수문자가 포함되어야 합니다.',
      ),
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해 주세요.'),
    nickname: z
      .string()
      .trim()
      .min(1, '닉네임을 입력해 주세요.')
      .max(
        NICKNAME_MAX,
        `닉네임은 최대 ${NICKNAME_MAX}자까지 입력할 수 있어요`,
      ),
    phone: z
      .string()
      .trim()
      .refine(
        (value) => value === '' || PHONE_REGEX.test(value),
        '올바른 연락처 형식으로 입력해주세요 (예: 010-1234-5678)',
      ),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않아요',
  });

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!isAxiosError(error)) return fallback;

  const data = error.response?.data as
    | { reason?: string; message?: string; errorCode?: string }
    | undefined;

  return data?.reason ?? data?.message ?? fallback;
};

const getEmailCodeErrorMessage = (error: unknown) => {
  if (!isAxiosError(error)) return '인증코드가 불일치합니다.';

  const data = error.response?.data as
    | { reason?: string; message?: string; errorCode?: string }
    | undefined;

  if (data?.errorCode === 'INVALID_CODE') {
    return '인증코드가 불일치합니다.';
  }

  return data?.reason ?? data?.message ?? '인증코드가 불일치합니다.';
};

type Feedback = {
  type: 'success' | 'error';
  message: string;
};

interface SignupFormStepProps {
  onCancel: () => void;
}

export const SignupFormStep = ({ onCancel }: SignupFormStepProps) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [email, setEmail] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailCodeExpiresAt, setEmailCodeExpiresAt] = useState<number | null>(
    null,
  );
  const [emailCodeRemainingSeconds, setEmailCodeRemainingSeconds] = useState(0);
  const [emailSendError, setEmailSendError] = useState('');
  const [emailCodeFeedback, setEmailCodeFeedback] = useState<Feedback | null>(
    null,
  );
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [nickname, setNickname] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isEmailCodeSending, setIsEmailCodeSending] = useState(false);
  const [isEmailCodeVerifying, setIsEmailCodeVerifying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const isPasswordLengthValid =
    password.length >= PASSWORD_MIN && password.length <= PASSWORD_MAX;
  const isPasswordSpecialValid = hasSpecialChar(password);
  const isPasswordValid = isPasswordLengthValid && isPasswordSpecialValid;
  const hasActiveEmailCodeTimer =
    emailCodeSent && !emailVerified && emailCodeExpiresAt !== null;
  const isEmailCodeExpired =
    hasActiveEmailCodeTimer && emailCodeRemainingSeconds <= 0;
  const isEmailCodeUrgent =
    hasActiveEmailCodeTimer &&
    emailCodeRemainingSeconds <= EMAIL_CODE_URGENT_SECONDS;

  const passwordConfirmError =
    passwordConfirm.length > 0 && password !== passwordConfirm
      ? '비밀번호가 일치하지 않아요'
      : null;

  const nicknameError =
    nickname.length > NICKNAME_MAX
      ? `닉네임은 최대 ${NICKNAME_MAX}자까지 입력할 수 있어요`
      : null;
  const phoneError =
    phone.trim().length > 0 && !PHONE_REGEX.test(phone.trim())
      ? '올바른 연락처 형식으로 입력해주세요 (예: 010-1234-5678)'
      : null;

  const canSubmit =
    email.trim().length > 0 &&
    emailVerified &&
    isPasswordValid &&
    password === passwordConfirm &&
    nickname.length > 0 &&
    nickname.length <= NICKNAME_MAX &&
    !phoneError;

  const emailActionButtonVariant =
    emailVerified || email.trim().length === 0
      ? 'fillGray'
      : emailCodeSent
        ? 'strokeBlue'
        : 'fillBlue';

  const emailActionButtonLabel = emailVerified
    ? '인증완료'
    : emailCodeSent
      ? isEmailCodeSending
        ? '재발송중'
        : '인증코드 재발송'
      : isEmailCodeSending
        ? '발송중'
        : '인증코드 발송';

  const canVerifyEmailCode =
    emailCodeSent &&
    !emailVerified &&
    !isEmailCodeExpired &&
    emailCode.trim().length > 0 &&
    !isEmailCodeVerifying;

  useEffect(() => {
    if (!emailCodeExpiresAt || emailVerified) return;

    const updateRemainingSeconds = () => {
      setEmailCodeRemainingSeconds(
        Math.max(0, Math.ceil((emailCodeExpiresAt - Date.now()) / 1000)),
      );
    };

    updateRemainingSeconds();
    const timerId = window.setInterval(updateRemainingSeconds, 1000);

    return () => window.clearInterval(timerId);
  }, [emailCodeExpiresAt, emailVerified]);

  useEffect(() => {
    if (!isEmailCodeExpired || emailCodeFeedback) return;

    setEmailCodeFeedback({
      type: 'error',
      message: '인증 시간이 만료되었습니다. 다시 발송해 주세요.',
    });
  }, [emailCodeFeedback, isEmailCodeExpired]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailCode('');
    setEmailCodeSent(false);
    setEmailVerified(false);
    setEmailCodeExpiresAt(null);
    setEmailCodeRemainingSeconds(0);
    setEmailSendError('');
    setEmailCodeFeedback(null);
    setSubmitError('');
  };

  const handleEmailCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmailCode(e.target.value);
    setEmailCodeFeedback(null);
    setSubmitError('');
  };

  const handleSendEmailCode = async () => {
    if (isEmailCodeSending) return;

    const parsed = emailSchema.safeParse(email.trim());

    if (!parsed.success) {
      setEmailSendError(
        parsed.error.issues[0]?.message ?? '이메일을 확인해 주세요.',
      );
      setEmailCodeSent(false);
      setEmailVerified(false);
      setEmailCodeExpiresAt(null);
      setEmailCodeRemainingSeconds(0);
      return;
    }

    const trimmedEmail = parsed.data;

    const shouldResend = emailCodeSent && !emailVerified;

    setIsEmailCodeSending(true);
    setEmailCode('');
    setEmailVerified(false);
    setEmailCodeExpiresAt(null);
    setEmailCodeRemainingSeconds(0);
    setEmailSendError('');
    setEmailCodeFeedback(null);
    setSubmitError('');

    try {
      const { isDuplicate } = await checkEmailDuplicate(trimmedEmail);

      if (isDuplicate) {
        setEmailSendError('이미 가입된 이메일입니다.');
        setEmailCodeSent(false);
        setEmailCodeExpiresAt(null);
        setEmailCodeRemainingSeconds(0);
        return;
      }

      if (shouldResend) {
        await resendSignupEmailCode({ email: trimmedEmail });
      } else {
        await sendSignupEmailCode({ email: trimmedEmail });
      }
      setEmailCodeSent(true);
      setEmailCodeFeedback(null);
      setEmailCodeExpiresAt(Date.now() + EMAIL_CODE_TTL_SECONDS * 1000);
      setEmailCodeRemainingSeconds(EMAIL_CODE_TTL_SECONDS);
    } catch (error) {
      setEmailCodeExpiresAt(null);
      setEmailCodeRemainingSeconds(0);
      setEmailSendError(
        getApiErrorMessage(error, '인증코드 발송에 실패했습니다.'),
      );
    } finally {
      setIsEmailCodeSending(false);
    }
  };

  const handleVerifyEmailCode = async () => {
    if (!emailCodeSent || isEmailCodeVerifying) {
      return;
    }

    if (isEmailCodeExpired) {
      setEmailCodeFeedback({
        type: 'error',
        message: '인증 시간이 만료되었습니다. 다시 발송해 주세요.',
      });
      return;
    }

    const parsed = emailCodeSchema.safeParse({
      email: email.trim(),
      code: emailCode.trim(),
    });

    if (!parsed.success) {
      setEmailCodeFeedback({
        type: 'error',
        message: parsed.error.issues[0]?.message ?? '인증코드를 확인해 주세요.',
      });
      return;
    }

    setIsEmailCodeVerifying(true);
    setEmailCodeFeedback(null);
    setSubmitError('');

    try {
      await verifySignupEmailCode({
        email: parsed.data.email,
        code: parsed.data.code,
      });
      setEmailVerified(true);
      setEmailCodeExpiresAt(null);
      setEmailCodeRemainingSeconds(0);
      setEmailCodeFeedback({
        type: 'success',
        message: '인증되었습니다.',
      });
    } catch (error) {
      setEmailVerified(false);
      setEmailCodeFeedback({
        type: 'error',
        message: getEmailCodeErrorMessage(error),
      });
    } finally {
      setIsEmailCodeVerifying(false);
    }
  };

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(URL.createObjectURL(file));
    setProfileImageFile(file);
  };

  const handleProfileDelete = () => {
    setProfileImage(null);
    setProfileImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;

    const parsed = signupSchema.safeParse({
      email: email.trim(),
      password,
      passwordConfirm,
      nickname,
      phone,
    });

    if (!parsed.success) {
      setSubmitError(
        parsed.error.issues[0]?.message ?? '회원가입 정보를 확인해 주세요.',
      );
      return;
    }

    if (!emailVerified) {
      setSubmitError('이메일 인증이 필요합니다.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await signup({
        email: parsed.data.email,
        password: parsed.data.password,
        nickname: parsed.data.nickname,
        phoneNum: parsed.data.phone || undefined,
        profileImage: profileImageFile,
      });
      window.sessionStorage.setItem('openLoginModalAfterSignup', 'true');
      router.replace('/login');
    } catch (error) {
      setSubmitError(getApiErrorMessage(error, '회원가입에 실패했습니다.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={pageStyle}>
      <form className={formStyle} onSubmit={handleSubmit} noValidate>
        <section className={cardStyle}>
          <header className={headerStyle}>
            <Image
              src='/login-logo.svg'
              alt='채택 로고'
              width={156}
              height={29}
              priority
            />
            <h1 className={titleStyle}>회원가입</h1>
          </header>

          <div className={bodyStyle}>
            <div className={fieldsStyle}>
              <div className={emailAuthGroupStyle}>
                <div className={emailFieldStyle}>
                  <FieldRow label='이메일' required>
                    <Input
                      type='email'
                      size='basic'
                      placeholder='이메일'
                      value={email}
                      onChange={handleEmailChange}
                      className={inputStyle}
                      readOnly={emailVerified}
                    />
                  </FieldRow>
                  <div className={fieldAsideStyle}>
                    <Button
                      type='button'
                      variant={emailActionButtonVariant}
                      size='small'
                      className={emailVerifyButtonStyle}
                      disabled={
                        email.trim().length === 0 ||
                        emailVerified ||
                        isEmailCodeSending
                      }
                      onClick={handleSendEmailCode}
                    >
                      {emailActionButtonLabel}
                    </Button>
                    {emailSendError && (
                      <p className={fieldAsideErrorStyle}>{emailSendError}</p>
                    )}
                  </div>
                </div>

                <div className={emailFieldStyle}>
                  <FieldRow label='인증코드' required>
                    <div className={emailCodeInputWrapperStyle}>
                      <Input
                        type='text'
                        size='basic'
                        placeholder='인증코드'
                        value={emailCode}
                        onChange={handleEmailCodeChange}
                        className={emailCodeInputStyle}
                        readOnly={emailVerified}
                      />
                      {hasActiveEmailCodeTimer && (
                        <span
                          className={
                            isEmailCodeUrgent
                              ? emailCodeTimerUrgentStyle
                              : emailCodeTimerStyle
                          }
                          aria-live='polite'
                        >
                          {formatRemainingTime(emailCodeRemainingSeconds)}
                        </span>
                      )}
                    </div>
                  </FieldRow>
                  <div className={fieldAsideStyle}>
                    {emailCodeFeedback ? (
                      <p
                        className={
                          emailCodeFeedback.type === 'success'
                            ? fieldAsideSuccessStyle
                            : fieldAsideErrorStyle
                        }
                      >
                        {emailCodeFeedback.message}
                      </p>
                    ) : (
                      <Button
                        type='button'
                        variant='fillBlue'
                        size='small'
                        className={emailVerifyButtonStyle}
                        disabled={!canVerifyEmailCode}
                        onClick={handleVerifyEmailCode}
                      >
                        {isEmailCodeVerifying ? '확인중' : '인증하기'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className={fieldWithHintStyle}>
                <FieldRow label='비밀번호' required>
                  <div className={inputWithIconStyle}>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      size='basic'
                      placeholder='비밀번호'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={passwordInputStyle}
                    />
                    <button
                      type='button'
                      className={eyeButtonStyle}
                      aria-label={
                        showPassword ? '비밀번호 숨기기' : '비밀번호 보기'
                      }
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </FieldRow>
                <div className={fieldAsideStyle}>
                  <div className={passwordHintListStyle}>
                    <PasswordRule
                      label='8자 이상, 20자 이하'
                      state={
                        password.length === 0
                          ? 'idle'
                          : isPasswordLengthValid
                            ? 'valid'
                            : 'invalid'
                      }
                    />
                    <PasswordRule
                      label='특수문자'
                      state={
                        password.length === 0
                          ? 'idle'
                          : isPasswordSpecialValid
                            ? 'valid'
                            : 'invalid'
                      }
                    />
                  </div>
                </div>
              </div>

              <div className={fieldWithHintStyle}>
                <FieldRow label='비밀번호 확인' required>
                  <div className={inputWithIconStyle}>
                    <Input
                      type={showPasswordConfirm ? 'text' : 'password'}
                      size='basic'
                      placeholder='비밀번호 확인'
                      value={passwordConfirm}
                      onChange={(e) => setPasswordConfirm(e.target.value)}
                      className={passwordInputStyle}
                    />
                    <button
                      type='button'
                      className={eyeButtonStyle}
                      aria-label={
                        showPasswordConfirm
                          ? '비밀번호 숨기기'
                          : '비밀번호 보기'
                      }
                      onClick={() => setShowPasswordConfirm((prev) => !prev)}
                    >
                      {showPasswordConfirm ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </FieldRow>
                {passwordConfirm.length > 0 && (
                  <p
                    className={
                      passwordConfirmError ? fieldErrorStyle : fieldSuccessStyle
                    }
                  >
                    {passwordConfirmError ?? '비밀번호가 일치합니다.'}
                  </p>
                )}
              </div>

              <div className={fieldWithHintStyle}>
                <FieldRow label='닉네임' required>
                  <Input
                    type='text'
                    size='basic'
                    placeholder='닉네임 입력(최대 30자)'
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className={inputStyle}
                  />
                </FieldRow>
                {nicknameError && (
                  <p className={fieldErrorStyle}>최대 글자수를 초과했습니다.</p>
                )}
              </div>

              <div className={fieldWithHintStyle}>
                <FieldRow label='전화번호'>
                  <Input
                    type='tel'
                    size='basic'
                    placeholder='010-0000-0000'
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputStyle}
                  />
                </FieldRow>
                {phoneError && <p className={fieldErrorStyle}>{phoneError}</p>}
              </div>

              <FieldRow label='프로필 사진' align='start'>
                {profileImage ? (
                  <div className={profilePreviewGroupStyle}>
                    <div className={profileImageWrapperStyle}>
                      <Image
                        src={profileImage}
                        alt='프로필 사진'
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div className={profileButtonsStyle}>
                      <button
                        type='button'
                        className={profileActionButtonStyle}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        사진변경
                        <ProfileChangeIcon />
                      </button>
                      <button
                        type='button'
                        className={profileActionButtonStyle}
                        onClick={handleProfileDelete}
                      >
                        사진삭제
                        <CloseIcon
                          size={18}
                          color='gray.400'
                          strokeWidth={1.16667}
                        />
                      </button>
                    </div>
                  </div>
                ) : (
                  <Button
                    type='button'
                    variant='fillGray'
                    size='small'
                    className={imageAddButtonStyle}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    이미지 추가
                  </Button>
                )}
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  className={hiddenInputStyle}
                  onChange={handleProfileChange}
                />
              </FieldRow>
            </div>

            <p className={requiredNoticeStyle}>
              <span>*</span>
              항목은 필수입니다.
            </p>
            {submitError && <p className={submitErrorStyle}>{submitError}</p>}
          </div>
        </section>

        <div className={bottomButtonsStyle}>
          <Button
            type='button'
            variant='fillGray'
            size='medium'
            className={actionButtonStyle}
            onClick={onCancel}
          >
            취소
          </Button>
          <Button
            type='submit'
            variant='fillBlue'
            size='medium'
            className={actionButtonStyle}
            disabled={!canSubmit || isSubmitting}
          >
            {isSubmitting ? '가입중' : '회원가입'}
          </Button>
        </div>
      </form>
    </div>
  );
};

const FieldRow = ({
  label,
  required = false,
  align = 'center',
  children,
}: {
  label: string;
  required?: boolean;
  align?: 'center' | 'start';
  children: React.ReactNode;
}) => {
  return (
    <div className={align === 'start' ? fieldRowStartStyle : fieldRowStyle}>
      <label className={fieldLabelStyle}>
        {required && <span className={fieldRequiredMarkStyle}>*</span>}
        <span>{label}</span>
      </label>
      {children}
    </div>
  );
};

const PasswordRule = ({
  label,
  state,
}: {
  label: string;
  state: 'idle' | 'valid' | 'invalid';
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

const pageStyle = css(
  stack.raw({
    minHeight: '100dvh',
    alignItems: 'center',
    justifyContent: 'flex-start',
    py: '5rem',
    bg: 'bg',
  }),
);

const formStyle = css(
  stack.raw({
    width: 'full',
    maxWidth: '37rem',
    gap: '3.75rem',
    alignItems: 'center',
  }),
);

const cardStyle = css(
  stack.raw({
    width: 'full',
    alignItems: 'flex-start',
    px: '1.875rem',
    py: '3.5rem',
    gap: '3rem',
    borderWidth: '0.0625rem',
    borderColor: 'gray.200',
    borderRadius: '0.75rem',
    bg: 'bg',
  }),
);

const headerStyle = css(
  hstack.raw({
    justifyContent: 'space-between',
    width: '31.875rem',
    height: '1.8125rem',
  }),
);

const titleStyle = css({
  textStyle: 'h4',
  color: 'gray.600',
});

const bodyStyle = css(
  stack.raw({
    alignItems: 'flex-start',
    gap: '1.5rem',
    width: 'full',
  }),
);

const fieldsStyle = css(
  stack.raw({
    gap: '2.5rem',
    width: 'full',
  }),
);

const fieldRowStyle = css(
  hstack.raw({
    alignItems: 'center',
    gap: '1.25rem',
    width: 'full',
  }),
);

const fieldRowStartStyle = css(
  hstack.raw({
    alignItems: 'flex-start',
    gap: '1.25rem',
    width: 'full',
  }),
);

const fieldLabelStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.25rem',
  width: '7.25rem',
  flexShrink: 0,
  textStyle: 'body1.m',
  color: 'gray.800',
  whiteSpace: 'nowrap',
});

const fieldRequiredMarkStyle = css({
  color: 'primary',
});

const inputStyle = css({
  width: '24.75rem',
  height: '2.625rem',
  color: 'gray.600',
  flexShrink: 0,
});

const emailCodeInputWrapperStyle = css({
  position: 'relative',
  width: '24.75rem',
  flexShrink: 0,
});

const emailCodeInputStyle = css({
  width: '24.75rem',
  height: '2.625rem',
  pr: '4rem',
  color: 'gray.600',
});

const emailCodeTimerStyle = css({
  position: 'absolute',
  top: '50%',
  right: '0.75rem',
  transform: 'translateY(-50%)',
  textStyle: 'body3.m',
  color: 'blue.500',
  pointerEvents: 'none',
});

const emailCodeTimerUrgentStyle = css({
  position: 'absolute',
  top: '50%',
  right: '0.75rem',
  transform: 'translateY(-50%)',
  textStyle: 'body3.m',
  color: 'sub.01.100',
  pointerEvents: 'none',
});

const passwordInputStyle = css({
  width: '24.75rem',
  height: '2.625rem',
  pr: '2.75rem',
  color: 'gray.600',
});

const inputWithIconStyle = css({
  position: 'relative',
  width: '24.75rem',
  flexShrink: 0,
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

const emailAuthGroupStyle = css(
  stack.raw({
    gap: '1.25rem',
    width: 'full',
  }),
);

const emailFieldStyle = css(
  stack.raw({
    gap: '0.75rem',
    width: 'full',
  }),
);

const fieldWithHintStyle = css(
  stack.raw({
    gap: '0.5rem',
    width: 'full',
  }),
);

const fieldAsideStyle = css({
  pl: '8.5rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '0.5rem',
});

const emailVerifyButtonStyle = css({
  width: '11.5rem',
});

const passwordHintListStyle = css(
  hstack.raw({
    gap: '0.25rem',
  }),
);

const passwordRuleIdleStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  textStyle: 'body3.r',
  color: 'gray.400',
});

const passwordRuleValidStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  textStyle: 'body3.r',
  color: 'primary',
});

const passwordRuleInvalidStyle = css({
  display: 'inline-flex',
  alignItems: 'center',
  textStyle: 'body3.r',
  color: 'sub.01.100',
});

const passwordRuleIconStyle = css({
  width: '1.25rem',
  height: '1.25rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const fieldSuccessStyle = css({
  pl: '8.5rem',
  textStyle: 'body3.r',
  color: 'primary',
});

const fieldErrorStyle = css({
  pl: '8.5rem',
  textStyle: 'body3.r',
  color: 'sub.01.100',
});

const fieldAsideSuccessStyle = css({
  textStyle: 'body3.r',
  color: 'primary',
});

const fieldAsideErrorStyle = css({
  textStyle: 'body3.r',
  color: 'sub.01.100',
});

const imageAddButtonStyle = css({
  width: '11.5rem',
  height: '2.625rem',
});

const profilePreviewGroupStyle = css(
  stack.raw({
    alignItems: 'flex-start',
    gap: '0.75rem',
  }),
);

const profileImageWrapperStyle = css({
  position: 'relative',
  width: '7.5rem',
  height: '7.5rem',
  borderRadius: 'full',
  overflow: 'hidden',
  bg: '#D9D9D9',
});

const profileButtonsStyle = css(
  hstack.raw({
    alignItems: 'flex-start',
    gap: '0.5rem',
  }),
);

const profileActionButtonStyle = css({
  display: 'inline-flex',
  alignItems: 'flex-start',
  pb: '0.125rem',
  borderBottom: '0.0625rem solid',
  borderColor: 'gray.200',
  textStyle: 'body4.r',
  color: 'gray.400',
  cursor: 'pointer',
});

const requiredNoticeStyle = css({
  display: 'flex',
  gap: '0.125rem',
  textStyle: 'body3.r',
  color: 'primary',

  '& span': {
    fontWeight: 500,
  },
});

const submitErrorStyle = css({
  textStyle: 'body3.r',
  color: 'sub.01.100',
});

const hiddenInputStyle = css({
  display: 'none',
});

const bottomButtonsStyle = css(
  hstack.raw({
    width: 'full',
    gap: '1.25rem',
  }),
);

const actionButtonStyle = css({
  width: '17.8125rem',
  height: '3.375rem',
});
