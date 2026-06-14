import { css } from 'styled-system/css';
import { hstack, stack } from 'styled-system/patterns';
import { DateSelectorWithPicker } from '@/features/home/components/DateSelectorWithPicker';
import { ButtonGroup } from '@/features/home/components/ButtonGroup';
import { HomeContent } from '@/features/home/components/HomeContent';

export default function Home() {
  return (
    <div className={pageStyle}>
      {/* 년/월 선택 + 버튼 */}
      <div className={headerStyle}>
        <DateSelectorWithPicker />
        <ButtonGroup />
      </div>

      {/* 폴더 필터 + 캘린더 + 과제목록 */}
      <HomeContent />
    </div>
  );
}

const pageStyle = css(
  stack.raw({
    gap: '1.5rem',
    paddingX: '1.5rem',
    marginX: 'auto',
    marginTop: '2rem',
    marginBottom: '3.75rem',
  }),
);

const headerStyle = css(
  hstack.raw({
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  }),
);
