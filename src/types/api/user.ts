export interface User {
  id: number;
  nickname: string;
  phoneNum: string | null;
  email: string;
  profileImage: string | null;
  loginType: 'LOCAL' | 'KAKAO';
  deadlineAlarm?: number;
  taskAlarm?: number;
}
