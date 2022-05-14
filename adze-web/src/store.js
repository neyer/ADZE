import { configureStore } from '@reduxjs/toolkit'

import manifestReducer from './state/manifestSlice.js'
import credentialsReducer from './state/credentialsSlice.js'

const localStorageMiddleware = ({ getState }) => {
  return next => action => {
    const result = next(action);
    localStorage.setItem('applicationState', JSON.stringify(getState()));
    return result;
  };
};

const reHydrateStore = () => {
  if (localStorage.getItem('applicationState') !== null) {
    return JSON.parse(localStorage.getItem('applicationState')); // re-hydrate the store
  };
}


export default configureStore({
  reducer: {
    manifest: manifestReducer,
    credentials: credentialsReducer,
  },
  preloadedState: reHydrateStore(),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(localStorageMiddleware),
})

