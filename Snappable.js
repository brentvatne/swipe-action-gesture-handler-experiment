import React, { Component } from 'react';
import { Animated } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const USE_NATIVE_DRIVER = false;

export default class Snappable extends Component {
  constructor(props) {
    super(props);
    this._dragX = new Animated.Value(0);
    this._transX = this._dragX.interpolate({ inputRange: [-100, -50, 0, 50, 100], outputRange: [-30, -10, 0, 10, 30]})
    this._onGestureEvent = Animated.event(
       [{ nativeEvent: { translationX: this._dragX }}],
       { useNativeDriver: USE_NATIVE_DRIVER },
    )
  }
  _onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      Animated.spring(this._dragX, {
        velocity: event.nativeEvent.velocityX,
        tension: 10,
        friction: 2,
        toValue: 0,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    }
  }
  render() {
    const { children } = this.props;
    return (
      <PanGestureHandler
          {...this.props}
          minDist={100}
          onGestureEvent={this._onGestureEvent}
          onHandlerStateChange={this._onHandlerStateChange}
      >
        <Animated.View style={{transform: [{ translateX: this._transX }]}}>
          {children}
        </Animated.View>
      </PanGestureHandler>
    );
  }
}
