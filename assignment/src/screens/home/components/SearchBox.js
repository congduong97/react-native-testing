import React, {useState, useRef, Fragment, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  LayoutAnimation,
  Animated,
  InteractionManager,
} from 'react-native';
import {COLOR, SIZE, isAndroid, hitSlop, STORAGE_KEY} from '../../../utils';
import SeaerchIcon from '../../../assets/icons/search.svg';
import CloseIcon from '../../../assets/icons/close.svg';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SearchBox = ({onChangeText, text, onSearch, containerStyle}) => {
  const [keywords, setKeywords] = useState([]);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    const getKeyFromStorage = async () => {
      try {
        const value = await AsyncStorage.getItem(STORAGE_KEY.KEYWORD);
        if (value !== null) {
          // value previously stored
          setKeywords(JSON.parse(value));
        }
      } catch (e) {
        // error reading value
      }
    };
    getKeyFromStorage();
  }, []);

  const onDeleteKeyword = index => async () => {
    try {
      const filter = keywords.filter((_, i) => i !== index);
      setKeywords(filter);
      AsyncStorage.setItem(STORAGE_KEY.KEYWORD, JSON.stringify(filter));
    } catch (error) {
      console.log('err');
    }
  };

  const onFocus = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        100,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity,
      ),
    );
    setFocus(prev => !prev);
  };

  const onSelect = k => () => {
    onChangeText(k);
  };

  const onHandleSearch = () => {
    try {
      onSearch();
      if (text) {
        let temArr = [...keywords];
        if (keywords.includes(text)) {
          temArr = keywords.filter(k => k !== text);
        }
        temArr.unshift(text);
        if (temArr.length > 5) {
          temArr.pop();
        }
        setKeywords(temArr);
        AsyncStorage.setItem(STORAGE_KEY.KEYWORD, JSON.stringify(temArr));
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <View style={containerStyle}>
      <View
        style={[
          styles.container,
          (!focus || keywords.length === 0) && {
            borderBottomLeftRadius: SIZE.widthPixel(16),
            borderBottomRightRadius: SIZE.widthPixel(16),
          },
        ]}>
        <TextInput
          style={styles.input}
          placeholder="Search movie..."
          placeholderTextColor={COLOR.GRAY_500}
          onFocus={onFocus}
          onBlur={onFocus}
          value={text}
          onChangeText={onChangeText}
          clearButtonMode="while-editing"
        />
        <View style={styles.devider} />
        <TouchableOpacity onPress={onHandleSearch}>
          <SeaerchIcon
            width={SIZE.widthPixel(20)}
            height={SIZE.widthPixel(20)}
          />
        </TouchableOpacity>
      </View>
      {focus && keywords.length > 0 && (
        <View style={styles.historyContainer}>
          {keywords.map((k, index) => (
            <Fragment key={k}>
              <KeywordItem
                onSelect={onSelect}
                keyword={k}
                onDeleteKeyword={onDeleteKeyword(index)}
              />
              {index < keywords.length - 1 && <View style={styles.seperator} />}
            </Fragment>
          ))}
        </View>
      )}
    </View>
  );
};

const KeywordItem = ({onSelect, keyword, onDeleteKeyword}) => {
  const fadeAnimation = useRef(new Animated.Value(1)).current;
  const scaleAnimition = useRef(new Animated.Value(1)).current;
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);

  const deleteAnimation = () => {
    Animated.timing(fadeAnimation, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const onDelete = () => {
    deleteAnimation();
    InteractionManager.runAfterInteractions(() => {
      onDeleteKeyword();
    });
  };

  return (
    <AnimatedTouchableOpacity
      key={keyword}
      style={[
        styles.historyItem,
        {opacity: fadeAnimation, transform: [{scaleY: scaleAnimition}]},
      ]}
      onPress={onSelect(keyword)}>
      <Text style={styles.keyword}>{keyword}</Text>
      <TouchableOpacity hitSlop={hitSlop(12)} onPress={onDelete}>
        <CloseIcon width={SIZE.widthPixel(8)} height={SIZE.widthPixel(8)} />
      </TouchableOpacity>
    </AnimatedTouchableOpacity>
  );
};

export default React.memo(SearchBox);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLOR.GRAY_700,
    paddingHorizontal: SIZE.widthPixel(16),
    paddingVertical: SIZE.widthPixel(8),
    height: SIZE.widthPixel(46),
    borderTopLeftRadius: SIZE.widthPixel(16),
    borderTopRightRadius: SIZE.widthPixel(16),
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: SIZE.fontPixel(24),
    color: COLOR.WHITE,
    marginBottom: SIZE.widthPixel(16),
  },
  devider: {
    height: '65%',
    width: SIZE.widthPixel(1),
    backgroundColor: COLOR.GRAY_400,
    margin: SIZE.widthPixel(12),
  },
  input: {
    flex: 1,
    padding: isAndroid ? 0 : undefined,
    fontSize: SIZE.widthPixel(14),
    color: COLOR.GRAY_200,
  },
  historyContainer: {
    marginTop: 1,
    borderBottomLeftRadius: SIZE.widthPixel(16),
    borderBottomRightRadius: SIZE.widthPixel(16),
    backgroundColor: COLOR.GRAY_700,
    paddingVertical: SIZE.widthPixel(12),
    paddingHorizontal: SIZE.widthPixel(16),
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 99,
    top: SIZE.widthPixel(46),
  },
  historyItem: {
    paddingVertical: SIZE.widthPixel(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  keyword: {
    fontSize: SIZE.fontPixel(14),
    color: COLOR.GRAY_200,
  },
  seperator: {
    height: 0.5,
    backgroundColor: COLOR.MAIN,
  },
});
