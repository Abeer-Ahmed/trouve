import React, { Component } from 'react';
import { Text, View, Image } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import firebase from 'firebase';
import ReduxThunk from 'redux-thunk';
import { Asset, AppLoading, SplashScreen } from 'expo';

import reducers from './src/reducers';
import LoginForm from './src/components/LoginForm';
import Router from './src/Router';

// codejamninja @ https://github.com/infinitered/reactotron/issues/432
import { YellowBox } from 'react-native';
import _ from 'lodash';
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    // _console.warn(message);
  }
};
//////////////////////////////////////////////////////////////////////

class App extends Component {

  state = {
    isSplashReady: false,
    isAppReady: false
  };

  componentWillMount(){
    // Initialize Firebase
    const config = {
      apiKey: "AIzaSyCrzhVw45LdKZPaFyhzonSe7KhNQDbC2-M",
      authDomain: "trouve-23fa0.firebaseapp.com",
      databaseURL: "https://trouve-23fa0.firebaseio.com",
      projectId: "trouve-23fa0",
      storageBucket: "trouve-23fa0.appspot.com",
      messagingSenderId: "280932971059"
    };
    firebase.initializeApp(config);
  }

  componentDidMount(){
    setTimeout(() => {
      this.setState({ isAppReady: true });
    }, 1500);
  }

  _cacheSplashResourcesAsync = async () => {
    const gif = require('./assets/splash.png');
    return Asset.fromModule(gif).downloadAsync()
  }

  _cacheResourcesAsync = async () => {
    SplashScreen.hide();
    const images = [
      require('./assets/splash.png')
    ];

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });

    await Promise.all(cacheImages);
    // this.setState({ isAppReady: true });
  }

  render() {
    // splash screen
    if (!this.state.isSplashReady) {
      return (
        <AppLoading
          startAsync={this._cacheSplashResourcesAsync}
          onFinish={() => this.setState({ isSplashReady: true })}
          onError={console.warn}
          autoHideSplash={false}
        />
      );
    }

    if (!this.state.isAppReady) {
      return (
          <Image
            style={{ flex: 1, width: 200, alignSelf: 'center', marginLeft: 20, marginBottom: 200 }}
            resizeMode='contain'
            source={require('./assets/splash.png')}
            onLoad={this._cacheResourcesAsync}
          />
      );
    }

    // syntax: createStore(reducer, initialState, storeEnhancer)
    const store = createStore(reducers, {}, applyMiddleware(ReduxThunk));

    return (
      <Provider store={ store }>
        <Router/>
      </Provider>
    );
  }
}

export default App;
