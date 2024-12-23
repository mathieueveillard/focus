import { createCollection, flow, Lens, noop, Reducer } from '@focus/core';

export type Subscriber = () => void;

export type CleanUpFunction = () => void;

export type Selector<State, R> = (state: State) => R;

type FocusedStore<State> = {
  getState: () => State;
  select: <R>(selector: Selector<State, R>) => R;
  updateState: (reducer: Reducer<State>) => void;
  batchUpdates: (...reducers: Reducer<State>[]) => void;
  subscribe: (subscriber: Subscriber) => CleanUpFunction;
};

export type Store<State> = FocusedStore<State> & {
  focus: <Focus>(lens: Lens<State, Focus>) => FocusedStore<Focus>;
};

export type Logger = (log: object) => void;

export const createStore = <State>(
  initialState: State,
  logger: Logger = noop
): Store<State> => {
  let state = initialState;

  let subscribers = createCollection<Subscriber>();

  const getState = () => state;

  const select = <R>(selector: Selector<State, R>) => selector(state);

  const updateState = (reducer: Reducer<State>) => {
    const stateBeforeUpdate = state;

    state = reducer(state);

    logger({
      stateBeforeUpdate,
      reducer: reducer.toString(),
      stateAfterUpdate: state,
    });

    subscribers.forEach((subscriber) => {
      subscriber();
    });
  };

  const batchUpdates = (...reducers: Reducer<State>[]) => {
    return updateState(flow(...reducers));
  };

  const subscribe = (subscriber: Subscriber) => {
    subscribers = subscribers.append(subscriber);

    return () => {
      subscribers = subscribers.remove(subscriber);
    };
  };

  const focus = <Focus>(lens: Lens<State, Focus>) => ({
    getState: () => lens.get(state),
    select: <R>(selector: Selector<Focus, R>) => selector(lens.get(state)),
    updateState: (reducer: Reducer<Focus>) => {
      updateState(lens.reduce(reducer));
    },
    batchUpdates: (...reducers: Reducer<Focus>[]) => {
      batchUpdates(...reducers.map((reducer) => lens.reduce(reducer)));
    },
    subscribe,
  });

  return {
    getState,
    select,
    updateState,
    batchUpdates,
    subscribe,
    focus,
  };
};
