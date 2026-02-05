// 과제 목록 조회 타입 정의
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

// 응답
export interface Task {
  taskId: number;
  folderId: number;
  folderTitle: string;
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

// 완료 과제 목록 조회 타입 정의
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
