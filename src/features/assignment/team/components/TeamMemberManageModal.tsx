import { css } from 'styled-system/css';
import { TeamMemberManageModalItem } from './TeamMemberManageModalItem';

export const TeamMemberManageModal = () => {
  return (
    <div className={modalContentStyle}>
      {/* TODO: 팀원 초대 버튼 모달 타이틀에 추가 */}
      <TeamMemberManageModalItem
        nickname='멤버 닉네임'
        role='Owner'
        onSetLeader={() => console.log('팀장으로 설정')}
        onDeleteMember={() => console.log('팀원 삭제')}
      />

      <TeamMemberManageModalItem
        nickname='멤버 닉네임'
        role='Member'
        onSetLeader={() => console.log('팀장으로 설정')}
        onDeleteMember={() => console.log('팀원 삭제')}
      />

      <TeamMemberManageModalItem
        nickname='멤버 닉네임'
        role='Member'
        onSetLeader={() => console.log('팀장으로 설정')}
        onDeleteMember={() => console.log('팀원 삭제')}
      />
    </div>
  );
};

const modalContentStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem',
  pt: '1.75rem',
});
