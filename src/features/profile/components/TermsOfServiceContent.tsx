import { css, cva } from 'styled-system/css';
import { stack } from 'styled-system/patterns';

const legalIntroText = {
  fontSize: '0.75rem',
  fontWeight: '500',
  lineHeight: '1.4',
  letterSpacing: '-0.02em',
};

const legalBodyText = {
  fontSize: '0.75rem',
  fontWeight: '400',
  lineHeight: '1.4',
  letterSpacing: '-0.02em',
  color: 'gray.600',
};

interface TermsOfServiceContentProps {
  embedded?: boolean;
}

export const TermsOfServiceContent = ({
  embedded = false,
}: TermsOfServiceContentProps) => {
  return (
    <div className={wrapperStyle({ embedded })}>
      <div className={scrollContainerStyle({ embedded })}>
        <p className={introStyle}>
          본 약관은 &#39;채택(CHECKTASK)&#39;(이하 &quot;서비스&quot;)이
          제공하는 웹 기반 경량 과제 관리 서비스의 이용과 관련하여, 서비스와
          이용자 간의 권리·의무 및 책임사항을 규정함을 목적으로 합니다.
        </p>

        <div className={sectionStyle}>
          <p className={sectionTitleStyle}>제1조 (목적)</p>
          <p className={sectionBodyStyle}>
            본 약관은 서비스가 제공하는 과제 및 세부과제 등록, 관리, 협업,
            리마인드 기능 등 제반 서비스의 이용 조건 및 절차, 이용자와 서비스
            간의 권리와 의무, 책임사항을 정함을 목적으로 합니다.
          </p>
        </div>

        <div className={sectionStyle}>
          <p className={sectionTitleStyle}>제2조 (정의)</p>
          <p className={sectionBodyStyle}>
            본 약관에서 사용하는 용어의 정의는 다음과 같습니다.
          </p>
          <ol className={orderedListStyle}>
            <li>
              &quot;회원&quot;이란 카카오 로그인을 통해 가입 후 서비스를
              이용하는 자를 말합니다.
            </li>
            <li>
              &quot;과제&quot;란 회원이 등록·관리하는 작업 단위를 의미합니다.
            </li>
            <li>
              &quot;세부과제&quot;란 과제를 구성하는 하위 작업 단위를
              의미합니다.
            </li>
            <li>
              &quot;콘텐츠&quot;란 회원이 서비스에 작성·업로드하는 텍스트,
              이미지, 파일, 링크 등 일체의 정보를 의미합니다.
            </li>
            <li>
              &quot;팀&quot;이란 복수의 회원이 공동으로 과제를 관리하기 위해
              구성한 단위를 의미합니다.
            </li>
          </ol>
        </div>

        <div className={sectionStyle}>
          <p className={sectionTitleStyle}>제3조 (약관의 효력 및 변경)</p>
          <ol className={orderedListStyle}>
            <li>
              본 약관은 서비스 화면에 게시하거나 기타 방법으로 공지함으로써
              효력이 발생합니다.
            </li>
            <li>
              서비스는 관련 법령을 위반하지 않는 범위에서 본 약관을 변경할 수
              있습니다.
            </li>
            <li>
              약관이 변경되는 경우 시행일 및 변경 내용을 사전에 공지하며, 변경
              후 서비스를 계속 이용하는 경우 동의한 것으로 봅니다.
            </li>
          </ol>
        </div>

        <div className={sectionStyle}>
          <p className={sectionTitleStyle}>제4조 (회원 가입 및 계정 관리)</p>
          <ol className={orderedListStyle}>
            <li>회원 가입은 카카오 로그인 인증 완료 시 성립합니다.</li>
            <li>
              회원은 본인의 계정을 본인만 사용하여야 하며, 타인에게
              양도·대여·공유할 수 없습니다.
            </li>
            <li>
              계정 관리 소홀로 발생하는 손해에 대한 책임은 회원 본인에게
              있습니다.
            </li>
            <li>
              서비스는 다음의 경우 해당 계정을 제한 또는 삭제할 수 있습니다.
              <ul className={nestedUnorderedListStyle}>
                <li>타인의 명의를 도용한 경우</li>
                <li>부정한 방법으로 가입한 경우</li>
                <li>본 약관을 위반한 경우</li>
              </ul>
            </li>
          </ol>
        </div>

        <div className={sectionStyle}>
          <p className={sectionTitleStyle}>제5조 (서비스의 제공)</p>
          <ol className={orderedListStyle}>
            <li>
              서비스는 다음 기능을 제공합니다.
              <ul className={nestedUnorderedListStyle}>
                <li>과제 및 세부과제 등록, 수정, 삭제</li>
                <li>일정 관리 및 리마인드 제공</li>
                <li>팀 기반 협업 기능</li>
                <li>콘텐츠 저장 및 관리</li>
              </ul>
            </li>
            <li>
              서비스는 이미지 및 파일 저장을 위하여 외부 클라우드 서비스를
              이용할 수 있습니다.
            </li>
            <li>
              서비스는 운영상 또는 기술상 필요에 따라 제공 기능을
              변경·추가·중단할 수 있으며, 중요한 변경 사항은 사전에 공지합니다.
            </li>
          </ol>
        </div>

        <div className={sectionStyle}>
          <p className={sectionTitleStyle}>제6조 (서비스 이용 제한 및 중단)</p>
          <p className={sectionBodyStyle}>
            서비스는 다음 각 호의 경우 서비스 이용을 제한하거나 중단할 수
            있습니다.
          </p>
          <ol className={orderedListStyle}>
            <li>
              시스템 점검, 장애, 설비 보수, 천재지변 등 불가피한 사유가 있는
              경우
            </li>
            <li>회원이 법령 또는 본 약관을 위반한 경우</li>
            <li>서비스 운영을 현저히 방해하는 행위를 한 경우</li>
            <li>보안상 문제가 발생하거나 발생할 우려가 있는 경우</li>
          </ol>
        </div>

        <div className={sectionStyle}>
          <p className={sectionTitleStyle}>제7조 (회원의 의무)</p>
          <p className={sectionBodyStyle}>
            회원은 다음 행위를 하여서는 안 됩니다.
          </p>
          <ol className={orderedListStyle}>
            <li>법령 또는 본 약관에 위반되는 행위</li>
            <li>타인의 개인정보 또는 계정을 무단 사용하는 행위</li>
            <li>허위 정보 등록 또는 서비스 운영 방해 행위</li>
            <li>
              불법, 음란, 명예훼손, 타인의 권리를 침해하는 콘텐츠 게시 행위
            </li>
            <li>서비스의 정상적인 운영을 방해하는 행위</li>
          </ol>
        </div>

        <div className={sectionStyle}>
          <p className={sectionTitleStyle}>제8조 (콘텐츠의 권리와 책임)</p>
          <ol className={orderedListStyle}>
            <li>
              회원이 작성·업로드한 콘텐츠의 저작권은 해당 회원에게 귀속됩니다.
            </li>
            <li>
              회원은 서비스 제공 및 운영을 위해 필요한 범위 내에서 콘텐츠 사용을
              서비스에 허용합니다.
            </li>
            <li>
              서비스는 법령 위반 또는 운영 정책에 위배되는 콘텐츠에 대해 삭제
              또는 접근 제한 조치를 할 수 있습니다.
            </li>
            <li>콘텐츠로 인해 발생하는 법적 책임은 해당 회원에게 있습니다.</li>
          </ol>
        </div>

        <div className={sectionStyle}>
          <p className={sectionTitleStyle}>제9조 (개인정보 보호)</p>
          <p className={sectionBodyStyle}>
            서비스는 관련 법령에 따라 회원의 개인정보를 보호하며, 구체적인
            사항은 「개인정보 처리방침」에 따릅니다.
          </p>
        </div>

        <div className={sectionStyle}>
          <p className={sectionTitleStyle}>제10조 (서비스 이용 종료 및 탈퇴)</p>
          <ol className={orderedListStyle}>
            <li>회원은 언제든지 서비스 내 기능을 통해 탈퇴할 수 있습니다.</li>
            <li>탈퇴 시 회원의 계정 정보는 일정 기간 보관 후 삭제됩니다.</li>
            <li>
              회원이 서비스 이용 제한 사유에 해당하는 경우 서비스는 해당 계정을
              삭제하거나 이용을 제한할 수 있습니다.
            </li>
          </ol>
        </div>

        <div className={sectionStyle}>
          <p className={sectionTitleStyle}>제11조 (책임의 제한)</p>
          <ol className={orderedListStyle}>
            <li>
              서비스는 천재지변, 시스템 장애 등 불가항력적 사유로 인한 손해에
              대해 책임을 지지 않습니다.
            </li>
            <li>
              서비스는 회원의 귀책사유로 발생한 손해에 대해 책임을 지지
              않습니다.
            </li>
            <li>
              서비스는 무료로 제공되는 서비스와 관련하여 법령상 허용되는 범위
              내에서 책임을 제한할 수 있습니다.
            </li>
            <li>
              서비스는 회원 간 또는 회원과 제3자 간 발생한 분쟁에 개입하지
              않으며 이에 대한 책임을 지지 않습니다.
            </li>
          </ol>
        </div>

        <div className={sectionStyle}>
          <p className={sectionTitleStyle}>제12조 (지적재산권)</p>
          <p className={sectionBodyStyle}>
            서비스에 포함된 디자인, 로고, 기능 등 일체의 권리는 서비스에
            귀속됩니다. <br />
            회원은 서비스의 사전 승인 없이 이를 복제, 배포, 상업적으로 이용할 수
            없습니다.
          </p>
        </div>

        <div className={sectionStyle}>
          <p className={sectionTitleStyle}>제13조 (준거법 및 관할)</p>
          <p className={sectionBodyStyle}>
            본 약관은 대한민국 법령에 따르며, 서비스 이용과 관련하여 분쟁이
            발생한 경우 관할 법원은 대한민국 민사소송법에 따릅니다.
          </p>
        </div>

        <div className={sectionStyle}>
          <p className={sectionTitleStyle}>부칙</p>
          <p className={sectionBodyStyle}>
            본 약관은 2026년 4월 20일부터 시행됩니다.
          </p>
        </div>

        <div className={businessInfoStyle}>
          <p>상호: 코메트리</p>
          <p>대표자: 정유진</p>
          <p>사업자등록번호: 292-20-02148</p>
          <p>주소: 서울특별시 영등포구 대림로31길 39</p>
          <p>이메일: songwol@tukorea.ac.kr</p>
        </div>
      </div>
    </div>
  );
};

