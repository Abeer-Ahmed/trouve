import { NOTIFICATIONS_FETCH_SUCCESS } from '../actions/types';

const INITIAL_STATE = {
  notificationsList: null
};

export default (state = INITIAL_STATE, action) => {
  console.log('ici');
  switch (action.type) {
    case NOTIFICATIONS_FETCH_SUCCESS:
    // console.log('red', { ...state, notifications: action.payload });
      return { ...state, notificationsList: action.payload };
    default:
      return state;
  }
};
