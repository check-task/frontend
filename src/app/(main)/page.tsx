import { styled } from 'styled-system/jsx';
import { hstack, stack } from 'styled-system/patterns';
import { DateSelectorWithPicker } from '@/features/home/components/DateSelectorWithPicker';
import { ButtonGroup } from '@/features/home/components/ButtonGroup';
import { HomeContent } from '@/features/home/components/HomeContent';

// 샘플 과제 데이터
const sampleAssignments = [
  {
    id: '1',
    folderId: '1',
    folderName: '그만세',
    folderColor: 'red' as const,
    dDay: 'D-43',
    dueDate: '2026-01-08',
    assignmentName: '프로그래밍 1차 과제',
    assignmentType: '개인/팀',
    progress: 81,
  },
  {
    id: '2',
    folderId: '4',
    folderName: '팀과제',
    folderColor: 'yellow' as const,
    dDay: 'D-40',
    dueDate: '2026-01-05',
    assignmentName: '과제 2',
    assignmentType: '개인/팀',
    progress: 82,
  },
  {
    id: '3',
    folderId: '3',
    folderName: '프로그래밍',
    folderColor: 'green' as const,
    dDay: 'D-37',
    dueDate: '2026-01-02',
    assignmentName: '과제 3',
    assignmentType: '개인/팀',
    progress: 62,
  },
  {
    id: '4',
    folderId: '2',
    folderName: '웹서프',
    folderColor: 'purple' as const,
    dDay: 'D-23',
    dueDate: '2026-01-16',
    assignmentName: '과제 4',
    assignmentType: '개인/팀',
    progress: 61,
  },
  {
    id: '5',
    folderId: '3',
    folderName: '프로그래밍',
    folderColor: 'green' as const,
    dDay: 'D-13',
    dueDate: '2026-01-26',
    assignmentName: '과제 5',
    assignmentType: '개인/팀',
    progress: 50,
  },
];

export default function Home() {
  return (
    <Container.Page>
      {/* 년/월 선택 + 버튼 */}
      <Container.Header>
        <DateSelectorWithPicker />
        <ButtonGroup />
      </Container.Header>

      {/* 폴더 필터 + 캘린더 + 과제목록 */}
      <HomeContent assignments={sampleAssignments} />
    </Container.Page>
  );
}

const Container = {
  Page: styled('div', {
    base: stack.raw({
      gap: '1.5rem',
      marginTop: '2rem',
      marginBottom: '3.75rem',
    }),
  }),
  Header: styled('div', {
    base: hstack.raw({
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    }),
  }),
};
