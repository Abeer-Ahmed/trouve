import { REPORT_FORM_UPDATE,
         REPORT_FORM_CREATE
} from '../actions/types';

const INITIAL_STATE = {
  description: '',
  category: '',
  location: '',
  date: '',
  image: null,
  secretQuestion: '',
  isTrouve: false
};

export default (state = INITIAL_STATE, action) => {
  // console.log(action);
  switch (action.type) {
    case REPORT_FORM_UPDATE:
      // action = { prop: 'property name', value: 'user input value'}
      // square braces are for key interpolation
      return { ...state, [action.payload.prop]: action.payload.value };
    case REPORT_FORM_CREATE:
      return INITIAL_STATE;
    default:
      return state;
  }
};
