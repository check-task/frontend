# CHECKTASK Frontend

<div align="center">

<img src="public/HomeLogo.svg" alt="logo" width="600" />

<br/>

**대학생을 위한 경량 과제 관리 서비스,**

**CHECKTASK의 프론트엔드 레포지토리입니다.**

</div>

---

## Team
|<img width="400" height="400" alt="image" src="https://github.com/user-attachments/assets/5a2da63a-3e0f-4fc1-b875-ee761d083ee0" />|<img width="400" height="400" alt="image" src="https://github.com/user-attachments/assets/47b2d1b3-64c7-4f47-9cfb-dae2bc3dcc4b" />|<img width="400" height="400" alt="image" src="https://github.com/user-attachments/assets/a992e8d0-5187-43c2-b06b-fbd59b332552" />|
|:-:|:-:|:-:|
| [신/성태경](https://github.com/sungtaegyeong) | [두두/두현우](https://github.com/HyunwooDoo) | [도토/김예원](https://github.com/yewon20804) |
| **Front-End (팀장)** | **Front-End** | **Front-End** |
| 프론트엔드 총괄<br/>홈 화면<br/>로그인<br/>내 정보 | 사이드바, 홈버튼 <br/>소켓<br/>과제 등록<br/>팀 과제 | 과제 목록, 완료<br/>개인 과제<br/>자료 수정<br/>알림 |

---

## 목차

- [주요 기능](#주요-기능)
- [기술 스택 및 선정 이유](#-기술-스택-및-선정-이유)
- [아키텍처 및 폴더 구조](#아키텍처-및-폴더-구조)
- [협업 규칙](#협업-규칙)

---

## 주요 기능

- **과제 통합 관리**: 개인 과제와 팀 과제를 한 곳에서 생성·수정·삭제하며 진행률을 추적
- **캘린더 대시보드**: FullCalendar 기반 캘린더로 과제 마감일과 세부 일정을 한눈에 파악
- **실시간 팀 협업**: Socket.IO 기반 실시간 동기화로 팀원 간 세부 업무 배정·상태 변경·댓글·회의록·자료 공유를 즉시 반영
- **폴더 분류**: 컬러 태그가 적용된 폴더로 과제를 체계적으로 분류 및 필터링
- **드래그 앤 드롭 정렬**: dnd-kit을 활용한 과제 우선순위 직관적 재배치
- **알림 시스템**: 마감일 및 업무 변경에 대한 알림으로 일정 누락 방지
- **다크 모드**: 라이트/다크 테마 전환 지원, 서버 사이드 쿠키 동기화로 깜빡임 없는 테마 적용
- **카카오 소셜 로그인**: OAuth 기반 간편 로그인 및 자동 토큰 갱신

---

## 🛠 기술 스택 및 선정 이유

### Frontend

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PandaCSS](https://img.shields.io/badge/PandaCSS-FDE047?style=for-the-badge&logo=css3&logoColor=black)

- **Next.js (App Router)**: SSR/SSG 등 다양한 렌더링 전략 지원, 성능·SEO 우수. Route Groups 활용으로 인증/비인증 영역 레이아웃 직관적 분리
- **TypeScript**: 정적 타입으로 안정성 확보, 잠재적 버그 사전 방지, 유지보수성 향상
- **PandaCSS**: 타입 안전한 Atomic CSS-in-JS로 런타임 오버헤드 없이 일관된 디자인 시스템 구축

### 상태 관리 & 데이터

![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

- **TanStack Query**: 서버 상태(API 데이터) 관리 최적화, 캐싱·동기화·비동기 로직 분리
- **Zustand**: 가벼운 전역 상태 관리 (인증, UI 테마, 모달, 캘린더), 쿠키 퍼시스트 미들웨어로 SSR 동기화
- **Axios**: 인터셉터를 활용한 토큰 자동 첨부 및 만료 시 자동 갱신 처리

### UI 인터랙션

![FullCalendar](https://img.shields.io/badge/FullCalendar-4285F4?style=for-the-badge&logo=googlecalendar&logoColor=white)
![dnd-kit](https://img.shields.io/badge/dnd--kit-5C2D91?style=for-the-badge)

- **FullCalendar**: 과제 마감일 기반 캘린더 시각화, 월간 일정 관리
- **dnd-kit**: 접근성 우수한 드래그 앤 드롭, 과제 우선순위 정렬에 활용

### 개발 환경

![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

- **ESLint & Prettier**: 코드 스타일 표준화, 오류 예방, 가독성 향상
- **pnpm**: 빠른 설치 속도와 디스크 효율적인 패키지 관리

---

## 아키텍처 및 폴더 구조

유지보수성과 확장성을 고려한 기능 단위(Feature-based) 구조 채택

```
src
├─ app                                     # Next.js App Router 페이지 구성
│  ├─ login                                # 로그인 페이지 (카카오 소셜 로그인)
│  ├─ auth/kakao/callback                  # 카카오 OAuth 콜백 처리
│  └─ (main)                               # 인증 필수 영역 (Sidebar + HomeButtonBar 레이아웃)
│     ├─ page.tsx                          # 홈 대시보드 (캘린더 + 과제 목록)
│     ├─ assignment                        # 과제 관리
│     │  ├─ page.tsx                       # 과제 목록 페이지
│     │  ├─ create                         # 과제 생성 페이지
│     │  ├─ modify                         # 과제 수정 페이지
│     │  ├─ personal/[id]                  # 개인 과제 상세 (동적 라우트)
│     │  └─ team/[id]                      # 팀 과제 상세 (동적 라우트)
│     ├─ completed                         # 완료된 과제 아카이브
│     ├─ alarm                             # 알림 목록 페이지
│     └─ profile                           # 프로필 및 설정 페이지
│
├─ components                              # 전역 공용 UI 컴포넌트
│  ├─ Sidebar.tsx                          # 접이식 사이드바 네비게이션
│  ├─ Modal.tsx                            # Zustand 기반 전역 모달
│  ├─ Button.tsx / Checkbox.tsx / TextField.tsx  # 원자 단위 UI
│  ├─ AssignmentCard.tsx                   # 과제 카드 (진행률 표시)
│  ├─ HomeButtonBar.tsx                    # 상단 바 (프로필, 알림, 로그아웃)
│  ├─ DatePicker/                          # 날짜 선택 UI
│  └─ icons/                               # SVG 아이콘 컴포넌트
│
├─ features                                # 기능별 모듈화 코드
│  ├─ home/components                      # 홈 대시보드 전용 (캘린더, 필터, 정렬)
│  ├─ assignment                           # 과제 기능 공통
│  │  ├─ components                        # 과제 데이터 카드, 진행률 바 등
│  │  ├─ hooks                             # 세부 업무 목록 관리 훅
│  │  ├─ create/                           # 과제 생성 전용 (폼, 폴더 선택, URL 추가)
│  │  ├─ modify/                           # 과제 수정 전용
│  │  ├─ personal/                         # 개인 과제 전용 (세부 업무, 알림 토글)
│  │  └─ team/                             # 팀 과제 전용 (멤버 관리, 댓글, 회의록, 초대)
│  ├─ alarm/components                     # 알림 기능 전용
│  ├─ login/components                     # 로그인 기능 전용
│  └─ profile/components                   # 프로필 기능 전용 (폴더 관리, 알림 설정)
│
├─ hooks                                   # 전역 공용 커스텀 훅
│  ├─ queries/                             # React Query 데이터 조회 훅
│  │  ├─ useMyInfo.ts                     # 사용자 정보 + 폴더 조회
│  │  ├─ useHomeTaskList.ts               # 과제 목록 조회 (폴더 색상 매핑)
│  │  ├─ useInfiniteAlarmList.ts          # 알림 무한 스크롤 조회
│  │  └─ useTaskMembers.ts               # 팀 멤버 조회
│  └─ mutations/                           # React Query 데이터 변경 훅
│     ├─ useCreateTask.ts / useUpdateTask.ts  # 과제 CRUD
│     ├─ useCreateSubTask.ts              # 세부 업무 생성
│     ├─ useCreateFolder.ts / useUpdateFolder.ts / useDeleteFolder.ts
│     ├─ useJoinTask.ts                   # 팀 과제 참여
│     ├─ useCreateInvitationLink.ts       # 초대 링크 생성
│     ├─ useCreateCommunication.ts        # 커뮤니케이션 생성
│     ├─ useCreateMeetingLog.ts           # 회의록 생성
│     └─ ...                              # 댓글, 알림, 프로필 등 뮤테이션 훅
│
├─ services                                # API 호출 함수 모음
│  ├─ task.ts                              # 과제 CRUD API
│  ├─ subtask.ts                           # 세부 업무 API
│  ├─ user.ts                              # 사용자 정보 API
│  ├─ folder.ts                            # 폴더 관리 API
│  └─ alarm.ts                             # 알림 API
│
├─ stores                                  # Zustand 전역 상태 관리
│  ├─ auth-store.ts                        # 인증 상태 (로그인, 로그아웃, 토큰)
│  ├─ ui-store.ts                          # UI 상태 (테마, 사이드바)
│  ├─ modal-store.ts                       # 모달 상태 (열기, 닫기, 옵션)
│  └─ calendar-store.ts                    # 캘린더 상태 (연/월 탐색)
│
├─ providers                               # React Context 프로바이더
│  ├─ auth-provider.tsx                    # 인증 가드
│  ├─ query-provider.tsx                   # TanStack Query 프로바이더
│  └─ theme-provider.tsx                   # 다크/라이트 테마 프로바이더
│
├─ lib                                     # 라이브러리 설정 및 유틸리티
│  ├─ axiosInstance.ts                     # Axios 인스턴스 (인터셉터, 토큰 갱신)
│  ├─ cookie-storage.ts                    # Zustand 쿠키 퍼시스트 스토리지
│  └─ parse-ui-cookie.ts                   # 서버 사이드 UI 상태 파싱
│
├─ theme                                   # PandaCSS 디자인 시스템
│  ├─ tokens/                              # 색상, z-index, duration 토큰
│  ├─ colors/                              # 컬러 팔레트
│  ├─ text-styles.ts                       # 타이포그래피
│  ├─ keyframes.ts                         # CSS 애니메이션 키프레임
│  └─ global-css.ts                        # 글로벌 CSS 리셋
│
├─ types                                   # 타입스크립트 타입 정의
│  ├─ task.ts                              # Task, SubTask, TaskDetail 타입
│  ├─ folder.ts                            # Folder 타입
│  ├─ alarm.ts                             # Alarm 타입
│  └─ api/                                 # API 요청/응답 타입
│
└─ constants                               # 상수 및 목 데이터
```

- **app**: App Router 규칙에 맞춰 페이지·레이아웃 구성, Route Groups로 인증/비인증 영역 분리
- **features**: 기능별 컴포넌트·훅을 통합 관리하여 독립성과 응집도 강화
- **components**: 프로젝트 전역 재사용 원자 단위 UI 컴포넌트
- **hooks/queries·mutations**: React Query 훅을 조회/변경으로 분리하여 데이터 흐름 명확화
- **stores**: Zustand 스토어를 역할별로 분리 (인증, UI, 모달, 캘린더)

---

## 협업 규칙

- **Git Flow**: `main` → `develop` → `feature/기능명` 브랜치 전략
- **Commit Convention**: Conventional Commits 규칙 (`feat:`, `fix:`, `refactor:`, `chore:` 등)
- **Pull Request**: `feature` → `develop`로 PR, 팀원 모두 승인 후 머지
- **패키지 매니저**: pnpm 사용 통일
- **코드 품질**: ESLint + Prettier 자동 포맷팅 적용
