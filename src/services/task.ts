import {
  CompletedTask,
  CreateSubTaskRequest,
  CreateSubTaskResponse,
  CreateTaskRequest,
  CreateTaskResponse,
  GetCompletedTaskListResponse,
  GetTaskDetailResponse,
  GetTaskListParams,
  GetTaskListResponse,
  JoinTaskResponse,
  DeleteTaskResponse,
  UpdateTaskPrioritiesRequest,
  SubTaskListItem,
  Task,
  TaskDetail,
  TaskDetailSubTask,
  TaskMeetingLog,
  TaskReference,
  UpdateTaskRequest,
  PatchTaskRequest,
  JoinTaskResult,
  TaskMemberProfile,
  GetTaskMemberProfileResponse,
} from '@/types/task';
import axiosInstance from '@/lib/axiosInstance';

// baseURL(NEXT_PUBLIC_API_URL)에 /api/v1 가 포함되어 있다고 가정하고
// 여기서는 순수 path('/task')만 사용합니다.
const TASK_BASE = '/task';

// 과제 목록 조회 api 호출 (task + subTask 분리 구조)
export const getTaskList = async (
  params?: GetTaskListParams,
): Promise<{ task: Task[]; subTask: SubTaskListItem[] }> => {
  const res = await axiosInstance.get<GetTaskListResponse>(TASK_BASE, {
    params,
  });
  const data = res.data?.data;
  return {
    task: data?.task ?? [],
    subTask: data?.subTask ?? [],
  };
};

