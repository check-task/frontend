import { GuestGuard } from '@/providers/auth-provider';

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <GuestGuard>{children}</GuestGuard>;
}
