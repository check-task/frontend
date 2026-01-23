import { useEffect, useRef } from 'react';

// 외부 영역 클릭시 감지 후, 진행할 로직을 받아서 처리하는 커스텀 훅
export function useClickOutside<T extends HTMLElement>(handler: () => void) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        // 처리할 로직(외부에서 받기)
        handler();
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handler]);

  return ref;
}
