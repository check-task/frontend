import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '완료 과제',
};

export default function CompletedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
