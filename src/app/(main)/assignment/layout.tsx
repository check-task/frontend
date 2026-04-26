import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | CHECKTASK',
    default: '내 과제',
  },
};

export default function AssignmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
