'use client';

import { ChangeEvent, FocusEvent, FormEvent, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAxiosError } from 'axios';
import { z } from 'zod';
import { css, cva } from 'styled-system/css';
import { hstack, stack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { Input } from '@/components/TextField';
import { CheckMark } from '@/components/icons/CheckMark';
import { CloseIcon } from '@/components/icons/CloseIcon';
import { EyeIcon } from '@/components/icons/EyeIcon';
import { EyeOffIcon } from '@/components/icons/EyeOffIcon';
import { useChangePassword } from '@/hooks/mutations/useChangePassword';
import { useVerifyCurrentPassword } from '@/hooks/mutations/useVerifyCurrentPassword';
import { useAuthStore } from '@/stores/auth-store';
import { useModalStore } from '@/stores/modal-store';

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 20;
const PASSWORD_SPECIAL_REGEX = /[!@#$%^&*(),.?":{}|<>]/;

const currentPasswordSchema = z
  .string()
  .min(1, '기존 비밀번호를 입력해 주세요.');

const passwordLengthSchema = z.string().min(PASSWORD_MIN).max(PASSWORD_MAX);

const passwordSpecialSchema = z.string().regex(PASSWORD_SPECIAL_REGEX);

const newPasswordSchema = z
  .string()
  .min(PASSWORD_MIN, `비밀번호는 ${PASSWORD_MIN}자 이상이어야 합니다.`)
  .max(PASSWORD_MAX, `비밀번호는 ${PASSWORD_MAX}자 이하여야 합니다.`)
  .regex(PASSWORD_SPECIAL_REGEX, '비밀번호에 특수문자가 포함되어야 합니다.');

const changePasswordSchema = z
  .object({
    currentPassword: currentPasswordSchema,
    newPassword: newPasswordSchema,
    passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해 주세요.'),
  })
  .refine((data) => data.newPassword === data.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 불일치합니다.',
  });

type ChangePasswordField = keyof z.infer<typeof changePasswordSchema>;

type CurrentPasswordVerifyStatus = 'idle' | 'pending' | 'verified' | 'invalid';

const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!isAxiosError(error)) return fallback;

  const data = error.response?.data as
    | { reason?: string; message?: string; errorCode?: string }
    | undefined;

  return data?.reason ?? data?.message ?? fallback;
};

