'use client';

import { useState } from 'react';
import { css } from 'styled-system/css';
import { useClickOutside } from '@/hooks/useClickOutside';
import { useMyInfo } from '@/hooks/queries/useMyInfo';
import type { TaskDetailSubTaskAssignee } from '@/types/task';
import { TeamTaskManagerDropdown } from './TeamTaskManagerDropdown';
import type { TeamTaskManagerDropdownMember } from './TeamTaskManagerDropdown';
import { TeamTaskManagerChipGroup } from './TeamTaskManagerChipGroup';

export type TeamTaskManagerMember = TeamTaskManagerDropdownMember;

interface TeamTaskManagerProps {
  assignees?: TaskDetailSubTaskAssignee[];
  /** 드롭다운에 표시할 팀원 목록 (내 정보 제외) */
  members?: TeamTaskManagerMember[];
  /** 선택된 담당자 user id 목록. 빈 배열이면 담당자 없음(none) */
  onSelectMember?: (assigneeIds: number[]) => void;
}

export const TeamTaskManager = ({
  assignees = [],
  members = [],
  onSelectMember,
}: TeamTaskManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prevAssignees, setPrevAssignees] = useState(assignees);
  // 현재 선택되어 있는 담당자들의 userId 목록
  const [selectedIds, setSelectedIds] = useState<number[]>(() =>
    assignees.map((a) => a.userId),
  );
  const { data: myInfo } = useMyInfo();
  const ref = useClickOutside<HTMLDivElement>(() => setIsOpen(false));

  // assignees prop이 바뀌면(서버 재조회 등) 렌더 중 즉시 로컬 선택 상태를 동기화
  if (assignees !== prevAssignees) {
    setPrevAssignees(assignees);
    setSelectedIds(assignees.map((a) => a.userId));
  }

  const myNickname = myInfo?.user?.nickname ?? '나';
  const myId = myInfo?.user?.id ?? 0;

  const handleToggleMember = (id: number) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setSelectedIds(next);
    onSelectMember?.(next);
  };

  const handleClearAll = () => {
    setSelectedIds([]);
    onSelectMember?.([]);
  };

  const canonicalOrder = [
    { id: myId, nickname: myNickname, profileImage: myInfo?.user?.profileImage },
    ...members,
  ];
  const chipMembers = canonicalOrder
    .filter((m) => selectedIds.includes(m.id))
    .map(({ nickname, profileImage }) => ({
      nickname,
      profileImage: profileImage ?? undefined,
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
          myId={myId}
          myNickname={myNickname}
          myProfileImage={myInfo?.user?.profileImage ?? undefined}
          members={members}
          selectedIds={selectedIds}
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
