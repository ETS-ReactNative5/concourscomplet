import React, {Component} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {ToastProvider} from 'react-native-toast-notifications';

import './app/assets/IMLocalize';
import StackNav from './app/screens/StackNav.js';

export default class App extends Component {
  render() {
    return (
      <ToastProvider>
        <NavigationContainer>
          <StackNav />
        </NavigationContainer>
      </ToastProvider>
    );
  }
}
