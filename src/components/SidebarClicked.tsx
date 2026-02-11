'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { css } from 'styled-system/css';

const ITEMS = [
  {
    id: 'create',
    label: 'Create',
    src: '/Create.svg',
    hoveredSrc: '/CreateHovered.svg',
    width: 178,
    height: 42,
    href: '/assignment/create',
  },
  {
    id: 'personal',
    label: 'Personal',
    src: '/Personal.svg',
    hoveredSrc: '/PersonalHovered.svg',
    width: 158,
    height: 42,
    href: '/',
  },
  {
    id: 'team',
    label: 'Team',
    src: '/Team.svg',
    hoveredSrc: '/TeamHovered.svg',
    width: 158,
    height: 42,
    href: '/assignment/team',
  },
] as const;

export const SidebarClicked = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div className={sidebarClickedStyle}>
      {ITEMS.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={itemLinkStyle}
          onMouseEnter={() => setHoveredId(item.id)}
          onMouseLeave={() => setHoveredId(null)}
        >
          <Image
            src={hoveredId === item.id ? item.hoveredSrc : item.src}
            alt={item.label}
            width={item.width}
            height={item.height}
          />
        </Link>
      ))}
    </div>
  );
};

const sidebarClickedStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
});

const itemLinkStyle = css({
  display: 'block',
  cursor: 'pointer',
});
