'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { css, cva } from 'styled-system/css';
import { hstack, stack } from 'styled-system/patterns';
import { Card } from '@/features/profile/components/Card';
import { NotificationSetting } from '@/features/profile/components/NotificationSetting';
import { FolderSetting } from '@/features/profile/components/FolderSetting';
import { SettingFolderButton } from '@/features/profile/components/SettingFolderButton';
import { EditFolderButton } from '@/features/profile/components/EditFolderButton';
import { DeleteFolderButton } from '@/features/profile/components/DeleteFolderButton';
import { AlarmTimeSelect } from '@/features/profile/components/AlarmTimeSelect';
import { AlignIcon } from '@/components/icons/AlignIcon';
import { useMyInfo } from '@/hooks/queries/useMyInfo';
import {
  useUpdateDeadlineAlarmSetting,
  useUpdateTaskAlarmSetting,
} from '@/hooks/mutations/useUpdateAlarmTimeSetting';
import type { Folder } from '@/types/folder';

const UNASSIGNED_FOLDER_NAME = '지정안함';

// 드래그 가능한 폴더 행 (정렬 아이콘을 잡고 위아래로 움직여 순서 변경)
const SortableFolderRow = ({ folder }: { folder: Folder }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: folder.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={folderItemStyle}>
      <div className={folderInfoStyle}>
        <div className={folderColorStyle({ color: folder.color })} />
        <span className={folderNameStyle}>{folder.name}</span>
      </div>
      <div className={folderActionsStyle}>
        <button
          {...attributes}
          {...listeners}
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <AlignIcon />
        </button>
      </div>
    </div>
  );
};

export const ManagementSection = () => {
  const [isReorder, setIsReorder] = useState(false);
  const [orderedFolders, setOrderedFolders] = useState<Folder[]>([]);
  const [snapshotFolders, setSnapshotFolders] = useState<Folder[]>([]);
  const { data, isLoading } = useMyInfo();
  const updateDeadlineAlarmSetting = useUpdateDeadlineAlarmSetting();
  const updateTaskAlarmSetting = useUpdateTaskAlarmSetting();
  const folders = useMemo(() => data?.folders ?? [], [data?.folders]);

  // 서버에서 받아온 폴더 목록을 로컬 순서 상태에 동기화
  useEffect(() => {
    setOrderedFolders(folders);
  }, [folders]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  // 순서 변경 모드 진입 시 되돌리기용 스냅샷 저장
  const handleStartReorder = () => {
    setSnapshotFolders(orderedFolders);
    setIsReorder(true);
  };

  // 취소: 스냅샷으로 복원 후 모드 종료
  const handleCancelReorder = () => {
    setOrderedFolders(snapshotFolders);
    setIsReorder(false);
  };

  // 저장: 현재 순서 유지 후 모드 종료 (순서 저장 API 연동 시 이곳에서 호출)
  const handleSaveReorder = () => {
    console.log(folders)
    setIsReorder(false);
  };

  const reorderableFolders = orderedFolders.filter(
    (folder) => folder.name !== UNASSIGNED_FOLDER_NAME,
  );
  const pinnedFolders = orderedFolders.filter(
    (folder) => folder.name === UNASSIGNED_FOLDER_NAME,
  );

  // 드래그 완료 시 화면에서만 폴더 순서 재정렬 (지정안함 폴더는 항상 고정)
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = reorderableFolders.findIndex(
      (folder) => folder.id === active.id,
    );
    const newIndex = reorderableFolders.findIndex(
      (folder) => folder.id === over.id,
    );
    const reordered = arrayMove(reorderableFolders, oldIndex, newIndex);

    setOrderedFolders([...pinnedFolders, ...reordered]);
  };

  if (isLoading || !data) {
    return null;
  }

  const { user } = data;

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
            <h3 className={sectionTitleStyle}>
              {isReorder ? '폴더 순서 변경' : '폴더 설정'}
            </h3>
            <SettingFolderButton
              isReorder={isReorder}
              onStartReorder={handleStartReorder}
              onCancelReorder={handleCancelReorder}
              onSaveReorder={handleSaveReorder}
            />
          </div>
          {isReorder ? (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <div className={folderListStyle}>
                {pinnedFolders.map((folder) => (
                  <div key={folder.id} className={folderItemStyle}>
                    <div className={folderInfoStyle}>
                      <div
                        className={folderColorStyle({ color: folder.color })}
                      />
                      <span className={folderNameStyle}>{folder.name}</span>
                    </div>
                  </div>
                ))}
                <SortableContext
                  items={reorderableFolders.map((folder) => folder.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {reorderableFolders.map((folder) => (
                    <SortableFolderRow key={folder.id} folder={folder} />
                  ))}
                </SortableContext>
              </div>
            </DndContext>
          ) : (
            <div className={folderListStyle}>
              {orderedFolders.map((folder) => (
                <div key={folder.id} className={folderItemStyle}>
                  <div className={folderInfoStyle}>
                    <div
                      className={folderColorStyle({ color: folder.color })}
                    />
                    <span className={folderNameStyle}>{folder.name}</span>
                  </div>
                  {folder.name !== UNASSIGNED_FOLDER_NAME && (
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
                  )}
                </div>
              ))}
            </div>
          )}
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
      null: { bg: 'sub.null.100' },
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