export const ChangePasswordModalContent = () => {
  const router = useRouter();
  const closeModal = useModalStore((state) => state.closeModal);
  const logout = useAuthStore((state) => state.logout);
  const changePassword = useChangePassword();
  const verifyCurrentPassword = useVerifyCurrentPassword();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [formErrors, setFormErrors] = useState<
    Partial<Record<ChangePasswordField, string>>
  >({});
  const [submitError, setSubmitError] = useState('');
  const [currentPasswordVerifyStatus, setCurrentPasswordVerifyStatus] =
    useState<CurrentPasswordVerifyStatus>('idle');
  const [verifiedCurrentPassword, setVerifiedCurrentPassword] = useState('');
  const verifyRequestIdRef = useRef(0);

  const isNewPasswordStarted = newPassword.length > 0;
  const isPasswordLengthValid =
    passwordLengthSchema.safeParse(newPassword).success;
  const isPasswordSpecialValid =
    passwordSpecialSchema.safeParse(newPassword).success;
  const isNewPasswordValid = isPasswordLengthValid && isPasswordSpecialValid;
  const isPasswordConfirmStarted = passwordConfirm.length > 0;
  const isPasswordConfirmValid =
    isPasswordConfirmStarted &&
    newPassword.length > 0 &&
    newPassword === passwordConfirm;
  const isPasswordConfirmInvalid =
    isPasswordConfirmStarted && newPassword !== passwordConfirm;
  const isCurrentPasswordVerified =
    currentPasswordVerifyStatus === 'verified' &&
    currentPassword.length > 0 &&
    currentPassword === verifiedCurrentPassword;
  const isCurrentPasswordVerifying = currentPasswordVerifyStatus === 'pending';
  const canSubmit =
    isCurrentPasswordVerified &&
    isNewPasswordValid &&
    isPasswordConfirmValid &&
    !isCurrentPasswordVerifying;

  const handleCurrentPasswordChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    verifyRequestIdRef.current += 1;
    setCurrentPassword(event.target.value);
    setCurrentPasswordVerifyStatus('idle');
    setVerifiedCurrentPassword('');
    setFormErrors((prev) => ({ ...prev, currentPassword: undefined }));
    setSubmitError('');
  };

  const verifyCurrentPasswordValue = async (password: string) => {
    const parsed = currentPasswordSchema.safeParse(password);

    if (!parsed.success) {
      setCurrentPasswordVerifyStatus('idle');
      setVerifiedCurrentPassword('');
      setFormErrors((prev) => ({
        ...prev,
        currentPassword: parsed.error.issues[0]?.message,
      }));
      return false;
    }

    if (
      currentPasswordVerifyStatus === 'verified' &&
      password === verifiedCurrentPassword
    ) {
      return true;
    }

    const requestId = verifyRequestIdRef.current + 1;
    verifyRequestIdRef.current = requestId;
    setCurrentPasswordVerifyStatus('pending');
    setFormErrors((prev) => ({ ...prev, currentPassword: undefined }));
    setSubmitError('');

    try {
      await verifyCurrentPassword.mutateAsync({ password });
      if (verifyRequestIdRef.current !== requestId) return false;
      setCurrentPasswordVerifyStatus('verified');
      setVerifiedCurrentPassword(password);
      return true;
    } catch (error) {
      if (verifyRequestIdRef.current !== requestId) return false;

      const errorCode = isAxiosError(error)
        ? (error.response?.data as { errorCode?: string } | undefined)
            ?.errorCode
        : undefined;

      setCurrentPasswordVerifyStatus('invalid');
      setVerifiedCurrentPassword('');

      if (errorCode === 'INVALID_CREDENTIALS') {
        setFormErrors((prev) => ({
          ...prev,
          currentPassword: '비밀번호가 불일치합니다.',
        }));
        return false;
      }

      if (errorCode === 'NOT_LOCAL_USER') {
        setFormErrors((prev) => ({
          ...prev,
          currentPassword:
            '자체 로그인 사용자만 비밀번호를 변경할 수 있습니다.',
        }));
        return false;
      }

      setFormErrors((prev) => ({
        ...prev,
        currentPassword: getApiErrorMessage(
          error,
          '비밀번호 확인에 실패했습니다.',
        ),
      }));
      return false;
    }
  };

  const handleCurrentPasswordBlur = async (
    event: FocusEvent<HTMLInputElement>,
  ) => {
    await verifyCurrentPasswordValue(event.target.value);
  };

  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
    setFormErrors((prev) => ({
      ...prev,
      newPassword: undefined,
      passwordConfirm: undefined,
    }));
    setSubmitError('');
  };

  const handlePasswordConfirmChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setPasswordConfirm(event.target.value);
    setFormErrors((prev) => ({ ...prev, passwordConfirm: undefined }));
    setSubmitError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (changePassword.isPending) return;

    if (!isCurrentPasswordVerified) {
      const verified = await verifyCurrentPasswordValue(currentPassword);
      if (!verified) return;
    }

    const parsed = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      passwordConfirm,
    });

    if (!parsed.success) {
      const nextErrors: Partial<Record<ChangePasswordField, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as ChangePasswordField | undefined;
        if (!field || nextErrors[field]) return;
        nextErrors[field] = issue.message;
      });
      setFormErrors(nextErrors);
      return;
    }

    setFormErrors({});
    setSubmitError('');

    try {
      await changePassword.mutateAsync({
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
      });
      closeModal();
      logout();
      router.replace('/login');
    } catch (error) {
      const errorCode = isAxiosError(error)
        ? (error.response?.data as { errorCode?: string } | undefined)
            ?.errorCode
        : undefined;

      if (errorCode === 'INVALID_CREDENTIALS') {
        setFormErrors({
          currentPassword: '비밀번호가 불일치합니다.',
        });
        setCurrentPasswordVerifyStatus('invalid');
        setVerifiedCurrentPassword('');
        return;
      }

      setSubmitError(
        getApiErrorMessage(error, '비밀번호 변경에 실패했습니다.'),
      );
    }
  };

  return (
    <form className={containerStyle} onSubmit={handleSubmit} noValidate>
      <div className={fieldListStyle}>
        <PasswordField
          label='기존 비밀번호 입력'
          value={currentPassword}
          placeholder='기존 비밀번호를 입력하세요.'
          showPassword={showCurrentPassword}
          onChange={handleCurrentPasswordChange}
          onBlur={handleCurrentPasswordBlur}
          onToggleShow={() => setShowCurrentPassword((prev) => !prev)}
        >
          {isCurrentPasswordVerifying && (
            <ValidationMessage tone='info'>
              비밀번호를 확인 중입니다.
            </ValidationMessage>
          )}
          {isCurrentPasswordVerified && !isCurrentPasswordVerifying && (
            <ValidationMessage tone='success'>
              비밀번호가 일치합니다.
            </ValidationMessage>
          )}
          {formErrors.currentPassword && !isCurrentPasswordVerifying && (
            <ValidationMessage tone='error'>
              {formErrors.currentPassword}
            </ValidationMessage>
          )}
        </PasswordField>

        <PasswordField
          label='새 비밀번호'
          value={newPassword}
          placeholder='새 비밀번호를 입력하세요.'
          showPassword={showNewPassword}
          onChange={handleNewPasswordChange}
          onToggleShow={() => setShowNewPassword((prev) => !prev)}
        >
          {isNewPasswordStarted && (
            <div className={passwordRuleListStyle}>
              <PasswordRule
                label='8자 이상, 20자 이하'
                valid={isPasswordLengthValid}
              />
              <PasswordRule label='특수문자' valid={isPasswordSpecialValid} />
            </div>
          )}
          {formErrors.newPassword && !isNewPasswordStarted && (
            <ValidationMessage tone='error'>
              {formErrors.newPassword}
            </ValidationMessage>
          )}
        </PasswordField>

        <PasswordField
          label='비밀번호 확인'
          value={passwordConfirm}
          placeholder='새 비밀번호를 한 번 더 입력하세요.'
          showPassword={showPasswordConfirm}
          onChange={handlePasswordConfirmChange}
          onToggleShow={() => setShowPasswordConfirm((prev) => !prev)}
        >
          {isPasswordConfirmInvalid && (
            <ValidationMessage tone='error'>
              {formErrors.passwordConfirm ?? '비밀번호가 불일치합니다.'}
            </ValidationMessage>
          )}
          {isPasswordConfirmValid && (
            <ValidationMessage tone='success'>
              비밀번호가 일치합니다.
            </ValidationMessage>
          )}
          {formErrors.passwordConfirm && !isPasswordConfirmStarted && (
            <ValidationMessage tone='error'>
              {formErrors.passwordConfirm}
            </ValidationMessage>
          )}
        </PasswordField>
      </div>

      {submitError && <p className={submitErrorStyle}>{submitError}</p>}

      <Button
        type='submit'
        variant='fillBlue'
        size='xlarge'
        disabled={
          !canSubmit || changePassword.isPending || isCurrentPasswordVerifying
        }
        className={saveButtonStyle}
      >
        {changePassword.isPending
          ? '저장 중...'
          : isCurrentPasswordVerifying
            ? '확인 중...'
            : '변경사항 저장'}
      </Button>
    </form>
  );
};

