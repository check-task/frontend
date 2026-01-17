import { styled } from 'styled-system/jsx';
import { hstack, stack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { ChevronDownIcon } from '@/components/icons/ChevronDownIcon';
import { AssignmentCard } from '@/features/home/components/AssignmentCard';
import { FilterChipGroup } from '@/features/home/components/FilterChipGroup';
import { SortTabs } from '@/features/home/components/SortTabs';

// 샘플 폴더 데이터
const folders = [
  { id: '1', name: '그만세', color: 'red' as const },
  { id: '2', name: '웹서프', color: 'purple' as const },
  { id: '3', name: '프로그래밍', color: 'green' as const },
  { id: '4', name: '팀과제', color: 'yellow' as const },
  { id: '5', name: '캡스톤', color: 'black' as const },
];

export default function Home() {
  return (
    <Container.Page>
      {/* 년/월 선택 + 과제등록 버튼 */}
      <Container.Header>
        <Container.DateSelector>
          <Text.DateTitle>2025년 11월</Text.DateTitle>
          <ChevronDownIcon />
        </Container.DateSelector>
        <Button variant='fillBlue' size='small'>
          과제등록
        </Button>
      </Container.Header>

      {/* 폴더 필터 바 */}
      <FilterChipGroup folders={folders} defaultSelected={['1', '4']} />

      {/* 캘린더 + 과제목록 */}
      <Container.Main>
        {/* 캘린더 */}
        <Container.Calendar>
          <CalendarPlaceholder />
        </Container.Calendar>

        {/* 과제목록 */}
        <Container.AssignmentList>
          <Container.AssignmentListHeader>
            <Text.AssignmentListTitle>과제목록</Text.AssignmentListTitle>
            <SortTabs defaultTab='priority' />
          </Container.AssignmentListHeader>

          {/* 과제 카드 리스트 */}
          <Container.AssignmentCards>
            <AssignmentCard
              index={0}
              folderName='그만세'
              folderColor='red'
              dDay='D-43'
              assignmentName='프로그래밍 1차 과제'
              assignmentType='개인/팀'
              progress={82}
              progressColor='red'
            />
            <AssignmentCard
              index={1}
              folderName='폴더명'
              folderColor='yellow'
              dDay='D-43'
              assignmentName='과제 1'
              assignmentType='개인/팀'
              progress={82}
              progressColor='yellow'
            />
            <AssignmentCard
              index={2}
              folderName='폴더명'
              folderColor='green'
              dDay='D-43'
              assignmentName='과제 1'
              assignmentType='개인/팀'
              progress={82}
              progressColor='green'
            />
            <AssignmentCard
              index={3}
              folderName='폴더명'
              folderColor='purple'
              dDay='D-43'
              assignmentName='과제 1'
              assignmentType='개인/팀'
              progress={82}
              progressColor='purple'
            />
            <AssignmentCard
              index={4}
              folderName='폴더명'
              folderColor='green'
              dDay='D-43'
              assignmentName='과제 1'
              assignmentType='개인/팀'
              progress={82}
              progressColor='green'
            />
          </Container.AssignmentCards>
        </Container.AssignmentList>
      </Container.Main>
    </Container.Page>
  );
}

// 캘린더 Placeholder 컴포넌트
const CalendarPlaceholder = () => (
  <div
    className={stack({
      width: '100%',
      height: '100%',
      bg: 'white',
      boxShadow: '-1px 1px 4px 0 rgba(0, 0, 0, 0.08)',
      borderRadius: '0.75rem',
      alignItems: 'center',
      justifyContent: 'center',
    })}
  >
    <Text.CalendarPlaceholder>캘린더 영역</Text.CalendarPlaceholder>
  </div>
);

const Container = {
  Page: styled('div', {
    base: stack.raw({
      gap: '1.5rem',
      width: '75rem',
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
  DateSelector: styled('button', {
    base: hstack.raw({
      gap: '0.25rem',
      alignItems: 'center',
      cursor: 'pointer',
      background: 'transparent',
      border: 'none',
    }),
  }),
  FilterBar: styled('div', {
    base: hstack.raw({
      gap: '0.25rem',
      flexWrap: 'wrap',
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
      width: '46.125rem',
      height: '44rem',
    },
  }),
  AssignmentList: styled('div', {
    base: stack.raw({
      gap: '1.25rem',
      width: '27.375rem',
    }),
  }),
  AssignmentListHeader: styled('div', {
    base: hstack.raw({
      justifyContent: 'space-between',
      alignItems: 'center',
    }),
  }),
  AssignmentCards: styled('div', {
    base: stack.raw({
      gap: '0.75rem',
    }),
  }),
};

const Text = {
  DateTitle: styled('h1', {
    base: {
      textStyle: 'h1',
      color: 'gray.900',
    },
  }),
  AssignmentListTitle: styled('h4', {
    base: {
      textStyle: 'h4',
      color: 'gray.900',
    },
  }),
  CalendarPlaceholder: styled('span', {
    base: {
      textStyle: 'body2.m',
      color: 'gray.400',
    },
  }),
};
