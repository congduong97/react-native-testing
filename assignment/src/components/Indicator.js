import {View, StyleSheet, LayoutAnimation} from 'react-native';
import React, {useState, useEffect} from 'react';
import {COLOR, SIZE} from '../utils';

const Indicator = ({number, activeIndex}) => {
  console.log('activeIndex', activeIndex);
  const indicatorArr = new Array(number).fill(1);
  return (
    <View style={styles.container}>
      {indicatorArr.map((_, index) => (
        <IndicatorItem key={index} active={activeIndex === index} />
      ))}
    </View>
  );
};

const IndicatorItem = ({active}) => {
  const [width, setWidth] = useState(SIZE.widthPixel(10));
  useEffect(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        200,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.scaleX,
      ),
    );
    if (active) {
      setWidth(prev => 2.5 * prev);
    } else {
      setWidth(SIZE.widthPixel(10));
    }
  }, [active]);

  return <View style={[styles.item, {width}]} />;
};

export default Indicator;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  item: {
    height: SIZE.widthPixel(10),
    borderRadius: SIZE.widthPixel(5),
    backgroundColor: COLOR.WHITE,
    marginRight: SIZE.widthPixel(4),
  },
});
