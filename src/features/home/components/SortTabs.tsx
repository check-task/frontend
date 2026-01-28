import { styled } from 'styled-system/jsx';
import { hstack } from 'styled-system/patterns';

export type SortType = 'priority' | 'deadline' | 'progress';

const TABS: { id: SortType; label: string }[] = [
  { id: 'priority', label: '우선순위' },
  { id: 'deadline', label: '마감일순' },
  { id: 'progress', label: '진척도순' },
];

interface SortTabsProps {
  activeTab: SortType;
  onTabChange: (tab: SortType) => void;
}

export const SortTabs = ({ activeTab, onTabChange }: SortTabsProps) => {
  return (
    <Tabs.Container>
      {TABS.map((tab) => (
        <Tabs.Tab
          key={tab.id}
          active={activeTab === tab.id}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </Tabs.Tab>
      ))}
    </Tabs.Container>
  );
};

const Tabs = {
  Container: styled('div', {
    base: hstack.raw({
      gap: '1rem',
    }),
  }),
  Tab: styled('button', {
    base: {
      textStyle: 'body3.r',
      color: 'gray.300',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: 0,
    },
    variants: {
      active: {
        true: {
          textStyle: 'body3.m',
          color: 'gray.900',
          textDecoration: 'underline',
          textUnderlineOffset: '0.25rem',
        },
      },
    },
  }),
};
