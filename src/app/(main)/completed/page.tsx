import { css } from 'styled-system/css';
import {
  AssignmentList,
  type AssignmentData,
} from '@/components/AssignmentList';

export default function CompletedPage() {
  return (
    <div className={css({ my: '3.25rem' })}>
      <h3 className={titleStyle}>완료 과제</h3>
      <AssignmentList assignments={DUMMY_DONE_ASSIGNMENTS} isDone={true} />
    </div>
  );
}

// ======== 스타일 정의 ========
const titleStyle = css({
  textStyle: 'h3',
  mb: '0.75rem',
  color: 'gray.900',
});

// ======== 더미데이터 ========
const DUMMY_DONE_ASSIGNMENTS: AssignmentData[] = [
  {
    id: '1',
    type: 'personal',
    folderName: '폴더명',
    assignmentName: '과제명',
    dueDate: '2025.11.19',
    folderColor: 'red',
  },
  {
    id: '2',
    type: 'team',
    folderName: '폴더명',
    assignmentName: '과제명',
    dueDate: '2025.11.19',
    folderColor: 'green',
  },
  {
    id: '3',
    type: 'team',
    folderName: '폴더명',
    assignmentName: '과제명',
    dueDate: '2025.11.19',
    folderColor: 'black',
  },
];
