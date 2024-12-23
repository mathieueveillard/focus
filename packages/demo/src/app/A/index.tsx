import React, { useEffect } from 'react';
import Code from '../utils/Code';
import Button from '../utils/Button';
import H2 from '../utils/H2';
import { ApplicationState, useGlobalState } from '../../main';
import { createLens } from '@focus/react-connect';

const lens = createLens<ApplicationState, number>({
  get: ({ a }) => a,
  set: (state, a) => ({ ...state, a }),
});

const Component: React.FunctionComponent = () => {
  const { state, updateState } = useGlobalState().focus(lens);

  const increment = (): void => {
    console.log("[A] User clicks the 'Increment' button");
    const state = updateState((n) => n + 1);
    console.log('[A] New (synchronous) value for a: ', state);
  };

  useEffect(() => {
    console.log('[A] Component renders\n---------------------------');
  });

  return (
    <div>
      <H2>Component A</H2>
      <div className="flex gap-2">
        <Code>a: {state}</Code>
        <Button onClick={increment}>Increment a</Button>
      </div>
    </div>
  );
};

export default Component;
