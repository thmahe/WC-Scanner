/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View} from 'react-native';
import AppNavigation from "./react/screen/navigation/AppNavigation";
import {Provider} from "react-redux";
import Store from "./react/Store/configureStore";
import websocketUtil from "./react/utils/websocket";

type Props = {};
export default class App extends Component<Props> {
  render() {
      let ws = new websocketUtil(Store);
      ws.get_connection_status();
    return (
        <Provider store={Store}>
          <AppNavigation screenProps={{ws: ws}}/>
        </Provider>
    );
  }
}


