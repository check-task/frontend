'use client';

import { useState, useEffect } from 'react';
import { css, cva } from 'styled-system/css';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useMyInfo } from '@/hooks/queries/useMyInfo';
import { TeamTaskManagerDropdown } from './TeamTaskManagerDropdown';
import type { TeamTaskManagerDropdownMember } from './TeamTaskManagerDropdown';

export type TeamTaskManagerMember = TeamTaskManagerDropdownMember;

const getDisplayFromProps = (
  manager?: string,
  profileImage?: string,
): { name: string; profileImage?: string } => {
  const value = (manager ?? '').trim();
  const isEmpty =
    value === '' ||
    value === 'none' ||
    value.toUpperCase() === 'PENDING' ||
    value === '미지정';
  return isEmpty
    ? { name: 'none', profileImage: undefined }
    : { name: manager!, profileImage };
};

interface TeamTaskManagerProps {
  manager?: string;
  profileImage?: string;
  /** 드롭다운에 표시할 팀원 목록 (내 정보 제외, id 있으면 과제 수정 API에 사용) */
  members?: TeamTaskManagerMember[];
  /** 선택 시 (닉네임, 담당자 사용자 ID). null이면 담당자 없음(none) */
  onSelectMember?: (nickname: string, assigneeId?: number | null) => void;
}

export const TeamTaskManager = ({
  manager,
  profileImage,
  members = [],
}: TeamTaskManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState(() =>
    getDisplayFromProps(manager, profileImage),
  );
  const [selectedNicknames, setSelectedNicknames] = useState<string[]>(() =>
    display.name !== 'none' ? [display.name] : [],
  );
  const { data: myInfo } = useMyInfo();
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  useEffect(() => {
    setDisplay(getDisplayFromProps(manager, profileImage));
  }, [manager, profileImage]);

  useEffect(() => {
    setSelectedNicknames(display.name !== 'none' ? [display.name] : []);
  }, [display]);

  const hasManager = display.name !== 'none';
  const isEmpty = display.name === 'none';

  const myNickname = myInfo?.user?.nickname ?? '나';

  const handleToggleMember = (nickname: string) => {
    setSelectedNicknames((prev) =>
      prev.includes(nickname)
        ? prev.filter((n) => n !== nickname)
        : [...prev, nickname],
    );
  };

  const handleClearAll = () => setSelectedNicknames([]);

  return (
    <div ref={ref} className={wrapperStyle}>
      <button
        type="button"
        className={teamTaskManagerStyle({ empty: isEmpty })}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <p
          className={teamTaskManagerIconStyle({ empty: isEmpty })}
          style={
            display.profileImage
              ? {
                  backgroundImage: `url(${display.profileImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        />
        <p className={css({ textStyle: 'body2.r', color: isEmpty ? 'gray.300' : 'gray.800' })}>
          {hasManager ? display.name : 'none'}
        </p>
      </button>

      {isOpen && (
        <TeamTaskManagerDropdown
          myNickname={myNickname}
          myProfileImage={myInfo?.user?.profileImage ?? undefined}
          members={members}
          selectedNicknames={selectedNicknames}
          onToggle={handleToggleMember}
          onClearAll={handleClearAll}
        />
      )}
    </div>
  );
};

const wrapperStyle = css({
  position: 'relative',
  display: 'inline-block',
});

const teamTaskManagerStyle = cva({
  base: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.375rem',
    borderRadius: '2.5rem',
    pl: '0.5rem',
    pr: '0.75rem',
    py: '0.5rem',
    border: 'none',
    cursor: 'pointer',
    outline: 'none',
  },
  variants: {
    empty: {
      true: { bg: 'gray.100' },
      false: { bg: 'blue.50' },
    },
  },
  defaultVariants: { empty: false },
});

const teamTaskManagerIconStyle = cva({
  base: {
    width: '1.375rem',
    height: '1.375rem',
    borderRadius: 'full',
  },
  variants: {
    empty: {
      true: { bg: 'gray.200' },
      false: { bg: 'blue.200' },
    },
  },
  defaultVariants: { empty: false },
});
