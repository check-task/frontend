import { cva, css } from 'styled-system/css';
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
    <div className={containerStyle}>
      {TABS.map((tab) => (
        <button
          key={tab.id}
          className={tabStyle({ active: activeTab === tab.id })}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const containerStyle = css(
  hstack.raw({
    gap: '1rem',
  }),
);

const tabStyle = cva({
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
      false: {},
    },
  },
  defaultVariants: {
    active: false,
  },
});
