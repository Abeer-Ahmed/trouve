import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';

import { REPORT_FORM_UPDATE,
         REPORT_FORM_CREATE
} from './types';

export const reportUpdate = ({ prop, value }) => {
  return {
    type: REPORT_FORM_UPDATE,
    payload: { prop, value }
  };
};

export const reportCreate = ({ description, category, location, date, image, isFound, secretQuestion, isTrouve }) => {
  const { currentUser } = firebase.auth();
  const uid = currentUser.uid;

  return (dispatch) => {
    // we backtick to interpolate.. c'mon es6 :"D
    // firebase.database().ref(`/users/${currentUser.uid}/items`)
    //   .push({ description, category, location, date, image, isFound })
    //   .then(() => {
    //     dispatch({ type: REPORT_FORM_CREATE}); // to reset the form
    //     Actions.pop();
    //   });

    const newItemKey = firebase.database().ref().child('items').push().key;
    const id = newItemKey;

    const updates = {};
    updates[`/users/${currentUser.uid}/items/${newItemKey}`] = true;

    firebase.database().ref(`users/${uid}`)
      .once('value', userSnap => {
        // console.log('userrrrrrrrrrrrrrr', userSnap.val().firstName);
        const { firstName, lastName, pictureURL, phone } = userSnap.val();

        updates[`/items/${newItemKey}`] = { id, uid, firstName, lastName, pictureURL, phone, description, category, location, date, image, isFound, secretQuestion, isTrouve };
        firebase.database().ref().update(updates)
          .then(() => {
            dispatch({ type: REPORT_FORM_CREATE }); // to reset the form
            Actions.pop();
          });
      });


  };

};
