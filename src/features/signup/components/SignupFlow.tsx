'use client';

import { useState } from 'react';
import { SignupFormStep } from './SignupFormStep';
import { SignupTermsStep } from './SignupTermsStep';

type Step = 'terms' | 'form';

export const SignupFlow = () => {
  const [step, setStep] = useState<Step>('terms');

  if (step === 'terms') {
    return <SignupTermsStep onNext={() => setStep('form')} />;
  }

  return <SignupFormStep onCancel={() => setStep('terms')} />;
};
