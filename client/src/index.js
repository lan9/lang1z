import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { loadState, saveState } from './localStorage';

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
    // eslint-disable-line no-unused-vars
    return { ...state, nightmode: action.payload.mode };
  }
};
const reducers = createReducer({}, actionHandlers);

const store = createStore(reducers, loadState());
store.subscribe(() => saveState(store.getState()));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
