import type { Metadata } from 'next';
import { GuestGuard } from '@/providers/auth-provider';
import { Modal } from '@/components/Modal';

export const metadata: Metadata = {
  title: '로그인',
};

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GuestGuard>
      {children}
      <Modal />
    </GuestGuard>
  );
}
