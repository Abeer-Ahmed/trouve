import {
  ITEMS_FETCH_SUCCESS,
  LOST_ITEMS_FETCH_SUCCESS,
  FOUND_ITEMS_FETCH_SUCCESS,
  CLAIM_FORM_SUBMIT_SUCCESS
} from '../actions/types';

const INITIAL_STATE = {
  myItems: null,
  lostItems: null,
  foundItems: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ITEMS_FETCH_SUCCESS:
      // console.log(action); // list of items
      return { ...state, myItems: action.payload };
    case LOST_ITEMS_FETCH_SUCCESS:
      return { ...state, lostItems: action.payload };
    case FOUND_ITEMS_FETCH_SUCCESS:
      return { ...state, foundItems: action.payload };
    case CLAIM_FORM_SUBMIT_SUCCESS:
      return { ...state, foundItems: action.payload };
    default:
      return state;
  }
};