interface PasswordFieldProps {
  label: string;
  value: string;
  placeholder: string;
  showPassword: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  onToggleShow: () => void;
  children?: React.ReactNode;
}

const PasswordField = ({
  label,
  value,
  placeholder,
  showPassword,
  onChange,
  onBlur,
  onToggleShow,
  children,
}: PasswordFieldProps) => {
  return (
    <div className={passwordFieldGroupStyle}>
      <label className={labelStyle}>{label}</label>
      <div className={passwordInputWrapStyle}>
        <Input
          size='modal'
          type={showPassword ? 'text' : 'password'}
          value={value}
          placeholder={placeholder}
          className={passwordInputStyle}
          onChange={onChange}
          onBlur={onBlur}
        />
        <button
          type='button'
          className={eyeButtonStyle}
          aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
          onClick={onToggleShow}
        >
          {showPassword ? (
            <EyeIcon size='1.75rem' color={value ? 'gray.600' : 'gray.400'} />
          ) : (
            <EyeOffIcon
              size='1.75rem'
              color={value ? 'gray.600' : 'gray.400'}
            />
          )}
        </button>
      </div>
      {children}
    </div>
  );
};

const PasswordRule = ({ label, valid }: { label: string; valid: boolean }) => {
  return (
    <div className={ruleItemStyle({ valid })}>
      <span>{label}</span>
      <span className={passwordRuleIconStyle} aria-hidden='true'>
        {valid ? (
          <CheckMark variant='blue' size={9} />
        ) : (
          <CloseIcon size='1rem' color='sub.01.100' strokeWidth={1.25} />
        )}
      </span>
    </div>
  );
};

const ValidationMessage = ({
  tone,
  children,
}: {
  tone: 'success' | 'error' | 'info';
  children: React.ReactNode;
}) => {
  return <p className={validationMessageStyle({ tone })}>{children}</p>;
};

const containerStyle = css(
  stack.raw({
    width: '24.125rem',
    mt: '1.75rem',
    gap: 0,
  }),
);

const fieldListStyle = css(
  stack.raw({
    gap: '1.25rem',
  }),
);

const passwordFieldGroupStyle = css(
  stack.raw({
    gap: '0.5rem',
  }),
);

const labelStyle = css({
  textStyle: 'body3.r',
  color: 'gray.800',
});

const passwordInputWrapStyle = css({
  position: 'relative',
  width: 'full',
});

const passwordInputStyle = css({
  width: 'full',
  height: '3rem',
  pr: '3rem',
});

const eyeButtonStyle = css({
  position: 'absolute',
  top: '50%',
  right: '0.75rem',
  transform: 'translateY(-50%)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '1.75rem',
  height: '1.75rem',
  cursor: 'pointer',
});

const validationMessageStyle = cva({
  base: {
    textStyle: 'body4.r',
  },
  variants: {
    tone: {
      success: {
        color: 'primary',
      },
      error: {
        color: 'sub.01.100',
      },
      info: {
        color: 'gray.400',
      },
    },
  },
});

const passwordRuleListStyle = css(
  hstack.raw({
    gap: '0.25rem',
    alignItems: 'center',
    flexWrap: 'wrap',
  }),
);

const ruleItemStyle = cva({
  base: hstack.raw({
    gap: 0,
    alignItems: 'center',
    textStyle: 'body4.r',
  }),
  variants: {
    valid: {
      true: {
        color: 'primary',
      },
      false: {
        color: 'sub.01.100',
      },
    },
  },
});

const passwordRuleIconStyle = css({
  width: '1rem',
  height: '1rem',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const submitErrorStyle = css({
  mt: '0.75rem',
  textStyle: 'body4.r',
  color: 'sub.01.100',
});

const saveButtonStyle = css({
  mt: '3rem',
});
