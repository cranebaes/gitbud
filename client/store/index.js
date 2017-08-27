/*
First we load all the reducer files.  In our case there is only one.
We combine these reducers into one single "file", but this is unnecessary
for this project's size.
*/

import * as storage from 'redux-storage';
import reducers from './reducers';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import createEngine from 'redux-storage-engine-localstorage';

const reducer = storage.reducer(combineReducers(reducers));
const engine = createEngine('my-save-key');

const middleware = storage.createMiddleware(engine);
const createStoreWithMiddleware = applyMiddleware(middleware)(createStore);
/*
   grabs all the reducer from store/reducers.js and creates a store with it. A store manages state.
*/
const store = createStoreWithMiddleware(
  reducers, /* preloadedState, */
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const load = storage.createLoader(engine);
load(store)
  .then((newState) => console.log('Loaded state:', newState))
  .catch(() => console.log('Failed to load previous state'));

export default store;
