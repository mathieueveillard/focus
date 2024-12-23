// https://react.dev/reference/react/useSyncExternalStore

import { useSyncExternalStore } from 'react';
import { Lens, noop } from '@focus/core';
import { createStore, Logger } from '@focus/store';

export const connect = <State>(initialState: State, logger: Logger = noop) => {
  const store = createStore(initialState, logger);

  const useGlobalState = () => {
    const { getState, select, updateState, subscribe } = store;

    const state = useSyncExternalStore(subscribe, getState);

    return {
      state,
      getSynchronousState: getState,
      select,
      updateState,
      focus: <Focus>(lens: Lens<State, Focus>) => {
        const focusedStore = store.focus(lens);

        const { getState, select, updateState } = focusedStore;

        return {
          state: lens.get(state),
          getSynchronousState: getState,
          select,
          updateState,
        };
      },
    };
  };

  return useGlobalState;
};
