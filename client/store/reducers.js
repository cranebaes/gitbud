/*
  Reducers - decides how the change a state after receiving an action, and thus can be considered the entrance of a state change. A reducer is comprised of functions and it changes states by taking an action as argument, in which it then returns a new state.

  The actions get sent to App component and other parent component where they can be pass through as props.
*/

import { combineReducers } from 'redux';

// does nothing - implemented to test connecting Redux to React
const changeString = (state = 'some message', action) => action.type === 'CHANGE_STRING' ? action.text : state;

/*
  first condition is the initial state
  inside ProjectDetails component, we dispatch 'addUsers' to display users at initial load
  inside UserDetails component, we dispatch 'dispatchPairing' when user select a partner to pair with
*/

const users = (state, action) => {
  // console.log('users state: ', state);
  // console.log('users action: ', action);
  if (state === undefined) {
    return [];
  } else if (action.type === 'USERS_ADD') {
    console.log('ADDING USERS', action);
    return action.users;
  } else if (action.type === 'CHANGE_USER_PAIRING') {
    return state.map((user) => {
      if (user.id === action.userId) {
        const object =  Object.assign({}, user, { paired: user.paired.concat(action.projectId) });
        return object;
      }
      return user;
    });
  } else if (action.type === 'REDUX_STORAGE_LOAD') {
     console.log('Users load:', action.payload.users);
     return action.payload.users;
  } else if (action.type === 'APP_LOGOUT') {
    //state = [];
  }
  return state;
};

const pairedUsers = (state, action) => {
  // console.log('pairedUsers state: ', state);
  // console.log('pairedUsers action: ', action);
  if (state === undefined) {
    return [];
  } else if (action.type === 'ADD_PAIRING') {
    return state.concat([{ name: action.name, language: action.language, experience: action.experience, id: action.id }]);
    // const object = Object.assign({}, )
    // return state.concat(action.)
  } else if (action.type === 'REDUX_STORAGE_LOAD') {
     console.log('pairedUsers load:', action.payload.pairedUsers);
     return action.payload.pairedUsers;
  } else if (action.type === 'APP_LOGOUT') {
    state = [];
  }
  return state;
}

/*
  first condition is the initial state
  inside App component we dispatch 'LIST_PROJECTS' to display list of projects
  inside ProjectDetails component we dispatch 'CHANGE_PROJECT_INTEREST' when user selects 'they are interested'
  inside UserDetails component we dispatch 'CHANGE_USER' when user select 'they want to pair' button
*/
const projects = (state, action) => {
  // console.log('projects state: ', state);
  // console.log('projects action: ', action);
  if (state === undefined) {
    return [];
  } else if (action.type === 'LIST_PROJECTS') {
    return action.projects;
  } else if (action.type === 'CHANGE_PROJECT_INTEREST') {
    return state.map((project) => {
      if (project.id === action.projectId) {
        return Object.assign({}, project, { interested: action.value });
      }
      return project;
    });
  } else if (action.type === 'CHANGE_USER_PAIRING') {
    return state.map((project) => {
      if (project.id === action.projectId) {
        return Object.assign({}, project, { paired: project.paired.concat(action.userId) });
      }
      return project;
    });
  } else if (action.type === 'REDUX_STORAGE_LOAD') {
     console.log('Project load:', action.payload.projects);
     return action.payload.projects;
  } else if (action.type === 'APP_LOGOUT') {
    //state = [];
  }

  return state;
};

/*
  first condition is the initial state
  inside UserDetails component we dispatch 'MESSAGE_SEND' when user sends a message to pairing user
  inside UserDetails component we dispatch 'MESSAGE_LOAD' when user refreshes page to view new incoming messages

  THINGS TO FIX: change messaging features to appear when sent
  SUGGESTION: implement socket.io
*/
const messages = (state, action) => {
  // console.log('messages state: ', state);
  // console.log('messages action: ', action);
  if (state === undefined) {
    return {};
  } else if (action.type === 'MESSAGE_SEND') {
    const newMessages = {};
    newMessages[action.userId] = state[action.userId] ? [action.message].concat(state[action.userId]) : [action.message];
    return Object.assign({}, state, newMessages);
  } else if (action.type === 'MESSAGES_LOAD') {
    return action.messages;
  } else if (action.type === 'REDUX_STORAGE_LOAD') {
     console.log('Messages load', action.payload.messages);
     return action.payload.messages;
  } else if (action.type === 'APP_LOGOUT') {
    state = {};
  }
  return state;
};

/*
  first condition is the initial state
  inside Project component, we dispatch 'PROGRESS_LOAD_ITEMS' to load the user's latest progress on project
  inside Project component, we dispatch 'PROGRESS_CHANGE_ITEM'
*/
const projectProgress = (state, action) => {
  if (state === undefined) {
    return {};
  } else if (action.type === 'PROGRESS_LOAD_ITEMS') {
    return action.progress;
  } else if (action.type === 'PROGRESS_CHANGE_ITEM') {
    const newProgress = {};
    const stateProject = state[action.projectId];
    newProgress[action.projectId] = stateProject.slice();
    const updatedProject = newProgress[action.projectId];
    updatedProject[action.itemIndex] = Object.assign({}, stateProject[action.itemIndex]);
    updatedProject[action.itemIndex].complete = !updatedProject[action.itemIndex].complete;
    return newProgress;
  } else if (action.type === 'REDUX_STORAGE_LOAD') {
     console.log('Project progress load', action.payload.projectProgress);
     return action.payload.projectProgress;
  } else if (action.type === 'APP_LOGOUT') {
    state = {};
  }
  return state;
};

const logout = (state, action) => {
  console.log('logout action', action);
  if (state === undefined) {
    return [];
  } else if (action.type === 'APP_LOGOUT') {
    console.log('Reducer: APP_LOGOUT');
    state = [];
  }
  return state;
}

/*
  hands off state/dispatch to React components with mapStateToProps and mapDispatchToProps
  combineReducers function creates a single object that contains all the reducers
  keys are the names of properties on the state and the value is the reducer function itself.
  reducers are scoped to that property (e.g. the users reducer only receives the users property
  of the state and only need return the users property). This massively simplifies the reducers'
  code--they don't have to worry about every other part of the state.
  what we are doing here is using ES6 destructuring, so key and value are named the same.
*/
export default combineReducers({
  message: changeString,
  users,
  projects,
  messages,
  pairedUsers,
  projectProgress,
  logout
});
