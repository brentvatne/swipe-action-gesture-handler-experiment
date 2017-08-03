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
    const translateX = this.state._translateX.interpolate({
      inputRange: [-ScreenWidth, 0, 200],
      outputRange: [-ScreenWidth, 0, 20],
    });

    return (
      <View style={[styles.container, this.props.style]}>
        <View style={styles.buttonContainer}>
          {this._renderButtons()}
        </View>
        <PanGestureHandler
          minDeltaX={10}
          onGestureEvent={this._onGestureEvent}
          onHandlerStateChange={this._onHandlerStateChange}>
          <Animated.View style={{ transform: [{ translateX: translateX }] }}>
            {this.props.children}
          </Animated.View>
        </PanGestureHandler>
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
        friction: 12,
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
