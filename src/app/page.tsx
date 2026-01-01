'use client';

import { css } from '../../styled-system/css';
import { Button } from '@/components/ui';
import { useCounterStore } from '@/providers/counter-store-provider';

export default function Home() {
  const { count, incrementCount, decrementCount } = useCounterStore(
    (state) => state,
  );

  return (
    <div className={css({ fontSize: '2xl', fontWeight: 'bold' })}>
      <Button>Button</Button>
      Hello 🐼!
      <div>
        Count: {count}
        <hr />
        <button type='button' onClick={incrementCount}>
          Increment Count
        </button>
        <button type='button' onClick={decrementCount}>
          Decrement Count
        </button>
      </div>
    </div>
  );
}
