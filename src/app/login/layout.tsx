import { GuestGuard } from '@/providers/auth-provider';
import { Modal } from '@/components/Modal';

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