const wrapperStyle = cva({
  base: stack.raw({
    marginTop: '1rem',
    maxWidth: '36.25rem',
  }),
  variants: {
    embedded: {
      true: {
        marginTop: 0,
        maxWidth: 'none',
        width: 'full',
      },
    },
  },
});

const scrollContainerStyle = cva({
  base: {
    ...stack.raw({
      gap: '0.75rem',
      paddingBottom: '0.5rem',
    }),
    width: 'calc(100% + 1.25rem)',
    maxHeight: '36.375rem',
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
  },
  variants: {
    embedded: {
      true: {
        width: '100%',
        maxHeight: 'none',
        overflowY: 'visible',
        paddingRight: 0,
        scrollbarGutter: 'auto',
      },
    },
  },
});

const introStyle = css({
  ...legalIntroText,
  color: 'gray.800',
});

const sectionStyle = css(
  stack.raw({
    gap: '0.25rem',
  }),
);

const sectionTitleStyle = css({
  ...legalIntroText,
  color: 'gray.700',
});

const sectionBodyStyle = css(legalBodyText);

const orderedListStyle = css({
  listStyleType: 'decimal',
  paddingLeft: '1.125rem',
  ...legalBodyText,
});

const nestedUnorderedListStyle = css({
  listStyleType: 'disc',
  paddingLeft: '1.125rem',
});

const businessInfoStyle = css({
  ...legalBodyText,
  borderTop: '1px solid',
  borderColor: 'gray.200',
  paddingTop: '0.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
});
