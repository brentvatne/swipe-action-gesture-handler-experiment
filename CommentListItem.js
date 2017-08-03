/* @flow */
import React from 'react';
import { StyleSheet, View, Text, Alert } from 'react-native';

type Props = {
  isYours: boolean,
  isOnPost: boolean,
  isLast: boolean,
  comment: CommentT,
}

type CommentT = {
  createdAt: string,
  content: string,
  Post: {
    title: string
  },
  User: {
    username: string
  }
}

export default class CommentListItem extends React.PureComponent {
  render() {
    const { comment, isLast } = this.props;

    return (
      <View style={isLast ? styles.itemBorderless : styles.item}>
        <Text style={styles.content}>
          {comment.content}
        </Text>
        <Text style={styles.lockup}>
          💬 by
          {' '}
          <Text style={styles.bold}>{comment.User.username}</Text>
          {' '}
          written on
          {' '}
          <Text style={styles.bold}>{comment.createdAt}</Text>
        </Text>
        <Text style={styles.response}>
          📮 in response to
          {' '}
          <Text style={styles.bold}>{comment.Post.title}</Text>
        </Text>
      </View>
    );
  }

  _handleViewPost = postId => {
    alert('press view post')
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
  backgroundColor: '#fff',
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
  },
  bold: {
    fontWeight: '600',
  },
  lockup: {
    fontSize: 12,
    marginTop: 16,
  },
  response: {
    fontSize: 12,
  },
});
