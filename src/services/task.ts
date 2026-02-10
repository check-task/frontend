import {
  CompletedTask,
  CreateTaskRequest,
  CreateTaskResponse,
  GetCompletedTaskListResponse,
  GetTaskDetailResponse,
  GetTaskListParams,
  GetTaskListResponse,
  JoinTaskResponse,
  UpdateTaskPrioritiesRequest,
  Task,
  TaskDetail,
  TaskDetailSubTask,
  TaskMeetingLog,
  TaskReference,
  UpdateTaskRequest,
} from '@/types/task';
import axiosInstance from '@/lib/axiosInstance';

// baseURL(NEXT_PUBLIC_API_URL)에 /api/v1 가 포함되어 있다고 가정하고
// 여기서는 순수 path('/task')만 사용합니다.
const TASK_BASE = '/task';

// 과제 목록 조회 api 호출
export const getTaskList = async (
  params?: GetTaskListParams,
): Promise<Task[]> => {
  const res = await axiosInstance.get<GetTaskListResponse>(TASK_BASE, {
    params,
  });
  const data = res.data?.data;
  return Array.isArray(data) ? data : [];
};

// 완료 과제 목록 조회 api 호출
export const getCompletedTaskList = async (): Promise<CompletedTask[]> => {
  const res = await axiosInstance.get<GetCompletedTaskListResponse>(
    `${TASK_BASE}/completed`,
  );
  return res.data?.data?.tasks ?? [];
};

// 과제 상세 조회 api 호출 (communications에 communication_id → communicationId 매핑)
export const getTaskDetail = async (taskId: number): Promise<TaskDetail> => {
  const res = await axiosInstance.get<GetTaskDetailResponse>(
    `${TASK_BASE}/${taskId}`,
  );
  const data = res.data.data;
  // communications: API는 id 필드 사용 → communicationId로 통일
  if (data.communications?.length) {
    data.communications = data.communications.map(
      (c: {
        id?: number;
        communication_id?: number;
        communicationId?: number;
        name: string;
        url: string;
      }) => ({
        ...c,
        communicationId:
          c.communicationId ?? c.communication_id ?? c.id,
      }),
    );
  }

  // references: API는 id, fileUrl 사용 → referenceId, file_url로 통일
  if (data.references?.length) {
    data.references = data.references.map(
      (r: TaskReference & {
        id?: number;
        reference_id?: number;
        fileUrl?: string | null;
      }) => ({
        referenceId: r.referenceId ?? r.reference_id ?? r.id,
        name: r.name,
        url: r.url ?? null,
        file_url: r.file_url ?? r.fileUrl ?? null,
      }),
    );
  }

  // subTasks: API는 camelCase(assigneeId 등), assigneeId가 null일 수 있음
  const rawSubTasks =
    data.subTasks ?? (data as { sub_tasks?: unknown[] }).sub_tasks;
  if (rawSubTasks?.length) {
    data.subTasks = rawSubTasks.map(
      (st: TaskDetailSubTask & {
        sub_task_id?: number;
        assignee_id?: number | null;
        assignee_name?: string;
        assignee_profile_image?: string | null;
      }) => {
        const rawAssigneeId = st.assigneeId ?? st.assignee_id;
        return {
          ...st,
          subTaskId: st.subTaskId ?? st.sub_task_id ?? 0,
          assigneeId:
            rawAssigneeId != null ? rawAssigneeId : undefined,
          assigneeName:
            st.assigneeName ?? st.assignee_name ?? st.assigneeName ?? '',
          assigneeProfileImage:
            st.assigneeProfileImage ?? st.assignee_profile_image ?? undefined,
        };
      },
    );
  }

  // meetingLogs: API는 id 사용, date는 ISO 문자열 → logId, date(YYYY-MM-DD) 통일
  if (data.meetingLogs?.length) {
    data.meetingLogs = data.meetingLogs.map(
      (m: TaskMeetingLog & { id?: number; log_id?: number }) => {
        const dateStr =
          typeof m.date === 'string' && m.date.includes('T')
            ? m.date.slice(0, 10)
            : m.date;
        return {
          logId: m.logId ?? m.log_id ?? m.id ?? 0,
          date: dateStr,
          agenda: m.agenda,
          conclusion: m.conclusion,
          discussion: m.discussion,
        };
      },
    );
  }
  return data;
};

// 과제 수정 api 호출 (PATCH /task/{taskId})
export const updateTask = async (
  taskId: number,
  body: UpdateTaskRequest,
): Promise<void> => {
  await axiosInstance.patch(`${TASK_BASE}/${taskId}`, body);
};

// 과제 생성 api 호출 (201 응답 시 data.taskId 반환, 응답 형태 다양하게 처리)
export const createTask = async (
  body: CreateTaskRequest,
): Promise<number> => {
  const res = await axiosInstance.post<CreateTaskResponse>(TASK_BASE, body);
  const bodyData = res.data?.data;
  const taskId =
    typeof bodyData === 'object' && bodyData !== null && 'taskId' in bodyData
      ? (bodyData as { taskId: number }).taskId
      : typeof bodyData === 'number'
        ? bodyData
        : undefined;
  if (typeof taskId !== 'number') {
    throw new Error(
      '과제 생성 응답에 taskId가 없습니다. 서버 응답 형식을 확인해주세요.',
    );
  }
  return taskId;
};

// 팀과제 참여 api 호출
export const joinTask = async (inviteCode: string) => {
  const res = await axiosInstance.post<JoinTaskResponse>('/task/join', {
    inviteCode,
  });

  return res.data.data;
};

// 과제 우선순위 일괄 변경 api 호출
export const updateTaskPriorities = async (
  orderedTasks: UpdateTaskPrioritiesRequest['orderedTasks'],
): Promise<void> => {
  await axiosInstance.patch('/task/priority', { orderedTasks });
};

// 과제 마감일 변경 api 호출
export const updateTaskDeadline = async (
  taskId: number,
  deadline: string,
): Promise<void> => {
  await axiosInstance.patch(`/task/${taskId}`, { deadline });
};
