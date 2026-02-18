import { styled } from 'styled-system/jsx';
import { stack } from 'styled-system/patterns';

export const PrivacyPolicyContent = () => {
  return (
    <Wrapper>
      <ScrollContainer>
        <Intro>
        본 서비스는 「개인정보 보호법」 및 「위치정보의 보호 및 이용 등에 관한
        법률」을 준수하며, 이용자의 개인정보를 안전하게 보호하고 권익을 보장하기
        위하여 다음과 같이 개인정보 처리방침을 수립·공개합니다.
      </Intro>

      <Section>
        <SectionTitle>제1조 (총칙)</SectionTitle>
        <SectionBody>
          서비스는 관련 법령에 따라 개인정보를 적법하고 안전하게 처리하며,
          이용자의 개인정보 보호를 최우선 가치로 합니다.
        </SectionBody>
      </Section>

      <Section>
        <SectionTitle>제2조 (수집하는 개인정보 항목)</SectionTitle>
        <SectionBody>서비스는 다음과 같은 개인정보를 수집합니다.</SectionBody>
        <ListContainer>
          <ListItem>1. 회원가입 및 로그인</ListItem>
          <UnorderedList>
            <li>카카오 로그인 계정 식별값(고유 ID)</li>
            <li>
              프로필 정보(닉네임, 프로필 이미지)
              <br />※ 이용자가 공개에 동의한 경우
            </li>
          </UnorderedList>
          <ListItem>
            2. 서비스 이용 과정에서 이용자가 직접 입력 또는 생성하는 정보
          </ListItem>
          <UnorderedList>
            <li>TASK, 댓글, 팀 과제 등 콘텐츠 정보</li>
            <li>프로필 이미지 및 첨부 파일</li>
          </UnorderedList>
          <ListItem>3. 자동 수집 항목</ListItem>
          <UnorderedList>
            <li>서비스 이용 기록</li>
            <li>접속 로그</li>
            <li>기기 및 브라우저 정보</li>
            <li>쿠키 및 세션 정보 (로그인 유지 목적)</li>
          </UnorderedList>
        </ListContainer>
      </Section>

      <Section>
        <SectionTitle>제3조 (개인정보의 이용 목적)</SectionTitle>
        <SectionBody>
          수집한 개인정보는 다음 목적에 한하여 이용합니다.
        </SectionBody>
        <UnorderedList>
          <li>회원 식별 및 로그인 인증</li>
          <li>서비스 제공 및 기능 운영</li>
          <li>프로필 이미지 설정 등 개인화 서비스 제공</li>
          <li>콘텐츠 저장 및 관리</li>
          <li>서비스 품질 개선 및 이용 통계 분석</li>
          <li>부정 이용 방지 및 보안 관리</li>
        </UnorderedList>
      </Section>

      <Section>
        <SectionTitle>제4조 (카카오 로그인 이용에 관한 사항)</SectionTitle>
        <SectionBody>
          서비스는 간편 회원가입 및 로그인을 위하여 카카오의 카카오 로그인을
          이용합니다.
        </SectionBody>
        <UnorderedList>
          <li>
            이용자는 카카오 로그인 과정에서 제공 항목에 대해 동의 후 서비스를
            이용할 수 있습니다.
          </li>
          <li>
            서비스는 인증 목적 범위 내에서 필요한 최소한의 정보만 수집합니다.
          </li>
          <li>카카오 계정 관리 및 인증 절차는 카카오 정책에 따릅니다.</li>
        </UnorderedList>
      </Section>

      <Section>
        <SectionTitle>제5조 (개인정보의 보관 기간 및 파기)</SectionTitle>
        <OrderedList>
          <li>
            회원 탈퇴 시 계정 정보(닉네임, 로그인 식별값, 프로필 이미지)는 분쟁
            방지 및 복구 요청 대응을 위해 7일간 보관 후 지체 없이 삭제합니다.
          </li>
          <li>
            이용자가 서비스 내 생성한 팀 과제 등 콘텐츠 데이터는 서비스 운영
            기록으로 남을 수 있으며, 삭제를 원하는 경우 탈퇴 전에 직접
            삭제하여야 합니다.
          </li>
          <li>
            개인정보는 보관 기간 경과 또는 처리 목적 달성 시 복구 불가능한
            방법으로 즉시 파기합니다.
          </li>
        </OrderedList>
      </Section>

      <Section>
        <SectionTitle>제6조 (개인정보의 제3자 제공)</SectionTitle>
        <SectionBody>
          서비스는 이용자의 개인정보를 원칙적으로 외부에 제공하지 않으며, 다음의
          경우에만 예외적으로 제공합니다.
        </SectionBody>
        <UnorderedList>
          <li>법령에 근거가 있는 경우</li>
          <li>수사기관 등의 적법한 요청이 있는 경우</li>
          <li>이용자의 사전 동의를 받은 경우</li>
        </UnorderedList>
      </Section>

      <Section>
        <SectionTitle>제7조 (개인정보 처리의 위탁 및 보관)</SectionTitle>
        <SectionBody>
          서비스 운영을 위해 일부 업무를 외부 업체에 위탁할 수 있으며, 관련
          법령에 따라 안전하게 관리·감독합니다.
        </SectionBody>
        <Table>
          <thead>
            <tr>
              <TableHeader>수탁업체</TableHeader>
              <TableHeader>위탁업무 내용</TableHeader>
            </tr>
          </thead>
          <tbody>
            <tr>
              <TableCell>Amazon Web Services</TableCell>
              <TableCell>
                이미지 및 파일 데이터 저장, 클라우드 인프라 운영 (Amazon S3
                포함)
              </TableCell>
            </tr>
          </tbody>
        </Table>
        <UnorderedList>
          <li>위탁된 개인정보는 계약에 따라 안전하게 관리됩니다.</li>
          <li>위탁업무 종료 시 즉시 파기 또는 반환됩니다.</li>
        </UnorderedList>
      </Section>

      <Section>
        <SectionTitle>제8조 (이용자의 권리 및 행사 방법)</SectionTitle>
        <OrderedList>
          <li>
            이용자는 언제든지 자신의 개인정보를 열람, 수정, 삭제하거나 회원
            탈퇴를 요청할 수 있습니다.
          </li>
          <li>
            관련 요청은 서비스 내 기능 또는 관리자 이메일을 통해 가능합니다.
          </li>
          <li>
            위치 기반 기능이 제공되는 경우, 해당 기능에 대해 별도의 동의 또는
            철회를 할 수 있습니다.
          </li>
        </OrderedList>
      </Section>

      <Section>
        <SectionTitle>
          제9조 (개인정보 보호를 위한 안전성 확보 조치)
        </SectionTitle>
        <SectionBody>
          서비스는 개인정보 보호를 위하여 다음과 같은 기술적·관리적 조치를
          시행합니다.
        </SectionBody>
        <UnorderedList>
          <li>주요 데이터 암호화 저장</li>
          <li>세션 기반 인증 관리</li>
          <li>접근 권한 최소화 및 통제</li>
          <li>정기적 보안 점검 및 로그 모니터링</li>
        </UnorderedList>
      </Section>

      <Section>
        <SectionTitle>제10조 (개인정보 보호책임자)</SectionTitle>
        <SectionBody>
          개인정보 보호 관련 문의 및 민원 처리를 위하여 아래와 같이 책임자를
          지정하고 있습니다.
        </SectionBody>
        <UnorderedList>
          <li>책임자: 김민지</li>
          <li>
            이메일:{' '}
            <EmailLink href='mailto:amber_lucy@naver.com'>
              amber_lucy@naver.com
            </EmailLink>
          </li>
        </UnorderedList>
      </Section>

      <Section>
        <SectionTitle>제11조 (개정 및 고지)</SectionTitle>
        <SectionBody>
          본 개인정보 처리방침은 법령, 정책 또는 서비스 내용 변경에 따라 개정될
          수 있으며, 변경 시 서비스 내 공지사항을 통해 사전 안내합니다.
        </SectionBody>
      </Section>
      </ScrollContainer>
    </Wrapper>
  );
};

