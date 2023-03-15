import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLOR, SIZE} from '../ultils';
import {useNavigation} from '@react-navigation/native';
import {hitSlop} from '../utils';

const AppHeader = ({
  bottomView,
  hideRightView,
  rightStyle,
  rightView,
  title,
  titleStyle,
  centerView,
  centerStyle,
  leftStyle,
  leftView,
  hideLeftView,
  showBackButton,
  leftIcon,
  onPressLeft,
  containerStyle,
}) => {
  const navigation = useNavigation();
  const onBack = () => {
    navigation.canGoBack && navigation.goBack();
  };

  return (
    <View>
      <SafeAreaView edges={['top']} style={[styles.container, containerStyle]}>
        {showBackButton && (
          <TouchableOpacity
            hitSlop={hitSlop(10)}
            onPress={onPressLeft || onBack}>
            {leftIcon}
          </TouchableOpacity>
        )}
        {!hideLeftView && (
          <View style={[styles.leftContainer, leftStyle]}>{leftView}</View>
        )}
        {centerView && (
          <View style={[styles.centerContainer, centerStyle]}>
            {centerView}
          </View>
        )}
        {title && (
          <Text style={[styles.title, titleStyle]}>
            {title.toLocaleUpperCase()}
          </Text>
        )}
        {!hideRightView && (
          <View style={[styles.rightContainer, rightStyle]}>{rightView}</View>
        )}
      </SafeAreaView>
      {bottomView}
    </View>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: SIZE.widthPixel(16),
    justifyContent: 'space-between',
    backgroundColor: COLOR.GRAY_200,
  },
  title: {
    fontSize: SIZE.fontPixel(16),
    color: COLOR.MAIN,
    fontWeight: '900',
  },
  rightContainer: {
    flex: 1,
    alignItems: 'flex-end',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
});
