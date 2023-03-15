import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';
import {IMAGE_URL} from '../services/api';
import {COLOR, SCREEN_WIDTH, SIZE} from '../utils';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import {ROUTE_KEY} from '../navigators/router';
import {StackActions} from '@react-navigation/native';

const calRatio = 750 / 500;
export const MARGIN = SIZE.widthPixel(16);
export const ITEM_WIDTH = (SCREEN_WIDTH - 3 * MARGIN) / 2;
export const ITEM_HEIGHT = calRatio * ITEM_WIDTH;

const MovieItem = ({movie}) => {
  const navigation = useNavigation();
  const onDetail = () => {
    navigation.dispatch(StackActions.push(ROUTE_KEY.MOVIE_DETAIL, {movie}));
  };

  return (
    <TouchableOpacity onPress={onDetail} style={styles.container}>
      <FastImage
        style={styles.image}
        source={{uri: `${IMAGE_URL}${movie.poster_path}`}}
      />
      <Text numberOfLines={2} style={styles.title}>
        {movie.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  image: {
    width: ITEM_WIDTH,
    marginTop: 2 * MARGIN,
    borderRadius: SIZE.widthPixel(16),
    height: ITEM_HEIGHT,
  },
  title: {
    fontSize: SIZE.fontPixel(16),
    marginTop: MARGIN,
    color: COLOR.WHITE,
    width: ITEM_WIDTH,
  },
});

export default React.memo(MovieItem);
