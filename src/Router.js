import React from 'react';
import { Router, Scene } from 'react-native-router-flux';
import { Text, Image } from 'react-native';

import LoginForm from './components/LoginForm';
import ItemList from './components/ItemList';
import GeneralItemList from './components/GeneralItemList';
import ReportForm from './components/ReportForm';
import ClaimForm from './components/ClaimForm';
import NotificationList from './components/NotificationList';

const RouterComponent = () => {
  return (
    <Router>
      <Scene key='root' hideNavBar titleStyle={{ flex: 1, textAlign: 'center' }}>

        { /* AUTH */ }
        <Scene key='auth' tabBarStyle={{ alignItems: 'center' }}>
          <Scene key='login' title='Login' component={ LoginForm } initial/>
        </Scene>

        <Scene key='main'
               tabs
               tabBarStyle={{ alignItems: 'center' }}
               tabBarSelectedItemStyle={{ color: 'red' }}
        >
          <Scene key='lostItems' component={ () => <GeneralItemList isFound={false}/> } title='Lost Items' icon={()=>(<Image
            source={{ uri: 'https://png.icons8.com/metro/1600/lost-and-found.png' }}
            style={{ width: 30, height: 30 }}
          />)} iconName="md-person" />
          <Scene key='itemList' component={ ItemList } title='My Items' icon={()=>(<Image
            source={{ uri: 'https://img.icons8.com/ios-glyphs/1600/lift-cart-here.png' }}
            style={{ width: 30, height: 30 }}
          />)} iconName="md-person" initial/>
          <Scene key='foundItems' component={ () => <GeneralItemList isFound={true}/> } title='Found Items' icon={()=>(<Image
            source={{ uri: 'https://png.icons8.com/ios/1600/handle-with-care-filled.png' }}
            style={{ width: 30, height: 30 }}
          />)} iconName="md-person" />
          <Scene key='notifications' component={ NotificationList } title='Notifications' icon={()=>(<Image
            source={{ uri: 'https://img.icons8.com/ios/1600/appointment-reminders-filled.png' }}
            style={{ width: 30, height: 30 }}
          />)}

          />
        </Scene>

        <Scene key='lostItemReportForm' tabBarStyle={{ alignItems: 'center' }}>
          <Scene key='reportLostItem' title='Report Lost Item' component={ ReportForm }/>
        </Scene>

        <Scene key='foundItemReportForm' tabBarStyle={{ alignItems: 'center' }}>
          <Scene key='reportFoundItem' title='Report Found Item' component={ ReportForm }/>
        </Scene>

        <Scene key='claimItemReportForm' tabBarStyle={{ alignItems: 'center' }}>
          <Scene key='claimFoundItem' title='Claim Item' component={ ClaimForm }/>
        </Scene>

      </Scene>
    </Router>
  );
};

export default RouterComponent;
