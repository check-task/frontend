// ============================
// 과제 목록 조회 타입 정의
// ============================
export type TaskType = 'TEAM' | 'PERSONAL';
export type TaskSort =
  | 'PROGRESSRATE' // 진적도순
  | 'DEADLINE' // 마감임박순
  | 'PRIORITY'; // 우선순위순

// 요청시 사용되는 파라미터
export interface GetTaskListParams {
  type?: TaskType;
  folderId?: number;
  sort?: TaskSort;
  status?: string;
}

// 과제(상세) 진행 상태 (API 응답과 동일)
export type TaskStatus = 'PROGRESS' | 'COMPLETED';

// 과제 기본 정보
// 세부 과제 정보에 상속됨 그래서 folderId, folderTitle optional 처리
export interface Task {
  taskId: number;
  folderId?: number;
  folderTitle?: string;
  foldercolor?: string;
  folderRank?: number | null;
  title: string;
  type: TaskType; // PERSONAL | TEAM
  status?: TaskStatus; // 과제 상세 조회 시 반환 (PROGRESS | COMPLETED)
  deadline: string; // YYYY-MM-DD
  dDay: string; // D-3 형태
  progressRate: number; // 0 ~ 100
}

// 과제 목록 내 세부과제 항목
export interface SubTaskListItem {
  subTaskId: number;
  taskId: number;
  title: string;
  status: string;
  deadline: string;
}

// 과제 목록 조회 응답
export interface GetTaskListResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: {
    task: Task[];
    subTask: SubTaskListItem[];
  };
}

// ============================
// 과제 상세 조회 타입 정의
// ============================

// 세부 TASK 상태 (과제 상세 응답)
export type SubTaskStatus = 'PROGRESS' | 'COMPLETED';

// 세부 과제 댓글 한 건 (상세 조회 응답)
export interface TaskDetailSubTaskComment {
  commentId: number;
  content: string;
  writer: string;
  profileImage: string | null;
  createdAt: string;
}

// Task 목록에 보여지는 세부 과제 항목
export interface TaskDetailSubTask {
  subTaskId: number;
  title: string;
  deadline: string; // YYYY-MM-DD
  status: SubTaskStatus;
  isAlarm: boolean;
  commentCount: number;
  comments?: TaskDetailSubTaskComment[];
  /** 담당자 사용자 ID (과제 수정 API용) */
  assigneeId?: number | null;
  assigneeName: string;
  assigneeProfileImage?: string | null;
}

// 자료 모음집 참조 항목 (과제 상세·자료 생성 응답)
export interface TaskReference {
  /** 자료 ID (수정/삭제 시 필요) */
  referenceId?: number;
  name: string;
  /** URL 자료의 경로 (URL형 자료가 아닐 경우 null일 수 있음) */
  url: string | null;
  /** 파일 업로드 시 S3 등 URL (과제 상세/자료 생성 응답) */
  file_url?: string | null;
  /** 파일 업로드 시 원본 파일명 */
  fileName?: string | null;
}

// 커뮤니케이션 한 건 (상세 조회 응답, 수정/삭제 시 communicationId 필요)
export interface TaskCommunication {
  communicationId?: number;
  name: string;
  url: string;
}

// 회의록 한 건 (상세 조회 응답, 생성/수정 후 목록 포함)
export interface TaskMeetingLog {
  logId: number;
  date: string; // YYYY-MM-DD
  agenda?: string;
  conclusion?: string;
  discussion?: string;
}

// 회의록 생성 요청
export interface CreateMeetingLogRequest {
  date: string; // YYYY-MM-DD
  agenda: string;
  conclusion: string;
  discussion: string;
}

// 회의록 한 건 (API 응답: log_id 등)
export interface MeetingLogItemResponse {
  log_id: number;
  date: string;
  agenda: string;
  conclusion: string;
  discussion: string;
}

// 회의록 생성 응답 (전체 목록 반환)
export interface CreateMeetingLogResponse {
  status: number;
  isSuccess: boolean;
  code: string;
  message: string;
  data: MeetingLogItemResponse[];
}

// 회의록 수정 요청
export interface UpdateMeetingLogRequest {
  date: string;
  agenda: string;
  conclusion: string;
  discussion?: string;
}

// 회의록 수정 응답
export interface UpdateMeetingLogResponse {
  status: number;
  isSuccess: boolean;
  code: string;
  message: string;
  data: MeetingLogItemResponse;
}

// 세부 과제 정보
export interface TaskDetail extends Task {
  subTasks: TaskDetailSubTask[];
  communications?: TaskCommunication[];
  meetingLogs?: TaskMeetingLog[];
  references: TaskReference[];
}

// 세부 과제 정보 조회 최종 응답 타입
export interface GetTaskDetailResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: TaskDetail;
}

// 과제 삭제 응답
export interface DeleteTaskResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: null;
}

// ============================
// 과제 생성 타입 정의
// ============================
export interface CreateTaskSubTaskRequest {
  title: string;
  endDate: string; // YYYY-MM-DD
}

export interface CreateTaskReferenceRequest {
  name: string;
  url: string;
}

export interface CreateTaskRequest {
  title: string;
  folderId: number | null;
  deadline: string; // YYYY-MM-DD
  type: TaskType; // PERSONAL | TEAM
  subTasks: CreateTaskSubTaskRequest[];
  references: CreateTaskReferenceRequest[];
}

