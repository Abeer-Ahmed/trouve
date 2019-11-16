import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export const Button = ( props ) => {
  return (
    <TouchableOpacity
     onPress={ props.onPress }
     style={ props.disabled? styles.disabledButtonStyle : styles.buttonStyle }
     disabled={ props.disabled }
    >
      <Text style={ props.disabled? styles.disabledTextStyle : styles.textStyle }>{ props.children }</Text>
    </TouchableOpacity>
  );
};

const styles = {
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#007aff',
    marginLeft: 5,
    marginRight: 5
  },
  disabledButtonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#cccccc',
    marginLeft: 5,
    marginRight: 5
  },
  textStyle: {
    alignSelf: 'center',
    color: '#007aff',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  disabledTextStyle: {
    alignSelf: 'center',
    color: '#cccccc',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
}
