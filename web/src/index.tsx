import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { transitions, positions, Provider as AlertProvider } from 'react-alert'

const alertConfiguration = {
  position: positions.TOP_CENTER,
  timeout: 8000,
  transition: transitions.SCALE
}

const AlertTemplate = ({style, options, message, close }: any) => (
  <div style={style}>
    {options.type === 'info' && '!'}
    {options.type === 'success' && '!'}
    {options.type === 'error' && '!'}
    {message}
    <button type="button" onClick={close}></button>
  </div>
)


ReactDOM.render(
  // <React.StrictMode>
  <AlertProvider template={AlertTemplate}>
    <App />
  </AlertProvider>,

  // </React.StrictMode>,
  document.getElementById('root')
);
