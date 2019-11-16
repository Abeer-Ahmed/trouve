import React, { Component } from 'react' ;
import { View, Text, SectionList, TouchableOpacity, TextInput , ScrollView } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import _ from 'lodash';

import { Button, Spinner } from './common';
import { generalItemsFetch } from '../actions';
import Item from './Item';

class GeneralItemList extends Component {
  state = {
    query: '',
    isSearchingMode: false,
    queryItems: []
  };

  componentWillMount(){
    // console.log('found?', this.props.isFound); this is for determining the lost or found items screen
    this.props.generalItemsFetch({ isFound: this.props.isFound });
  }

  handleSearch(text){
    const formatQuery = text.toLowerCase();
    const data = _.filter(this.props.items, item => {
      return contains({ item }, formatQuery);
    });
    this.setState({ query: text, queryItems: data });
  }

  renderList(data){
    if(this.props.items.length > 0){  // if app has no data, we'll be showing spinner forever lol
      return (
        <View style={{ flex: 1 }}>
          <TextInput
            style={ styles.searchBarStyle }
            value={ this.state.query }
            onChangeText={ this.handleSearch.bind(this) }
            placeholder={ 'search by description, category or location...' }
            underlineColorAndroid='transparent'
          />
          <SectionList
          renderItem={({item, index, section}) => {
            // prepare the props to be sent to <Item/>
            let props = {};
            props.isMyItem = false;
            props.item = item;
            return <Item {...props}/>;
          }}
          sections={[
            { data: data }
          ]}
          keyExtractor={(item, index) => item + index}
          >
          </SectionList>

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

  render() {
    // console.log('propppppppppppppppppppppppppps', this.props.items);

    // determing which list to show
    let data = [];
    if(this.state.query === '')
      data = this.props.items;
    else
      data = this.state.queryItems;

    return (
      <View style={ styles.container }>

      {/*
        <ScrollView>
          {data.map((item, i) => { // Mo says this index will cause us problems on deletion of items
            let props = {};
                props.isMyItem = false;
                props.item = item;
                // console.log('rendering');
                return <Item key={i} {...props}/>;
          })}
        </ScrollView>
        */}

      { this.renderList(data) }

      </View>
    );
  }
}

const contains = ({ item }, query) => {
  var { description, category, location, date } = item;
  description = description.toLowerCase();
  category = category.toLowerCase();
  location = location.toLowerCase();
  date = date.toLowerCase();
  if(description.includes(query) || category.includes(query) || location.includes(query) || date.includes(query))
    return true;
  return false;
};

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
  },
  searchBarStyle: {
    borderRadius: 5,
    backgroundColor: '#fff',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    margin: 7,
    borderColor: '#cccccc',
    borderWidth: 1
  }
};

const mapStateToProps = (state, ownProps) => {
  var stateObj = null;
  if(ownProps.isFound){
    stateObj = state.items.foundItems;
  } else {
    stateObj = state.items.lostItems;
  }
  const items = _.map(stateObj, (val, key) => {
    return { ...val, key };
  });

  return { items };
};

export default connect(mapStateToProps, { generalItemsFetch })(GeneralItemList);
