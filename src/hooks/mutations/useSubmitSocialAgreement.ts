import { useMutation } from '@tanstack/react-query';
import { submitSocialAgreement } from '@/services/auth';
import type { SocialAgreementRequest } from '@/types/api/auth';

export const useSubmitSocialAgreement = () => {
  return useMutation({
    mutationFn: (body: SocialAgreementRequest) => submitSocialAgreement(body),
  });
};
