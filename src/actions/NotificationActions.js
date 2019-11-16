import firebase from 'firebase';

import { NOTIFICATIONS_FETCH_SUCCESS } from './types';

export const notificationsFetch = () => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    firebase.database().ref(`users/${ currentUser.uid }`).child('notifications')
      .on('value', snapshot => {
        dispatch({ type: NOTIFICATIONS_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};
