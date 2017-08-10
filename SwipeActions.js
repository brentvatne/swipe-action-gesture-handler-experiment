import React from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import {
  PanGestureHandler,
  RectButton,
  State,
} from 'react-native-gesture-handler';

const ScreenWidth = Dimensions.get('window').width;
const ActionsVisibleX = -200;
const ActionsHiddenX = 0;

const USE_NATIVE_DRIVER = true;

export default class SwipeActions extends React.Component {
  state = {
    _translateX: new Animated.Value(0),
    _dragX: new Animated.Value(0),
  };

  _actionsHidden = true;
  _onGestureEvent = Animated.event(
    [{ nativeEvent: { translationX: this.state._dragX } }],
    { useNativeDriver: USE_NATIVE_DRIVER }
  );

  render() {
    const translateX = Animated.add(this.state._dragX, this.state._translateX).interpolate({
      inputRange: [2 * ActionsVisibleX, ActionsVisibleX, 0, 200],
      outputRange: [1.4 * ActionsVisibleX, ActionsVisibleX, 0, 20],
    });

    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.buttonContainer}>
          {this._renderButtons()}
        </View>
        <PanGestureHandler
          minDeltaX={30}
          onGestureEvent={this._onGestureEvent}
          onHandlerStateChange={this._onHandlerStateChange}>
          <Animated.View style={{ transform: [{ translateX: translateX }] }}>
            {this.props.children}
          </Animated.View>
        </PanGestureHandler>
      </View>
    );
  }

  _onHandlerStateChange = ({ nativeEvent }) => {
    console.log(`From ${gestureStateFromEnum(nativeEvent.oldState)} to ${gestureStateFromEnum(nativeEvent.state)}`);
    if (nativeEvent.oldState === State.ACTIVE) {
      const { velocityX, translationX, x } = nativeEvent;
      const dragToss = 0.05;
      const endOffsetX = translationX + dragToss * velocityX;

      let toValue = 0;
      let hideActions = true;
      if (this._actionsHidden && endOffsetX < -100 /* Should we show it? */) {
        toValue = ActionsVisibleX;
        hideActions = false;
      } else if (!this._actionsHidden && endOffsetX < 100 /* Should we keep them open? */) {
        toValue = ActionsVisibleX;
        hideActions = false;
      }
      this._actionsHidden = hideActions;

      // Pan is finished, we need to set dragX value to 0 as when the pan starts for the
      // next time it will start from 0. Since x translation of the views is the sum of
      // dragX and translateX values, we need to add the value of dragX to the current
      // value of translateX first. As we don't know the current value of translateX
      // (it could run using native driver) this can be done by calling a sequence of
      // methods: `extractOffset` -> `setValue` -> `flattenOffset`
      this.state._translateX.extractOffset();
      this.state._translateX.setValue(translationX);
      this.state._translateX.flattenOffset();
      this.state._dragX.setValue(0);

      Animated.spring(this.state._translateX, {
        tension: 90,
        friction: 12,
        toValue,
        useNativeDriver: USE_NATIVE_DRIVER,
      }).start();
    }
  };

  _renderButtons = () => {
    return this.props.right && this.props.right.map(this._renderButton);
  };

  _renderButton = (button, i) => {
    return (
      <RectButton
        key={i}
        onPress={button.onPress}
        disallowInterruption
        style={[
          styles.button,
          { backgroundColor: button.backgroundColor || '#ccc' },
        ]}>
        {button.component}
      </RectButton>
    );
  };
}

function gestureStateFromEnum(s) {
  switch (s) {
    case State.UNDETERMINED:
      return 'UNDETERMINED';
    case State.BEGAN:
      return 'BEGAN';
    case State.FAILED:
      return 'FAILED';
    case State.CANCELLED:
      return 'CANCELLED';
    case State.ACTIVE:
      return 'ACTIVE';
    case State.END:
      return 'END';
    default:
      return `Invalid gesture state: ${s}`;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#888',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    right: 0,
    left: 0,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexGrow: 1,
  },
  button: {
    width: 100,
  },
});
