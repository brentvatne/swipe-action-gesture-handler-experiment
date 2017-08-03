✅ Successful experiment to implement row swipe actions using
[react-native-gesture-handler](https://github.com/kmagiera/react-native-gesture-handler).

Advantages over `PanResponder` in this case:
- Can use native `Animated` driver to update values in response to
gesture, so you don't drop frames if JS frame is choked during gesture.
- Uses native gesture recognizers and does the right thing inside of a
ScrollView -- no manual ScrollView locking required. This is huge.
