import React from 'react';
import {StatusBar} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ROUTE_KEY} from './router';
import {COLOR} from '../utils';
import MovieDetail from '../screens/movie-detail/MovieDetail';
import Home from '../screens/home/Home';
const RootStack = createNativeStackNavigator();

const RootNavigator = () => {
  return (
    <>
      <StatusBar backgroundColor={COLOR.WHITE} barStyle="dark-content" />
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'fade',
          }}>
          <RootStack.Screen name={ROUTE_KEY.HOME} component={Home} />
          <RootStack.Screen
            name={ROUTE_KEY.MOVIE_DETAIL}
            component={MovieDetail}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default RootNavigator;
