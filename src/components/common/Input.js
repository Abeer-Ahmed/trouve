import React, { Component } from 'react';
import { TextInput, View, Text} from 'react-native';


const Input = ({ label, value, onChangeText, placeholder, secureTextEntry, large, multiline, numberOfLines }) => {

  const {inputStyle, labelStyle, containerStyle} = styles;

  var cStyle = Object.assign({}, containerStyle);

  if(large)
    cStyle = {
      height: 100,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center'
    };

  return (
    <View style={ cStyle }>
      <Text style={ labelStyle }> { label } </Text>
      <TextInput
        autoCorrect={ false }
        secureTextEntry={ secureTextEntry }
        style={ inputStyle }
        value={ value }
        onChangeText={ onChangeText }
        placeholder={ placeholder }
        underlineColorAndroid='transparent'
        multiline={ multiline }
        numberOfLines={ numberOfLines }
      />
    </View>
  );
};



const styles = {
  inputStyle: {
    color: '#000',
    paddingRight: 5,
    paddingLeft: 5,
    fontSize: 18,
    lineHeight: 23,
    flex: 2
  },
  labelStyle: {
    fontSize: 18,
    paddingLeft: 20,
    flex: 1
  },
  containerStyle: {
    height: 40,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  }
};


export { Input };
