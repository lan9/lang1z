import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { createStore } from 'redux';

const createReducer = (initialState, actionHandlers) => {
  return (state = initialState, action) => {
    if (actionHandlers.hasOwnProperty(action.type)) {
      return actionHandlers[action.type](state, action);
    } else {
      return state;
    }
  };
};

const actionHandlers = {
  TOGGLE_NIGHTMODE: (state, action) => {
    return { ...state, nightmode: !state.nightmode };
  }
};
const reducers = createReducer({}, actionHandlers);

const store = createStore(reducers);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
