import {
  UpdateSubTaskDeadlineRequest,
  UpdateSubTaskDeadlineResponse,
  UpdateSubTaskStatusRequest,
  UpdateSubTaskStatusResponse,
  UpdateSubTaskAssigneeRequest,
  UpdateSubTaskAssigneeResponse,
  // CreateSubTaskRequest,
  // CreateSubTaskResponse,
  CreateSubTaskCommentRequest,
  CreateSubTaskCommentResponse,
  UpdateCommentRequest,
  UpdateCommentResponse,
  DeleteCommentResponse,
} from '@/types/task';
import axiosInstance from '@/lib/axiosInstance';

// 세부 TASK 마감일 변경 api 호출
export const updateSubTaskDeadline = async (
  subTaskId: number,
  body: UpdateSubTaskDeadlineRequest,
): Promise<UpdateSubTaskDeadlineResponse> => {
  const res = await axiosInstance.patch<UpdateSubTaskDeadlineResponse>(
    `/task/subtask/${subTaskId}/deadline`,
    body,
  );

  return res.data;
};

// 세부 TASK 완료 상태 변경 api 호출
export const updateSubTaskStatus = async (
  subTaskId: number,
  body: UpdateSubTaskStatusRequest,
): Promise<UpdateSubTaskStatusResponse> => {
  const res = await axiosInstance.patch<UpdateSubTaskStatusResponse>(
    `/task/subtask/${subTaskId}/status`,
    body,
  );

  return res.data;
};

// 단일 세부 TASK 생성 api 호출
// export const createSubTask = async (
//   taskId: number,
//   body: CreateSubTaskRequest,
// ): Promise<CreateSubTaskResponse> => {
//   const res = await axiosInstance.post<CreateSubTaskResponse>(
//     `/task/${taskId}/subTask`,
//     body,
//   );

//   return res.data;
// };

// 세부 TASK 담당자 설정 api 호출 (PATCH /task/subtask/{subTaskId}/assignee)
export const updateSubTaskAssignee = async (
  subTaskId: number,
  body: UpdateSubTaskAssigneeRequest,
): Promise<UpdateSubTaskAssigneeResponse> => {
  const res = await axiosInstance.patch<UpdateSubTaskAssigneeResponse>(
    `/task/subtask/${subTaskId}/assignee`,
    body,
  );

  return res.data;
};

// 세부 TASK 댓글 생성 api 호출
export const createSubTaskComment = async (
  subTaskId: number,
  body: CreateSubTaskCommentRequest,
): Promise<CreateSubTaskCommentResponse> => {
  const res = await axiosInstance.post<CreateSubTaskCommentResponse>(
    `/task/subtask/${subTaskId}/comments`,
    {
      user_id: body.userId,
      content: body.content,
    },
  );

  return res.data;
};

// 댓글 수정 api 호출
export const updateComment = async (
  commentId: number,
  body: UpdateCommentRequest,
): Promise<UpdateCommentResponse> => {
  const res = await axiosInstance.patch<UpdateCommentResponse>(
    `/task/comment/${commentId}`,
    body,
  );
  return res.data;
};

// 댓글 삭제 api 호출
export const deleteComment = async (
  commentId: number,
): Promise<DeleteCommentResponse> => {
  const res = await axiosInstance.delete<DeleteCommentResponse>(
    `/task/comment/${commentId}`,
  );
  return res.data;
};
