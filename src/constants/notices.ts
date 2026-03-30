export interface NoticeItem {
  id: string;
  title: string;
  bulletItems: string[];
  description: string;
  date: string;
}

export const NOTICES: NoticeItem[] = [
  {
    id: '1',
    title: '서비스 출시 안내',
    bulletItems: [
      '체크태스크 서비스가 정식 출시되었습니다.',
      '개인과제 및 팀과제 기능을 이용할 수 있습니다.',
      '캘린더를 통해 과제 일정을 확인하세요.',
    ],
    description:
      '체크태스크는 개인과 팀의 과제 관리를 효율적으로 도와주는 서비스입니다. 과제 등록, 진행 상황 추적, 팀원과의 협업 기능을 제공합니다. 앞으로도 지속적인 업데이트를 통해 더 나은 서비스를 제공할 예정입니다.',
    date: '2026.02.02',
  },
  {
    id: '2',
    title: '기능 업데이트 안내',
    bulletItems: [
      '과제 수정 기능이 추가되었습니다.',
      '다크모드를 지원합니다.',
      '알림 기능이 개선되었습니다.',
    ],
    description:
      '이번 업데이트를 통해 과제 수정 및 삭제 기능이 추가되었습니다. 또한 다크모드 지원으로 눈의 피로를 줄일 수 있습니다. 알림 기능도 개선되어 중요한 과제 마감일을 놓치지 않도록 도와드립니다.',
    date: '2026.03.01',
  },
];
