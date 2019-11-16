import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';

import { Card, CardSection, Input, Button } from './common';
import { itemClaim } from '../actions';

class ClaimForm extends Component {
  state = {
    answer: '',
    invalidData: true
  };

  componentWillUpdate(nextProps, nextState){
    nextState.invalidData = !(nextState.answer);
  }

  onButtonPress(){
    // console.log('mo?', this.props.state.items.foundItems);
    this.props.itemClaim({ answer: this.state.answer, image: this.props.image,  foundItems: this.props.state.items.foundItems });
    Actions.foundItems({ isClaimedItem: true }); // what was I thinking? :/
  }

  render(){
    return (
      <Card>
        <View style={ styles.questionContainerStyle }>
          <Text style={ styles.questionStyle }>
            { this.props.secretQuestion }
          </Text>
        </View>
        <CardSection>
          <Input
            label='Answer'
            placeholder='provide your best answer to the posed question'
            value={ this.state.answer }
            onChangeText={ (text) => { this.setState({ answer: text }) } }
            large
            multiline={ true }
            numberOfLines={ 4 }
          />
        </CardSection>
        <CardSection>
          <Button onPress={ () => Actions.pop() }>
            Cancel
          </Button>
          <Button disabled={ this.state.invalidData } onPress={ this.onButtonPress.bind(this) }>
            Submit
          </Button>
        </CardSection>
      </Card>
    );
  }
}

const styles = {
  questionStyle: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    padding: 5,
    lineHeight: 30,
    marginTop: 5
  },
  questionContainerStyle: {
    backgroundColor: 'white',
    height: 60,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export default connect((state)=> ({state}), { itemClaim } )(ClaimForm);
