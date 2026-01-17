'use client';

import { useState } from 'react';
import { styled } from 'styled-system/jsx';
import { hstack } from 'styled-system/patterns';

export type SortType = 'priority' | 'deadline' | 'progress';

interface SortTabsProps {
  defaultTab?: SortType;
  onTabChange?: (tab: SortType) => void;
}

export const SortTabs = ({
  defaultTab = 'priority',
  onTabChange,
}: SortTabsProps) => {
  const [activeTab, setActiveTab] = useState<SortType>(defaultTab);

  const handleTabClick = (tab: SortType) => {
    setActiveTab(tab);
    onTabChange?.(tab);
  };

  return (
    <Tabs.Container>
      <Tabs.Tab
        active={activeTab === 'priority'}
        onClick={() => handleTabClick('priority')}
      >
        우선순위
      </Tabs.Tab>
      <Tabs.Tab
        active={activeTab === 'deadline'}
        onClick={() => handleTabClick('deadline')}
      >
        마감일순
      </Tabs.Tab>
      <Tabs.Tab
        active={activeTab === 'progress'}
        onClick={() => handleTabClick('progress')}
      >
        진척도순
      </Tabs.Tab>
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
