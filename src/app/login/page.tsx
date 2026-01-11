import { css } from 'styled-system/css';
import { styled } from 'styled-system/jsx';
import { center, stack, hstack } from 'styled-system/patterns';
import { Button } from '@/components/Button';
import { Input } from '@/components/TextField';
import { KakaoLoginButton } from '@/features/login/components/KakaoLoginButton';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <Container.Page>
      <Image
        src='/login-logo.svg'
        alt='채택 로그인 로고'
        width={260}
        height={48}
      />
      <Container.Login>
        <LoginSection
          title='이메일로 로그인하기'
          button={
            <Button
              variant='fillBlue'
              size='xlarge'
              className={css({ marginTop: 'auto' })}
            >
              로그인
            </Button>
          }
        >
          <Container.InputForm>
            <InputGroup />
            <LoginLinks />
          </Container.InputForm>
        </LoginSection>
        <Divider.Big />
        <LoginSection
          title='카카오로 간편로그인하기'
          button={<KakaoLoginButton />}
        >
          <Text.KakaoDescription>
            아이디와 비밀번호 입력하기 귀찮으시죠?
            <br />
            1초 회원가입으로 입력없이 간편하게 로그인 하세요.
          </Text.KakaoDescription>
        </LoginSection>
      </Container.Login>
      <Text.Footer>
        계속 진행하면 이용약관 및 개인정보처리방침을 이해하고 동의하는 것으로
        간주됩니다.
      </Text.Footer>
    </Container.Page>
  );
}

// 로그인 섹션 컴포넌트
interface LoginSectionProps {
  title: string;
  children: React.ReactNode;
  button: React.ReactNode;
}

const LoginSection = ({ title, children, button }: LoginSectionProps) => (
  <Container.Section>
    <Text.SectionTitle>{title}</Text.SectionTitle>
    {children}
    {button}
  </Container.Section>
);

// Input 컴포넌트
const InputGroup = () => (
  <div>
    <Input
      type='email'
      placeholder='가입하신 이메일을 입력하세요.'
      width='24.125rem'
      className={inputStyle.email}
    />
    <Input
      type='password'
      placeholder='비밀번호를 입력하세요.'
      width='24.125rem'
      className={inputStyle.password}
    />
  </div>
);

// 로그인 링크 컴포넌트
const LoginLinks = () => (
  <Container.Links>
    <Text.Link>회원가입</Text.Link>
    <div className={hstack({ gap: '0.5rem' })}>
      <Text.Link>이메일 찾기</Text.Link>
      <Divider.Small />
      <Text.Link>비밀번호 찾기</Text.Link>
    </div>
  </Container.Links>
);

// Container 관련 스타일
const Container = {
  Page: styled('div', {
    base: center.raw({
      minHeight: '100vh',
      maxHeight: '100vh',
      flexDirection: 'column',
      paddingTop: '19.5vh',
      paddingBottom: '26vh',
      gap: '5rem',
    }),
  }),
  Login: styled('div', {
    base: hstack.raw({
      gap: '2.5rem',
      alignItems: 'flex-start',
      marginTop: '1.25rem',
      height: '19.125rem',
    }),
  }),
  Section: styled('section', {
    base: stack.raw({
      gap: '1.5rem',
      height: '100%',
    }),
  }),
  InputForm: styled('div', {
    base: stack.raw({
      gap: '0.75rem',
    }),
  }),
  Links: styled('div', {
    base: hstack.raw({
      justifyContent: 'space-between',
      color: 'gray.500',
    }),
  }),
};

// 텍스트 스타일
const Text = {
  SectionTitle: styled('h2', {
    base: {
      textStyle: 'h2',
      color: 'gray.900',
    },
  }),
  Link: styled('p', {
    base: {
      textStyle: 'body4.r',
      cursor: 'pointer',
    },
  }),
  KakaoDescription: styled('p', {
    base: {
      textStyle: 'body2.m',
      color: 'gray.600',
    },
  }),
  Footer: styled('footer', {
    base: {
      textStyle: 'body3.r',
      color: 'gray.500',
    },
  }),
};

// 세로선 스타일
const Divider = {
  Big: styled('div', {
    base: {
      width: '0.0625rem',
      height: '19.125rem',
      bg: 'gray.200',
    },
  }),
  Small: styled('div', {
    base: {
      width: '0.0625rem',
      height: '0.875rem',
      bg: 'gray.500',
    },
  }),
};

// Input 스타일
const inputStyle = {
  email: css({
    borderBottomLeftRadius: '0',
    borderBottomRightRadius: '0',
    position: 'relative',
    _focus: { zIndex: 1 },
  }),
  password: css({
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
    marginTop: '-2px',
    position: 'relative',
    _focus: { zIndex: 1 },
  }),
};
