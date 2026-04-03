'use client';

import { css, cva } from 'styled-system/css';
import { hstack, stack } from 'styled-system/patterns';
import { Card } from '@/features/profile/components/Card';
import { NotificationSetting } from '@/features/profile/components/NotificationSetting';
import { FolderSetting } from '@/features/profile/components/FolderSetting';
import { AddFolderButton } from '@/features/profile/components/AddFolderButton';
import { EditFolderButton } from '@/features/profile/components/EditFolderButton';
import { DeleteFolderButton } from '@/features/profile/components/DeleteFolderButton';
import { AlarmTimeSelect } from '@/features/profile/components/AlarmTimeSelect';
import { useMyInfo } from '@/hooks/queries/useMyInfo';
import {
  useUpdateDeadlineAlarmSetting,
  useUpdateTaskAlarmSetting,
} from '@/hooks/mutations/useUpdateAlarmTimeSetting';

export const ManagementSection = () => {
  const { data, isLoading } = useMyInfo();
  const updateDeadlineAlarmSetting = useUpdateDeadlineAlarmSetting();
  const updateTaskAlarmSetting = useUpdateTaskAlarmSetting();

  // 알림 시간 변경 핸들러 (즉시 자동저장)
  const handleAlarmChange = (
    field: 'deadlineAlarm' | 'taskAlarm',
    hours: number,
  ) => {
    if (field === 'deadlineAlarm') {
      updateDeadlineAlarmSetting.mutate(hours);
      return;
    }

    updateTaskAlarmSetting.mutate(hours);
  };

  if (isLoading || !data) {
    return null;
  }

  const { user, folders } = data;

  return (
    <section className={layoutSectionStyle}>
      <h1 className={titleStyle}>과제 관리</h1>

      <Card type='management'>
        {/* 알림 설정 */}
        <NotificationSetting>
          <h3 className={sectionTitleStyle}>알림 설정</h3>
          <div className={settingContentStyle}>
            <div className={settingRowStyle}>
              <span className={settingLabelStyle}>최종 마감 알림</span>
              <AlarmTimeSelect
                defaultValue={user.deadlineAlarm}
                onChange={(hours) => handleAlarmChange('deadlineAlarm', hours)}
              />
            </div>
            <div className={settingRowStyle}>
              <span className={settingLabelStyle}>TASK별 알림</span>
              <AlarmTimeSelect
                defaultValue={user.taskAlarm}
                onChange={(hours) => handleAlarmChange('taskAlarm', hours)}
              />
            </div>
          </div>
        </NotificationSetting>

        {/* 구분선 */}
        <div className={dividerStyle} />

        {/* 폴더 설정 */}
        <FolderSetting>
          <div className={folderHeaderStyle}>
            <h3 className={sectionTitleStyle}>폴더 설정</h3>
            <AddFolderButton />
          </div>
          <div className={folderListStyle}>
            {folders.map((folder) => (
              <div key={folder.id} className={folderItemStyle}>
                <div className={folderInfoStyle}>
                  <div className={folderColorStyle({ color: folder.color })} />
                  <span className={folderNameStyle}>{folder.name}</span>
                </div>
                <div className={folderActionsStyle}>
                  <EditFolderButton
                    folderId={folder.id}
                    folderName={folder.name}
                    folderColor={folder.color}
                  />
                  <DeleteFolderButton
                    folderId={folder.id}
                    folderName={folder.name}
                    folderColor={folder.color}
                  />
                </div>
              </div>
            ))}
          </div>
        </FolderSetting>
      </Card>
    </section>
  );
};

// 레이아웃
const layoutSectionStyle = css(
  stack.raw({
    gap: '0.75rem',
    marginTop: '0.75rem',
  }),
);

// 텍스트 스타일
const titleStyle = css({
  textStyle: 'h3',
  color: 'gray.900',
});

const sectionTitleStyle = css({
  textStyle: 'h4',
  color: 'gray.900',
});

const settingLabelStyle = css({
  textStyle: 'body1.r',
  color: 'gray.400',
});

// 설정 섹션 스타일
const settingRowStyle = css(
  hstack.raw({
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: '3rem',
  }),
);

const settingContentStyle = css(
  stack.raw({
    gap: '0.5rem',
  }),
);

// 폴더 스타일
const folderHeaderStyle = css(
  hstack.raw({
    justifyContent: 'space-between',
    alignItems: 'center',
  }),
);

const folderListStyle = css(
  stack.raw({
    gap: '0.5rem',
  }),
);

const folderItemStyle = css(
  hstack.raw({
    gap: '0.75rem',
    alignItems: 'center',
    height: '3rem',
  }),
);

const folderInfoStyle = css(
  hstack.raw({
    gap: '0.75rem',
    alignItems: 'center',
    flex: 1,
  }),
);

const folderColorStyle = cva({
  base: {
    width: '1.75rem',
    height: '1.75rem',
    borderRadius: '50%',
  },
  variants: {
    color: {
      red: { bg: 'sub.01.100' },
      yellow: { bg: 'sub.02.100' },
      green: { bg: 'sub.03.100' },
      purple: { bg: 'sub.04.100' },
      black: { bg: 'sub.05.100' },
    },
  },
});

const folderNameStyle = css({
  textStyle: 'body1.m',
  color: 'gray.700',
  flex: 1,
});

const folderActionsStyle = css(
  hstack.raw({
    gap: '0.75rem',
  }),
);

// 구분선
const dividerStyle = css({
  width: '1px',
  height: '17.25rem',
  bg: 'gray.200',
  alignSelf: 'center',
});
