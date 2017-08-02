import React from 'react';
import { Animated, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

export default class SwipeActions extends React.Component {
  state = {
    _translateX: new Animated.Value(0),
  };

  _onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: this.state._translateX } }]
    // { useNativeDriver: true }
  );

  componentWillMount() {
    this.state._translateX.addListener(animatedValue => {
      // console.log('----------');
      // console.log({animatedValue});
    });
  }

  render() {
    const translateX = this.state._translateX;

    return (
      <View>
        <PanGestureHandler
          id={this.props.gestureId}
          minDist={100.0}
          shouldCancelWhenOutside={true}
          onGestureEvent={this._onGestureEvent}
          onHandlerStateChange={this._onHandlerStateChange}>
          <Animated.View
            style={{ transform: [{ translateX: translateX }] }}
            onLayout={this._onLayoutChildren}>
            {this.props.children}
          </Animated.View>
        </PanGestureHandler>

        {this._renderButtons()}
      </View>
    );
  }

  _onHandlerStateChange = event => {
    if (event.nativeEvent.state === State.BEGAN) {
      console.warn('BEGAN')
    } else if (event.nativeEvent.state === State.ACTIVE) {
      console.warn('ACTIVE')
    }

    if (event.nativeEvent.oldState === State.ACTIVE) {
      // alert('active');
      // this._lastOffset.x += event.nativeEvent.translationX;
      // this._lastOffset.y += event.nativeEvent.translationY;
      // this._translateX.setOffset(this._lastOffset.x);
      // this._translateX.setValue(0);
      // this._translateY.setOffset(this._lastOffset.y);
      // this._translateY.setValue(0);
    }
  };

  _onLayoutChildren = e => {
    // console.log({e});
  };

  _renderButtons = () => {};
}
