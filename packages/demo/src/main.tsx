import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import Demo from './app';
import { connect } from '@focus/react-connect';
import './styles.css';

export type ApplicationState = {
  a: number;
  b: number;
};

export const useGlobalState = connect<ApplicationState>({ a: 0, b: 0 });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <Demo />
  </StrictMode>
);
