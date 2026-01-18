import { css } from 'styled-system/css';

// 여기에 정의된 폴더 색상을 헤더에서 사용하기 위해 export 추가해주었습니다.
export type FolderColor = '01' | '02' | '03' | '04' | '05';

export interface FolderClassificationProps {
  color: FolderColor;
}

export const colorMap: Record<FolderColor, string> = {
  '01': 'sub.01.100',
  '02': 'sub.02.100',
  '03': 'sub.03.100',
  '04': 'sub.04.100',
  '05': 'sub.05.100',
};

export const FolderClassification = ({ color }: FolderClassificationProps) => {
  return (
    <div
      className={css({
        width: '2.5rem',
        height: '2.5rem',
        borderRadius: '50%',
        bg: colorMap[color],
      })}
    />
  );
};
