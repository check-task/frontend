'use client';

import { useState, useEffect } from 'react';
import { css } from 'styled-system/css';
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
    value.toUpperCase() === 'PENDING';
  return isEmpty
    ? { name: 'none', profileImage: undefined }
    : { name: manager!, profileImage };
};

interface TeamTaskManagerProps {
  manager?: string;
  profileImage?: string;
  /** 드롭다운에 표시할 팀원 목록 (내 정보 제외, id 있으면 과제 수정 API에 사용) */
  members?: TeamTaskManagerMember[];
  /** 선택 시 (닉네임, 담당자 사용자 ID). ID 없으면 API 미전송 가능 */
  onSelectMember?: (nickname: string, assigneeId?: number) => void;
}

export const TeamTaskManager = ({
  manager,
  profileImage,
  members = [],
  onSelectMember,
}: TeamTaskManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [display, setDisplay] = useState(() =>
    getDisplayFromProps(manager, profileImage),
  );
  const { data: myInfo } = useMyInfo();
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  useEffect(() => {
    setDisplay(getDisplayFromProps(manager, profileImage));
  }, [manager, profileImage]);

  const hasManager = display.name !== 'none';
  const isEmpty = display.name === 'none';

  const myNickname = myInfo?.user?.nickname ?? '나';

  const getProfileImageForNickname = (nickname: string): string | undefined => {
    if (nickname === myNickname) return myInfo?.user?.profileImage;
    return members.find((m) => m.nickname === nickname)?.profileImage;
  };

  const getAssigneeIdForNickname = (nickname: string): number | undefined => {
    if (nickname === myNickname) return myInfo?.user?.id;
    return members.find((m) => m.nickname === nickname)?.id;
  };

  const handleSelect = (nickname: string) => {
    setDisplay({
      name: nickname,
      profileImage: getProfileImageForNickname(nickname),
    });
    onSelectMember?.(nickname, getAssigneeIdForNickname(nickname));
    setIsOpen(false);
  };

  return (
    <div ref={ref} className={wrapperStyle}>
      <button
        type="button"
        className={
          isEmpty ? teamTaskManagerEmptyContainerStyle : teamTaskManagerStyle
        }
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <p
          className={
            isEmpty ? teamTaskManagerIconEmptyStyle : teamTaskManagerIconStyle
          }
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
        <p className={css({ textStyle: 'body2.r', color: 'gray.800' })}>
          {hasManager ? display.name : 'none'}
        </p>
      </button>

      {isOpen && (
        <TeamTaskManagerDropdown
          myNickname={myNickname}
          myProfileImage={myInfo?.user?.profileImage}
          members={members}
          selectedManager={display.name !== 'none' ? display.name : undefined}
          onSelect={handleSelect}
        />
      )}
    </div>
  );
};

const wrapperStyle = css({
  position: 'relative',
  display: 'inline-block',
});

const teamTaskManagerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  height: '2.625rem',
  bg: 'blue.50',
  borderRadius: '2.5rem',
  px: '0.75rem',
  border: 'none',
  cursor: 'pointer',
});

const teamTaskManagerEmptyContainerStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  height: '2.625rem',
  bg: 'gray.100',
  borderRadius: '2.5rem',
  px: '0.75rem',
  border: 'none',
  cursor: 'pointer',
});

const teamTaskManagerIconStyle = css({
  width: '1.375rem',
  height: '1.375rem',
  borderRadius: 'full',
  bg: 'blue.200',
});

const teamTaskManagerIconEmptyStyle = css({
  width: '1.375rem',
  height: '1.375rem',
  borderRadius: 'full',
  bg: 'gray.200',
});
