import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const Header = (props) => {

  const { textStyle, viewStyle } = styles;

  return (
    <View style={ viewStyle }>
      <Text style={ textStyle }>{ props.headerText }</Text>
    </View>
  );
};


const styles = {
  viewStyle: {
    backgroundColor: '#F8F8F8',
    justifyContent: 'center',
    alignItems: 'center',
    height: 70,
    paddingTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    elevation: 2,
    position: 'relative'
  },
  textStyle: {
    fontSize: 20
  }
};
