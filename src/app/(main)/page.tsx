import { styled } from 'styled-system/jsx';
import { hstack, stack } from 'styled-system/patterns';
import { FilterChipGroup } from '@/features/home/components/FilterChipGroup';
import { Calendar } from '@/features/home/components/Calendar';
import { DateSelectorWithPicker } from '@/features/home/components/DateSelectorWithPicker';
import { AssignmentSection } from '@/features/home/components/AssignmentSection';
import { ButtonGroup } from '@/features/home/components/ButtonGroup';

// 샘플 폴더 데이터
const folders = [
  { id: '1', name: '그만세', color: 'red' as const },
  { id: '2', name: '웹서프', color: 'purple' as const },
  { id: '3', name: '프로그래밍', color: 'green' as const },
  { id: '4', name: '팀과제', color: 'yellow' as const },
  { id: '5', name: '캡스톤', color: 'black' as const },
];

// 샘플 과제 데이터
const sampleAssignments = [
  {
    id: '1',
    folderName: '그만세',
    folderColor: 'red' as const,
    dDay: 'D-43',
    assignmentName: '프로그래밍 1차 과제',
    assignmentType: '개인/팀',
    progress: 81,
  },
  {
    id: '2',
    folderName: '폴더명',
    folderColor: 'yellow' as const,
    dDay: 'D-40',
    assignmentName: '과제 2',
    assignmentType: '개인/팀',
    progress: 82,
  },
  {
    id: '3',
    folderName: '폴더명',
    folderColor: 'green' as const,
    dDay: 'D-37',
    assignmentName: '과제 3',
    assignmentType: '개인/팀',
    progress: 62,
  },
  {
    id: '4',
    folderName: '폴더명',
    folderColor: 'purple' as const,
    dDay: 'D-23',
    assignmentName: '과제 4',
    assignmentType: '개인/팀',
    progress: 61,
  },
  {
    id: '5',
    folderName: '폴더명',
    folderColor: 'green' as const,
    dDay: 'D-13',
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

      {/* 폴더 필터 바 */}
      <FilterChipGroup folders={folders} defaultSelected={['1', '4']} />

      {/* 캘린더 + 과제목록 */}
      <Container.Main>
        {/* 캘린더 */}
        <Container.Calendar>
          <Calendar />
        </Container.Calendar>

        {/* 과제목록 */}
        <AssignmentSection initialAssignments={sampleAssignments} />
      </Container.Main>
    </Container.Page>
  );
}

const Container = {
  Page: styled('div', {
    base: stack.raw({
      gap: '1.5rem',
      marginY: '2rem',
    }),
  }),
  Header: styled('div', {
    base: hstack.raw({
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
    }),
  }),
  Main: styled('div', {
    base: hstack.raw({
      gap: '1.5rem',
      alignItems: 'flex-start',
      width: '100%',
    }),
  }),
  Calendar: styled('div', {
    base: {
      width: '45.9375rem',
      height: '44rem',
      border: '0.0625rem solid',
      borderColor: 'gray.200',
      borderRadius: '0.75rem',
      boxShadow: '-1px 1px 4px 0 rgba(0, 0, 0, 0.08)',
    },
  }),
};
