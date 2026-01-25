import { styled } from 'styled-system/jsx';
import { hstack, stack } from 'styled-system/patterns';
import { DateSelectorWithPicker } from '@/features/home/components/DateSelectorWithPicker';
import { ButtonGroup } from '@/features/home/components/ButtonGroup';
import { HomeContent } from '@/features/home/components/HomeContent';
import { sampleAssignments } from '@/data/sampleAssignments';

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
