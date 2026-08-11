import { css } from 'styled-system/css';
import { useTaskMemberProfile } from '@/hooks/queries/useTaskMemberProfile';

// 백엔드가 연락처 미설정 사용자에게 null 대신 내려주는 안내 문구
const PHONE_PLACEHOLDER = '전화번호를 입력해 주세요.';

interface TeamMemberProfileModalItemProps {
  taskId: number;
  userId?: number;
}

export const TeamMemberProfileModalItem = ({
  taskId,
  userId,
}: TeamMemberProfileModalItemProps) => {
  const { data: profile } = useTaskMemberProfile(taskId, userId);
  const phoneNum =
    profile?.phoneNum && profile.phoneNum !== PHONE_PLACEHOLDER
      ? profile.phoneNum
      : '';

  return (
    <div className={cardStyle}>
      <div className={profileColumnStyle}>
        <div
          className={avatarStyle}
          style={
            profile?.profileImage
              ? {
                  backgroundImage: `url(${profile.profileImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }
              : undefined
          }
        />
        <p className={nameStyle}>{profile?.nickname ?? ''}</p>
      </div>

      <div className={verticalDividerStyle} />

      <div className={infoColumnStyle}>
        <p className={infoTitleStyle}>기본정보</p>
        <div className={infoRowsStyle}>
          <div className={infoRowStyle}>
            <span className={infoLabelStyle}>연락처</span>
            <span className={infoValueStyle}>{phoneNum || '-'}</span>
          </div>
          <div className={infoRowStyle}>
            <span className={infoLabelStyle}>이메일</span>
            <span className={infoValueStyle}>{profile?.email || '-'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const cardStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1.75rem',
  padding: '1.25rem 1.75rem',
  marginTop: '1.75rem',
  marginBottom: '1.125rem',
  bg: 'gray.0',
  borderRadius: '0.75rem',
  boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.08)',
});

const profileColumnStyle = css({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '0.75rem',
});

const avatarStyle = css({
  width: '5rem',
  height: '5rem',
  minWidth: '5rem',
  borderRadius: 'full',
  bg: 'blue.100',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'hidden',
});

const nameStyle = css({
  textStyle: 'body2.m',
  color: 'gray.900',
  textAlign: 'center',
});

const verticalDividerStyle = css({
  width: '0.0625rem',
  height: '6.25rem',
  bg: 'gray.200',
});

const infoColumnStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  flex: 1,
});

const infoTitleStyle = css({
  textStyle: 'body2.m',
  color: 'gray.900',
});

const infoRowsStyle = css({
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
});

const infoRowStyle = css({
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
});

const infoLabelStyle = css({
  textStyle: 'body2.r',
  color: 'gray.400',
  whiteSpace: 'nowrap',
  flexShrink: 0,
});

const infoValueStyle = css({
  textStyle: 'body2.m',
  color: 'gray.700',
});
