/**
 * Code by Cong_dev
 */

import React from 'react';
import RootNavigator from './src/navigators/RootNavigator';
import {isAndroid} from './src/utils';
import {UIManager} from 'react-native';

if (isAndroid) {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const App = () => {
  return <RootNavigator />;
};

export default App;
