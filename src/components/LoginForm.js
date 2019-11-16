import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text } from 'react-native';

import { Card, CardSection, Spinner, Input, Button } from './common';
import { emailChanged, passwordChanged, loginUser } from '../actions';

class LoginForm extends Component {

  onEmailChange(text){
    this.props.emailChanged(text);
  }

  onPasswordChange(text){
    this.props.passwordChanged(text);
  }

  onButtonPress(){
    const { email, password } = this.props;
    console.log(email, password);

    this.props.loginUser({ email, password });
  }

  renderError(){
    if(this.props.error){
      return (
        <View style={{ backgroundColor: '#fff' }}>
          <Text style={ styles.errorTextStyle }>
            {this.props.error}
          </Text>
        </View>
      );
    }
  }

  renderLoginButton(){
    if(this.props.loading){
      return (
        <Spinner size='large'/>
      );
    } else {
      return (
        <Button onPress={ this.onButtonPress.bind(this) } >
          Login
        </Button>
      );
    }
  }

  render(){
    return (
        <Card>
          <CardSection>
            <Input
              label='E-mail'
              placeholder='e.g. kevin@gmail.com'
              onChangeText={ this.onEmailChange.bind(this) }
              value={ this.props.email }
            />
          </CardSection> 

          <CardSection>
            <Input
              secureTextEntry
              label='Password'
              placeholder='password'
              onChangeText={ this.onPasswordChange.bind(this) }
              value={ this.props.password }
            />
          </CardSection>

          { this.renderError() }

          <CardSection>
            { this.renderLoginButton() }
          </CardSection>
        </Card>
    );
  }
}

const styles = {
  errorTextStyle: {
    color: 'red',
    fontSize: 20,
    alignSelf: 'center'
  }
};

const mapStateToProps = (state) => {
  const { email, password, error, loading } = state.auth;

  return {
    email,
    password,
    error,
    loading
  }
};

export default connect(mapStateToProps, {
  emailChanged,
  passwordChanged,
  loginUser
})(LoginForm);
