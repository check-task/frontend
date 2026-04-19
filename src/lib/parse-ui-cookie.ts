//UI Storage 쿠키를 파싱하여 초기 상태를 추출하는 유틸리티 함수

export interface UIState {
  theme: 'light' | 'dark';
  isSidebarCollapsed: boolean;
}

export function parseUICookie(cookieValue: string | undefined): UIState {
  const defaultState: UIState = {
    theme: 'light',
    isSidebarCollapsed: false,
  };

  if (!cookieValue) {
    return defaultState;
  }

  try {
    const decoded = decodeURIComponent(cookieValue);
    const parsed = JSON.parse(decoded);

    if (parsed && parsed.state) {
      return {
        theme:
          parsed.state.theme === 'light' || parsed.state.theme === 'dark'
            ? parsed.state.theme
            : defaultState.theme,
        isSidebarCollapsed:
          typeof parsed.state.isSidebarCollapsed === 'boolean'
            ? parsed.state.isSidebarCollapsed
            : defaultState.isSidebarCollapsed,
      };
    }

    return defaultState;
  } catch (error) {
    console.error('Error parsing UI cookie:', error);
    return defaultState;
  }
}
