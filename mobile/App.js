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

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
        <AppNavigation/>
    );
  }
}


