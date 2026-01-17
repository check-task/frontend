import { css } from 'styled-system/css';

type FolderColor = '01' | '02' | '03' | '04' | '05';

interface FolderClassificationProps {
  color: FolderColor;
}

const colorMap: Record<FolderColor, string> = {
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
