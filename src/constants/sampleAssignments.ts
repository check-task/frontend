import type { FolderColor } from '@/types/folder';

export interface SampleAssignment {
  id: string;
  folderId: string;
  folderName: string;
  folderColor: FolderColor;
  dDay: string;
  dueDate: string;
  assignmentName: string;
  assignmentType: string;
  progress: number;
}

export const sampleAssignments: SampleAssignment[] = [
  {
    id: '1',
    folderId: '1',
    folderName: '그림으로 만나는 세상',
    folderColor: 'red',
    dDay: 'D-43',
    dueDate: '2026-01-08',
    assignmentName: '프로그래밍 1차 과제 2차 과제 3차 과제',
    assignmentType: '개인/팀',
    progress: 81,
  },
  {
    id: '2',
    folderId: '4',
    folderName: '팀과제팀과제팀과제',
    folderColor: 'yellow',
    dDay: 'D-40',
    dueDate: '2026-01-05',
    assignmentName: '과제 2',
    assignmentType: '개인/팀',
    progress: 82,
  },
  {
    id: '3',
    folderId: '3',
    folderName: 'C언어프로그래밍입문',
    folderColor: 'green',
    dDay: 'D-37',
    dueDate: '2026-01-02',
    assignmentName: '과제 3',
    assignmentType: '개인/팀',
    progress: 62,
  },
  {
    id: '4',
    folderId: '2',
    folderName: '웹서비스프로그래밍',
    folderColor: 'purple',
    dDay: 'D-23',
    dueDate: '2026-01-16',
    assignmentName: '과제 4',
    assignmentType: '개인/팀',
    progress: 61,
  },
  {
    id: '5',
    folderId: '5',
    folderName: '파이썬프로그래밍',
    folderColor: 'black',
    dDay: 'D-13',
    dueDate: '2026-01-26',
    assignmentName: '과제 5',
    assignmentType: '개인/팀',
    progress: 50,
  },
];
