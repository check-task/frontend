export interface NoticeSection {
  heading: string;
  items?: string[];
  text?: string;
  subSections?: {
    heading: string;
    items: string[];
  }[];
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
    id: '3',
    title: '📢 2차 릴리즈 안내',
    intro: 'CHECKTASK(채택) 서비스에 새로운 기능이 추가됐어요! 👏',
    sections: [
      {
        heading: '🔔 주요 업데이트',
        subSections: [
          {
            heading: '폴더별로 모아봐요.',
            items: [
              '과제 목록에서 원하는 폴더로 분류해서 볼 수 있어요.',
              '폴더 순서를 직접 관리하고, 자주 쓰는 폴더를 앞으로 배치할 수 있어요.',
              '폴더에도 우선순위를 남겨보세요!',
            ],
          },
          {
            heading: '개인 과제를 팀 과제로 바꿔보세요.',
            items: [
              '개인 과제로 만들었다가 팀원이 생기면, 새로 만들지 않고 그대로 팀 과제로 전환할 수 있어요.',
              '단, 팀 과제를 개인 과제로 되돌리는 것은 불가능해요.',
            ],
          },
        ],
      },
    ],
    footer: '',
    date: '2026.07.15',
  },
  {
    id: '2',
    title: '📢 1차 릴리즈 안내',
    intro: 'CHECKTASK(채택) 서비스가 더 편리하게 발전됐어요! 👏',
    sections: [
      {
        heading: '🔔 주요 업데이트',
        subSections: [
          {
            heading: '자체 로그인이 가능해졌어요.',
            items: [
              '⚠️ 자체 회원가입 시 카카오 계정과 같은 이메일로 가입할 수 없어요.',
              '기존 사용자 분들은 카카오 로그인으로 진행해주세요.',
            ],
          },
          // {
          //   heading: '이제 아이패드에서도 사용할 수 있어요.',
          //   items: [
          //     '아이패드에서도 웹사이트와 같은 화면으로 서비스를 사용할 수 있어요.',
          //     '모바일은 아직 준비중이에요. 완성되면 알려드릴게요!',
          //   ],
          // },
        ],
      },
      {
        heading: '📬 문의 및 피드백',
        text: '기능 추가 요청이나 문의사항은 인스타그램 (@checktask_) DM으로 보내주세요.',
      },
    ],
    footer: '',
    date: '2026.06.03',
  },
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