// 완료 과제 목록 조회 api 호출 (folderId 전달 시 쉼표로 구분하여 해당 폴더만 필터링)
export const getCompletedTaskList = async (
  folderId?: number[],
): Promise<CompletedTask[]> => {
  const res = await axiosInstance.get<GetCompletedTaskListResponse>(
    `${TASK_BASE}/completed`,
    {
      params:
        folderId && folderId.length > 0
          ? { folderId: folderId.join(',') }
          : undefined,
    },
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
        communicationId: c.communicationId ?? c.communication_id ?? c.id,
      }),
    );
  }

  // references: API는 id, fileUrl 사용 → referenceId, file_url로 통일
  if (data.references?.length) {
    data.references = data.references.map(
      (
        r: TaskReference & {
          id?: number;
          reference_id?: number;
          fileUrl?: string | null;
        },
      ) => ({
        referenceId: r.referenceId ?? r.reference_id ?? r.id,
        name: r.name,
        url: r.url ?? null,
        file_url: r.file_url ?? r.fileUrl ?? null,
        fileName: r.fileName ?? null,
      }),
    );
  }

  // subTasks: API는 camelCase(assignees 등)
  const rawSubTasks = data.subTasks;
  if (rawSubTasks?.length) {
    data.subTasks = rawSubTasks.map(
      (st: TaskDetailSubTask & { sub_task_id?: number }) => ({
        ...st,
        subTaskId: st.subTaskId ?? st.sub_task_id ?? 0,
        assignees: st.assignees ?? [],
      }),
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
  const formData = new FormData();
  formData.append('title', body.title);
  formData.append('deadline', body.deadline);
  formData.append('type', body.type);
  if (body.status) formData.append('status', body.status);
  formData.append('folderId', String(body.folderId));
  formData.append('subTasks', JSON.stringify(body.subTasks ?? []));
  formData.append('references', JSON.stringify(body.references ?? []));

  if (body.fileNames) {
    const fileNames = Array.isArray(body.fileNames)
      ? body.fileNames.join(',')
      : body.fileNames;
    if (fileNames) formData.append('fileNames', fileNames);
  }

  if (body.files?.length) {
    body.files.forEach((file) => {
      formData.append('files', file);
    });
  }

  await axiosInstance.patch(`${TASK_BASE}/${taskId}`, formData, {
    headers: { 'Content-Type': undefined } as unknown as Record<string, string>,
  });
};

// 과제 기본 정보 수정 api 호출 (PATCH /task/{taskId}) - title, folderId, deadline
export const patchTask = async (
  taskId: number,
  body: PatchTaskRequest,
): Promise<void> => {
  await axiosInstance.patch(`${TASK_BASE}/${taskId}`, body);
};

// 과제 삭제 api 호출 (DELETE /task/{taskId})
export const deleteTask = async (taskId: number): Promise<void> => {
  await axiosInstance.delete<DeleteTaskResponse>(`${TASK_BASE}/${taskId}`);
};

// 과제 생성 api 호출 (201 응답 시 data.taskId 반환, 응답 형태 다양하게 처리)
export const createTask = async (body: CreateTaskRequest): Promise<number> => {
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
export const joinTask = async (
  inviteCode: string,
  folderId?: number | null,
): Promise<JoinTaskResult> => {
  const res = await axiosInstance.post<JoinTaskResponse>('/task/join', {
    inviteCode,
    folderId: folderId ?? null,
  });

  return {
    message: res.data.message,
    data: res.data.data,
  };
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
  await axiosInstance.patch(`/task/${taskId}/deadline`, { deadline });
};

// 단일 세부 과제 추가 api 호출 (POST /task/{taskId}/subTask)
export const createSubTask = async (
  taskId: number,
  body: CreateSubTaskRequest,
): Promise<CreateSubTaskResponse['data']> => {
  const res = await axiosInstance.post<CreateSubTaskResponse>(
    `${TASK_BASE}/${taskId}/subTask`,
    body,
  );
  return (
    res.data?.data ?? {
      subTaskId: 0,
      title: '',
      deadline: '',
      status: 'PENDING',
      assigneeName: '',
    }
  );
};

// 팀원 초대 링크 생성 api 호출 (POST /task/{taskId}/invitation)
export interface CreateInvitationResponse {
  invite_code: string;
  invite_expired: string;
}

export const createInvitationLink = async (
  taskId: number,
): Promise<CreateInvitationResponse> => {
  const res = await axiosInstance.post<{
    data: CreateInvitationResponse;
  }>(`${TASK_BASE}/${taskId}/invitation`);
  return res.data?.data ?? { invite_code: '', invite_expired: '' };
};

// 팀원 목록 (역할: 0 = Owner, 1 = Member)
// PATCH 경로용 ID: patchMemberId(있으면 우선) → memberId. GET에서 taskMemberId 등 별도 id 오면 사용
export interface TaskMember {
  memberId: number;
  /** PATCH /task/:taskId/members/:id 경로에 쓸 ID. GET에서 오면 사용, 없으면 memberId 사용 */
  patchMemberId?: number;
  userId?: number; // 현재 사용자 일치·Owner 판별용
  name: string;
  profileImage?: string | null;
  role: 0 | 1; // 0: Owner, 1: Member
}

/** 팀원 목록 조회 API 응답 한 건 (GET /task/{taskId}/members) */
export interface TaskMemberRawItem {
  id: number;
  /** PATCH 경로용. 백엔드가 task_member.id 등 별도 id를 주면 여기 넣어서 404 방지 (camelCase) */
  taskMemberId?: number;
  /** PATCH 경로용. 백엔드가 snake_case로 보낼 수 있음 */
  task_member_id?: number;
  profileImage?: string | null;
  nickname: string;
  role: string; // "owner" | "member"
}

/** 조회(문자열/숫자) · 수정(숫자) 타입 차이 흡수 — 앱 내부는 항상 0 | 1 */
const normalizeRole = (role: 0 | 1 | string | undefined): 0 | 1 => {
  if (role === 0 || role === '0') return 0;
  if (typeof role === 'string') {
    const lower = role.toLowerCase();
    if (lower === 'owner' || lower === 'admin' || lower === '관리자') return 0;
  }
  return 1;
};

/** "3:1" 등 복합 문자열이 오면 앞의 숫자만 반환 (경로/비교용 ID) */
const toSingleId = (v: number | string | null | undefined): number => {
  if (v == null) return 0;
  const s = String(v).trim();
  if (s.includes(':')) return Number(s.split(':')[0]) || 0;
  const n = Number(s);
  return Number.isInteger(n) ? n : 0;
};

export const getTaskMembers = async (taskId: number): Promise<TaskMember[]> => {
  const res = await axiosInstance.get<GetTaskMembersResponse>(
    `${TASK_BASE}/${taskId}/members`,
  );
  const raw = res.data?.data?.members;
  if (!Array.isArray(raw)) return [];
  return [...raw].sort((a, b) => toSingleId(a.id) - toSingleId(b.id)).map((m) => {
    const id = toSingleId(m.id);
    // PATCH path는 task_member PK 필요. GET에 taskMemberId 또는 task_member_id 없으면 user id로 보내져 404 발생
    const rawPatchId = m.taskMemberId ?? m.task_member_id;
    const patchId = rawPatchId != null ? toSingleId(rawPatchId) : id;
    return {
      memberId: id,
      patchMemberId: patchId,
      userId: id,
      name: m.nickname ?? '',
      profileImage: m.profileImage ?? null,
      role: normalizeRole(m.role),
    };
  });
};

/** 팀원 목록 조회 API 응답 (GET /task/{taskId}/members) */
export interface GetTaskMembersResponse {
  resultType: string;
  message: string;
  data: {
    members: TaskMemberRawItem[];
    count: number;
  };
}

// 팀과제 특정 팀원 프로필 조회 api 호출 (GET /task/{taskId}/members/{userId})
export const getTaskMemberProfile = async (
  taskId: number,
  userId: number,
): Promise<TaskMemberProfile> => {
  const res = await axiosInstance.get<GetTaskMemberProfileResponse>(
    `${TASK_BASE}/${taskId}/members/${userId}`,
  );
  return res.data.data;
};

// 팀원 역할 수정 (PATCH /task/{taskId}/member/{userId})
export const updateMemberRole = async (
  taskId: number,
  userId: number | string,
  role: 0 | 1,
): Promise<void> => {
  const id = toSingleId(userId);
  if (id <= 0) {
    throw new Error('유효한 사용자 ID가 필요합니다.');
  }
  await axiosInstance.patch(`${TASK_BASE}/${taskId}/member/${id}`, { role });
};

/** 팀원 추방 (DELETE /task/{taskId}/member/{memberId}) — 팀장만 가능 */
export const expelTaskMember = async (
  taskId: number,
  memberId: number | string,
): Promise<void> => {
  const id = toSingleId(memberId);
  if (id <= 0) {
    throw new Error('유효한 팀원 ID가 필요합니다.');
  }
  await axiosInstance.delete(`${TASK_BASE}/${taskId}/member/${id}`);
};

// 개인과제 -> 팀과제 변경 (Post /task/{taskId}/convert-to-team)
export const updateTaskType = async (
  taskId: number,
): Promise<void> => {
  await axiosInstance.patch(`${TASK_BASE}/${taskId}/convert-to-team`);
};

