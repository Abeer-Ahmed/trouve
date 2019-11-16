import { combineReducers } from 'redux';

import AuthReducer from './AuthReducer';
import ReportReducer from './ReportReducer';
import ItemReducer from './ItemReducer';
import NotificationReducer from './NotificationReducer';

export default combineReducers({
  auth: AuthReducer,
  report: ReportReducer,
  items: ItemReducer,
  notifications: NotificationReducer
});
