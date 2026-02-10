'use client';

import { styled } from 'styled-system/jsx';
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
    <Layout.Section>
      <Text.Title>과제 관리</Text.Title>

      <Card type='management'>
        {/* 알림 설정 */}
        <NotificationSetting>
          <Text.SectionTitle>알림 설정</Text.SectionTitle>
          <Setting.Content>
            <Setting.Row>
              <Text.SettingLabel>최종 마감 알림</Text.SettingLabel>
              <AlarmTimeSelect
                defaultValue={user.deadlineAlarm}
                onChange={(hours) => handleAlarmChange('deadlineAlarm', hours)}
              />
            </Setting.Row>
            <Setting.Row>
              <Text.SettingLabel>TASK별 알림</Text.SettingLabel>
              <AlarmTimeSelect
                defaultValue={user.taskAlarm}
                onChange={(hours) => handleAlarmChange('taskAlarm', hours)}
              />
            </Setting.Row>
          </Setting.Content>
        </NotificationSetting>

        {/* 구분선 */}
        <Divider />

        {/* 폴더 설정 */}
        <FolderSetting>
          <Folder.Header>
            <Text.SectionTitle>폴더 설정</Text.SectionTitle>
            <AddFolderButton />
          </Folder.Header>
          <Folder.List>
            {folders.map((folder) => (
              <Folder.Item key={folder.id}>
                <Folder.Info>
                  <Folder.Color color={folder.color} />
                  <Folder.Name>{folder.name}</Folder.Name>
                </Folder.Info>
                <Folder.Actions>
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
                </Folder.Actions>
              </Folder.Item>
            ))}
          </Folder.List>
        </FolderSetting>
      </Card>
    </Layout.Section>
  );
};

// 레이아웃
const Layout = {
  Section: styled('section', {
    base: stack.raw({ gap: '0.75rem' }),
  }),
};

// 텍스트 스타일
const Text = {
  Title: styled('h1', {
    base: { textStyle: 'h3', color: 'gray.900' },
  }),
  SectionTitle: styled('h3', {
    base: { textStyle: 'h4', color: 'gray.900' },
  }),
  SettingLabel: styled('span', {
    base: { textStyle: 'body1.r', color: 'gray.400' },
  }),
};

// 설정 섹션 스타일
const Setting = {
  Row: styled('div', {
    base: hstack.raw({
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: '3rem',
    }),
  }),
  Content: styled('div', {
    base: stack.raw({ gap: '0.5rem' }),
  }),
};

// 폴더 스타일
const Folder = {
  Header: styled('div', {
    base: hstack.raw({
      justifyContent: 'space-between',
      alignItems: 'center',
    }),
  }),
  List: styled('div', {
    base: stack.raw({ gap: '0.5rem' }),
  }),
  Item: styled('div', {
    base: hstack.raw({
      gap: '0.75rem',
      alignItems: 'center',
      height: '3rem',
    }),
  }),
  Info: styled('div', {
    base: hstack.raw({
      gap: '0.75rem',
      alignItems: 'center',
      flex: 1,
    }),
  }),
  Color: styled('div', {
    base: { width: '1.25rem', height: '1.25rem', borderRadius: '50%' },
    variants: {
      color: {
        red: { bg: 'sub.01.100' },
        yellow: { bg: 'sub.02.100' },
        green: { bg: 'sub.03.100' },
        purple: { bg: 'sub.04.100' },
        black: { bg: 'sub.05.100' },
      },
    },
  }),
  Name: styled('span', {
    base: { textStyle: 'body1.m', color: 'gray.700', flex: 1 },
  }),
  Actions: styled('div', {
    base: hstack.raw({ gap: '0.75rem' }),
  }),
};

// 구분선
const Divider = styled('div', {
  base: {
    width: '1px',
    height: '17.25rem',
    bg: 'gray.200',
    alignSelf: 'center',
  },
});
