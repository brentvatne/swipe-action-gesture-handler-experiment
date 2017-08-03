import React from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const ScreenWidth = Dimensions.get('window').width;
const ActionsVisibleX = -200;
const ActionsHiddenX = 0;

/* NOTE(brent): have to disable this because of bug on iOS, ask me for info or just try it */
const USE_NATIVE_DRIVER = false;

export default class SwipeActions extends React.Component {
  state = {
    _translateX: new Animated.Value(0),
  };

  _lastOffsetX = 0;

  _onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: this.state._translateX } }],
    { useNativeDriver: USE_NATIVE_DRIVER }
  );

  componentWillMount() {
    console.log(Object.keys(this._onGestureEvent));
  }

  render() {
    const translateX = this.state._translateX;

    return (
      <View style={[styles.container, this.props.style]}>
        <PanGestureHandler
          id={this.props.gestureId}
          minDeltaX={10}
          maxDeltaY={5}
          onGestureEvent={this._onGestureEvent}
          onHandlerStateChange={this._onHandlerStateChange}>
          <Animated.View style={{ transform: [{ translateX: translateX }] }} >
            {this.props.children}
          </Animated.View>
        </PanGestureHandler>

        {this._renderButtons()}
      </View>
    );
  }

  _areActionsVisible = () => {
    return !this._areActionsHidden();
  };

  _areActionsHidden = () => {
    return this._lastOffsetX === 0;
  };

  _onHandlerStateChange = ({ nativeEvent }) => {
    if (nativeEvent.oldState === State.ACTIVE) {
      const { velocityX, translationX, x } = nativeEvent;
      let toValue;
      if (this._areActionsHidden()) {
        if (velocityX < -50 || translationX < -100 /* Should we show it? */) {
          toValue = ActionsVisibleX;
        } else {
          /* Otherwise, keep it hidden */
          toValue = 0;
        }
      } else if (this._areActionsVisible()) {
        if (velocityX > 20 || translationX > 20 /* Should we hide it? */) {
          toValue = -ActionsVisibleX;
        } else {
          /* Otherwise, keep it open */
          toValue = 0;
        }
      }

      Animated.spring(this.state._translateX, {
        velocity: nativeEvent.velocityX,
        tension: 68,
        friction: 10,
        toValue,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start(() => {
        console.log({ toValue, _lastOffsetX: this._lastOffsetX });
        this._lastOffsetX += toValue;
        this.state._translateX.setOffset(this._lastOffsetX);
        this.state._translateX.setValue(0);
      });
    }
  };

  _renderButtons = () => {
    return this.props.buttons && this.props.buttons.map(this._renderButton);
  };

  _renderButton = (button) => {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#888',
  },
});
