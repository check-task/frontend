import { Button } from '@/components/Button';
import Link from 'next/link';
import { styled } from 'styled-system/jsx';
import { hstack } from 'styled-system/patterns';

export const ButtonGroup = () => {
  return (
    <Container>
      <Button variant='strokeBlue' size='small'>
        과제참여
      </Button>
      <Link href='/assignment/create'>
        <Button variant='fillBlue' size='small'>
          과제등록
        </Button>
      </Link>
    </Container>
  );
};

const Container = styled('div', {
  base: hstack.raw({
    gap: '1.25rem',
  }),
});
