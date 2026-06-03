import type { Metadata } from 'next';
import { CreateAssignmentForm } from '@/features/assignment/create/components/CreateAssignmentForm';

export const metadata: Metadata = {
  title: '과제 등록',
};

export default function CreateAssignmentPage() {
  return <CreateAssignmentForm />;
}
