import React from 'react';
import { View, StyleSheet } from 'react-native';
import { State, TapGestureHandler } from 'react-native-gesture-handler';

const UNDERLAY_REF = 'UNDERLAY_REF';
const CHILD_REF = 'CHILD_REF';

const INACTIVE_CHILD_STYLE = StyleSheet.create({ x: { opacity: 1.0 } }).x;
const INACTIVE_UNDERLAY_STYLE = StyleSheet.create({
  x: { backgroundColor: 'transparent' },
}).x;

export default class TouchableHighlight extends React.Component {
  static propTypes = View.propTypes;
  static defaultProps = {
    activeOpacity: 0.85,
    underlayColor: 'black',
  };
  constructor(props) {
    super(props);
    this.state = { gestureHandlerState: State.UNDETERMINED };
    this._pressedStyle = {
      opacity: this.props.activeOpacity,
    };
  }
  _onStateChange = event => {
    const nextGestureHandlerState = event.nativeEvent.state;
    if (this.state.gestureHandlerState !== nextGestureHandlerState) {
      this.setState({ gestureHandlerState: nextGestureHandlerState }, () => {
        const pressed = nextGestureHandlerState === State.BEGAN;
        this.refs[CHILD_REF].setNativeProps({
          style: pressed
            ? { opacity: this.props.activeOpacity }
            : INACTIVE_CHILD_STYLE,
        });
      });
      if (event.nativeEvent.state === State.ACTIVE && this.props.onClick) {
        this.props.onClick();
      }
    }
  };
  render() {
    const pressed = this.state.gestureHandlerState === State.BEGAN;
    const style = pressed
      ? { backgroundColor: this.props.underlayColor }
      : INACTIVE_UNDERLAY_STYLE;
    return (
      <TapGestureHandler onHandlerStateChange={this._onStateChange}>
        <View style={[this.props.style, style]}>
          {React.cloneElement(React.Children.only(this.props.children), {
            ref: CHILD_REF,
          })}
        </View>
      </TapGestureHandler>
    );
  }
}
