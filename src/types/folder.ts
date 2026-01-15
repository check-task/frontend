// 폴더 색상 타입
export const FOLDER_COLORS = [
  'red',
  'yellow',
  'green',
  'purple',
  'black',
] as const;

export type FolderColor = (typeof FOLDER_COLORS)[number];
