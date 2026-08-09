'use client';

import { Fragment } from 'react';
import { css, cva } from 'styled-system/css';
import { CheckMark } from '@/components/icons/CheckMark';

export interface TeamTaskManagerDropdownMember {
  id?: number;
  nickname: string;
  profileImage?: string;
}

interface TeamTaskManagerDropdownProps {
  myNickname: string;
  myProfileImage?: string;
  members: TeamTaskManagerDropdownMember[];
  selectedNicknames: string[];
  onToggle: (nickname: string) => void;
  onClearAll: () => void;
}

export const TeamTaskManagerDropdown = ({
  myNickname,
  myProfileImage,
  members,
  selectedNicknames,
  onToggle,
  onClearAll,
}: TeamTaskManagerDropdownProps) => {
  const isNoneSelected = selectedNicknames.length === 0;

  const rows = [
    <button
      key='none'
      type='button'
      className={dropdownItemStyle({ selected: isNoneSelected })}
      onClick={onClearAll}
      role='option'
      aria-selected={isNoneSelected}
    >
      <span className={noneCircleStyle} />
      <span className={nicknameStyle({ selected: isNoneSelected })}>none</span>
      {isNoneSelected && <CheckMark variant='blue' size={10} className={checkIconStyle} />}
    </button>,
    <button
      key={myNickname}
      type='button'
      className={dropdownItemStyle({
        selected: selectedNicknames.includes(myNickname),
      })}
      onClick={() => onToggle(myNickname)}
      role='option'
      aria-selected={selectedNicknames.includes(myNickname)}
    >
      <span
        className={profileCircleStyle}
        style={
          myProfileImage
            ? {
                backgroundImage: `url(${myProfileImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : undefined
        }
      />
      <span
        className={nicknameStyle({
          selected: selectedNicknames.includes(myNickname),
        })}
      >
        {myNickname}(you)
      </span>
      {selectedNicknames.includes(myNickname) && (
        <CheckMark variant='blue' size={10} className={checkIconStyle} />
      )}
    </button>,
    ...members.map((m) => {
      const isSelected = selectedNicknames.includes(m.nickname);
      return (
        <button
          key={m.nickname}
          type='button'
          className={dropdownItemStyle({ selected: isSelected })}
          onClick={() => onToggle(m.nickname)}
          role='option'
          aria-selected={isSelected}
        >
          <span
            className={profileCircleStyle}
            style={
              m.profileImage
                ? {
                    backgroundImage: `url(${m.profileImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }
                : undefined
            }
          />
          <span className={nicknameStyle({ selected: isSelected })}>
            {m.nickname}
          </span>
          {isSelected && <CheckMark variant='blue' size={10} className={checkIconStyle} />}
        </button>
      );
    }),
  ];

  return (
    <div className={dropdownStyle} role='listbox' aria-label='담당자 선택'>
      {rows.map((row, index) => (
        <Fragment key={row.key}>
          {row}
          {index < rows.length - 1 && <span className={dividerStyle} />}
        </Fragment>
      ))}
    </div>
  );
};

const dropdownStyle = css({
  position: 'absolute',
  top: '100%',
  right: 0,
  zIndex: 10,
  width: '13.375rem',
  marginTop: '0.25rem',
  padding: '0.5rem',
  bg: 'bg',
  borderRadius: '0.5rem',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
  overflow: 'hidden',
});

const dropdownItemStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '0.75rem',
    width: '100%',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    textAlign: 'left',
  },
  variants: {
    selected: {
      true: { bg: 'blue.50' },
      false: {},
    },
  },
  defaultVariants: { selected: false },
});

const dividerStyle = css({
  display: 'block',
  height: '0.0625rem',
  bg: 'gray.100',
  margin: '0.5rem -0.5rem',
});

const checkIconStyle = css({
  flexShrink: 0,
  marginLeft: '0.25rem',
});

const noneCircleStyle = css({
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: 'full',
  bg: 'gray.200',
  flexShrink: 0,
});

const profileCircleStyle = css({
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: 'full',
  bg: 'blue.200',
  flexShrink: 0,
});

const nicknameStyle = cva({
  base: {
    textStyle: 'body3.r',
    color: 'gray.800',
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  variants: {
    selected: {
      true: { textStyle: 'body3.m', color: 'blue.500' },
      false: {},
    },
  },
  defaultVariants: { selected: false },
});
