import type { Metadata } from 'next';
import { GuestGuard } from '@/providers/auth-provider';

export const metadata: Metadata = {
  title: '회원가입',
};

export default function SignupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <GuestGuard>{children}</GuestGuard>;
}
