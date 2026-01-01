import { css } from '../../styled-system/css';
import { Button } from '@/components/ui';

export default function Home() {
  return (
    <div className={css({ fontSize: '2xl', fontWeight: 'bold' })}>
      <Button>Button</Button>
      Hello 🐼!
    </div>
  );
}
