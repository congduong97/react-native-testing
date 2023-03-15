import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {COLOR, SIZE} from '../utils';

const ListEmpty = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.content}>No data</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: SIZE.widthPixel(24),
  },
  content: {
    fontSize: SIZE.fontPixel(16),
    color: COLOR.GRAY_400,
  },
});

export default ListEmpty;
