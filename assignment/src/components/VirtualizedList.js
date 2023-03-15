import * as React from 'react';
import {FlatList} from 'react-native';

const VirtualizedList = props => {
  const {children, ...rest} = props;
  return (
    <FlatList
      {...rest}
      data={[]}
      keyExtractor={() => 'key'}
      renderItem={null}
      ListHeaderComponent={<>{children}</>}
    />
  );
};
export default VirtualizedList;
