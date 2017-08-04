/* @flow */
import React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { RectButton, BorderlessButton } from 'react-native-gesture-handler';

type Props = {
  isYours: boolean,
  isOnPost: boolean,
  isLast: boolean,
  comment: CommentT,
};

type CommentT = {
  createdAt: string,
  content: string,
  Post: {
    title: string,
  },
  User: {
    username: string,
  },
};

export default class CommentListItem extends React.PureComponent {
  render() {
    const { comment, isLast } = this.props;

    return (
      <View style={{ backgroundColor: '#fff' }}>
        <RectButton
          onPress={() => alert('pressed row!')}
          maxDelayMs={100}
          style={isLast ? styles.itemBorderless : styles.item}>
          <Text style={styles.content}>
            {comment.content}
          </Text>

          <BorderlessButton
            borderless={false}
            onPress={() => alert('user!')}
            style={{ marginTop: 15 }}>
            <Text style={styles.lockup}>
              💬 by <Text style={styles.bold}>
                {comment.User.username}
              </Text>{' '}
              written on <Text style={styles.bold}>{comment.createdAt}</Text>
            </Text>
          </BorderlessButton>

          <BorderlessButton
            borderless={false}
            onPress={() => alert('post!')}
            style={{ marginTop: 5 }}>
            <Text style={styles.response}>
              📮 in response to{' '}
              <Text style={styles.bold}>{comment.Post.title}</Text>
            </Text>
          </BorderlessButton>
        </RectButton>
      </View>
    );
  }

  _handleViewPost = postId => {
    alert('press view post');
  };

  _handleDeleteComment = async ({ commentId, postId }) => {
    Alert.alert(
      'Are you sure?',
      'By selecting OK you are deleting this comment forever.',
      [
        { text: 'Cancel', onPress: () => {} },
        {
          text: 'OK',
          onPress: () => {
            alert('press ok');
          },
        },
      ]
    );
  };
}

const commentItemBaseStyles = {
  flex: 1,
  padding: 16,
};

const styles = StyleSheet.create({
  item: {
    ...commentItemBaseStyles,
    borderColor: '#eee',
    borderBottomWidth: 1,
  },
  itemBorderless: {
    ...commentItemBaseStyles,
  },
  content: {
    fontSize: 18,
    backgroundColor: 'transparent',
  },
  bold: {
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  lockup: {
    fontSize: 12,
    backgroundColor: 'transparent',
  },
  response: {
    fontSize: 12,
    backgroundColor: 'transparent',
  },
});
