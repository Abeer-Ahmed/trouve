import firebase from 'firebase';

import { ITEMS_FETCH_SUCCESS,
         FOUND_ITEMS_FETCH_SUCCESS,
         LOST_ITEMS_FETCH_SUCCESS,
         CLAIM_FORM_SUBMIT_SUCCESS
} from './types';

export const userItemsFetch = () => {
  const { currentUser } = firebase.auth();

  return (dispatch) => {
    firebase.database().ref().child('items').orderByChild('uid').equalTo(`${currentUser.uid}`)
      .on('value', snapshot =>{ // snapshot is description and snapshot.val() is the actual data
        dispatch({ type: ITEMS_FETCH_SUCCESS, payload: snapshot.val() });
      });
  };
};

export const generalItemsFetch = ({ isFound }) => {
  console.log('api called');
  return (dispatch) => {
    firebase.database().ref().child('items').orderByChild('isFound').equalTo(isFound)
      .on('value', snapshot => {
        // console.log('at ur service maam', snapshot.val());
        if(isFound){
          dispatch({ type: FOUND_ITEMS_FETCH_SUCCESS, payload: snapshot.val() });
        } else {
          dispatch({ type: LOST_ITEMS_FETCH_SUCCESS, payload: snapshot.val() });
        }
      });
  };
};

// not an action creator: to set user as a claimer for the item and notify the finder with this claim
export const itemClaim = ({ answer, image, foundItems }) => {
  return (dispatch) => {
    const { currentUser } = firebase.auth();
    const uid = currentUser.uid;
    // console.log(uid);
    firebase.database().ref().child(`users/${ uid }`)
      .once('value', user => {
        firebase.database().ref().child('items').orderByChild('image').equalTo(image)
          .once('value', snapshot => {
            const key = Object.keys(snapshot.val())[0];
            const finderId = snapshot.val()[key]["uid"];
            const claimerName = user.val()["firstName"] + ' ' + user.val()["lastName"];
            const claimerPhone = user.val()["phone"];
            const itemDecription = snapshot.val()[key]["description"];
            updates = {};
            console.log(`${ claimerName } claims the ${ itemDecription } you found, and their answer to your secret question is: ${ answer }. If you think they are the owner, please contact them on ${ claimerPhone }`);
            updates[`items/${ key }/claimers/${ uid }`] = true;
            // console.log(finderId);
            updates[`users/${ finderId }/notifications/${ finderId }`] = `${ claimerName } claims the ${ itemDecription } you found, and his answer to your secret question is: ${ answer }. If you think they are the owner, please contact them on ${ claimerPhone }`;
            firebase.database().ref().update(updates)
              .then(() => {
                console.log('yessss claim');
                foundItems[key].claimers = {};
                foundItems[key].claimers[uid] = true;
                // console.log(foundItems[key]);
                let foundItemsClone = { ...foundItems };
                dispatch({ type: CLAIM_FORM_SUBMIT_SUCCESS, payload: foundItemsClone });
              })
              .catch((error) => {
                console.log('noooo claim');
                console.log(error);
              });
          });
      });
  };
};

// not an action creator
export const markAsTrouve = ({ id }) => {
  updates = {};
  updates[`items/${ id }/isTrouve`] = true;

  firebase.database().ref().update(updates)
    .then(() => {
      console.log('item marked as trouvé');
    })
    .catch((error) => {
      console.log('item was not marked as trouvé');
      console.log(error);
    });

  // ANOTHER WAY
  // firebase.database().ref().child(`items/${ id }`).update({
  //   isTrouve: "true"
  // })
  // .then(() => console.log('found'))
  // .catch((err) => console.log(err))
};
