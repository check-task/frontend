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
}

// 과제 기본 정보
// 세부 과제 정보에 상속됨 그래서 folderId, folderTitle optional 처리
export interface Task {
  taskId: number;
  folderId?: number;
  folderTitle?: string;
  /** 폴더 색상 HEX (상세 조회 응답) */
  foldercolor?: string;
  title: string;
  type: TaskType; // PERSONAL | TEAM
  deadline: string; // YYYY-MM-DD
  dDay: string; // D-3 형태
  progressRate: number; // 0 ~ 100
}

// 과제 목록 조회 응답
export interface GetTaskListResponse {
  resultType: 'SUCCESS' | 'FAIL';
  message: string;
  data: Task[];
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
  profileImage: string;
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
  assigneeName: string;
  assigneeProfileImage?: string;
}

// 자료 모음집 참조 항목
export interface TaskReference {
  name: string;
  url: string;
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
  folderId: number;
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
// 세부 TASK 완료 상태 변경 타입 정의
// ============================
// 상태 변경 요청시 사용되는 타입
// SubTaskStatus 이걸 사용하지 못한 건 상태 값이 달라서 입니다.
export type UpdateSubTaskStatusRequestStatus = 'PROGRESS' | 'COMPLETE';

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
