import { createStore } from 'redux';
import reducer from './reducers';

/*
  grabs all the reducer from store/reducers.js and creates a store with it. A store manages state.
 */
const store = createStore(
   reducer, /* preloadedState, */
   window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


export default store;
