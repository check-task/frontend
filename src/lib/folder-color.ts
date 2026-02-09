import type { FolderColor } from '@/types/folder';

// HEX → FolderColor 이름 매핑
const HEX_TO_COLOR: Record<string, FolderColor> = {
  '#F55757': 'red',
  '#FFC93F': 'yellow',
  '#6EC77B': 'green',
  '#A177E2': 'purple',
  '#081221': 'black',
};

// FolderColor 이름 → HEX 매핑
const COLOR_TO_HEX: Record<FolderColor, string> = {
  red: '#F55757',
  yellow: '#FFC93F',
  green: '#6EC77B',
  purple: '#A177E2',
  black: '#081221',
};

// HEX 문자열을 FolderColor로 변환
export const resolveFolderColor = (hex: string): FolderColor => {
  return HEX_TO_COLOR[hex.toUpperCase()];
};

// FolderColor를 HEX 문자열로 변환
export const folderColorToHex = (color: FolderColor): string => {
  return COLOR_TO_HEX[color];
};
