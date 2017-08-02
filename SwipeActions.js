import React from 'react';
import { View } from 'react-native';

export default class SwipeActions extends React.Component {
  render() {
    return (
      <View>
        {this.props.children}
      </View>
    );
  }
}