export interface CreateTaskResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: { taskId: number };
}

// 과제 수정 요청 (PATCH /task/{taskId})
export interface UpdateTaskSubTaskItem {
  title: string;
  endDate: string; // YYYY-MM-DD
  status: 'PROGRESS' | 'COMPLETED';
  isAlarm: boolean;
  assigneeId: number;
}

export interface UpdateTaskRequest {
  title: string;
  deadline: string; // YYYY-MM-DD
  type: TaskType;
  status?: TaskStatus;
  folderId: number | null;
  subTasks: UpdateTaskSubTaskItem[];
  references: { name: string; url: string }[];
  fileNames?: string[] | string;
  files?: File[];
}

// ============================
// 완료 과제 목록 조회 타입 정의
// ============================
export type CompletedTaskType = '개인' | '팀';
export type CompletedTaskStatus = '완료' | '미완료';

// 완료 과제
export interface CompletedTask {
  taskId: number;
  title: string;
  deadline: string; // YYYY-MM-DD
  type: CompletedTaskType;
  status: CompletedTaskStatus;
  folderId: number;
  folderTitle: string;
  color: string; // HEX
}

// 완료 과제 목록 조회 응답
export interface GetCompletedTaskListResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: {
    tasks: CompletedTask[];
  };
}

// ============================
// 세부 TASK 마감일 변경 타입 정의
// ============================

export interface UpdateSubTaskDeadlineRequest {
  endDate: string; // YYYY-MM-DD
}

export interface UpdateSubTaskDeadlineResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: {
    sub_task_id: number;
    end_date: string; // YYYY-MM-DD
  };
}

// ============================
// 단일 세부 TASK 생성 타입 정의
// ============================

// export interface CreateSubTaskRequest {
//   title: string;
//   deadline: string; // YYYY-MM-DD
//   isAlarm: boolean;
// }

// export interface CreateSubTaskResponse {
//   resultType: 'SUCCESS' | 'FAIL';
//   message: string;
//   data?: {
//     subTaskId: number;
//   };
// }

// 팀과제 참여 타입 정의
export interface JoinTaskRequest {
  inviteCode: string;
}

export interface JoinTaskResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: {
    task_id: number;
    task_title: string;
    member_id: number;
    folderId?: number | null;
  };
}

export interface JoinTaskResult {
  message: string;
  data: JoinTaskResponse['data'];
}

// ============================
// 과제 기본 정보 수정 타입 정의 (PATCH /task/{taskId})
// ============================
export interface PatchTaskRequest {
  title: string;
  folderId: number | null;
  deadline: string;
}

// 과제 우선순위 변경 타입 정의
export interface UpdateTaskPrioritiesRequest {
  orderedTasks: { taskId: number; rank: number }[];
}

// ============================
// 세부 TASK 완료 상태 변경 타입 정의
// ============================
// 상태 변경 요청시 사용되는 타입
/** 백엔드 SubTaskStatus enum과 동일: PENDING | COMPLETED */
export type UpdateSubTaskStatusRequestStatus = 'PENDING' | 'COMPLETED';

export interface UpdateSubTaskStatusRequest {
  status: UpdateSubTaskStatusRequestStatus;
}

export interface UpdateSubTaskStatusResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: {
    sub_task_id: number;
    status: CompletedTaskStatus; // '완료' | '미완료'
  };
}

// ============================
// 세부 TASK 담당자 설정 타입 정의
// ============================
export interface UpdateSubTaskAssigneeRequest {
  assigneeId: number | null;
}

export interface UpdateSubTaskAssigneeResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: {
    sub_task_id: number;
    assignee_id: number;
  };
}

// ============================
// 단일 세부 과제 추가 타입 정의
// ============================
export interface CreateSubTaskRequest {
  title: string;
  deadline: string; // YYYY-MM-DDTHH:mm:ss
  isAlarm: boolean;
}

export interface CreateSubTaskResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: {
    subTaskId: number;
    title: string;
    deadline: string;
    status: string;
    assigneeName: string;
  };
}

// ============================
// 세부 TASK 댓글 생성 타입 정의
// ============================
export interface CreateSubTaskCommentRequest {
  userId: number;
  content: string;
}

export interface CreateSubTaskCommentResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: {
    comment_id: number;
    sub_task_id: number;
    content: string;
    created_at: string;
  };
}

// 댓글 수정 요청/응답
export interface UpdateCommentRequest {
  content: string;
}

export interface UpdateCommentResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: { comment_id: number; content: string } | null;
}

// 댓글 삭제 응답
export interface DeleteCommentResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: null;
}

// ============================
// 세부 TASK 전체 삭제 타입 정의
// ============================
export interface DeleteAllSubTasksResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: {
    deletedCount: number;
  };
}

// ============================
// 세부 TASK 선택 삭제 타입 정의
// ============================
export interface DeleteSubTasksBulkRequest {
  subTaskIds: number[];
}

export interface DeleteSubTasksBulkResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: {
    deletedCount: number;
  };
}

// ============================
// 세부 TASK 배치 수정 타입 정의
// ============================
export interface UpdateSubTasksBatchItem {
  subTaskId: number;
  title: string;
  deadline: string;
  isAlarm: boolean;
}

export interface UpdateSubTasksBatchRequest {
  subTasks: UpdateSubTasksBatchItem[];
}
