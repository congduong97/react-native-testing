import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import React, {useEffect, useState, useMemo} from 'react';
import {MovieService} from '../../services';
import VirtualizedList from '../../components/VirtualizedList';
import {IMAGE_URL} from '../../services/api';
import {COLOR, hitSlop, SCREEN_WIDTH, SIZE} from '../../utils';
import LinearGradient from 'react-native-linear-gradient';
import BackIcon from '../../assets/icons/back.svg';
import {useNavigation} from '@react-navigation/native';
import MovieItem, {ITEM_HEIGHT, MARGIN} from '../../components/MovieItem';
import Indicator from '../../components/Indicator';
import {ReactNativeZoomableView} from '@openspacelabs/react-native-zoomable-view';
import CloseIcon from '../../assets/icons/close.svg';
import Modal from 'react-native-modal';

const LinearGradientColors = [
  'rgba(28, 28, 39, 0)',
  'rgba(28, 28, 39, 0.7)',
  'rgba(28, 28, 39, 0.7)',
  'rgba(28, 28, 39, 0.8)',
  'rgba(28, 28, 39, 1)',
];

const MovieDetail = ({route}) => {
  const [data, setData] = useState(null);
  const [media, setMedia] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(1);
  const [similarMov, setSimilarMov] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMedia, setActiveMedia] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [mediaView, setMediaView] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const getMovieInfo = async () => {
      try {
        const response = await Promise.all([
          MovieService.getDetail(route.params?.movie?.id),
          MovieService.getMedia(route.params?.movie?.id),
          MovieService.getSimilarMovie(route.params?.movie?.id, page),
        ]);
        setData(response[0]?.data);
        if (response[1]?.data?.posters) {
          const length =
            response[1]?.data?.posters.length < 5
              ? response[1]?.data?.posters.length
              : 5;
          const arr = response[1]?.data?.posters.slice(0, length);
          setMedia(arr || []);
        }
        setSimilarMov(response[2]?.data?.results || []);
        setTotalPage(response[2].data?.total_pages || 1);
      } catch (error) {
        //error
      } finally {
      }
    };
    getMovieInfo();
  }, []);

  const renderMediaItem = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          setMediaView(item);
          setModalVisible(true);
        }}
        style={{
          width: SCREEN_WIDTH,
          height: SCREEN_WIDTH / item.aspect_ratio,
          backgroundColor: COLOR.GRAY_600,
        }}>
        <Image
          resizeMode="cover"
          source={{uri: `${IMAGE_URL}${item.file_path}`}}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_WIDTH / item.aspect_ratio,
          }}
        />
      </TouchableOpacity>
    );
  };

  const headerView = useMemo(() => {
    return (
      <View>
        <FlatList
          onScroll={({
            nativeEvent: {
              contentOffset: {x, y},
            },
          }) => {
            if (x % SCREEN_WIDTH === 0) {
              console.log('active-1', x / SCREEN_WIDTH);
              setActiveMedia(x / SCREEN_WIDTH);
            }
          }}
          showsHorizontalScrollIndicator={false}
          bounces={false}
          pagingEnabled
          horizontal
          data={media}
          renderItem={renderMediaItem}
          keyExtractor={item => item.file_path}
        />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.back}
          hitSlop={hitSlop(10)}>
          <BackIcon width={SIZE.widthPixel(32)} height={SIZE.widthPixel(32)} />
        </TouchableOpacity>
        <LinearGradient
          colors={LinearGradientColors}
          style={styles.linearGradient}>
          <View style={[StyleSheet.absoluteFillObject, styles.headerContent]}>
            <View style={styles.headerBottom}>
              <View style={styles.titleWrapper}>
                {!!data?.title && (
                  <Text numberOfLines={3} style={styles.title}>
                    {data.title}
                  </Text>
                )}
                {!!data?.vote_average && (
                  <View style={styles.imdbWrapper}>
                    <Text style={styles.imdb}>IMDB {data.vote_average}</Text>
                  </View>
                )}
              </View>
              <Indicator number={media.length} activeIndex={activeMedia} />
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }, [media, activeMedia]);

  const renderItemSimilarMov = ({item}) => {
    return <MovieItem movie={item} />;
  };

  const imageModal = () => {
    return (
      <Modal
        useNativeDriver={true}
        isVisible={modalVisible}
        style={styles.modal}
        animationIn="fadeIn"
        animationInTiming={400}
        animationOut="fadeOut"
        animationOutTiming={400}
        backdropOpacity={0.9}
        backdropTransitionOutTiming={0}
        onBackdropPress={() => {
          setModalVisible(false);
        }}
        hideModalContentWhileAnimating={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity
            style={styles.modalClose}
            onPress={() => setModalVisible(false)}
            hitSlop={hitSlop(10)}>
            <CloseIcon
              width={SIZE.widthPixel(10)}
              height={SIZE.widthPixel(10)}
            />
          </TouchableOpacity>
          {mediaView && (
            <View style={{height: SCREEN_WIDTH / mediaView.aspect_ratio}}>
              <ReactNativeZoomableView
                maxZoom={5}
                contentWidth={SCREEN_WIDTH}
                contentHeight={SCREEN_WIDTH / mediaView.aspect_ratio}>
                <Image
                  resizeMode="cover"
                  source={{uri: `${IMAGE_URL}${mediaView.file_path}`}}
                  style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_WIDTH / mediaView.aspect_ratio,
                  }}
                />
              </ReactNativeZoomableView>
            </View>
          )}
        </View>
      </Modal>
    );
  };

  const onLoadMore = async () => {
    try {
      if (!loading && totalPage > page) {
        const response = await MovieService.getSimilarMovie(
          route.params?.movie?.id,
          page + 1,
        );
        setSimilarMov(prev => [...prev, ...(response?.data?.results || [])]);
        setPage(prev => prev + 1);
      }
    } catch (error) {
      //error
    } finally {
      setLoading(false);
    }
  };

  const similarMovies = useMemo(() => {
    return (
      <FlatList
        showsHorizontalScrollIndicator={false}
        data={similarMov}
        renderItem={renderItemSimilarMov}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT + 4 * MARGIN,
          offset: (ITEM_HEIGHT + 4 * MARGIN) * index,
          index,
        })}
        onEndReachedThreshold={0.8}
        onEndReached={onLoadMore}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapperStyle}
        keyExtractor={item => `${item.id + Math.random()}`}
        style={{paddingHorizontal: SIZE.widthPixel(16)}}
        ListFooterComponent={
          loading && <ActivityIndicator color={COLOR.WHITE} />
        }
      />
    );
  }, [similarMov]);

  return (
    <VirtualizedList
      contentContainerStyle={styles.contentContainerStyle}
      bounces={false}>
      {headerView}
      <View style={{paddingHorizontal: SIZE.widthPixel(16)}}>
        {data?.genres && (
          <View style={styles.genresWrapper}>
            {data.genres.map(g => (
              <View style={styles.genresItem} key={g.id}>
                <Text style={styles.genresTitle}>{g.name}</Text>
              </View>
            ))}
          </View>
        )}
        <Text style={styles.descritpionLabel}>Movie Descritpion :</Text>
        {!!data?.overview && (
          <Text style={styles.descritpion}>{data.overview}</Text>
        )}
        <Text style={styles.descritpionLabel}>Similar Movies :</Text>
      </View>
      {similarMovies}
      {imageModal()}
    </VirtualizedList>
  );
};

