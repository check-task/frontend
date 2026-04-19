export interface NoticeSection {
  heading: string;
  items?: string[];
  text?: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  intro: string;
  sections: NoticeSection[];
  footer: string;
  date: string;
}

export const NOTICES: NoticeItem[] = [
  {
    id: '1',
    title: '📢 서비스 출시 안내',
    intro:
      'CHECKTASK(채택) 서비스가 정식 출시되었습니다 🥳\n\n과제 관리, 아직도 여러 앱을 오가며 하고 계신가요?\n채택은 흩어진 과제 관리 과정을 하나로 통합해 개인과 팀 과제 모두 더 효율적으로 과제를 수행할 수 있도록 돕습니다.',
    sections: [
      {
        heading: '🔑 주요 기능',
        items: [
          '캘린더 기반 과제 일정 관리',
          '개인 과제 / 팀 과제 통합 관리',
          '과제 진행 상황 및 세부 과제 관리',
          '폴더를 통한 과제 정리',
          '효율적인 알림 설정 (적절한 타이밍에 리마인드)',
          '프로필 설정 및 다크모드 지원',
        ],
      },
      {
        heading: '📬 문의 및 피드백',
        text: '기능 추가 요청이나 문의사항은 인스타그램 (@checktask_) DM으로 보내주세요.\n\n여러분의 피드백을 바탕으로 더 나은 서비스를 만들어가겠습니다.',
      },
    ],
    footer:
      'CHECKTASK는 과제 등록부터 진행 관리, 협업까지 모든 흐름을 하나의 서비스에서 해결할 수 있도록 설계되었습니다.\n지금 바로 CHECKTASK를 경험해보세요.\n주변에도 많이 공유해주시면 큰 도움이 됩니다 🙇🏻‍♀️',
    date: '2026.04.20',
  },
];