const Wrapper = styled('div', {
  base: stack.raw({
    marginTop: '1rem',
    maxWidth: '36.25rem',
  }),
});

const ScrollContainer = styled('div', {
  base: stack.raw({
    gap: '0.75rem',
    paddingBottom: '0.5rem',
    width: 'calc(100% + 1.25rem)',
    maxHeight: '30.6255rem',
    overflowY: 'auto',
    paddingRight: '1rem',
    scrollbarGutter: 'stable',
    boxSizing: 'border-box',

    '&::-webkit-scrollbar': {
      width: '0.25rem',
    },
    '&::-webkit-scrollbar-button': {
      width: 0,
      height: 0,
      display: 'none !important',
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'gray.200',
      borderRadius: '6.25rem',
    },
  }),
});

const Intro = styled('p', {
  base: {
    fontSize: '0.75rem',
    fontWeight: '500',
    lineHeight: '1.4',
    letterSpacing: '-0.02em',
    color: 'gray.800',
  },
});

const Section = styled('div', {
  base: stack.raw({
    gap: '0.25rem',
  }),
});

const SectionTitle = styled('p', {
  base: {
    fontSize: '0.75rem',
    fontWeight: '500',
    lineHeight: '1.4',
    letterSpacing: '-0.02em',
    color: 'gray.700',
  },
});

const SectionBody = styled('p', {
  base: {
    fontSize: '0.75rem',
    fontWeight: '400',
    lineHeight: '1.4',
    letterSpacing: '-0.02em',
    color: 'gray.600',
  },
});

const ListContainer = styled('div', {
  base: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: '0.75rem',
    fontWeight: '400',
    lineHeight: '1.4',
    letterSpacing: '-0.02em',
    color: 'gray.600',
  },
});

const ListItem = styled('p', {
  base: {
    lineHeight: '1.4',
  },
});

const UnorderedList = styled('ul', {
  base: {
    listStyleType: 'disc',
    paddingLeft: '1.125rem',
    fontSize: '0.75rem',
    fontWeight: '400',
    lineHeight: '1.4',
    letterSpacing: '-0.02em',
    color: 'gray.600',
  },
});

const OrderedList = styled('ol', {
  base: {
    listStyleType: 'decimal',
    paddingLeft: '1.125rem',
    fontSize: '0.75rem',
    fontWeight: '400',
    lineHeight: '1.4',
    letterSpacing: '-0.02em',
    color: 'gray.600',
  },
});

const Table = styled('table', {
  base: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.6875rem',
    lineHeight: '1.4',
    letterSpacing: '-0.02em',
    color: 'gray.600',
  },
});

const TableHeader = styled('th', {
  base: {
    backgroundColor: 'gray.100',
    border: '1px solid',
    borderColor: 'gray.200',
    padding: '0.25rem 0.75rem',
    textAlign: 'left',
    fontWeight: '400',
  },
});

const TableCell = styled('td', {
  base: {
    border: '1px solid',
    borderColor: 'gray.200',
    padding: '0.25rem 0.75rem',
    fontWeight: '400',
  },
});

const EmailLink = styled('a', {
  base: {
    textDecoration: 'underline',
    color: 'gray.600',
  },
});
