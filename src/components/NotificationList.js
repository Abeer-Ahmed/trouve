import React, { Component } from 'react';
import { Text, View, SectionList } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';

import { notificationsFetch } from '../actions';
import { Card, CardSection } from './common';

class NotificationList extends Component {
  componentWillMount(){
    this.props.notificationsFetch();
  }

  render(){
    // console.log('huh', this.props.notificationsList);
    // return <View><Text>huh?</Text></View>
    return (
      <View style={{ flex: 1 }}>

        <SectionList
          renderItem={({item, index, section}) => {
            return (
              <CardSection>
                <Text style={{ fontSize: 16, padding: 5 }}>
                  { item }
                </Text>
              </CardSection>
            );
          }}
          renderSectionHeader={({section: {title}}) => (
            <Text style={{fontWeight: 'bold', paddingLeft: 5, fontSize: 18}}>{title}</Text>
          )}
          sections={[
            { title: 'Recently...', data: this.props.notificationsList }
          ]}
          keyExtractor={(item, index) => item + index}
        />

      </View>
    );
  }
}

const mapStateToProps = (state) => {
  // console.log('eh', state.notifications);
  // mapping the obj of objs to an array
  // let notificationsList = [];
  // let notificationsList = _.map(state.notifications, (val, key) => {
  //   console.log('val: ', val, ' key: ', key);
  //   return { ...val, key };
  // });
  let { notificationsList } = state.notifications;
  // console.log('map: ', map);
  let array = [];

  for (var key in notificationsList) {
    if (notificationsList.hasOwnProperty(key)) {
      // console.log('pls', notificationsList[key]);
      array.push(notificationsList[key]);
    }
  }

  notificationsList = array;
  // console.log('tani', notificationsList);

  return { notificationsList };
};

export default connect(mapStateToProps, { notificationsFetch })(NotificationList);


// Object {
//  "9UqcIzfdFoZeqoK07RhHmaRE6Ro2": "Jack Mac claims the Toaster you found, and his answer to your secret question is: Green. If you think they are the owner, please contact them on undefined",
//  "Ixgci5L0H0M1sGSmLWyqqeoI1Wp2": "Danny Wilson claims the Toaster you found, and his answer to your secret question is: Me me. If you think they are the owner, please contact them on 202-555-0192",
//  "key": "notifications",
//  "rzo8BglcIbc6iNMyc9u6a2MVk7D2": "Jonas Williams claims the Toaster you found, and his answer to your secret question is: Fuchsia. If you think they are the owner, please contact them on 202-555-0111"
// }