export default MovieDetail;

const styles = StyleSheet.create({
  contentContainerStyle: {
    backgroundColor: COLOR.MAIN,
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    zIndex: 2,
    marginHorizontal: SIZE.widthPixel(16),
    justifyContent: 'flex-end',
    paddingBottom: SIZE.widthPixel(32),
  },
  headerBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  linearGradient: {
    flex: 1,
    minHeight: SIZE.heightPixel(150),
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
  },
  back: {
    position: 'absolute',
    left: SIZE.widthPixel(16),
    top: 3 * SIZE.widthPixel(16),
  },
  titleWrapper: {
    width: (SCREEN_WIDTH - 2 * SIZE.widthPixel(16)) / 2,
  },
  title: {
    fontSize: SIZE.widthPixel(24),
    fontWeight: 'bold',
    color: COLOR.GRAY_200,
  },
  imdbWrapper: {
    paddingHorizontal: SIZE.widthPixel(16),
    paddingVertical: SIZE.widthPixel(8),
    backgroundColor: COLOR.YELLOW,
    alignSelf: 'flex-start',
    borderRadius: SIZE.widthPixel(12),
    marginTop: SIZE.widthPixel(16),
  },
  imdb: {
    fontSize: SIZE.fontPixel(20),
    fontWeight: 'bold',
  },
  genresWrapper: {
    flexDirection: 'row',
    marginTop: SIZE.widthPixel(16),
    flexWrap: 'wrap',
  },
  genresItem: {
    borderWidth: 1,
    paddingHorizontal: SIZE.widthPixel(14),
    paddingVertical: SIZE.widthPixel(10),
    borderRadius: SIZE.widthPixel(8),
    borderColor: COLOR.GRAY_500,
    marginRight: SIZE.widthPixel(16),
    marginBottom: SIZE.widthPixel(12),
  },
  genresTitle: {
    fontSize: SIZE.widthPixel(16),
    color: COLOR.GRAY_300,
    fontWeight: '600',
  },
  descritpionLabel: {
    color: COLOR.WHITE,
    fontWeight: '900',
    fontSize: SIZE.widthPixel(16),
    marginTop: SIZE.widthPixel(16),
  },
  descritpion: {
    fontSize: SIZE.fontPixel(14),
    marginTop: SIZE.widthPixel(16),
    color: COLOR.GRAY_300,
  },
  columnWrapperStyle: {
    justifyContent: 'space-between',
  },
  modal: {
    flex: 1,
    margin: 0,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  modalClose: {
    padding: SIZE.widthPixel(8),
    backgroundColor: COLOR.GRAY_400,
    borderRadius: SIZE.widthPixel(100),
    marginBottom: SIZE.widthPixel(8),
  },
});
