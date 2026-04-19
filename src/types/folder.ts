// 폴더 색상 타입
export const FOLDER_COLORS = [
  'red',
  'yellow',
  'green',
  'purple',
  'black',
  'null',
] as const;

export type FolderColor = (typeof FOLDER_COLORS)[number];

// 폴더 타입
export interface Folder {
  id: number;
  name: string;
  color: FolderColor;
}
