import {
  Text,
  StyleSheet,
  FlatList,
  View,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {MovieService} from '../../services';
import SearchBox from './components/SearchBox';
import {COLOR, SIZE} from '../../utils';
import MovieItem, {ITEM_HEIGHT, MARGIN} from '../../components/MovieItem';

const Home = () => {
  const [data, setData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getMovies = async (p, query) => {
    try {
      setLoading(true);
      const response = await MovieService.searchMovie(p, query);
      setData(response?.data?.results || []);
      setTotalPage(response.data?.total_pages || 1);
    } catch (error) {
      // error
    } finally {
      setLoading(false);
    }
  };
  const onChangeText = value => {
    setText(value);
  };
  const onSearch = async () => {
    getMovies(1, text);
    Keyboard.dismiss();
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await getMovies(1, text);
    } catch (error) {
      //error
    } finally {
      setRefreshing(false);
    }
  };

  const onLoadMore = async () => {
    try {
      if (!loading && totalPage > page) {
        const response = await MovieService.searchMovie(page + 1, text);
        setData(prev => [...prev, ...(response?.data?.results || [])]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      //error
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({item}) => {
    return <MovieItem movie={item} />;
  };

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Home</Text>
        <SearchBox
          onChangeText={onChangeText}
          text={text}
          onSearch={onSearch}
        />
      </View>
      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        data={data}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapperStyle}
        renderItem={renderItem}
        keyExtractor={item => `${item.id + Math.random()}`}
        onEndReachedThreshold={0.6}
        onEndReached={onLoadMore}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT + 4 * MARGIN,
          offset: (ITEM_HEIGHT + 4 * MARGIN) * index,
          index,
        })}
        contentContainerStyle={{paddingHorizontal: SIZE.widthPixel(16)}}
        ListFooterComponent={
          loading && <ActivityIndicator color={COLOR.WHITE} />
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.MAIN,
  },
  header: {padding: SIZE.widthPixel(16), zIndex: 99},
  title: {
    fontSize: SIZE.fontPixel(24),
    color: COLOR.WHITE,
    marginBottom: SIZE.widthPixel(16),
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
});

export default Home;
