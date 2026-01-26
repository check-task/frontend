import type { FolderColor } from '@/types/folder';

export interface SampleFolder {
  color: FolderColor;
  name: string;
}

export const sampleFolders: SampleFolder[] = [
  { color: 'black', name: '프로그래밍' },
  { color: 'red', name: '그만세' },
  { color: 'yellow', name: '웹서프' },
  { color: 'purple', name: '팀과제' },
];
