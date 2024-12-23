// https://testing-library.com/docs/queries/about

import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { connect } from '.';
import { createLens } from '@focus/core';

describe('Without focusing', () => {
  type State = number;

  const useStore = connect<State>(0);

  const Component: React.FunctionComponent = () => {
    const { state, updateState } = useStore();

    const onClick = (): void => {
      updateState((state) => state + 1);
    };

    return (
      <div>
        <button data-testid="update" onClick={onClick}>
          Update
        </button>
        <div data-testid="state">{state}</div>
      </div>
    );
  };

  test('It should allow to read the state', async () => {
    // Given
    render(<Component />);

    // When
    // Then
    expect(screen.getByTestId('state')).toHaveTextContent('0');
  });

  test('It should allow to update the state', async () => {
    // Given
    render(<Component />);

    // When
    await userEvent.click(screen.getByTestId('update'));

    // Then
    expect(screen.getByTestId('state')).toHaveTextContent('1');
  });
});

describe('Without focusing', () => {
  type State = {
    value: number;
    other: 'other';
  };

  const useStore = connect<State>({
    value: 0,
    other: 'other',
  });

  const lens = createLens<State, number>({
    get: ({ value }) => value,
    set: (state, value) => ({ ...state, value }),
  });

  const Component: React.FunctionComponent = () => {
    const { state, updateState } = useStore().focus(lens);

    const onClick = (): void => {
      updateState((state) => state + 1);
    };

    return (
      <div>
        <button data-testid="update" onClick={onClick}>
          Update
        </button>
        <div data-testid="state">{state}</div>
      </div>
    );
  };

  test('It should allow to read the state', async () => {
    // Given
    render(<Component />);

    // When
    // Then
    expect(screen.getByTestId('state')).toHaveTextContent('0');
  });

  test('It should allow to update the state', async () => {
    // Given
    render(<Component />);

    // When
    await userEvent.click(screen.getByTestId('update'));

    // Then
    expect(screen.getByTestId('state')).toHaveTextContent('1');
  });
});
