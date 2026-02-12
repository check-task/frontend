'use client';

import { css } from 'styled-system/css';

export interface TeamTaskManagerDropdownMember {
  id?: number;
  nickname: string;
  profileImage?: string;
}

interface TeamTaskManagerDropdownProps {
  myNickname: string;
  myProfileImage?: string;
  members: TeamTaskManagerDropdownMember[];
  selectedManager?: string;
  onSelect: (nickname: string) => void;
}

export const TeamTaskManagerDropdown = ({
  myNickname,
  myProfileImage,
  members,
  selectedManager,
  onSelect,
}: TeamTaskManagerDropdownProps) => {
  return (
    <div className={dropdownStyle} role='listbox' aria-label='담당자 선택'>
      <button
        type='button'
        className={dropdownItemStyle}
        onClick={() => onSelect(myNickname)}
        role='option'
        aria-selected={selectedManager === myNickname}
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
        <span className={nicknameStyle}>{myNickname}(you)</span>
      </button>
      {members.map((m) => (
        <button
          key={m.nickname}
          type='button'
          className={dropdownItemStyle}
          onClick={() => onSelect(m.nickname)}
          role='option'
          aria-selected={selectedManager === m.nickname}
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
          <span className={nicknameStyle}>{m.nickname}</span>
        </button>
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
  bg: 'bg',
  borderRadius: '0.5rem',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.12)',
  overflow: 'hidden',
});

const dropdownItemStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  width: '100%',
  py: '0.75rem',
  pl: '1rem',
  pr: '1rem',
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  textAlign: 'left',
  borderBottom: '0.0625rem solid',
  borderBottomColor: 'gray.100',
  '&:last-child': {
    borderBottom: 'none',
  },
});

const profileCircleStyle = css({
  width: '1.5rem',
  height: '1.5rem',
  borderRadius: 'full',
  bg: 'blue.200',
  flexShrink: 0,
});

const nicknameStyle = css({
  textStyle: 'body3.r',
  color: 'gray.800',
});
