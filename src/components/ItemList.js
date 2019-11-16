import React, { Component } from 'react';
import { View, Text, FlatList, TouchableOpacity, SectionList } from 'react-native';
import { FloatingAction } from 'react-native-floating-action';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Spinner } from './common';
import { userItemsFetch } from '../actions';
import Item from './Item';

class ItemList extends Component {
  componentWillMount(){
    this.props.userItemsFetch();
  }

  // componentWillReceiveProps(nextProps){
  //   // nextProps are the next set of props the component will render
  //   // this.props is the old one
  //   // this.state.items = this
  //   console.log('receiving: ', nextProps);
  // }

  onButtonPress(name){
    console.log('You clicked me!', name);
    switch (name) {
      case 'lostBtn':
        Actions.lostItemReportForm({ isFound: false });
        break;
      case 'foundBtn':
        Actions.foundItemReportForm({ isFound: true });
        break;
      default:
        break;
    }
  }

  renderList(){
    if(this.props.lostItems.length > 0 || this.props.foundItems.length > 0){ // this.props.lostItems.length > 0 || this.props.foundItems.length > 0
      const actions = [{
        text: 'Report Lost Item',
        icon: require('../images/plus.png'),
        name: 'lostBtn',
        position: 1
      }, {
        text: 'Report Found Item',
        icon: require('../images/plus.png'),
        name: 'foundBtn',
        position: 2
      }];
      const { sectionTitleStyle } = styles;

      return (
        <View style={{ flex: 1 }}>
          <SectionList
            renderItem={({item, index, section}) => {
              // prepare the props to be sent to <Item/>
              let props = {};
              props.isMyItem = true;
              props.item = item;
              return <Item {...props}/>;
            }}
            renderSectionHeader={({section: {title}}) => (
              <Text style={{fontWeight: 'bold', paddingLeft: 5, fontSize: 18}}>{title}</Text>
            )}
            sections={[
              { title: 'Items You Lost', data: this.props.lostItems },
              { title: 'Items You Found', data: this.props.foundItems }
            ]}
            keyExtractor={(item, index) => item + index}
          />


           <FloatingAction
              actions={actions}
              onPressItem={ this.onButtonPress.bind(this) }
          />
        </View>
      );
    } else {
      return (
        <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
          <Spinner/>
        </View>
      );
    }
  }

  render(){
    // console.log('currently in ', Actions.currentScene);

    return (
      <View style={ styles.container }>

      { this.renderList() }

      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1
  },
  btn: {
    position: 'absolute',
    width: 50,
    height: 50,
    backgroundColor: '#1253bc',
    borderRadius: 30,
    bottom: 10,
    right: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  plus: {
    color: '#fff',
    fontSize: 25
  }
};

{
// <TouchableOpacity style={ styles.btn } onPress={ this.onButtonPress.bind(this) }>
//   <Text style={ styles.plus }>+</Text>
// </TouchableOpacity>
}

const mapStateToProps = (state) => {
  // mapping the obj of objs to an array
  const items = _.map(state.items.myItems, (val, key) => {
    return { ...val, key };
  });

  const foundItems = [],
        lostItems = [];
  items.forEach((item) => {
    if(item.isFound){
      foundItems.push(item);
    } else {
      lostItems.push(item);
    }
  });
  // console.log(foundItems);

  return { foundItems, lostItems };
};

export default connect(mapStateToProps, { userItemsFetch })(ItemList);
