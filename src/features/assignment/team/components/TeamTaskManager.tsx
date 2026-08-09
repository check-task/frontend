'use client';

import { useState, useEffect } from 'react';
import { css } from 'styled-system/css';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useMyInfo } from '@/hooks/queries/useMyInfo';
import { TeamTaskManagerDropdown } from './TeamTaskManagerDropdown';
import type { TeamTaskManagerDropdownMember } from './TeamTaskManagerDropdown';
import { TeamTaskManagerChipGroup } from './TeamTaskManagerChipGroup';

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

  const myNickname = myInfo?.user?.nickname ?? '나';

  const handleToggleMember = (nickname: string) => {
    setSelectedNicknames((prev) =>
      prev.includes(nickname)
        ? prev.filter((n) => n !== nickname)
        : [...prev, nickname],
    );
  };

  const handleClearAll = () => setSelectedNicknames([]);

  const canonicalOrder = [myNickname, ...members.map((m) => m.nickname)];
  const chipMembers = canonicalOrder
    .filter((nickname) => selectedNicknames.includes(nickname))
    .map((nickname) => ({
      nickname,
      profileImage:
        nickname === myNickname
          ? (myInfo?.user?.profileImage ?? undefined)
          : members.find((m) => m.nickname === nickname)?.profileImage,
    }));

  return (
    <div ref={ref} className={wrapperStyle}>
      <TeamTaskManagerChipGroup
        members={chipMembers}
        isOpen={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      />

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
  flex: 1,
  minWidth: 0,
});
