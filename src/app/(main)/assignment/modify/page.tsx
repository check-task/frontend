import type { Metadata } from 'next';
import { ModifyAssignmentForm } from '@/features/assignment/modify/components/ModifyAssignmentForm';

export const metadata: Metadata = {
  title: '과제 수정',
};

export default function ModifyAssignmentPage() {
  return <ModifyAssignmentForm />;
}
