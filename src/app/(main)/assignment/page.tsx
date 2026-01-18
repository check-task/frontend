import { css } from 'styled-system/css';
import {
  AssignmentList,
  type AssignmentData,
} from '@/components/AssignmentList';

export default function AssignmentPage() {
  return (
    // 전체 컨테이너
    <div
      className={css({
        my: '3.25rem',
      })}
    >
      <h3 className={titleStyle}>내 과제</h3>
      <AssignmentList assignments={DUMMY_ING_ASSIGNMENTS} />
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
const DUMMY_ING_ASSIGNMENTS: AssignmentData[] = [
  {
    id: '1',
    type: 'personal',
    folderName: '폴더명',
    assignmentName: '과제명',
    dueDate: 43,
    folderColor: 'purple',
  },
  {
    id: '2',
    type: 'personal',
    folderName: '폴더명',
    assignmentName: '과제명',
    dueDate: 12,
    folderColor: 'green',
  },
  {
    id: '3',
    type: 'team',
    folderName: '폴더명',
    assignmentName: '과제명',
    dueDate: 5,
    folderColor: 'black',
  },
  {
    id: '4',
    type: 'personal',
    folderName: '폴더명',
    assignmentName: '과제명',
    dueDate: 43,
    folderColor: 'red',
  },
  {
    id: '5',
    type: 'team',
    folderName: '폴더명',
    assignmentName: '과제명',
    dueDate: 43,
    folderColor: 'yellow',
  },
];
