import React from 'react';
import {
  Button,
  ScrollView,
  Platform,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { ScrollView as GestureHandlerScrollView } from 'react-native-gesture-handler';
import CommentListItem from './CommentListItem';
import Comments from './Comments';
import PanResponderSwipeActions from 'react-native-swipeout';
import GestureHandlerSwipeActions from './SwipeActions';

const DEBUG = false;

export default class App extends React.Component {
  state = {
    api: 'gesture-handler',
    comments: Comments,
  };

  render() {
    const ScrollViewComponent =
      this.state.api === 'gesture-handler'
        ? GestureHandlerScrollView
        : ScrollView;

    return (
      <View
        style={{
          flex: 1,
          paddingTop: Platform.OS === 'ios' ? 25 : 0,
          paddingBottom: 50,
        }}>
        <ScrollViewComponent style={{ flex: 1 }}>
          {this.state.comments.map(this._renderComment)}
        </ScrollViewComponent>

        {Platform.OS === 'ios' && <View style={styles.underlay} />}
        <View style={styles.toggleContainer}>
          <Button
            title={
              (this.state.api === 'gesture-handler' ? '🎉 ' : '') +
              'gesture-handler'
            }
            onPress={() => this.setState({ api: 'gesture-handler' })}
          />
          <Button
            title={
              (this.state.api === 'PanResponder' ? '😭 ' : '') + 'PanResponder'
            }
            onPress={() => this.setState({ api: 'PanResponder' })}
          />
        </View>
      </View>
    );
  }

  _renderComment = (comment, i) => {
    const buttons = this._getButtons(comment);

    if (this.state.api === 'gesture-handler') {
      return (
        <GestureHandlerSwipeActions
          key={i}
          style={{ backgroundColor: 'black' }}
          right={buttons}>
          <CommentListItem {...comment} />
        </GestureHandlerSwipeActions>
      );
    } else {
      return (
        <PanResponderSwipeActions
          key={i}
          backgroundColor="black"
          right={buttons}>
          <CommentListItem {...comment} />
        </PanResponderSwipeActions>
      );
    }
  };

  _getButtons = comment => {
    const { isOnPost, isYours } = comment;
    const buttons = [];

    if (!isOnPost) {
      buttons.push({
        autoClose: true,
        backgroundColor: 'blue',
        onPress: () => alert('view!'),
        component: (
          <View style={styles.button}>
            <Text style={styles.buttonText}>View 📝</Text>
          </View>
        ),
      });
    }

    if (isYours) {
      buttons.push({
        autoClose: true,
        backgroundColor: 'red',
        component: (
          <View style={styles.button}>
            <Text style={styles.buttonText}>Delete 💬</Text>
          </View>
        ),
        onPress: () => alert('delete comment!'),
      });
    }

    return buttons;
  };
}

const styles = StyleSheet.create({
  underlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 25,
    backgroundColor: '#fafafa',
  },
  toggleContainer: {
    flexDirection: 'row',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'space-around',
    bottom: 0,
    left: 0,
    right: 0,
    height: 50,
    backgroundColor: '#fafafa',
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    textAlignVertical: 'center',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});
